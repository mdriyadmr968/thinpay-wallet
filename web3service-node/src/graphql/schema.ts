export const typeDefs = /* GraphQL */ `
  type UserProfile {
    id: ID!
    walletAddress: String!
    email: String
    role: String!
    createdAt: String!
  }

  type BasketToken {
    symbol: String!
    name: String
    address: String!
    allocation: Int!
  }

  type CryptoBasket {
    id: ID!
    name: String!
    symbol: String
    description: String
    riskLevel: String
    targetApy: String
    tokens: [BasketToken!]!
    isPublic: Boolean!
    createdAt: String!
  }

  type AirdropCampaign {
    id: ID!
    title: String!
    tokenSymbol: String!
    rewardAmount: String!
    criteria: String
    faucetUrl: String
    isActive: Boolean!
    expiresAt: String
    createdAt: String!
  }

  type TransactionItem {
    id: ID!
    hash: String!
    chainId: Int!
    fromAddress: String!
    toAddress: String!
    amount: String!
    tokenSymbol: String!
    status: String!
    createdAt: String!
  }

  type TokenBalance {
    symbol: String!
    balance: String!
    usdValue: Float
    chainId: Int!
  }

  type PortfolioSummary {
    totalValueUsd: Float!
    tokens: [TokenBalance!]!
  }

  input BasketTokenInput {
    symbol: String!
    name: String
    address: String!
    allocation: Int!
  }

  type Query {
    me(walletAddress: String!): UserProfile
    cryptoBaskets(limit: Int): [CryptoBasket!]!
    cryptoBasket(id: ID!): CryptoBasket
    airdropCampaigns(activeOnly: Boolean): [AirdropCampaign!]!
    transactions(address: String, limit: Int): [TransactionItem!]!
    portfolio(address: String!): PortfolioSummary!
  }

  type Mutation {
    recordBasketInvestment(
      basketId: ID!
      hash: String!
      chainId: Int!
      fromAddress: String!
      toAddress: String!
      amount: String!
      tokenSymbol: String!
    ): TransactionItem!
    createBasket(
      name: String!
      description: String
      tokens: [BasketTokenInput!]!
    ): CryptoBasket!
  }
`;
