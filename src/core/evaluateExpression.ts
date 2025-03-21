export interface Conditions {
  [key: string]: boolean;
}

/**
 * Evaluates a boolean expression with operators ||, &&, !, and parentheses
 * @param expression - The expression to evaluate
 * @param conditions - The condition values object
 * @returns The evaluation result
 */
export function evaluateExpression(expression: string, conditions: Conditions): boolean {
  let pos = 0;

  // Parse OR expressions (lowest precedence)
  function parseOr(): boolean {
    let left = parseAnd();
    while (pos < expression.length) {
      skipWhitespace();

      if (pos + 1 < expression.length && expression.substring(pos, pos + 2) === '||') {
        pos += 2; // Skip '||'
        const right = parseAnd();
        left = left || right;
      } else {
        break;
      }
    }
    return left;
  }

  // Parse AND expressions (medium precedence)
  function parseAnd(): boolean {
    let left = parseNot();
    while (pos < expression.length) {
      skipWhitespace();

      if (pos + 1 < expression.length && expression.substring(pos, pos + 2) === '&&') {
        pos += 2; // Skip '&&'
        const right = parseNot();
        left = left && right;
      } else {
        break;
      }
    }
    return left;
  }

  // Parse NOT expressions (high precedence)
  function parseNot(): boolean {
    skipWhitespace();

    if (pos < expression.length && expression[pos] === '!') {
      pos++; // Skip '!'
      return !parseAtom();
    }

    return parseAtom();
  }

  // Parse atomic expressions (variables or parenthesized expressions)
  function parseAtom(): boolean {
    skipWhitespace();

    if (pos >= expression.length) {
      throw new Error('Unexpected end of expression');
    }

    // Handle parenthesized expressions
    if (expression[pos] === '(') {
      pos++; // Skip '('
      const result = parseOr();

      skipWhitespace();

      if (pos >= expression.length || expression[pos] !== ')') {
        throw new Error('Missing closing parenthesis');
      }

      pos++; // Skip ')'
      return result;
    }

    // Handle identifiers (condition names)
    const start = pos;
    while (pos < expression.length &&
      (isAlphaNumericUnderdash(expression[pos]))) {
      pos++;
    }

    const identifier = expression.substring(start, pos);
    if (identifier.length === 0) {
      throw new Error(`Unexpected character at position ${pos}: ${expression[pos]}`);
    }

    return !!conditions[identifier];
  }

  function skipWhitespace(): void {
    while (pos < expression.length && /\s/.test(expression[pos])) {
      pos++;
    }
  }

  function isAlphaNumericUnderdash(char: string): boolean {
    return /[A-Z0-9_]/.test(char);
  }

  const result = parseOr();
  if (pos < expression.length) {
    throw new Error(`Unexpected character at position ${pos}: ${expression[pos]}`);
  }
  return result;
}
