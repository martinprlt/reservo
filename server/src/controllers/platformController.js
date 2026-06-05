import * as platformService from '../services/platformService.js';
import * as metricsService from '../services/metricsService.js';

export default {
  async obtenerStats(req, res, next) {
    try {
      const stats = await platformService.obtenerStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  async listarTenants(req, res, next) {
    try {
      const { page, limit, busqueda } = req.query;
      const result = await platformService.listarTenants({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        busqueda,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async obtenerTenant(req, res, next) {
    try {
      const tenant = await platformService.obtenerTenant(req.params.id);
      res.json(tenant);
    } catch (error) {
      next(error);
    }
  },

  async crearTenant(req, res, next) {
    try {
      const tenant = await platformService.crearTenant(req.body);
      res.status(201).json(tenant);
    } catch (error) {
      next(error);
    }
  },

  async actualizarTenant(req, res, next) {
    try {
      const tenant = await platformService.actualizarTenant(req.params.id, req.body);
      res.json(tenant);
    } catch (error) {
      next(error);
    }
  },

  async eliminarTenant(req, res, next) {
    try {
      await platformService.eliminarTenant(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },

  async listarAdmins(req, res, next) {
    try {
      const { page, limit, busqueda } = req.query;
      const result = await platformService.listarAdmins({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        busqueda,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async crearAdmin(req, res, next) {
    try {
      const admin = await platformService.crearAdmin(req.body);
      res.status(201).json(admin);
    } catch (error) {
      next(error);
    }
  },

  async eliminarAdmin(req, res, next) {
    try {
      await platformService.eliminarAdmin(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },

  async resetAdminPassword(req, res, next) {
    try {
      const { password } = req.body;
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Contraseña mínima 6 caracteres' });
      }
      const admin = await platformService.resetAdminPassword(req.params.id, password);
      res.json(admin);
    } catch (error) {
      next(error);
    }
  },

  async toggleTenantActivo(req, res, next) {
    try {
      const tenant = await platformService.toggleTenantActivo(req.params.id);
      res.json(tenant);
    } catch (error) {
      next(error);
    }
  },

  async obtenerMetricas(req, res, next) {
    try {
      const { desde, hasta } = req.query;
      const metrics = await metricsService.obtenerMetricas({ desde, hasta });
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  },

  async registrosPorDia(req, res, next) {
    try {
      const { dias } = req.query;
      const data = await metricsService.registrosPorDia({ dias: parseInt(dias) || 30 });
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
};
