import * as notificacionesService from '../services/notificacionesService.js';

export default {
  async listar(req, res, next) {
    try {
      const notificaciones = await notificacionesService.listar(req.tenantId, {
        soloNoLeidas: req.query.noLeidas === 'true',
        limit: parseInt(req.query.limit) || 20,
      });
      res.json(notificaciones);
    } catch (error) {
      next(error);
    }
  },

  async contar(req, res, next) {
    try {
      const count = await notificacionesService.contarNoLeidas(req.tenantId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  },

  async marcarLeida(req, res, next) {
    try {
      await notificacionesService.marcarLeida(req.tenantId, req.params.id);
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },

  async marcarTodasLeidas(req, res, next) {
    try {
      await notificacionesService.marcarTodasLeidas(req.tenantId);
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
};
