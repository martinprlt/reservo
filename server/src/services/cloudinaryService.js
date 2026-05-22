import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

export default {
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'reservo',
        resource_type: 'auto',
      });

      res.json({ url: result.secure_url, publicId: result.public_id });
    } catch (error) {
      res.status(500).json({ error: 'Error uploading image' });
    }
  },

  async deleteImage(req, res) {
    try {
      const { publicId } = req.body;
      if (!publicId) return res.status(400).json({ error: 'No publicId provided' });

      await cloudinary.uploader.destroy(publicId);
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting image' });
    }
  },

  cloudinary,
  uploadMiddleware: upload.single('file'),
};
