import { evaluateExpression, Conditions } from '../../src/core/evaluateExpression';

describe('evaluateExpression', () => {
  it('should evaluate simple OR expressions', () => {
    const conditions: Conditions = { A: true, B: false };
    expect(evaluateExpression('A || B', conditions)).toBe(true);
    expect(evaluateExpression('B || A', conditions)).toBe(true);
    expect(evaluateExpression('B || B', conditions)).toBe(false);
  });

  it('should evaluate simple AND expressions', () => {
    const conditions: Conditions = { A: true, B: false };
    expect(evaluateExpression('A && B', conditions)).toBe(false);
    expect(evaluateExpression('A && A', conditions)).toBe(true);
    expect(evaluateExpression('B && B', conditions)).toBe(false);
  });

  it('should evaluate NOT expressions', () => {
    const conditions: Conditions = { A: true, B: false };
    expect(evaluateExpression('!A', conditions)).toBe(false);
    expect(evaluateExpression('!B', conditions)).toBe(true);
  });

  it('should evaluate expressions with parentheses', () => {
    const conditions: Conditions = { A: true, B: false, C: true };
    expect(evaluateExpression('(A || B) && C', conditions)).toBe(true);
    expect(evaluateExpression('(A && B) || C', conditions)).toBe(true);
    expect(evaluateExpression('(A && (B || C))', conditions)).toBe(true);
  });

  it('should handle whitespace correctly', () => {
    const conditions: Conditions = { A: true, B: false };
    expect(evaluateExpression(' A || B ', conditions)).toBe(true);
    expect(evaluateExpression(' A && B ', conditions)).toBe(false);
  });

  it('should throw an error for invalid expressions', () => {
    const conditions: Conditions = { A: true };
    expect(() => evaluateExpression('A ||', conditions)).toThrow(SyntaxError);
    expect(() => evaluateExpression('|| A', conditions)).toThrow(SyntaxError);
    expect(() => evaluateExpression('A && (B ||)', conditions)).toThrow(SyntaxError);
    expect(() => evaluateExpression('A && (B', conditions)).toThrow(SyntaxError);
  });

  it('should evaluate complex expressions', () => {
    const conditions: Conditions = { A: true, B: false, C: true, D: false };
    expect(evaluateExpression('A && B || C && D', conditions)).toBe(false);
    expect(evaluateExpression('A || B && C || D', conditions)).toBe(true);
    expect(evaluateExpression('!(A && B) || (C && !D)', conditions)).toBe(true);
  });
});
