import { Text, View } from "react-native";
import { formatDuration } from "../../lib/format";

type Props = {
  label: string;
  /** Pre-formatted value; when omitted, `ms` is formatted as a duration. */
  value?: string;
  ms?: number;
  accent?: boolean;
};

/** A single metric readout: small caps label above a monospace value. */
export function StatTile({ label, value, ms, accent = false }: Props) {
  const shown = value ?? (ms !== undefined ? formatDuration(ms) : "—");
  return (
    <View className="flex-1 rounded-2xl border border-ink-700 bg-ink-850 px-4 py-3">
      <Text className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
        {label}
      </Text>
      <Text
        className={[
          "mt-1 font-mono text-lg font-bold",
          accent ? "text-acid-400" : "text-white",
        ].join(" ")}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {shown}
      </Text>
    </View>
  );
}
