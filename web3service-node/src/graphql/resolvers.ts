import { eq, desc } from 'drizzle-orm';
import { db } from '../db';
import { users, cryptoBaskets, airdropCampaigns, transactions } from '../db/schema';

function enrichBasket(b: any) {
  const tokens = Array.isArray(b.tokens) ? b.tokens : [];
  const nameLower = b.name.toLowerCase();
  const isDeFi = nameLower.includes('defi') || nameLower.includes('bluechip');
  const isAI = nameLower.includes('ai') || nameLower.includes('oracle');
  const isL2 = nameLower.includes('layer') || nameLower.includes('growth') || nameLower.includes('scaling');

  const symbol = isDeFi ? 'TP-DEFI' : isAI ? 'TP-AI' : isL2 ? 'TP-L2G' : 'TP-BASKET';
  const riskLevel = isDeFi ? 'Low' : isAI ? 'High' : 'Medium';
  const targetApy = isDeFi ? '12.40' : isAI ? '28.50' : isL2 ? '19.80' : '16.50';

  return {
    ...b,
    symbol,
    riskLevel,
    targetApy,
    tokens,
    createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : new Date().toISOString(),
  };
}

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

      return baskets.map(enrichBasket);
    },

    cryptoBasket: async (_: any, { id }: { id: string }) => {
      const basket = await db.query.cryptoBaskets.findFirst({
        where: eq(cryptoBaskets.id, id),
      });
      if (!basket) return null;
      return enrichBasket(basket);
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

  Mutation: {
    recordBasketInvestment: async (
      _: any,
      {
        basketId,
        hash,
        chainId,
        fromAddress,
        toAddress,
        amount,
        tokenSymbol,
      }: {
        basketId: string;
        hash: string;
        chainId: number;
        fromAddress: string;
        toAddress: string;
        amount: string;
        tokenSymbol: string;
      }
    ) => {
      const [tx] = await db
        .insert(transactions)
        .values({
          hash,
          chainId,
          fromAddress: fromAddress.toLowerCase(),
          toAddress: toAddress.toLowerCase(),
          amount,
          tokenSymbol: tokenSymbol.toUpperCase(),
          status: 'CONFIRMED',
        })
        .onConflictDoUpdate({
          target: transactions.hash,
          set: { status: 'CONFIRMED' },
        })
        .returning();

      return {
        ...tx,
        createdAt: tx.createdAt.toISOString(),
      };
    },

    createBasket: async (
      _: any,
      {
        name,
        description,
        tokens,
      }: {
        name: string;
        description?: string;
        tokens: { symbol: string; name?: string; address: string; allocation: number }[];
      }
    ) => {
      const [newBasket] = await db
        .insert(cryptoBaskets)
        .values({
          name,
          description: description || 'Custom user testnet index basket',
          tokens,
          isPublic: true,
        })
        .returning();

      return enrichBasket(newBasket);
    },
  },
};
