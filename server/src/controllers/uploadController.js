import cloudinaryService from '../services/cloudinaryService.js';

export default {
  async uploadImage(req, res) {
    return cloudinaryService.uploadImage(req, res);
  },

  async deleteImage(req, res) {
    return cloudinaryService.deleteImage(req, res);
  },
};
