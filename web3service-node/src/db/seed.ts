import { db, pool } from './index';
import { users, cryptoBaskets, airdropCampaigns } from './schema';

async function seed() {
  console.log('[Seed] Seeding database with initial testnet data...');

  try {
    // 1. Seed Demo User
    const [demoUser] = await db
      .insert(users)
      .values({
        walletAddress: '0x71C8360f3a8b4119d691e84C0F0811eF78B40b64'.toLowerCase(),
        email: 'demo@thinpay.wallet',
        role: 'user',
        nonce: 'thinpay_initial_nonce_123',
      })
      .onConflictDoNothing()
      .returning();

    const creatorId = demoUser?.id;

    // 2. Seed Pre-Curated Crypto Baskets
    await db.insert(cryptoBaskets).values([
      {
        creatorId,
        name: 'DeFi Testnet Bluechips',
        description: 'Curated index of top testnet DeFi tokens for safe multi-chain experimentation.',
        tokens: [
          { symbol: 'ETH', name: 'Sepolia Ether', address: '0x0000000000000000000000000000000000000000', allocation: 40 },
          { symbol: 'USDC', name: 'Testnet USD Coin', address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', allocation: 30 },
          { symbol: 'LINK', name: 'Chainlink Testnet', address: '0x779877A7B0D9E8603169DdbD7836e478b4624789', allocation: 30 },
        ],
        isPublic: true,
      },
      {
        creatorId,
        name: 'Layer 2 Growth Index',
        description: 'Weighted basket capturing high-throughput testnet ecosystems.',
        tokens: [
          { symbol: 'POL', name: 'Polygon Amoy', address: '0x0000000000000000000000000000000000000000', allocation: 50 },
          { symbol: 'BASE_ETH', name: 'Base Sepolia ETH', address: '0x4200000000000000000000000000000000000006', allocation: 50 },
        ],
        isPublic: true,
      },
      {
        creatorId,
        name: 'AI & Oracle Testnet Basket',
        description: 'Artificial intelligence infrastructure and oracle tokens on testnets.',
        tokens: [
          { symbol: 'LINK', name: 'Chainlink Oracle', address: '0x779877A7B0D9E8603169DdbD7836e478b4624789', allocation: 60 },
          { symbol: 'GRT', name: 'The Graph Testnet', address: '0x5432100000000000000000000000000000000001', allocation: 40 },
        ],
        isPublic: true,
      },
    ]);

    // 3. Seed Airdrop Campaigns
    await db.insert(airdropCampaigns).values([
      {
        title: 'Ethereum Sepolia Faucet Boost',
        tokenSymbol: 'ETH',
        rewardAmount: '0.05 Sepolia ETH',
        criteria: 'Connect your wallet and complete 1 testnet transfer.',
        faucetUrl: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        title: 'Polygon Amoy Ecosystem Onboarding',
        tokenSymbol: 'POL',
        rewardAmount: '5.0 AMOY POL',
        criteria: 'Perform 1 swap quote inquiry.',
        faucetUrl: 'https://faucet.polygon.technology/',
        isActive: true,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
      {
        title: 'Solana Devnet Liquidity Sprint',
        tokenSymbol: 'SOL',
        rewardAmount: '1.0 DEV SOL',
        criteria: 'Generate or connect a Solana Devnet address.',
        faucetUrl: 'https://faucet.solana.com/',
        isActive: true,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'ThinPay Early Adopter Badge',
        tokenSymbol: 'THIN',
        rewardAmount: '100 THIN (Testnet)',
        criteria: 'Run an AI Smart Contract Security Audit on any testnet address.',
        faucetUrl: 'https://thinpay.wallet/faucet',
        isActive: true,
      },
    ]);

    console.log('[Seed] Database seeded successfully.');
  } catch (error) {
    console.error('[Seed] Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
