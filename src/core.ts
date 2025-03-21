const COMMENT_EXTRACT = /(?:<!--|\{?\/\*)\s+#(if(?:not|n?def)?|else|endif)([A-Z_!|&\s\(\)]+)(?:(?<=<!--.*)-->|(?<=\/\*.*)\*\/\}?)/g;

interface DirectiveMatch {
  index: number;
  length: number;
  type: string;
  condition: string | null;
}

interface ConditionsObject {
  [key: string]: boolean;
}

interface ProcessOptions {
  debug?: boolean;
}

/**
 * Process source code with conditional compilation directives
 * @param code - Source code to process
 * @param conditions - Condition flags, e.g. { IS_LINUX: false }
 * @param debug - Debug mode flag
 * @returns Processed code
 */
function processConditionalCode(code: string, conditions: ConditionsObject = {}, debug?: boolean): string {
  // Process the code using a stack-based approach
  let result = '', currentPosition = 0;
  const stack: boolean[] = [];
  // Find all conditional directives
  const directives = findAllDirectives(code, COMMENT_EXTRACT);
  console.log('Directives found:', directives);
  for (const directive of directives) {
    const directiveType = directive.type;
    if (directiveType[0] === 'i') {
      // Handle #if, #ifdef, #ifndef, #ifnot
      const evaluatedCondition = evaluateCondition(directive, conditions);
      stack.push(evaluatedCondition);
      result += code.substring(currentPosition, directive.index);
    } else {
      if (stack.length === 0) {
        throw new Error(`Unexpected #${directiveType} without matching #if`);
      }
      const lastConditionMet = stack.pop();
      if (lastConditionMet) {
        result += code.substring(currentPosition, directive.index);
      }
      if (directiveType === 'else') {
        stack.push(!lastConditionMet);
      }
    }
    currentPosition = directive.index + directive.length;
  }
  // Add remaining code
  result += code.substring(currentPosition);
  if (stack.length > 0) {
    throw new Error('Unclosed conditional block(s)');
  }
  return result;
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
      index: match.index,
      length: matched.length,
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
function evaluateCondition(directive: DirectiveMatch, conditions: ConditionsObject): boolean {
  const condition = directive.condition;
  const type = directive.type;
  
  if (!condition) return false;
  
  switch (type) {
    case 'ifdef': return condition in conditions;
    case 'ifndef': return !(condition in conditions);
    case 'ifnot': return !conditions[condition];
    default: return !!conditions[condition];
  }
}

export {
  processConditionalCode,
  ConditionsObject,
  DirectiveMatch
};