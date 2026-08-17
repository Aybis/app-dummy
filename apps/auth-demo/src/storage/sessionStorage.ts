import * as SecureStore from 'expo-secure-store';

/** Tracks which account email is "logged in" right now — kept in SecureStore since
 * it's more sensitive than app data, even though it's just an email string. */
const SESSION_KEY = 'app-dummy-auth-demo-session-email';

export async function getSessionEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(SESSION_KEY);
}

export async function setSessionEmail(email: string): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, email);
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
