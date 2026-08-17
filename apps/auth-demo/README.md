# Auth Demo (app-dummy)

A login/register flow with **no backend and no database server** — accounts
are created and validated entirely on-device. Built with Expo + React Native + TypeScript.

## How "no DB" auth works here

- Registering creates an account record (`id`, `email`, `name`, salted password hash)
  stored as JSON in `AsyncStorage` — this is the entire "user table."
- Passwords are **never stored in plaintext**: each account gets a random 16-byte salt
  (`expo-crypto`) and a `SHA-256(salt:password)` hash. Login re-hashes the entered
  password with the stored salt and compares hashes.
- The "logged in" session (just the current user's email) is kept in
  `expo-secure-store`, since that's more sensitive than general app data.
- Everything is fully offline. This is a **demo of the auth UX/flow**, not a
  production authentication system — a real app should use a proper backend
  with argon2/bcrypt, rate limiting, and session tokens.

## Structure

- `src/types.ts` — `Account` (private) vs `PublicUser` (safe to display) shapes
- `src/security/passwordHash.ts` — salted SHA-256 hashing
- `src/security/validation.ts` — email/password format checks
- `src/storage/accountStorage.ts` — the local "user table" (AsyncStorage)
- `src/storage/sessionStorage.ts` — current session (SecureStore)
- `src/hooks/useAuth.ts` — register/login/logout state machine
- `src/components/organisms/` — `LoginForm`, `RegisterForm`, `HomeScreen`

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
