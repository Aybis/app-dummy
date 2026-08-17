# Tic Tac Toe (app-dummy)

Classic tic-tac-toe, local only — no backend. Built with Expo + React Native + TypeScript.

## Features

- **vs CPU**: unbeatable minimax AI (with alpha-beta pruning) — best you can do is draw
- **2 Player**: pass-and-play on the same device
- Score tracking (X wins / O wins / draws), persisted to `AsyncStorage`
- Winning line highlight

## Structure

- `src/logic/gameLogic.ts` — pure game rules + minimax AI (unit-tested, no React)
- `src/logic/gameLogic.test.ts` — standalone assertions (`npx tsx src/logic/gameLogic.test.ts`)
- `src/storage/scoreStorage.ts` — AsyncStorage score persistence
- `src/hooks/useGame.ts` — game state, turn management, AI move scheduling
- `src/components/atoms/Cell.tsx` — single board cell
- `src/components/molecules/` — `ScoreBoard`, `ModeToggle`
- `src/components/organisms/GameBoard.tsx` — 3x3 grid

## Run locally

```bash
npm install
npm run start
npm run ios
npm run android
```

## Build standalone APK / IPA

```bash
npx expo prebuild
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

iOS IPA requires an Apple Developer signing certificate (see repo root README).
