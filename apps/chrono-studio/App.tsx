import "./global.css";

import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SegmentedControl } from "./src/components/atoms/SegmentedControl";
import { StopwatchView } from "./src/components/organisms/StopwatchView";
import { CountdownView } from "./src/components/organisms/CountdownView";
import { LapView } from "./src/components/organisms/LapView";

type Mode = "stopwatch" | "countdown" | "lap";

const MODES: { key: Mode; label: string }[] = [
  { key: "stopwatch", label: "Stopwatch" },
  { key: "countdown", label: "Countdown" },
  { key: "lap", label: "Lap" },
];

export default function App() {
  const [mode, setMode] = useState<Mode>("stopwatch");

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-ink-950" edges={["top", "left", "right"]}>
        <StatusBar style="light" />
        <View className="flex-1 px-5">
          <View className="pb-4 pt-2">
            <Text className="text-[11px] font-semibold uppercase tracking-[5px] text-acid-500">
              Chrono
            </Text>
            <Text className="mt-1 text-3xl font-bold tracking-tight text-white">
              Chrono Studio
            </Text>
          </View>

          <View className="mb-4">
            <SegmentedControl
              items={MODES}
              activeKey={mode}
              onChange={(key) => setMode(key as Mode)}
            />
          </View>

          {mode === "stopwatch" && <StopwatchView />}
          {mode === "countdown" && <CountdownView />}
          {mode === "lap" && <LapView />}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
