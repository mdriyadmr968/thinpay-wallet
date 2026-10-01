import { Request, Response } from 'express';
import { requestFaucetDrip, getFaucetStatus } from '../services/faucetService';

export async function dripTokens(req: Request, res: Response) {
  try {
    const { network, address } = req.body;

    if (!network || !address) {
      return res.status(400).json({
        success: false,
        message: 'Network and recipient address are required.',
      });
    }

    const result = await requestFaucetDrip(network, address);
    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error: any) {
    return res.status(429).json({
      status: 'error',
      message: error?.message || 'Faucet request failed.',
    });
  }
}

export function checkStatus(req: Request, res: Response) {
  try {
    const { network, address } = req.params;
    if (!network || !address) {
      return res.status(400).json({ success: false, message: 'Network and address required' });
    }

    const status = getFaucetStatus(network, address);
    return res.status(200).json({
      status: 'success',
      data: status,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Failed checking status.',
    });
  }
}
