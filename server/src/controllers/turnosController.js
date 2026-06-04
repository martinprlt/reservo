import { crear, obtenerEstado } from '../services/turnosService.js';

export default {
  async crear(req, res, next) {
    try {
      const result = await crear(req.tenantId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async obtenerEstado(req, res, next) {
    try {
      const turno = await obtenerEstado(req.params.id, req.tenantId);
      res.json(turno);
    } catch (error) {
      next(error);
    }
  },
};
