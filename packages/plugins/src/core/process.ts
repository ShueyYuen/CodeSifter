import MagicString, { type SourceMap } from 'magic-string';

import { evaluateExpression, type Conditions } from './evaluateExpression.js';

export type { Conditions };


const DIRECTIVE_PATTERN = /\s*(?:<!--|\{?\/\*)\s+#(if(?:n?def)?|else|endif)((?<=#i\S*)[\s\S]+?|\s+)(?:(?<=<!--.*)-->|(?<=\/\*.*)\*\/\}?)/g;

type DirectiveType = 'ifdef' | 'ifndef' | 'if' | 'else' | 'endif';
interface Directive {
  start: number;
  end: number;
  type: DirectiveType;
  condition: string | null;
  next?: Directive;
}

interface EvaluatedDirective extends Directive {
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

const isElseDirective = /* #__PURE__ */ (type: DirectiveType) => type === 'else';

/**
 * Skip to the next paired directive in the sequence
 * @param directives - Array of remaining directives to process
 * @param currentDirective - Current directive to find the pair for
 */
function skipToMatchingDirective(directives: Directive[], currentDirective: Directive): void {
  const nextDirective = currentDirective.next;
  let directive: Directive | undefined;
  // eslint-disable-next-line no-cond-assign
  while (directive = directives.shift()) {
    if (directive === nextDirective) {
      break;
    }
  }
  directives.unshift(directive!);
}

/**
 * Convert a character index to a line and column position in the source code
 * @param code - Source code string
 * @param index - Character index to convert
 * @returns Position object with line and column information
 */
function getPositionInfo(code: string, index: number): { line: number; column: number } {
  if (index <= 0) {
    return { line: 0, column: 0 };
  }
  const lines = code.slice(0, index).split('\n');
  return {
    line: lines.length,
    column: lines.at(-1)!.length,
  };
}

/**
 * Get the removed sections of code based on directives and conditions
 * @param directives - Array of directive matches
 * @param conditions - Condition flags
 * @returns Array of removed sections as [start, end] pairs
 */
function getRemovedSections(
  directives: Directive[],
  conditions: Conditions
): [number, number][] {
  const stack: EvaluatedDirective[] = [], removed: [number, number][] = [];

  let directive: Directive | undefined;
  // eslint-disable-next-line no-cond-assign
  while (directive = directives.shift()) {
    const { start, end, type: directiveType } = directive;
    removed.push([start, end]);
    if (directive.condition) {
      try {
        const evaluated = evaluateDirectiveCondition(directive, conditions);
        stack.push({ ...directive, evaluated });
        if (!evaluated) {
          skipToMatchingDirective(directives, directive);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new SyntaxError(`Error evaluating directive condition`, {
            cause: start + <number>error.cause,
          });
        }
      }
    } else {
      const evaluatedDirective = stack.pop()!;
      const evaluated = evaluatedDirective.evaluated;
      if (!evaluated) {
        removed.pop();
        removed.pop();
        removed.push([evaluatedDirective.start, end]);
      }

      if (isElseDirective(directiveType)) {
        stack.push({
          ...directive,
          evaluated: !evaluated,
        });
        if (evaluated) {
          skipToMatchingDirective(directives, directive);
        }
      }
    }
  }

  return removed;
}

const DEFAULT_OPTIONS: ProcessOptions = {
  conditions: {},
  sourcemap: true,
  filename: 'unknown',
};

/**
 * Process source code with conditional compilation directives
 * @param code - Source code to process
 * @param options - Processing options including conditions and filename
 * @returns Processed code and optional source map
 */
function processCode(
  code: string,
  options: ProcessOptions = DEFAULT_OPTIONS
): ProcessResult {
  const { conditions, filename, sourcemap } =
    <Required<ProcessOptions>>Object.assign(structuredClone(DEFAULT_OPTIONS), options);

  // Find all conditional directives
  const directives = parseDirectives(code, DIRECTIVE_PATTERN);
  const removedSections = getRemovedSections(directives, conditions);

  if (!removedSections.length) {
    return { code };
  }

  if (sourcemap) {
    const magicString = new MagicString(code, { filename });
    for (const [start, end] of removedSections) {
      magicString.remove(start, end);
    }
    return {
      code: magicString.toString(),
      sourceMap: magicString.generateMap({ includeContent: true }),
    };
  }

  let result = '', lastPos = 0;
  for (const [start, end] of removedSections) {
    result += code.slice(lastPos, start);
    lastPos = end;
  }
  result += code.slice(lastPos);
  return { code: result };
}

/**
 * Maps directive types to their expected following directive types
 * e: either else or endif
 * en: only endif
 */
const DIRECTIVE_SEQUENCE_MAP = {
  if: 'e',
  ifdef: 'e',
  ifndef: 'e',
  else: 'en',
} as Record<DirectiveType, string>;

/**
 * Parse all directive matches in the source code
 * @param code - Source code to analyze
 * @param pattern - Regex pattern for conditional directives
 * @returns Array of parsed directives with their relationships
 */
function parseDirectives(code: string, pattern: RegExp): Directive[] {
  let match;
  const directives: Directive[] = [], stack: Directive[] = [];
  pattern.lastIndex = 0;

  while ((match = pattern.exec(code)) !== null) {
    if (match.index === pattern.lastIndex) {
      pattern.lastIndex++;
      continue;
    }
    const [matched, type, condition] = match;
    const directive = {
      start: match.index,
      end: match.index + matched.length,
      type,
      condition: condition.trim() || null,
    } as Directive;

    // 'i' indicates if[[n]def]
    if (type.startsWith('i')) {
      stack.push(directive);
    } else {
      const parentDirective = stack.pop();
      if (!parentDirective) {
        throw new Error(`Unexpected #${type} without matching #if`, {
          cause: getPositionInfo(code, match.index),
        });
      }

      const expectedType = DIRECTIVE_SEQUENCE_MAP[parentDirective.type];
      if (type.startsWith(expectedType)) {
        parentDirective.next = directive;
        if (isElseDirective(<DirectiveType>type)) {
          stack.push(directive);
        }
      } else {
        throw new Error(`Unexpected #${type} after #${parentDirective.type}`, {
          cause: getPositionInfo(code, match.index),
        });
      }
    }
    directives.push(directive);
  }

  if (stack.length) {
    const unclosedDirective = stack.pop()!;
    throw new Error(`Unclosed conditional block(s)`, {
      cause: getPositionInfo(code, unclosedDirective.start),
    });
  }

  return directives;
}

/**
 * Evaluate a directive condition based on provided condition values
 * @param directive - The directive to evaluate
 * @param conditions - Condition flags to use for evaluation
 * @returns Boolean result of the evaluation
 */
function evaluateDirectiveCondition(directive: Directive, conditions: Conditions): boolean {
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
  processCode,
  type Directive,
  type ProcessResult
};
