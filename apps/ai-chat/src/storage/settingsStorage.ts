import * as SecureStore from 'expo-secure-store';
import { ApiSettings } from '../types';

/**
 * API credentials are secrets — they live in SecureStore (Keychain/Keystore
 * backed), never AsyncStorage, and are never bundled or committed anywhere.
 * The user must type their own key in the in-app Settings screen.
 */
const BASE_URL_KEY = 'app-dummy-ai-chat-base-url';
const API_KEY_KEY = 'app-dummy-ai-chat-api-key';
const MODEL_KEY = 'app-dummy-ai-chat-model';

export const DEFAULT_SETTINGS: ApiSettings = {
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
};

export async function loadSettings(): Promise<ApiSettings> {
  const [baseUrl, apiKey, model] = await Promise.all([
    SecureStore.getItemAsync(BASE_URL_KEY),
    SecureStore.getItemAsync(API_KEY_KEY),
    SecureStore.getItemAsync(MODEL_KEY),
  ]);

  return {
    baseUrl: baseUrl || DEFAULT_SETTINGS.baseUrl,
    apiKey: apiKey || DEFAULT_SETTINGS.apiKey,
    model: model || DEFAULT_SETTINGS.model,
  };
}

export async function saveSettings(settings: ApiSettings): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(BASE_URL_KEY, settings.baseUrl),
    SecureStore.setItemAsync(API_KEY_KEY, settings.apiKey),
    SecureStore.setItemAsync(MODEL_KEY, settings.model),
  ]);
}
