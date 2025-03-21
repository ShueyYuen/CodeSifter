const COMMENT_EXTRACT = /(?:<!--|\/\*)\s+#(if|ifnot|ifdef|ifndef|else|endif)\s+(?:([A-Z_]+)*\s+){0,1}(?:(?<=<!--.*)-->|(?<=\/\*.*)\*\/)/g;

const CONDITION_START = ['if', 'ifdef', 'ifndef'];

/**
 * Process source code with conditional compilation directives
 * @param {string} code - Source code to process
 * @param {Object} conditions - Condition flags, e.g. { IS_LINUX: false }
 * @param {Object} options - Additional options
 * @returns {string} Processed code
 */
function processConditionalCode(code, conditions = {}, debug) {
  // Process the code using a stack-based approach
  let result = '', currentPosition = 0;
  const stack = [];

  // Find all conditional directives
  const allMatches = findAllDirectives(code, COMMENT_EXTRACT);

  for (const match of allMatches) {
    // match.type.startsWith('if');
    if (CONDITION_START.includes(match.type)) {
      // Handle #if directive
      const evaluatedCondition = evaluateCondition(match, conditions);
      stack.push(evaluatedCondition);
      result += code.substring(currentPosition, match.index);
    } else {
      if (stack.length === 0) {
        throw new Error(`Unexpected #${match.type} without matching #if`);
      }
      const lastConditionMet = stack.pop();
      if (lastConditionMet) {
        result += code.substring(currentPosition, match.index);
      }
      if (match.type === 'else') {
        stack.push(!lastConditionMet);
      }
    }
    currentPosition = match.index + match.length;
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
 * @param {string} code - Source code
 * @param {Object} patterns - Regex patterns for directives
 * @returns {Array} Array of matches
 */
function findAllDirectives(code, pattern) {
  let match;
  const matches = [];
  pattern.lastIndex = 0;

  while ((match = pattern.exec(code)) !== null) {
    const [matched,type,condition] = match;
    console.log('Matched:',match);
    matches.push({
      index: match.index,
      length: matched.length,
      type,
      condition: condition || null,
    });
  }
  return matches;
}

/**
 * Evaluate a condition based on provided condition values
 * @param {string} condition - Condition name
 * @param {Object} conditions - Condition values
 * @returns {boolean} Evaluation result
 */
function evaluateCondition(match, conditions) {
  const condition = match.condition;
  const type = match.type;
  
  switch (type) {
    case 'ifdef': return condition in conditions;
    case 'ifndef': return !(condition in conditions);
    case 'ifnot': return !conditions[condition];
    default: return !!conditions[condition];
  }
}

module.exports = {
  processConditionalCode
};
