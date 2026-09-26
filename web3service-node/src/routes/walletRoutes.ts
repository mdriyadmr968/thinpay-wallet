import { Router } from 'express';
import { createWallet, getBalance } from '../controllers/walletController';

const router = Router();

router.post('/create', createWallet);
router.get('/:chain/:address/balance', getBalance);

export default router;
