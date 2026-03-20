import turnosService from '../../services/turnosService.js';

export default {
  async crear(req, res, next) {
    try {
      const result = await turnosService.crear(req.tenantId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async obtenerEstado(req, res, next) {
    try {
      const turno = await turnosService.obtenerEstado(req.params.id);
      res.json(turno);
    } catch (error) {
      next(error);
    }
  },
};
