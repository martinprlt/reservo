import disponibilidadService from '../../services/disponibilidadService.js';

export default {
  async obtenerSlots(req, res, next) {
    try {
      const { servicioId, fecha } = req.query;
      const fechaDate = new Date(fecha);
      const slots = await disponibilidadService.calcularSlotsLibres(
        req.tenantId,
        servicioId,
        fechaDate
      );
      res.json(slots);
    } catch (error) {
      next(error);
    }
  },
};
