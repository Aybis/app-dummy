/**
 * Scientific expression evaluator.
 *
 * Deliberately NOT using eval()/Function() — this is a hand-rolled
 * recursive-descent parser so behavior is predictable, safe, and
 * supports proper operator precedence, functions, and constants.
 *
 * Grammar (highest to lowest precedence):
 *   primary    := number | constant | ident '(' expression ')' | '(' expression ')'
 *   postfix    := primary ('%' | '!')*
 *   power      := postfix ('^' unary)*        (right-associative)
 *   unary      := ('-' | '+')? power
 *   term       := unary (('*' | '/') unary)*
 *   expression := term (('+' | '-') term)*
 */

export type AngleMode = 'deg' | 'rad';

export class EvaluatorError extends Error {}

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan',
  'asin', 'acos', 'atan',
  'ln', 'log', 'sqrt', 'exp', 'abs',
]);

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

type TokenType = 'num' | 'ident' | 'op' | 'lparen' | 'rparen' | 'comma';

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const src = input.replace(/\s+/g, '');

  while (i < src.length) {
    const ch = src[i];

    if (/[0-9.]/.test(ch)) {
      let j = i + 1;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      const numStr = src.slice(i, j);
      if ((numStr.match(/\./g) || []).length > 1) {
        throw new EvaluatorError('Invalid number');
      }
      tokens.push({ type: 'num', value: numStr });
      i = j;
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      let j = i + 1;
      while (j < src.length && /[a-zA-Z]/.test(src[j])) j++;
      tokens.push({ type: 'ident', value: src.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen', value: ch });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen', value: ch });
      i++;
      continue;
    }
    if (ch === ',') {
      tokens.push({ type: 'comma', value: ch });
      i++;
      continue;
    }
    if ('+-*/^%!'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    if (ch === '\u00d7') { // ×
      tokens.push({ type: 'op', value: '*' });
      i++;
      continue;
    }
    if (ch === '\u00f7') { // ÷
      tokens.push({ type: 'op', value: '/' });
      i++;
      continue;
    }

    throw new EvaluatorError(`Unexpected character: ${ch}`);
  }

  return tokens;
}

/** Auto-close any unmatched opening parens so users don't have to. */
function balanceParens(tokens: Token[]): Token[] {
  let depth = 0;
  for (const t of tokens) {
    if (t.type === 'lparen') depth++;
    if (t.type === 'rparen') depth--;
  }
  if (depth > 0) {
    return [...tokens, ...Array(depth).fill({ type: 'rparen', value: ')' } as Token)];
  }
  return tokens;
}

function factorial(n: number): number {
  if (n < 0 || Math.floor(n) !== n) {
    throw new EvaluatorError('Factorial requires a non-negative integer');
  }
  if (n > 170) return Infinity;
  let result = 1;
  for (let k = 2; k <= n; k++) result *= k;
  return result;
}

class Parser {
  private tokens: Token[];
  private pos = 0;
  private angleMode: AngleMode;

  constructor(tokens: Token[], angleMode: AngleMode) {
    this.tokens = tokens;
    this.angleMode = angleMode;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    const t = this.tokens[this.pos];
    if (!t) throw new EvaluatorError('Unexpected end of expression');
    this.pos++;
    return t;
  }

  parse(): number {
    if (this.tokens.length === 0) throw new EvaluatorError('Empty expression');
    const value = this.parseExpression();
    if (this.pos !== this.tokens.length) {
      throw new EvaluatorError('Unexpected trailing input');
    }
    return value;
  }

