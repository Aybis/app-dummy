import { useCallback, useEffect, useState } from 'react';
import { createAccount, findAccountByEmail } from '../storage/accountStorage';
import { clearSession, getSessionEmail, setSessionEmail } from '../storage/sessionStorage';
import { generateSalt, hashPassword, verifyPassword } from '../security/passwordHash';
import { isValidEmail, passwordError } from '../security/validation';
import { Account, PublicUser, toPublicUser } from '../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type AuthResult = { ok: true } | { ok: false; error: string };

export function useAuth() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const email = await getSessionEmail();
      if (email) {
        const account = await findAccountByEmail(email);
        if (account) setUser(toPublicUser(account));
      }
      setIsLoaded(true);
    })();
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) return { ok: false, error: 'Please enter your name' };
    if (!isValidEmail(normalizedEmail)) return { ok: false, error: 'Please enter a valid email' };
    const pwError = passwordError(password);
    if (pwError) return { ok: false, error: pwError };

    const existing = await findAccountByEmail(normalizedEmail);
    if (existing) return { ok: false, error: 'An account with this email already exists' };

    const salt = await generateSalt();
    const passwordHash = await hashPassword(password, salt);
    const account: Account = {
      id: generateId(),
      email: normalizedEmail,
      name: trimmedName,
      passwordHash,
      passwordSalt: salt,
      createdAt: Date.now(),
    };

    await createAccount(account);
    await setSessionEmail(normalizedEmail);
    setUser(toPublicUser(account));
    return { ok: true };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) return { ok: false, error: 'Please enter your email and password' };

    const account = await findAccountByEmail(normalizedEmail);
    if (!account) return { ok: false, error: 'No account found with this email' };

    const isValid = await verifyPassword(password, account.passwordSalt, account.passwordHash);
    if (!isValid) return { ok: false, error: 'Incorrect password' };

    await setSessionEmail(normalizedEmail);
    setUser(toPublicUser(account));
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  return { user, isLoaded, register, login, logout };
}
