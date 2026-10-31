import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Monotonic, drift-free timing engines.
 *
 * Why not `elapsed += 33` inside setInterval? Because setInterval drifts, and
 * React Native throttles timers when the JS thread is busy or the app is
 * backgrounded, so an accumulating counter silently desyncs from real time.
 * Instead we keep a timestamp anchor in a ref and derive the display value as
 * `Date.now() - anchor` on every tick: the reading can be at most one tick
 * stale, never accumulated-wrong. Anchors live in refs (not state) so that
 * pause/start never has to write state from inside a state updater.
 */

const TICK_MS = 33; // ~30fps; plenty for a centisecond display, easier on the battery

export function useStopwatch() {
  const startedAt = useRef<number | null>(null);
  const banked = useRef(0); // time banked before the current run segment
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  const read = useCallback((): number => {
    return banked.current + (startedAt.current === null ? 0 : Date.now() - startedAt.current);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const compute = () => setElapsed(read());
    compute();
    const id = setInterval(compute, TICK_MS);
    return () => clearInterval(id);
  }, [isRunning, read]);

  const start = useCallback(() => {
    if (startedAt.current !== null) return;
    startedAt.current = Date.now();
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (startedAt.current === null) return;
    banked.current += Date.now() - startedAt.current;
    startedAt.current = null;
    setElapsed(banked.current);
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    startedAt.current = null;
    banked.current = 0;
    setElapsed(0);
    setIsRunning(false);
    setLaps([]);
  }, []);

  const lap = useCallback(() => {
    if (startedAt.current === null) return; // no split for a paused stopwatch
    const mark = read();
    setLaps((prev) => [...prev, mark]);
  }, [read]);

  return { elapsed, isRunning, laps, start, pause, reset, lap };
}

/**
 * Countdown engine. Counts down to a fixed deadline rather than decrementing a
 * counter, so a throttled tick can make the UI update late but can never make
 * the countdown actually run long.
 */
export function useCountdown(totalMs: number, onComplete?: () => void) {
  const deadline = useRef<number | null>(null);
  const fired = useRef(false);
  const [remaining, setRemaining] = useState(totalMs);
  const [isRunning, setIsRunning] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Idle re-anchor: changing the configured duration updates the idle display.
  useEffect(() => {
    if (!isRunning) {
      setRemaining(totalMs);
      fired.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalMs]);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      if (deadline.current === null) return;
      const left = deadline.current - Date.now();
      if (left <= 0) {
        setRemaining(0);
        deadline.current = null;
        setIsRunning(false);
        if (!fired.current) {
          fired.current = true;
          onCompleteRef.current?.();
        }
        return;
      }
      setRemaining(left);
    };

    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [isRunning]);

  const start = useCallback(() => {
    if (deadline.current !== null) return;
    fired.current = false;
    // Resume from the remaining time (not the full duration) when paused.
    const base = remaining > 0 ? remaining : totalMs;
    deadline.current = Date.now() + base;
    setIsRunning(true);
  }, [remaining, totalMs]);

  const pause = useCallback(() => {
    if (deadline.current === null) return;
    const left = Math.max(0, deadline.current - Date.now());
    deadline.current = null;
    setRemaining(left);
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    deadline.current = null;
    fired.current = false;
    setRemaining(totalMs);
    setIsRunning(false);
  }, [totalMs]);

  return {
    remaining,
    isRunning,
    progress: totalMs > 0 ? Math.min(1, Math.max(0, 1 - remaining / totalMs)) : 0,
    start,
    pause,
    reset,
  };
}
