/**
 * Time formatting helpers. All functions are pure and operate on milliseconds.
 */

const pad = (value: number, size = 2) => String(Math.floor(value)).padStart(size, "0");

/** Stopwatch style: mm:ss.cc, expanding to h:mm:ss.cc past one hour. */
export function formatStopwatch(ms: number): string {
  const safe = Math.max(0, Math.floor(ms));
  const centis = Math.floor((safe % 1000) / 10);
  const totalSeconds = Math.floor(safe / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
}

/** Countdown style: h:mm:ss (or mm:ss under an hour), rounding up so it reads 1s before zero. */
export function formatCountdown(ms: number): string {
  const safe = Math.max(0, Math.ceil(ms / 1000));
  const seconds = safe % 60;
  const minutes = Math.floor(safe / 60) % 60;
  const hours = Math.floor(safe / 3600);

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/** Compact label for duration chips: "45s", "5m", "1h 30m". */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0 && seconds > 0) return `${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}
