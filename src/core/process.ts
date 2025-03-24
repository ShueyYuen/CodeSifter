import { dir } from 'console';
import { evaluateExpression, type Conditions } from './evaluateExpression';
import MagicString, { type SourceMap } from 'magic-string';

export type { Conditions };


const COMMENT_EXTRACT = /\s*(?:<!--|\{?\/\*)\s+#(if(?:n?def)?|else|endif)((?<=#if)[\s\S]+?|\s+)(?:(?<=<!--.*)-->|(?<=\/\*.*)\*\/\}?)/g;

type DirectiveType = 'ifdef' | 'ifndef' | 'if' | 'else' | 'endif';
interface DirectiveMatch {
  start: number;
  end: number;
  type: DirectiveType;
  condition: string | null;
  next?: DirectiveMatch;
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

function skipUntilNextDirective(directives: DirectiveMatch[], directive: DirectiveMatch): void {
  const nextDirective = directive.next;
  let currentDirective: DirectiveMatch | undefined;
  while (currentDirective = directives.shift()) {
    if (currentDirective === nextDirective) {
      break;
    }
  }
  directives.unshift(currentDirective!);
}

/**
 * Get the removed sections of code based on directives and conditions
 * @param directives - Array of directive matches
 * @param conditions - Condition flags
 * @returns Array of removed sections as [start, end] pairs
 */
function getRemovedSection(
  directives: DirectiveMatch[],
  conditions: Conditions
): [number, number][] {
  const stack: EvaluatedDirective[] = [], removed: [number, number][] = [];

  let directive: DirectiveMatch | undefined;
  while (directive = directives.shift()) {
    removed.push([directive.start, directive.end]);
    const directiveType = directive.type;
    if (directiveType[0] === 'i') {
      const evaluated = evaluateCondition(directive, conditions);
      stack.push({ ...directive, evaluated });
      !evaluated && skipUntilNextDirective(directives, directive);
    } else {
      const evaluatedDirective = stack.pop()!;
      const evaluated = evaluatedDirective.evaluated;
      if (!evaluated) {
        removed.pop();
        removed.pop();
        removed.push([evaluatedDirective.start, directive.end]);
      }

      if (directiveType === 'else') {
        stack.push({
          ...directive,
          evaluated: !evaluated,
        });
        evaluated && skipUntilNextDirective(directives, directive);
      }
    }
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
  const directives = parseAllDirectives(code, COMMENT_EXTRACT);
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
 * Convert a character index to a line and column position in the source code
 * @param code - Source code
 * @param index - Character index
 * @returns Position object containing line and column
 */
function convertIndexToPosition(code: string, index: number): { line: number; column: number } {
  if (index <= 0) {
    return { line: 0, column: 0 };
  }
  const lines = code.slice(0, index).split('\n');
  return {
    line: lines.length,
    column: lines.at(-1)!.length,
  };
}


const NEXT_DIRECTIVE_MAP = {
  if: 'e',
  ifdef: 'e',
  ifndef: 'e',
  else: 'en',
} as Record<DirectiveType, string>;

/**
 * Find all directive matches in the code
 * @param code - Source code
 * @param pattern - Regex patterns for directives
 * @returns Array of matches
 */
function parseAllDirectives(code: string, pattern: RegExp): DirectiveMatch[] {
  let match;
  const matches: DirectiveMatch[] = [], stack: DirectiveMatch[] = [];
  pattern.lastIndex = 0;
  while ((match = pattern.exec(code)) !== null) {
    const [matched, type, condition] = match;
    const directive = {
      start: match.index,
      end: match.index + matched.length,
      type,
      condition: condition.trim() || null,
    } as DirectiveMatch;
    // 'i' indicates if[[n]def], 'e' indicates else/endif, 'en' indicates endif
    if (type.startsWith('i')) {
      stack.push(directive);
    } else {
      const preDirective = stack.pop();
      if (!preDirective) {
        throw new Error(`Unexpected #${type} without matching #if`, {
          cause: convertIndexToPosition(code, match.index),
        });
      }
      const prediction = NEXT_DIRECTIVE_MAP[preDirective.type];
      if (type.startsWith(prediction)) {
        preDirective.next = directive;
        type === 'else' && stack.push(directive);
      } else {
        throw new Error(`Unexpected #${type} after #${preDirective.type}`, {
          cause: convertIndexToPosition(code, match.index),
        });
      }
    }
    matches.push(directive);
  }

  if (stack.length) {
    const directive = stack.pop()!;
    throw new Error(`Unclosed conditional block(s)`, {
      cause: convertIndexToPosition(code, directive.start),
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
