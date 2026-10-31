import { FlatList, Text, View } from "react-native";
import { formatStopwatch } from "../../lib/format";

type Props = {
  /** Cumulative marks, ascending, as produced by the stopwatch engine. */
  laps: number[];
};

/**
 * Lap list. Each row shows the split (lap time) and the cumulative total, which
 * is what people actually want when comparing laps. Newest lap on top.
 */
export function LapList({ laps }: Props) {
  if (laps.length === 0) {
    return (
      <View className="items-center rounded-2xl border border-dashed border-ink-700 px-4 py-8">
        <Text className="text-sm text-ink-500">No laps yet</Text>
        <Text className="mt-1 text-xs text-ink-600">Tap Lap while running</Text>
      </View>
    );
  }

  const rows = laps
    .map((cumulative, index) => ({
      index: index + 1,
      cumulative,
      split: cumulative - (index === 0 ? 0 : laps[index - 1]),
    }))
    .reverse();

  const fastest = Math.min(...rows.map((r) => r.split));
  const slowest = Math.max(...rows.map((r) => r.split));

  return (
    <View className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-850">
      <View className="flex-row border-b border-ink-700 px-4 py-2.5">
        <Text className="w-14 text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          Lap
        </Text>
        <Text className="flex-1 text-right text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          Split
        </Text>
        <Text className="flex-1 text-right text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          Total
        </Text>
      </View>
      <FlatList
        data={rows}
        keyExtractor={(row) => String(row.index)}
        scrollEnabled={false}
        renderItem={({ item }) => {
          // Highlight only once there is more than one lap to compare against.
          const isFastest = rows.length > 1 && item.split === fastest;
          const isSlowest = rows.length > 1 && item.split === slowest;
          const splitClass = isFastest
            ? "text-acid-400"
            : isSlowest
              ? "text-ember-400"
              : "text-white";
          return (
            <View className="flex-row items-center border-b border-ink-800 px-4 py-3 last:border-b-0">
              <Text className="w-14 font-mono text-sm text-ink-500">
                {String(item.index).padStart(2, "0")}
              </Text>
              <Text className={`flex-1 text-right font-mono text-sm font-semibold ${splitClass}`}>
                {formatStopwatch(item.split)}
              </Text>
              <Text className="flex-1 text-right font-mono text-sm text-ink-500">
                {formatStopwatch(item.cumulative)}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
