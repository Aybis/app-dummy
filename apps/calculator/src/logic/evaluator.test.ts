/**
 * Standalone smoke test runnable via `npx tsx src/logic/evaluator.test.ts`.
 * Not wired into a test runner yet (no jest configured for this app) —
 * kept as a lightweight assertion script for manual verification.
 */
import { evaluate } from './evaluator';
import { formatResult } from './format';

let passed = 0;
let failed = 0;

function check(expr: string, expected: number, angleMode: 'deg' | 'rad' = 'deg') {
  try {
    const actual = evaluate(expr, angleMode);
    const ok = Math.abs(actual - expected) < 1e-9;
    if (ok) {
      passed++;
    } else {
      failed++;
      console.error(`FAIL: ${expr} => ${actual}, expected ${expected}`);
    }
  } catch (err) {
    failed++;
    console.error(`FAIL (threw): ${expr} => ${err}`);
  }
}

function checkThrows(expr: string) {
  try {
    evaluate(expr);
    failed++;
    console.error(`FAIL (did not throw): ${expr}`);
  } catch {
    passed++;
  }
}

// Basic arithmetic
check('2+3', 5);
check('10-4', 6);
check('6*7', 42);
check('20/4', 5);
check('2+3*4', 14); // precedence
check('(2+3)*4', 20); // parens
check('-5+3', -2); // unary minus
check('2^3^2', 512); // right-assoc power: 2^(3^2) = 2^9

// Percent / factorial
check('50%', 0.5);
check('5!', 120);
check('0!', 1);

// Scientific functions (degrees)
check('sin(90)', 1, 'deg');
check('cos(0)', 1, 'deg');
check('sqrt(16)', 4);
check('log(100)', 2);
check('ln(1)', 0);
check('abs(-7)', 7);
check('exp(0)', 1);

// Scientific functions (radians)
check('sin(0)', 0, 'rad');

// Constants
check('pi', Math.PI);
check('e', Math.E);

// Auto-close unbalanced parens
check('sin(90', 1, 'deg');
check('(2+3', 5);

// Error cases
checkThrows('5/0');
checkThrows('sqrt(-1)');
checkThrows('ln(-1)');
checkThrows('2+');
checkThrows('');

// Format
console.log(`format(0.30000000000000004) = ${formatResult(0.1 + 0.2)}`);
console.log(`format(1e13) = ${formatResult(1e13)}`);
console.log(`format(NaN) = ${formatResult(NaN)}`);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
