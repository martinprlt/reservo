import { Router } from 'express';
import uploadController from '../controllers/uploadController.js';
import cloudinaryService from '../services/cloudinaryService.js';

const router = Router();

router.post('/', cloudinaryService.uploadMiddleware, uploadController.uploadImage);
router.delete('/', uploadController.deleteImage);

export default router;
