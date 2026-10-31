#!/bin/bash
set -u
cd "$HOME/Sandbox/app-dummy" || exit 1

export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$PATH"
export CI=1

LOG="$HOME/Sandbox/app-dummy/build-all.log"
: > "$LOG"

echo "== ENV ==" | tee -a "$LOG"
echo "node $(node -v)" | tee -a "$LOG"
echo "java: $(java -version 2>&1 | head -1)" | tee -a "$LOG"
echo "sdk: $ANDROID_HOME" | tee -a "$LOG"

echo "== npm install (workspaces) ==" | tee -a "$LOG"
if ! npm install >>"$LOG" 2>&1; then
  echo "NPM INSTALL FAILED" | tee -a "$LOG"
  exit 1
fi
echo "npm install OK" | tee -a "$LOG"

APPS=(calculator notes reminder tic-tac-toe auth-demo ai-chat chrono-studio)

for app in "${APPS[@]}"; do
  echo "===== BUILDING $app =====" | tee -a "$LOG"
  cd "$HOME/Sandbox/app-dummy/apps/$app" || { echo "CD FAILED: $app" | tee -a "$LOG"; continue; }

  echo "-- expo prebuild $app --" | tee -a "$LOG"
  if ! npx expo prebuild --platform android --no-install >>"$LOG" 2>&1; then
    echo "PREBUILD FAILED: $app" | tee -a "$LOG"
    continue
  fi

  cd android || { echo "NO ANDROID DIR: $app" | tee -a "$LOG"; continue; }

  echo "-- gradlew assembleRelease $app --" | tee -a "$LOG"
  if ! ./gradlew assembleRelease >>"$LOG" 2>&1; then
    echo "GRADLE FAILED: $app" | tee -a "$LOG"
    continue
  fi

  APK="$HOME/Sandbox/app-dummy/apps/$app/android/app/build/outputs/apk/release/app-release.apk"
  if [ -f "$APK" ]; then
    echo "APK OK: $app" | tee -a "$LOG"
    ls -lh "$APK" | tee -a "$LOG"
  else
    echo "APK MISSING: $app" | tee -a "$LOG"
  fi
done

echo "===== ALL DONE =====" | tee -a "$LOG"
