import { rpcCache, getOrSetCache } from '../utils/cache';

export interface SwapQuoteParams {
  chain: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  slippagePercentage?: number;
  takerAddress?: string;
}

// Reference testnet exchange rates for pricing simulation
const BASE_TESTNET_RATES: Record<string, number> = {
  ETH: 2650.0,
  POL: 0.42,
  BNB: 580.0,
  SOL: 145.0,
  USDC: 1.0,
  USDT: 1.0,
  LINK: 12.5,
  THIN: 0.15,
};

const KNOWN_ADDRESS_TO_SYMBOL: Record<string, string> = {
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ETH',
  '0x0000000000000000000000000000000000000000': 'ETH',
  '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238': 'USDC',
  '0x0000000000000000000000000000000000001010': 'POL',
  '0x779877a7b0d9e8603169ddbd7836e478b4624789': 'LINK',
};

function resolveSymbol(token: string): string {
  const normalized = token.toLowerCase();
  if (KNOWN_ADDRESS_TO_SYMBOL[normalized]) {
    return KNOWN_ADDRESS_TO_SYMBOL[normalized];
  }
  return token.toUpperCase();
}

export async function getSwapQuote(params: SwapQuoteParams) {
  const { chain, fromToken, toToken, fromAmount, slippagePercentage = 1 } = params;
  const cacheKey = `quote_${chain}_${fromToken}_${toToken}_${fromAmount}_${slippagePercentage}`;

  return getOrSetCache(rpcCache, cacheKey, async () => {
    const amountNum = parseFloat(fromAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error('Invalid fromAmount provided.');
    }

    const resolvedFrom = resolveSymbol(fromToken);
    const resolvedTo = resolveSymbol(toToken);

    const fromRate = BASE_TESTNET_RATES[resolvedFrom] || 1.0;
    const toRate = BASE_TESTNET_RATES[resolvedTo] || 1.0;

    // Exchange rate = fromRate / toRate
    const exchangeRate = fromRate / toRate;
    const grossToAmount = amountNum * exchangeRate;

    // Simulate 0.3% DEX liquidity provider fee
    const feeAmount = grossToAmount * 0.003;
    const netToAmount = (grossToAmount - feeAmount).toFixed(6);

    // Calculate slippage impact
    const priceImpact = (Math.random() * 0.15 + 0.05).toFixed(2); // 0.05% - 0.20%

    // Minimum received considering user slippage tolerance
    const minimumReceived = (parseFloat(netToAmount) * (1 - slippagePercentage / 100)).toFixed(6);

    return {
      chain,
      fromToken: resolvedFrom,
      toToken: resolvedTo,
      fromAmount,
      toAmount: netToAmount,
      minimumReceived,
      exchangeRate: exchangeRate.toFixed(6),
      priceImpactPercentage: `${priceImpact}%`,
      estimatedGasUnits: '145000',
      estimatedGasUsd: '0.12',
      route: [
        {
          pool: 'ThinPay Testnet V3 Pool',
          percentage: '100%',
        },
      ],
      allowanceTarget: '0x111111125421ca6dc452d289314280a0f8842a65', // Standard DEX router placeholder
    };
  });
}
