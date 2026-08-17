import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '../types';

/** Local-only persistence (no backend/database) — a single JSON blob in AsyncStorage. */
const STORAGE_KEY = '@app-dummy/reminders/v1';

export async function loadReminders(): Promise<Reminder[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Reminder[]) : [];
  } catch {
    return [];
  }
}

export async function saveReminders(reminders: Reminder[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}
