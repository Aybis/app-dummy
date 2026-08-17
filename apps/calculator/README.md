# Calculator (app-dummy)

A scientific calculator built with Expo + React Native. Supports:

- Basic arithmetic: `+ − × ÷`, parentheses, percent
- Scientific functions: `sin cos tan asin acos atan ln log sqrt exp abs`
- Power (`x^y`), factorial (`x!`), constants `π` and `e`
- Degrees/Radians toggle
- Memory: `MC MR M+ M-`
- Live preview of the result as you type
- Real recursive-descent expression parser (no `eval`), so operator precedence and function calls are handled correctly.

## Structure

- `src/logic/evaluator.ts` — tokenizer + parser + evaluator (pure functions, unit-testable)
- `src/logic/format.ts` — number formatting for display
- `src/hooks/useCalculator.ts` — all calculator state/behavior
- `src/components/atoms/CalcButton.tsx` — single key
- `src/components/molecules/DisplayPanel.tsx` — expression + preview display
- `src/components/organisms/Keypad.tsx` — full button grid, basic + scientific

## Run locally

```bash
npm install
npm run start      # Expo dev server (scan QR with Expo Go, or press i/a)
npm run ios        # iOS simulator
npm run android     # Android emulator/device
```

## Build standalone APK / IPA

This app uses the Expo **local build** workflow (no EAS account/cloud required):

```bash
# One-time native project generation
npx expo prebuild

# Android APK (debug-signed, installable on any device)
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk

# iOS (requires Xcode + an Apple Developer signing certificate for a real device;
# without one, this produces a simulator build only)
cd ../ios && xcodebuild -workspace Calculator.xcworkspace -scheme Calculator \
  -configuration Release -sdk iphonesimulator -derivedDataPath build
```

For distributable (App Store / ad-hoc) IPAs, use `eas build -p ios` with a paid Apple Developer account, or provide a signing certificate for local `xcodebuild archive` + `exportArchive`.
