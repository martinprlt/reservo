import { Router } from 'express';
import uploadController from '../controllers/uploadController.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import verifyJWT from '../middleware/auth.js';

const router = Router();

// Verify JWT tenantId matches resolved tenant
router.use(verifyJWT);
router.use((req, res, next) => {
  if (req.tenantId && req.user?.tenantId && req.user.tenantId !== req.tenantId) {
    return res.status(403).json({ error: 'No autorizado para este negocio' });
  }
  next();
});

router.post('/', uploadLimiter, cloudinaryService.uploadMiddleware, uploadController.uploadImage);
router.delete('/', uploadLimiter, uploadController.deleteImage);

export default router;
