import { evaluateExpression, type Conditions } from './evaluateExpression';
import MagicString, { type SourceMap } from 'magic-string';

export type { Conditions };

const COMMENT_EXTRACT = /\s*(?:<!--|\{?\/\*)\s+#(if(?:n?def)?|else|endif)([\s\S]+?)(?:(?<=<!--.*)-->|(?<=\/\*.*)\*\/\}?)/g;

interface DirectiveMatch {
  start: number;
  end: number;
  type: string;
  condition: string | null;
}

interface EvaluatedDirective extends DirectiveMatch {
  evaluated: boolean;
}

interface ProcessResult {
  code: string;
  sourceMap?: SourceMap;
}

interface ProcessOptions {
  conditions?: Conditions;
  filename?: string;
  sourcemap?: boolean;
}

function getRemovedSection(
  directives: DirectiveMatch[],
  conditions: Conditions
): [number, number][] {
  const stack: EvaluatedDirective[] = [], removed: [number, number][] = [];
  for (const directive of directives) {
    const directiveType = directive.type;
    if (directiveType[0] === 'i') {
      const evaluated = evaluateCondition(directive, conditions);
      stack.push({ ...directive, evaluated });
    } else {
      if (stack.length === 0) {
        throw new Error(`Unexpected #${directiveType} without matching #if`);
      }

      const evaluatedDirective = stack.pop()!;
      if (!evaluatedDirective.evaluated) {
        removed.pop();
        removed.pop();
        removed.push([evaluatedDirective.start, directive.end]);
      }

      if (directiveType === 'else') {
        stack.push({
          ...directive,
          evaluated: !evaluatedDirective.evaluated,
        });
      }
    }
  }

  if (stack.length > 0) {
    throw new Error('Unclosed conditional block(s)');
  }

  return removed;
}

const DEFAULT_OPTIONS: ProcessOptions = {
  conditions: {},
  filename: 'unknown',
};

/**
 * Process source code with conditional compilation directives
 * @param code - Source code to process
 * @param conditions - Condition flags, e.g. { IS_LINUX: false }
 * @param options - Processing options
 * @returns Processed code and optional source map
 */
function processConditionalCode(
  code: string,
  options: {
    conditions?: Conditions,
    filename?: string;
  } = DEFAULT_OPTIONS
): ProcessResult {
  const { conditions, filename } =
    <Required<ProcessOptions>>Object.assign(structuredClone(DEFAULT_OPTIONS), options);

  // Find all conditional directives
  const directives = findAllDirectives(code, COMMENT_EXTRACT);
  const removedSections = getRemovedSection(directives, conditions);

  const magicString = new MagicString(code, { filename });
  for (const [start, end] of removedSections) {
    magicString.remove(start, end);
  }
  return {
    code: magicString.toString(),
    sourceMap: magicString.generateMap({ includeContent: true }),
  };
}

/**
 * Find all directive matches in the code
 * @param code - Source code
 * @param pattern - Regex patterns for directives
 * @returns Array of matches
 */
function findAllDirectives(code: string, pattern: RegExp): DirectiveMatch[] {
  let match;
  const matches: DirectiveMatch[] = [];
  pattern.lastIndex = 0;
  while ((match = pattern.exec(code)) !== null) {
    const [matched, type, condition] = match;
    matches.push({
      start: match.index,
      end: match.index + matched.length,
      type,
      condition: condition.trim() || null,
    });
  }
  return matches;
}

/**
 * Evaluate a condition based on provided condition values
 * @param match - The directive match
 * @param conditions - Condition values
 * @returns Evaluation result
 */
function evaluateCondition(directive: DirectiveMatch, conditions: Conditions): boolean {
  const condition = directive.condition;
  const type = directive.type;

  if (!condition) return false;

  switch (type) {
    case 'ifdef': return condition in conditions;
    case 'ifndef': return !(condition in conditions);
    default: return evaluateExpression(condition, conditions);
  }
}

export {
  processConditionalCode,
  DirectiveMatch,
  ProcessResult
};