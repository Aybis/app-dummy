# Chrono Studio (app-dummy)

A three-mode timer built with Expo SDK 58 + React Native 0.88, TypeScript (strict), and NativeWind v4. Supports:

- **Stopwatch** — count up, pause/resume preserving banked time, record cumulative lap marks
- **Countdown** — presets (10s → 25m), pause/resume from remaining time, SVG progress ring, completion haptic
- **Lap** — closes a lap and immediately opens the next; current/best/worst/average splits, derived session total
- Haptic feedback on every transition (expo-haptics)

## Stack

| Layer | Choice |
| --- | --- |
| Runtime | Expo SDK 58.0.21, React Native 0.88.1, React 19.3 |
| Language | TypeScript 6 (`strict: true`) |
| Styling | NativeWind 4.2.7 on Tailwind CSS 3.4 |
| Graphics | react-native-svg (countdown ring) |
| Feedback | expo-haptics |
| Architecture | New Architecture (Fabric), Hermes |
| Structure | Atomic design: atoms → molecules → organisms → screen |

## Structure

- `src/lib/format.ts` — pure time formatting (`mm:ss.cc`, `h:mm:ss`, duration labels)
- `src/lib/haptics.ts` — fire-and-forget haptic wrappers
- `src/hooks/useTimerEngine.ts` — `useStopwatch` + `useCountdown`
- `src/components/atoms/` — `ActionButton`, `SegmentedControl`, `ProgressRing`, `StatTile`
- `src/components/molecules/` — `LapList`, `PresetChips`
- `src/components/organisms/` — `StopwatchView`, `CountdownView`, `LapView`
- `scripts/verify-format.ts` — assertion harness for the format module

## Timing model

Both engines anchor on `Date.now()` instead of accumulating a counter each tick:

```ts
// Display value is always derived from a timestamp anchor.
elapsed = banked + (Date.now() - startedAt)
```

`setInterval` drifts and React Native throttles timers when the JS thread is busy or the app is backgrounded, so `elapsed += 33` would silently desync from real time. Deriving from an anchor means a tick can be late, but the value is never accumulated-wrong. The countdown counts down to a fixed `deadline`, so it can render late but can never actually run long.

Anchors live in `useRef`, not state, so `start`/`pause`/`lap` never write state from inside a state updater.

## Styling note

NativeWind **4.2.7** on Tailwind **3.4** — v4's preset requires Tailwind 3.x, and NativeWind 5 is still RC. All four wiring files are required: `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `global.css`, plus `nativewind-env.d.ts` for the CSS module declaration. `babel-preset-expo` must be an explicit devDependency — in SDK 58 it is nested under `expo/node_modules` and a custom babel config cannot resolve it.

## Run locally

```bash
npm install
npm run start      # Expo dev server (scan QR with Expo Go, or press i/a)
npm run ios        # iOS simulator
npm run android    # Android emulator/device
```

## Verify

```bash
npm run typecheck   # tsc --noEmit, strict
npm run verify      # 323 assertions against the real format module
```

## Build standalone APK

This app uses the Expo **local build** workflow (no EAS account/cloud required):

```bash
# One-time native project generation
npx expo prebuild --platform android

# Android APK (debug-signed, installable on any device)
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

Requires JDK 17 and the Android SDK:

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$JAVA_HOME/bin:$PATH
```

The release APK is signed with the **debug keystore** (no upload keystore supplied) — installable on any device for side-loading, but Play Store upload needs a real keystore or EAS-managed credentials.

## Version

`app.json` → `expo.version = "1.0.0"`, `android.versionCode = 1`, `ios.buildNumber = "1"`. Android `versionName` is generated into `android/app/build.gradle` as `1.0.0` by prebuild.
