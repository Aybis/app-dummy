# app-dummy

A monorepo of small standalone demo apps (React Native + Expo), each buildable to its own installable APK (Android) and IPA (iOS).

## Apps

| App | Path | Description |
|---|---|---|
| Calculator | [`apps/calculator`](apps/calculator) | Scientific calculator (basic + trig/log/pow/memory) |
| Notes | [`apps/notes`](apps/notes) | Local-only notes app (AsyncStorage, no backend) |
| Reminder | [`apps/reminder`](apps/reminder) | To-do/reminder app with local scheduled notifications |
| Tic Tac Toe | [`apps/tic-tac-toe`](apps/tic-tac-toe) | Classic game, unbeatable minimax AI or 2-player local |
| Auth Demo | [`apps/auth-demo`](apps/auth-demo) | Login/register with no backend (local salted-hash accounts) |

More apps (AI chatbot) will be added under `apps/`.

## Structure

Each app in `apps/<name>` is an independent Expo project with its own `package.json`, `app.json`, and native `android/`/`ios/` folders once prebuilt. The repo root only provides shared tooling and documentation — no shared runtime code is forced between apps.

## Building

See each app's own README for build instructions.
