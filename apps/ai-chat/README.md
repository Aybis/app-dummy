# AI Chat (app-dummy)

A ChatGPT/Claude-style chat app — **you bring your own API key**, nothing is
hardcoded or committed. Built with Expo + React Native + TypeScript.

## How it works

- Settings screen lets you enter any **OpenAI-compatible** endpoint:
  - `baseUrl` (default `https://api.openai.com/v1`)
  - `apiKey`
  - `model` (default `gpt-4o-mini`)
- This means it works with OpenAI directly, or any compatible gateway/proxy
  (e.g. a self-hosted router, shiteru.id, OpenRouter, etc.) — just point the
  base URL and key at it.
- The API key is stored in `expo-secure-store` (iOS Keychain / Android
  Keystore) — **never** in AsyncStorage, never bundled into the app, never
  committed to this repo.
- Multiple conversations, each with full history, persisted locally
  (`AsyncStorage` — chat text isn't secret material, unlike the key).
- No backend of ours in the loop — the app calls your configured endpoint
  directly from the device.

## Structure

- `src/types.ts` — `ChatMessage`, `Conversation`, `ApiSettings`
- `src/api/chatClient.ts` — OpenAI-compatible `/chat/completions` client
- `src/storage/settingsStorage.ts` — SecureStore for the API key/URL/model
- `src/storage/conversationStorage.ts` — AsyncStorage for chat history
- `src/hooks/useSettings.ts`, `src/hooks/useConversations.ts`
- `src/components/organisms/` — `ChatScreen`, `SettingsModal`, `ConversationDrawer`
- `src/components/molecules/` — `MessageBubble`, `ChatInput`

## Run locally

```bash
npm install
npm run start
npm run ios
npm run android
```

On first launch, tap the ⚙ icon and enter your own API key before chatting.

## Build standalone APK / IPA

```bash
npx expo prebuild
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

iOS IPA requires an Apple Developer signing certificate (see repo root README).
