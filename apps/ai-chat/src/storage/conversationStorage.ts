import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation } from '../types';

/** Chat history is not sensitive credential material, so plain AsyncStorage is fine here. */
const STORAGE_KEY = '@app-dummy/ai-chat/conversations/v1';

export async function loadConversations(): Promise<Conversation[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Conversation[]) : [];
  } catch {
    return [];
  }
}

export async function saveConversations(conversations: Conversation[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}
