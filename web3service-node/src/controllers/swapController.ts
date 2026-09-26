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
    const validated = swapQuoteSchema.parse(req.body);
    const quote = await getSwapQuote(validated);

    return res.json({
      status: 'success',
      data: quote,
    });
  } catch (error) {
    next(error);
  }
}
