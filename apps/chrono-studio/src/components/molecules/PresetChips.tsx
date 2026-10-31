import { Text, View } from "react-native";
import { tapLight } from "../../lib/haptics";

type Preset = { label: string; ms: number };

type Props = {
  presets: Preset[];
  activeMs: number;
  disabled?: boolean;
  onSelect: (ms: number) => void;
};

/** Quick-duration chips for the countdown picker. */
export function PresetChips({ presets, activeMs, disabled = false, onSelect }: Props) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {presets.map((preset) => {
        const active = preset.ms === activeMs;
        return (
          <Text
            key={preset.label}
            accessibilityRole="button"
            accessibilityState={{ selected: active, disabled }}
            onPress={() => {
              if (disabled || active) return;
              tapLight();
              onSelect(preset.ms);
            }}
            className={[
              "overflow-hidden rounded-xl border px-3.5 py-2 text-sm font-semibold",
              active
                ? "border-acid-400 bg-acid-500/15 text-acid-400"
                : "border-ink-600 bg-ink-850 text-ink-500",
              disabled ? "opacity-40" : "active:opacity-70",
            ].join(" ")}
          >
            {preset.label}
          </Text>
        );
      })}
    </View>
  );
}
