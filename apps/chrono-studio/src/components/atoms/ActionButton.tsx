import { Pressable, Text } from "react-native";
import { tapLight } from "../../lib/haptics";

type Variant = "primary" | "accent" | "ghost" | "danger" | "neutral";

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  wide?: boolean;
};

// Variant -> class map keeps the JSX in the screens free of conditional noise.
const SURFACE: Record<Variant, string> = {
  primary: "bg-acid-500 border-acid-400",
  accent: "bg-sky-500 border-sky-400",
  ghost: "bg-transparent border-ink-600",
  danger: "bg-ember-500 border-ember-400",
  neutral: "bg-ink-700 border-ink-600",
};

const LABEL: Record<Variant, string> = {
  primary: "text-ink-950",
  accent: "text-ink-950",
  ghost: "text-ink-500",
  danger: "text-ink-950",
  neutral: "text-white",
};

export function ActionButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  wide = false,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        tapLight();
        onPress();
      }}
      className={[
        "items-center justify-center rounded-2xl border px-5 py-3.5",
        SURFACE[variant],
        wide ? "flex-1" : "min-w-[104px]",
        disabled ? "opacity-30" : "active:opacity-70",
      ].join(" ")}
    >
      <Text className={`text-base font-semibold tracking-wide ${LABEL[variant]}`}>
        {label}
      </Text>
    </Pressable>
  );
}
