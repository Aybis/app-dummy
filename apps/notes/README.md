# Notes (app-dummy)

A simple notes app with local-only persistence (no backend, no database server — just
`AsyncStorage` on-device). Built with Expo + React Native + TypeScript.

## Features

- Create, edit, delete notes
- Auto-save on close (blank notes are discarded)
- Search by title/body
- Randomly colored note cards, 2-column grid
- Fully offline, no account or network required

## Structure

- `src/types.ts` — `Note` shape
- `src/storage/notesStorage.ts` — AsyncStorage read/write (JSON blob)
- `src/hooks/useNotes.ts` — CRUD + search state
- `src/components/atoms/` — `Fab`, `IconButton`
- `src/components/molecules/` — `SearchBar`, `NoteCard`
- `src/components/organisms/` — `NoteList`, `NoteEditor`

## Run locally

```bash
npm install
npm run start
npm run ios
npm run android
```

## Build standalone APK / IPA

Same local build flow as the other apps in this repo:

```bash
npx expo prebuild
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

iOS IPA requires an Apple Developer signing certificate (see repo root README).
