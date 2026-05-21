import * as reportesService from '../services/reportesService.js';

export default {
  async reporteTurnos(req, res, next) {
    try {
      const { desde, hasta, estado } = req.query;
      const reporte = await reportesService.obtenerReporteTurnos(req.tenantId, { desde, hasta, estado });
      res.json(reporte);
    } catch (error) {
      next(error);
    }
  },

  async reporteGanancias(req, res, next) {
    try {
      const { desde, hasta } = req.query;
      const reporte = await reportesService.obtenerReporteGanancias(req.tenantId, { desde, hasta });
      res.json(reporte);
    } catch (error) {
      next(error);
    }
  },

  async reporteTrabajos(req, res, next) {
    try {
      const { desde, hasta } = req.query;
      const reporte = await reportesService.obtenerReporteTrabajos(req.tenantId, { desde, hasta });
      res.json(reporte);
    } catch (error) {
      next(error);
    }
  },
};
