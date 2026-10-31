import { Text, View } from "react-native";
import { formatStopwatch } from "../../lib/format";
import { ActionButton } from "../atoms/ActionButton";
import { LapList } from "../molecules/LapList";
import { useStopwatch } from "../../hooks/useTimerEngine";

/**
 * Stopwatch organism: counts up, records laps, pauses/resumes without losing
 * banked time. All timing lives in the engine hook so this file stays layout.
 */
export function StopwatchView() {
  const { elapsed, isRunning, laps, start, pause, reset, lap } = useStopwatch();
  const hasElapsed = elapsed > 0;

  return (
    <View className="flex-1">
      <View className="items-center justify-center py-10">
        <Text
          className="font-mono text-[68px] font-bold leading-none tracking-tight text-white"
          numberOfLines={1}
          adjustsFontSizeToFit
          accessibilityLabel={`Elapsed ${formatStopwatch(elapsed)}`}
        >
          {formatStopwatch(elapsed)}
        </Text>
        <Text className="mt-3 text-xs font-semibold uppercase tracking-[4px] text-ink-500">
          {isRunning ? "Running" : hasElapsed ? "Paused" : "Ready"}
        </Text>
      </View>

      <View className="mb-6 flex-row gap-3">
        <ActionButton
          label={isRunning ? "Pause" : hasElapsed ? "Resume" : "Start"}
          onPress={isRunning ? pause : start}
          variant={isRunning ? "neutral" : "primary"}
          wide
        />
        <ActionButton
          label="Lap"
          onPress={lap}
          variant="accent"
          disabled={!isRunning}
          wide
        />
        <ActionButton
          label="Reset"
          onPress={reset}
          variant="ghost"
          disabled={!hasElapsed && laps.length === 0}
          wide
        />
      </View>

      <View className="mb-2 flex-row items-baseline justify-between">
        <Text className="text-sm font-semibold uppercase tracking-widest text-ink-500">
          Laps
        </Text>
        <Text className="font-mono text-sm text-ink-500">{laps.length}</Text>
      </View>

      <LapList laps={laps} />
    </View>
  );
}
