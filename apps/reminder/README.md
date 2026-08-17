# Reminder (app-dummy)

A reminder/to-do app with local scheduled notifications — no backend, no database
server. Built with Expo + React Native + TypeScript.

## Features

- Create reminders with a title, optional notes, and a due date/time
- Schedules a real local push notification for the due time (`expo-notifications`)
- Mark done/undone, delete
- Persists to on-device `AsyncStorage` only

## Structure

- `src/types.ts` — `Reminder` shape
- `src/notifications.ts` — permission + schedule/cancel local notifications
- `src/storage/reminderStorage.ts` — AsyncStorage read/write
- `src/hooks/useReminders.ts` — CRUD + notification lifecycle
- `src/components/atoms/` — `Fab`, `Checkbox`
- `src/components/molecules/` — `ReminderCard`
- `src/components/organisms/` — `ReminderList`, `ReminderEditor` (with native date/time picker)

## Run locally

```bash
npm install
npm run start
npm run ios
npm run android
```

Notifications require a real device or simulator with notification permissions
granted — the Editor prompts for permission the first time you save a reminder.

## Build standalone APK / IPA

```bash
npx expo prebuild
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

iOS IPA requires an Apple Developer signing certificate (see repo root README).
