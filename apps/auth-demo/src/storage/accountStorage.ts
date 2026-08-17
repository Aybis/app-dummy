import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account } from '../types';

/**
 * Local-only "user table" — no backend, no real database server.
 * Every account (with its salted hash, never a plaintext password) lives
 * in a single JSON blob in AsyncStorage, keyed by lowercase email.
 */
const STORAGE_KEY = '@app-dummy/auth-demo/accounts/v1';

async function loadAllAccounts(): Promise<Account[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Account[]) : [];
  } catch {
    return [];
  }
}

async function saveAllAccounts(accounts: Account[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export async function findAccountByEmail(email: string): Promise<Account | null> {
  const accounts = await loadAllAccounts();
  const normalized = email.trim().toLowerCase();
  return accounts.find((a) => a.email === normalized) ?? null;
}

export async function createAccount(account: Account): Promise<void> {
  const accounts = await loadAllAccounts();
  accounts.push(account);
  await saveAllAccounts(accounts);
}
