import { Router } from 'express';
import { getQuote } from '../controllers/swapController';

const router = Router();

router.post('/quote', getQuote);

export default router;
