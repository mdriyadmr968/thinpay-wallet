import { pgTable, uuid, varchar, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletAddress: varchar('wallet_address', { length: 128 }).notNull().unique(),
  email: varchar('email', { length: 255 }),
  role: varchar('role', { length: 32 }).default('user').notNull(),
  nonce: varchar('nonce', { length: 64 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Wallets Table (Connected or In-App generated non-custodial wallets)
export const wallets = pgTable('wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  network: varchar('network', { length: 64 }).notNull(), // 'sepolia', 'amoy', 'bsc_testnet', 'solana_devnet'
  publicKey: varchar('public_key', { length: 128 }).notNull(),
  encryptedSecret: text('encrypted_secret'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Transactions Table
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  hash: varchar('hash', { length: 128 }).notNull().unique(),
  chainId: integer('chain_id').notNull(),
  fromAddress: varchar('from_address', { length: 128 }).notNull(),
  toAddress: varchar('to_address', { length: 128 }).notNull(),
  amount: varchar('amount', { length: 64 }).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 32 }).notNull(),
  status: varchar('status', { length: 32 }).default('PENDING').notNull(), // PENDING, CONFIRMED, FAILED
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Crypto Baskets Table
export const cryptoBaskets = pgTable('crypto_baskets', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').references(() => users.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 128 }).notNull(),
  description: text('description'),
  tokens: jsonb('tokens').notNull(), // Array of { symbol: string, address: string, allocation: number }
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Airdrop Campaigns Table
export const airdropCampaigns = pgTable('airdrop_campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 128 }).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 32 }).notNull(),
  rewardAmount: varchar('reward_amount', { length: 64 }).notNull(),
  criteria: text('criteria'),
  faucetUrl: text('faucet_url'),
  isActive: boolean('is_active').default(true).notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI Smart Contract Audit Logs Cache
export const aiAuditLogs = pgTable('ai_audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  targetAddress: varchar('target_address', { length: 128 }).notNull(),
  chainId: integer('chain_id').notNull(),
  tokenName: varchar('token_name', { length: 128 }),
  tokenSymbol: varchar('token_symbol', { length: 32 }),
  riskScore: integer('risk_score').notNull(), // 0 to 100
  auditSummary: text('audit_summary').notNull(),
  rawDetails: jsonb('raw_details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),
  transactions: many(transactions),
  baskets: many(cryptoBaskets),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const cryptoBasketsRelations = relations(cryptoBaskets, ({ one }) => ({
  creator: one(users, {
    fields: [cryptoBaskets.creatorId],
    references: [users.id],
  }),
}));
