import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { formatCountdown, formatDuration } from "../../lib/format";
import { notifySuccess, notifyWarning } from "../../lib/haptics";
import { useCountdown } from "../../hooks/useTimerEngine";
import { ActionButton } from "../atoms/ActionButton";
import { ProgressRing } from "../atoms/ProgressRing";
import { PresetChips } from "../molecules/PresetChips";

const PRESETS = [
  { label: "10s", ms: 10_000 },
  { label: "30s", ms: 30_000 },
  { label: "1m", ms: 60_000 },
  { label: "5m", ms: 5 * 60_000 },
  { label: "10m", ms: 10 * 60_000 },
  { label: "25m", ms: 25 * 60_000 },
];

const RING_SIZE = 280;

/**
 * Countdown organism: preset durations, resumable pause, progress ring, and a
 * completion state. The engine fires `onComplete` exactly once per run.
 */
export function CountdownView() {
  const [duration, setDuration] = useState(5 * 60_000);
  const [finished, setFinished] = useState(false);

  const handleComplete = useCallback(() => {
    setFinished(true);
    notifyWarning();
    setTimeout(notifySuccess, 220);
  }, []);

  const { remaining, isRunning, progress, start, pause, reset } = useCountdown(
    duration,
    handleComplete
  );

  const pickDuration = (ms: number) => {
    setFinished(false);
    setDuration(ms);
  };

  const handleReset = () => {
    setFinished(false);
    reset();
  };

  const expired = finished && remaining === 0;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center justify-center py-8">
        <View className="items-center justify-center">
          <View style={{ transform: [{ rotate: "0deg" }] }}>
            <ProgressRing
              progress={progress}
              size={RING_SIZE}
              strokeWidth={10}
              color={expired ? "#ff6b35" : "#2fe39a"}
            />
          </View>
          <View className="absolute items-center">
            <Text
              className={[
                "font-mono text-5xl font-bold leading-none tracking-tight",
                expired ? "text-ember-400" : "text-white",
              ].join(" ")}
              numberOfLines={1}
              adjustsFontSizeToFit
              accessibilityLabel={`Remaining ${formatCountdown(remaining)}`}
            >
              {formatCountdown(remaining)}
            </Text>
            <Text className="mt-2 text-[11px] font-semibold uppercase tracking-[3px] text-ink-500">
              {expired ? "Finished" : isRunning ? "Counting down" : "Of " + formatDuration(duration)}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-5">
        <Text className="mb-2 text-sm font-semibold uppercase tracking-widest text-ink-500">
          Duration
        </Text>
        <PresetChips
          presets={PRESETS}
          activeMs={duration}
          disabled={isRunning}
          onSelect={pickDuration}
        />
      </View>

      <View className="flex-row gap-3">
        <ActionButton
          label={isRunning ? "Pause" : remaining < duration && !expired ? "Resume" : "Start"}
          onPress={isRunning ? pause : start}
          variant={isRunning ? "neutral" : "primary"}
          disabled={expired}
          wide
        />
        <ActionButton label="Reset" onPress={handleReset} variant="ghost" wide />
      </View>

      <View className="mt-6 rounded-2xl border border-ink-700 bg-ink-850 p-4">
        <Text className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          Session
        </Text>
        <View className="mt-2 flex-row justify-between">
          <Text className="text-sm text-ink-500">Target</Text>
          <Text className="font-mono text-sm text-white">{formatDuration(duration)}</Text>
        </View>
        <View className="mt-1.5 flex-row justify-between">
          <Text className="text-sm text-ink-500">Remaining</Text>
          <Text className="font-mono text-sm text-white">{formatCountdown(remaining)}</Text>
        </View>
        <View className="mt-1.5 flex-row justify-between">
          <Text className="text-sm text-ink-500">Progress</Text>
          <Text className="font-mono text-sm text-acid-400">
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
