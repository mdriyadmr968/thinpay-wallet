import { Request, Response, NextFunction } from 'express';
import { verifyMessage } from 'viem';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { z } from 'zod';
import { db } from '../db';
import { users, wallets } from '../db/schema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'thinpay_wallet_jwt_secret_dev_key_change_in_production_32chars';

export async function getNonce(req: Request, res: Response, next: NextFunction) {
  try {
    const address = req.query.address as string;
    if (!address || !address.startsWith('0x')) {
      return res.status(400).json({ status: 'error', message: 'Valid EVM wallet address is required.' });
    }

    const normalizedAddress = address.toLowerCase();
    const newNonce = `thinpay_nonce_${crypto.randomBytes(16).toString('hex')}`;

    // Find or create user
    const existing = await db.query.users.findFirst({
      where: eq(users.walletAddress, normalizedAddress),
    });

    if (existing) {
      await db.update(users).set({ nonce: newNonce }).where(eq(users.id, existing.id));
    } else {
      await db.insert(users).values({
        walletAddress: normalizedAddress,
        nonce: newNonce,
      });
    }

    return res.json({
      status: 'success',
      address: normalizedAddress,
      nonce: newNonce,
      message: `Sign this message to authenticate with ThinPay Wallet:\n\nNonce: ${newNonce}`,
    });
  } catch (error) {
    next(error);
  }
}

const verifySiweSchema = z.object({
  address: z.string().min(10),
  message: z.string().min(5),
  signature: z.string().min(10),
});

export async function verifySiwe(req: Request, res: Response, next: NextFunction) {
  try {
    const { address, message, signature } = verifySiweSchema.parse(req.body);
    const normalizedAddress = address.toLowerCase() as `0x${string}`;

    const user = await db.query.users.findFirst({
      where: eq(users.walletAddress, normalizedAddress),
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found. Request nonce first.' });
    }

    // Verify cryptographic signature with viem
    const isValid = await verifyMessage({
      address: normalizedAddress,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return res.status(401).json({ status: 'error', message: 'Invalid cryptographic signature.' });
    }

    // Rotate nonce for security
    const rotatedNonce = `thinpay_nonce_${crypto.randomBytes(16).toString('hex')}`;
    await db.update(users).set({ nonce: rotatedNonce, updatedAt: new Date() }).where(eq(users.id, user.id));

    // Issue JWT
    const token = jwt.sign(
      {
        userId: user.id,
        walletAddress: user.walletAddress,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      status: 'success',
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function demoLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const demoAddress = '0x71c8360f3a8b4119d691e84c0f0811ef78b40b64';
    let user = await db.query.users.findFirst({
      where: eq(users.walletAddress, demoAddress),
    });

    if (!user) {
      const [created] = await db
        .insert(users)
        .values({
          walletAddress: demoAddress,
          email: 'demo@thinpay.wallet',
          nonce: `thinpay_nonce_${crypto.randomBytes(16).toString('hex')}`,
        })
        .returning();
      user = created;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        walletAddress: user.walletAddress,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      status: 'success',
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user.userId),
      with: {
        wallets: true,
      },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    return res.json({
      status: 'success',
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        email: user.email,
        role: user.role,
        wallets: user.wallets,
      },
    });
  } catch (error) {
    next(error);
  }
}
