import { Router } from 'express';
import { getNonce, verifySiwe, demoLogin, getProfile } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/nonce', getNonce);
router.post('/verify-siwe', verifySiwe);
router.post('/demo-login', demoLogin);
router.get('/me', requireAuth, getProfile);

export default router;
