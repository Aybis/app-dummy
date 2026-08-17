/** Formats a numeric result for display, avoiding float noise and overly long strings. */
export function formatResult(value: number): string {
  if (Number.isNaN(value)) return 'Error';
  if (!Number.isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';

  const abs = Math.abs(value);

  // Use scientific notation for very large/small non-zero numbers.
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-9)) {
    return value.toExponential(6).replace(/\.?0+e/, 'e');
  }

  // Round to 10 significant decimal places to kill binary float noise
  // (e.g. 0.1 + 0.2 -> 0.30000000000000004), then strip trailing zeros.
  const rounded = parseFloat(value.toPrecision(12));
  let str = rounded.toString();

  if (str.includes('e')) {
    str = rounded.toFixed(12).replace(/0+$/, '').replace(/\.$/, '');
  }

  return str;
}
