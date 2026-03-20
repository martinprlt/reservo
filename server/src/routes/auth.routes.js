import { Router } from 'express';
import authController from '../controllers/authController.js';
import verifyJWT from '../middleware/auth.js';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', verifyJWT, authController.logout);
router.get('/me', verifyJWT, authController.me);

export default router;
