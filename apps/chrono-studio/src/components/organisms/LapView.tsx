import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { formatDuration, formatStopwatch } from "../../lib/format";
import { notifySuccess, tapMedium } from "../../lib/haptics";
import { ActionButton } from "../atoms/ActionButton";
import { StatTile } from "../atoms/StatTile";

const TICK_MS = 33;

/**
 * Lap timer. Unlike the stopwatch (which records cumulative marks), this closes
 * each lap and immediately opens the next, so "current lap" is a first-class
 * value.
 *
 * `total` is *derived* as sum(closed splits) + live lap rather than tracked in
 * a separate accumulator: every close/pause path would otherwise have to keep a
 * second counter in sync, and a missed update silently resets the session total.
 * Derivation makes that class of bug impossible.
 *
 * Anchors live in refs so start/lap/pause never write state from an updater.
 */
export function LapView() {
  const segmentStart = useRef<number | null>(null);

  const [splits, setSplits] = useState<number[]>([]);
  const [currentLap, setCurrentLap] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const compute = () => {
      if (segmentStart.current === null) return;
      setCurrentLap(Date.now() - segmentStart.current);
    };
    compute();
    const id = setInterval(compute, TICK_MS);
    return () => clearInterval(id);
  }, [isRunning]);

  const start = useCallback(() => {
    if (segmentStart.current !== null) return;
    segmentStart.current = Date.now();
    setIsRunning(true);
  }, []);

  const closeLap = useCallback(() => {
    if (segmentStart.current === null) return;
    const now = Date.now();
    const split = now - segmentStart.current;
    segmentStart.current = now; // next lap starts immediately
    setSplits((prev) => [...prev, split]);
    setCurrentLap(0);
    tapMedium();
  }, []);

  const pause = useCallback(() => {
    if (segmentStart.current === null) return;
    const split = Date.now() - segmentStart.current;
    segmentStart.current = null;
    // Bank the partial lap so no elapsed time is lost across a pause.
    if (split > 0) setSplits((prev) => [...prev, split]);
    setCurrentLap(0);
    setIsRunning(false);
    notifySuccess();
  }, []);

  const reset = useCallback(() => {
    segmentStart.current = null;
    setSplits([]);
    setCurrentLap(0);
    setIsRunning(false);
  }, []);

  const closedTotal = splits.reduce((sum, split) => sum + split, 0);
  const total = closedTotal + currentLap;

  const best = splits.length > 0 ? Math.min(...splits) : 0;
  const worst = splits.length > 0 ? Math.max(...splits) : 0;
  const average = splits.length > 0 ? closedTotal / splits.length : 0;
  const hasData = total > 0 || splits.length > 0;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center py-8">
        <Text className="text-[11px] font-semibold uppercase tracking-[4px] text-ink-500">
          Current lap
        </Text>
        <Text
          className="mt-2 font-mono text-[56px] font-bold leading-none tracking-tight text-acid-400"
          numberOfLines={1}
          adjustsFontSizeToFit
          accessibilityLabel={`Current lap ${formatStopwatch(currentLap)}`}
        >
          {formatStopwatch(currentLap)}
        </Text>
        <Text className="mt-3 font-mono text-base text-ink-500">
          Total {formatStopwatch(total)}
        </Text>
      </View>

      <View className="mb-5 flex-row gap-3">
        <ActionButton
          label={isRunning ? "Pause" : hasData ? "Resume" : "Start"}
          onPress={isRunning ? pause : start}
          variant={isRunning ? "neutral" : "primary"}
          wide
        />
        <ActionButton label="Lap" onPress={closeLap} variant="accent" disabled={!isRunning} wide />
        <ActionButton label="Reset" onPress={reset} variant="ghost" disabled={!hasData} wide />
      </View>

      <View className="mb-5 flex-row gap-3">
        <StatTile label="Laps" value={String(splits.length)} />
        <StatTile label="Best" ms={best || undefined} accent />
        <StatTile label="Worst" ms={worst || undefined} />
      </View>

      <View className="mb-2 flex-row items-baseline justify-between">
        <Text className="text-sm font-semibold uppercase tracking-widest text-ink-500">
          Splits
        </Text>
        <Text className="font-mono text-sm text-ink-500">
          avg {splits.length > 0 ? formatDuration(average) : "—"}
        </Text>
      </View>

      {splits.length === 0 ? (
        <View className="items-center rounded-2xl border border-dashed border-ink-700 px-4 py-8">
          <Text className="text-sm text-ink-500">No laps closed yet</Text>
          <Text className="mt-1 text-xs text-ink-600">Start, then tap Lap to close a lap</Text>
        </View>
      ) : (
        <View className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-850">
          {splits
            .map((split, index) => ({ split, index: index + 1 }))
            .reverse()
            .map(({ split, index }) => {
              const isBest = splits.length > 1 && split === best;
              const isWorst = splits.length > 1 && split === worst;
              return (
                <View
                  key={index}
                  className="flex-row items-center border-b border-ink-800 px-4 py-3 last:border-b-0"
                >
                  <Text className="w-14 font-mono text-sm text-ink-500">
                    {String(index).padStart(2, "0")}
                  </Text>
                  <Text
                    className={[
                      "flex-1 text-right font-mono text-sm font-semibold",
                      isBest ? "text-acid-400" : isWorst ? "text-ember-400" : "text-white",
                    ].join(" ")}
                  >
                    {formatStopwatch(split)}
                  </Text>
                </View>
              );
            })}
        </View>
      )}
    </ScrollView>
  );
}
