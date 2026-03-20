import * as exportService from '../services/exportService.js';

export default {
  async clientesCSV(req, res, next) {
    try {
      const csv = await exportService.exportarClientesCSV(req.tenantId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=clientes.csv');
      res.send(csv);
    } catch (error) {
      next(error);
    }
  },

  async turnosCSV(req, res, next) {
    try {
      const { desde, hasta } = req.query;
      const csv = await exportService.exportarTurnosCSV(req.tenantId, desde, hasta);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=turnos.csv');
      res.send(csv);
    } catch (error) {
      next(error);
    }
  },
};
