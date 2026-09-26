import { Router } from 'express';
import { submitTransaction, getStatus } from '../controllers/transactionController';

const router = Router();

router.post('/submit', submitTransaction);
router.get('/:chain/:hash', getStatus);

export default router;
