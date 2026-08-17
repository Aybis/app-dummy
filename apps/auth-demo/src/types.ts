export interface Account {
  id: string;
  email: string; // stored lowercase, used as the unique key
  name: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: number;
}

/** Publicly safe view of an account (never includes password material). */
export interface PublicUser {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

export function toPublicUser(account: Account): PublicUser {
  return { id: account.id, email: account.email, name: account.name, createdAt: account.createdAt };
}
