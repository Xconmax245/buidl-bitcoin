
import Dexie, { type EntityTable } from 'dexie';

interface Wallet {
  id?: number;
  name: string;
  encryptedMnemonic: string; // Base64
  salt: string; // Base64
  iv: string; // Base64
  createdAt: number;
  lastUsed: number;
}

interface Transaction {
  txid: string;
  status: 'pending' | 'confirmed' | 'failed';
  amount: number; // Satoshis
  type: 'deposit' | 'withdrawal' | 'staking';
  timestamp: number;
}

interface Setting {
  key: string;
  value: any;
}

interface User {
  id?: number;
  username: string;
  email?: string;
  passwordHash?: string;
  provider: 'credentials' | 'google' | 'wallet';
  externalId?: string; // Google ID or Wallet Address
  createdAt: number;
  lastLogin: number;
}

const db = new Dexie('AntiGravityWalletDB') as Dexie & {
  wallets: EntityTable<Wallet, 'id'>;
  transactions: EntityTable<Transaction, 'txid'>;
  settings: EntityTable<Setting, 'key'>;
  users: EntityTable<User, 'id'>;
};

// Version 2: Index lastUsed and add users table
db.version(2).stores({
  wallets: '++id, name, createdAt, lastUsed',
  transactions: 'txid, status, timestamp',
  settings: 'key',
  notifications: '++id, read, date',
  users: '++id, username, email, provider, externalId, createdAt'
});

export type { Wallet, Transaction, Setting, User };
export { db };
