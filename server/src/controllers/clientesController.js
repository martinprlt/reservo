import clientesService from '../../services/clientesService.js';

export default {
  async identificar(req, res, next) {
    try {
      const { telefono, nombre, apellido } = req.body;
      const cliente = await clientesService.identificarOCrear(
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
};
