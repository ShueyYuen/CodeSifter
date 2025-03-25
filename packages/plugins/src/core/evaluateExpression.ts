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
  let position = 0;

  // Parse OR expressions (lowest precedence)
  function parseOr(): boolean {
    let left = parseAnd();
    while (position < expression.length) {
      skipWhitespace();

      if (position + 1 < expression.length && expression.substring(position, position + 2) === '||') {
        position += 2; // Skip '||'
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
    while (position < expression.length) {
      skipWhitespace();

      if (position + 1 < expression.length && expression.substring(position, position + 2) === '&&') {
        position += 2; // Skip '&&'
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

    if (position < expression.length && expression[position] === '!') {
      position++; // Skip '!'
      return !parseAtom();
    }

    return parseAtom();
  }

  // Parse atomic expressions (variables or parenthesized expressions)
  function parseAtom(): boolean {
    skipWhitespace();

    if (position >= expression.length) {
      throw new SyntaxError('Unexpected end of expression', { cause: position });
    }

    // Handle parenthesized expressions
    if (expression[position] === '(') {
      position++; // Skip '('
      const result = parseOr();

      skipWhitespace();

      if (position >= expression.length || expression[position] !== ')') {
        throw new SyntaxError('Missing closing parenthesis', { cause: position });
      }

      position++; // Skip ')'
      return result;
    }

    // Handle identifiers (condition names)
    const startPosition = position;
    while (position < expression.length &&
      (isIdentifierChar(expression[position]))) {
      position++;
    }

    const identifier = expression.substring(startPosition, position);
    if (identifier.length === 0) {
      throw new SyntaxError(`Unexpected character at position ${position}: ${expression[position]}`, {
        cause: position
      });
    }

    return !!conditions[identifier];
  }

  function skipWhitespace(): void {
    while (position < expression.length && /\s/.test(expression[position])) {
      position++;
    }
  }

  function isIdentifierChar(char: string): boolean {
    return /[A-Za-z0-9_]/.test(char);
  }

  const result = parseOr();
  if (position < expression.length) {
    throw new SyntaxError(`Unexpected character at position ${position}: ${expression[position]}`, {
      cause: position
    });
  }
  return result;
}
