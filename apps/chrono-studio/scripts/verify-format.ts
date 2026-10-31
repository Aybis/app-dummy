/**
 * Verification harness for the pure timing/format logic.
 *
 * Run: node --experimental-strip-types scripts/verify-format.ts
 *
 * This exercises the real source module (not a copy), asserting the exact
 * display contract the UI depends on.
 */
import assert from "node:assert/strict";
import { formatCountdown, formatDuration, formatStopwatch } from "../src/lib/format.ts";

type Case<T> = { name: string; input: T; expected: string };

const stopwatchCases: Case<number>[] = [
  { name: "zero", input: 0, expected: "00:00.00" },
  { name: "negative clamps", input: -500, expected: "00:00.00" },
  { name: "10 centiseconds", input: 100, expected: "00:00.10" },
  { name: "1 second", input: 1000, expected: "00:01.00" },
  { name: "59.99s", input: 59_990, expected: "00:59.99" },
  { name: "1 minute", input: 60_000, expected: "01:00.00" },
  { name: "1h crossover", input: 3_600_000, expected: "1:00:00.00" },
  { name: "1h 2m 3.45s", input: 3_723_450, expected: "1:02:03.45" },
];

const countdownCases: Case<number>[] = [
  { name: "zero", input: 0, expected: "00:00" },
  { name: "1ms rounds up", input: 1, expected: "00:01" },
  { name: "900ms rounds up", input: 900, expected: "00:01" },
  { name: "1s", input: 1000, expected: "00:01" },
  { name: "5 minutes", input: 300_000, expected: "05:00" },
  { name: "25 minutes", input: 1_500_000, expected: "25:00" },
  { name: "1 hour", input: 3_600_000, expected: "1:00:00" },
  { name: "negative clamps", input: -1000, expected: "00:00" },
];

const durationCases: Case<number>[] = [
  { name: "10s", input: 10_000, expected: "10s" },
  { name: "45s", input: 45_000, expected: "45s" },
  { name: "1m", input: 60_000, expected: "1m" },
  { name: "1m 30s", input: 90_000, expected: "1m 30s" },
  { name: "5m", input: 300_000, expected: "5m" },
  { name: "1h", input: 3_600_000, expected: "1h" },
  { name: "1h 30m", input: 5_400_000, expected: "1h 30m" },
];

let passed = 0;
const failures: string[] = [];

function run<T>(label: string, cases: Case<T>[], fn: (input: T) => string) {
  for (const testCase of cases) {
    try {
      assert.equal(fn(testCase.input), testCase.expected);
      passed += 1;
    } catch {
      failures.push(
        `${label} / ${testCase.name}: expected "${testCase.expected}", got "${fn(testCase.input)}"`
      );
    }
  }
}

run("formatStopwatch", stopwatchCases, formatStopwatch);
run("formatCountdown", countdownCases, formatCountdown);
run("formatDuration", durationCases, formatDuration);

// Round-trip sanity: a countdown display must never show a value below 00:00.
for (let ms = 0; ms <= 120_000; ms += 997) {
  const shown = formatCountdown(ms);
  if (!/^\d{2}:\d{2}$/.test(shown)) {
    failures.push(`formatCountdown shape at ${ms}ms produced "${shown}"`);
  }
  passed += 1;
}

// Monotonic sanity: stopwatch output must be non-decreasing in time.
let previous = "";
for (let ms = 0; ms <= 60_000; ms += 337) {
  const shown = formatStopwatch(ms);
  if (shown < previous) {
    failures.push(`formatStopwatch went backwards at ${ms}ms: "${previous}" -> "${shown}"`);
  }
  previous = shown;
  passed += 1;
}

console.log(`checks passed: ${passed}`);
if (failures.length > 0) {
  console.error(`failures: ${failures.length}`);
  for (const failure of failures) console.error("  - " + failure);
  process.exit(1);
}
console.log("all format assertions passed");