  private parseExpression(): number {
    let value = this.parseTerm();
    while (this.peek()?.type === 'op' && (this.peek()!.value === '+' || this.peek()!.value === '-')) {
      const op = this.consume().value;
      const rhs = this.parseTerm();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  }

  private parseTerm(): number {
    let value = this.parseUnary();
    while (this.peek()?.type === 'op' && (this.peek()!.value === '*' || this.peek()!.value === '/')) {
      const op = this.consume().value;
      const rhs = this.parseUnary();
      if (op === '/' && rhs === 0) throw new EvaluatorError('Division by zero');
      value = op === '*' ? value * rhs : value / rhs;
    }
    return value;
  }

  private parseUnary(): number {
    if (this.peek()?.type === 'op' && (this.peek()!.value === '-' || this.peek()!.value === '+')) {
      const op = this.consume().value;
      const value = this.parseUnary();
      return op === '-' ? -value : value;
    }
    return this.parsePower();
  }

  private parsePower(): number {
    const base = this.parsePostfix();
    if (this.peek()?.type === 'op' && this.peek()!.value === '^') {
      this.consume();
      const exponent = this.parseUnary(); // right-associative, allows -2^-2
      return Math.pow(base, exponent);
    }
    return base;
  }

  private parsePostfix(): number {
    let value = this.parsePrimary();
    while (this.peek()?.type === 'op' && (this.peek()!.value === '%' || this.peek()!.value === '!')) {
      const op = this.consume().value;
      value = op === '%' ? value / 100 : factorial(value);
    }
    return value;
  }

  private parsePrimary(): number {
    const t = this.peek();
    if (!t) throw new EvaluatorError('Unexpected end of expression');

    if (t.type === 'num') {
      this.consume();
      return parseFloat(t.value);
    }

    if (t.type === 'lparen') {
      this.consume();
      const value = this.parseExpression();
      if (this.peek()?.type !== 'rparen') throw new EvaluatorError('Missing closing parenthesis');
      this.consume();
      return value;
    }

    if (t.type === 'ident') {
      const name = this.consume().value.toLowerCase();

      if (CONSTANTS[name] !== undefined) {
        return CONSTANTS[name];
      }

      if (FUNCTIONS.has(name)) {
        if (this.peek()?.type !== 'lparen') throw new EvaluatorError(`Expected '(' after ${name}`);
        this.consume();
        const arg = this.parseExpression();
        if (this.peek()?.type !== 'rparen') throw new EvaluatorError('Missing closing parenthesis');
        this.consume();
        return this.applyFunction(name, arg);
      }

      throw new EvaluatorError(`Unknown identifier: ${name}`);
    }

    throw new EvaluatorError(`Unexpected token: ${t.value}`);
  }

  private applyFunction(name: string, arg: number): number {
    const toRad = (v: number) => (this.angleMode === 'deg' ? (v * Math.PI) / 180 : v);
    const fromRad = (v: number) => (this.angleMode === 'deg' ? (v * 180) / Math.PI : v);

    switch (name) {
      case 'sin': return Math.sin(toRad(arg));
      case 'cos': return Math.cos(toRad(arg));
      case 'tan': return Math.tan(toRad(arg));
      case 'asin': return fromRad(Math.asin(arg));
      case 'acos': return fromRad(Math.acos(arg));
      case 'atan': return fromRad(Math.atan(arg));
      case 'ln':
        if (arg <= 0) throw new EvaluatorError('ln domain error');
        return Math.log(arg);
      case 'log':
        if (arg <= 0) throw new EvaluatorError('log domain error');
        return Math.log10(arg);
      case 'sqrt':
        if (arg < 0) throw new EvaluatorError('sqrt domain error');
        return Math.sqrt(arg);
      case 'exp': return Math.exp(arg);
      case 'abs': return Math.abs(arg);
      default:
        throw new EvaluatorError(`Unknown function: ${name}`);
    }
  }
}

export function evaluate(expression: string, angleMode: AngleMode = 'deg'): number {
  const tokens = balanceParens(tokenize(expression));
  const result = new Parser(tokens, angleMode).parse();
  if (!Number.isFinite(result)) {
    throw new EvaluatorError(Number.isNaN(result) ? 'Math error' : 'Overflow');
  }
  return result;
}
