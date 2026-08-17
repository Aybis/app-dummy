import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';

/**
 * Local-only persistence for notes (no backend/database).
 * Everything lives in the device's AsyncStorage as a single JSON blob,
 * which is plenty for a dummy/demo notes app's expected data volume.
 */
const STORAGE_KEY = '@app-dummy/notes/v1';

export async function loadNotes(): Promise<Note[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Note[];
  } catch {
    return [];
  }
}

export async function saveNotes(notes: Note[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}
