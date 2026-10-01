import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getSwapQuote } from '../services/swapService';

const swapQuoteSchema = z.object({
  chain: z.string().default('sepolia'),
  fromToken: z.string().min(1),
  toToken: z.string().min(1),
  fromAmount: z.string().min(1),
  slippagePercentage: z.number().min(0.1).max(50).optional().default(1),
  takerAddress: z.string().optional(),
});

export async function getQuote(req: Request, res: Response, next: NextFunction) {
  try {
    // Support both GET (query parameters) and POST (body parameters)
    const rawData = req.method === 'GET' ? req.query : req.body;

    // Normalize field names (support both 0x style and ThinPay style)
    const chain = (rawData.chain || rawData.chainId || 'sepolia').toString();
    const fromToken = (rawData.fromToken || rawData.sellToken || '').toString();
    const toToken = (rawData.toToken || rawData.buyToken || '').toString();
    const fromAmount = (rawData.fromAmount || rawData.sellAmount || '0.005').toString();
    const slippagePercentage = rawData.slippagePercentage 
      ? parseFloat(rawData.slippagePercentage.toString()) 
      : rawData.slippage 
      ? parseFloat(rawData.slippage.toString()) 
      : 1;

    const validated = swapQuoteSchema.parse({
      chain,
      fromToken,
      toToken,
      fromAmount,
      slippagePercentage,
      takerAddress: rawData.takerAddress ? rawData.takerAddress.toString() : undefined,
    });

    const quote = await getSwapQuote(validated);

    return res.json({
      status: 'success',
      data: quote,
    });
  } catch (error) {
    next(error);
  }
}
