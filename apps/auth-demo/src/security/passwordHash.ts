import * as Crypto from 'expo-crypto';

/**
 * Salted SHA-256 password hashing. This is a local-only DEMO app with no
 * server and no real threat model beyond "don't store plaintext passwords
 * on disk" — a proper backend would use bcrypt/argon2 with a slow KDF.
 * SHA-256 + per-user random salt is a reasonable, dependency-light choice here.
 */
export async function generateSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

export async function verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
  const actualHash = await hashPassword(password, salt);
  return actualHash === expectedHash;
}
