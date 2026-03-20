import { identificarOCrear, verificarPuntos } from '../services/clientesService.js';

export default {
  async identificar(req, res, next) {
    try {
      const { telefono, nombre, apellido } = req.body;
      const cliente = await identificarOCrear(
        req.tenantId,
        telefono,
        nombre,
        apellido
      );
      res.json(cliente);
    } catch (error) {
      next(error);
    }
  },

  async verificarPuntos(req, res, next) {
    try {
      const { telefono } = req.params;
      const resultado = await verificarPuntos(req.tenantId, telefono);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  },
};
