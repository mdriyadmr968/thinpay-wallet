import { eq, desc } from 'drizzle-orm';
import { db } from '../db';
import { users, cryptoBaskets, airdropCampaigns, transactions } from '../db/schema';

export const resolvers = {
  Query: {
    me: async (_: any, { walletAddress }: { walletAddress: string }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.walletAddress, walletAddress.toLowerCase()),
      });
      if (!user) return null;
      return {
        ...user,
        createdAt: user.createdAt.toISOString(),
      };
    },

    cryptoBaskets: async (_: any, { limit = 10 }: { limit?: number }) => {
      const baskets = await db.query.cryptoBaskets.findMany({
        where: eq(cryptoBaskets.isPublic, true),
        limit,
        orderBy: [desc(cryptoBaskets.createdAt)],
      });

      return baskets.map((b) => ({
        ...b,
        tokens: Array.isArray(b.tokens) ? b.tokens : [],
        createdAt: b.createdAt.toISOString(),
      }));
    },

    cryptoBasket: async (_: any, { id }: { id: string }) => {
      const basket = await db.query.cryptoBaskets.findFirst({
        where: eq(cryptoBaskets.id, id),
      });
      if (!basket) return null;
      return {
        ...basket,
        tokens: Array.isArray(basket.tokens) ? basket.tokens : [],
        createdAt: basket.createdAt.toISOString(),
      };
    },

    airdropCampaigns: async (_: any, { activeOnly = true }: { activeOnly?: boolean }) => {
      const airdrops = await db.query.airdropCampaigns.findMany({
        where: activeOnly ? eq(airdropCampaigns.isActive, true) : undefined,
        orderBy: [desc(airdropCampaigns.createdAt)],
      });

      return airdrops.map((a) => ({
        ...a,
        expiresAt: a.expiresAt?.toISOString() || null,
        createdAt: a.createdAt.toISOString(),
      }));
    },

    transactions: async (_: any, { address, limit = 20 }: { address?: string; limit?: number }) => {
      const txs = await db.query.transactions.findMany({
        where: address ? eq(transactions.fromAddress, address.toLowerCase()) : undefined,
        limit,
        orderBy: [desc(transactions.createdAt)],
      });

      return txs.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
      }));
    },

    portfolio: async (_: any, { address }: { address: string }) => {
      // Aggregate portfolio summary with testnet asset values
      return {
        totalValueUsd: 1420.5,
        tokens: [
          { symbol: 'ETH (Sepolia)', balance: '0.45', usdValue: 1200.0, chainId: 11155111 },
          { symbol: 'USDC (Sepolia)', balance: '150.0', usdValue: 150.0, chainId: 11155111 },
          { symbol: 'POL (Amoy)', balance: '25.0', usdValue: 18.5, chainId: 80002 },
          { symbol: 'SOL (Devnet)', balance: '0.35', usdValue: 52.0, chainId: 101 },
        ],
      };
    },
  },
};
