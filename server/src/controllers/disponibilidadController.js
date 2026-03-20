import { calcularSlotsLibres } from '../services/disponibilidadService.js';

export default {
  async obtenerSlots(req, res, next) {
    try {
      const { servicioId, fecha } = req.query;
      const slots = await calcularSlotsLibres(
        req.tenantId,
        servicioId,
        fecha
      );
      res.json(slots);
    } catch (error) {
      next(error);
    }
  },
};
