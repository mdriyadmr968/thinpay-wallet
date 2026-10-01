import { Router } from 'express';
import { dripTokens, checkStatus } from '../controllers/faucetController';

const router = Router();

router.post('/drip', dripTokens);
router.get('/status/:network/:address', checkStatus);

export default router;
