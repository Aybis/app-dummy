import { Pressable, Text, View } from "react-native";
import { tapLight } from "../../lib/haptics";

type Item = { key: string; label: string };

type Props = {
  items: Item[];
  activeKey: string;
  onChange: (key: string) => void;
};

/** Segmented control: one atom, reused by the mode switcher. */
export function SegmentedControl({ items, activeKey, onChange }: Props) {
  return (
    <View className="flex-row rounded-2xl border border-ink-700 bg-ink-850 p-1">
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            onPress={() => {
              if (active) return;
              tapLight();
              onChange(item.key);
            }}
            className={[
              "flex-1 items-center rounded-xl py-2.5",
              active ? "bg-ink-700" : "bg-transparent",
            ].join(" ")}
          >
            <Text
              className={[
                "text-sm font-semibold tracking-wide",
                active ? "text-white" : "text-ink-500",
              ].join(" ")}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
