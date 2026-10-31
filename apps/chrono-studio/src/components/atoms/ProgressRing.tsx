import Svg, { Circle } from "react-native-svg";

type Props = {
  /** 0..1, where 1 = ring fully drawn. */
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
};

/** Circular progress track used by the countdown. Pure presentation. */
export function ProgressRing({
  progress,
  size = 280,
  strokeWidth = 10,
  color = "#2fe39a",
  trackColor = "#232936",
}: Props) {
  const clamped = Math.min(1, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        fill="none"
        // Start the arc at 12 o'clock instead of 3 o'clock.
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}
