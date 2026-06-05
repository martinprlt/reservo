import { Router } from 'express';
import authController from '../controllers/authController.js';
import verifyJWT from '../middleware/auth.js';
import { loginLimiter, strictLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', strictLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', verifyJWT, authController.logout);
router.get('/me', verifyJWT, authController.me);
router.post('/verificar-email', verifyJWT, authController.verificarEmail);

export default router;
