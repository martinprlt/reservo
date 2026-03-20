import { listar } from '../services/serviciosService.js';

export default {
  async listar(req, res, next) {
    try {
      const servicios = await listar(req.tenantId);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  },
};
