import adminService from '../services/adminService.js';

export default {
  async listarTurnos(req, res, next) {
    try {
      const { fecha, estado } = req.query;
      const turnos = await adminService.listarTurnos(req.tenantId, { fecha, estado });
      res.json(turnos);
    } catch (error) {
      next(error);
    }
  },

  async actualizarTurno(req, res, next) {
    try {
      const result = await adminService.actualizarTurno(req.tenantId, req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async listarClientes(req, res, next) {
    try {
      const { page, limit, busqueda } = req.query;
      const result = await adminService.listarClientes(req.tenantId, { page, limit, busqueda });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async obtenerCliente(req, res, next) {
    try {
      const cliente = await adminService.obtenerCliente(req.tenantId, req.params.id);
      res.json(cliente);
    } catch (error) {
      next(error);
    }
  },

  async listarServiciosAdmin(req, res, next) {
    try {
      const servicios = await adminService.listarServicios(req.tenantId);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  },

  async crearServicio(req, res, next) {
    try {
      const servicio = await adminService.crearServicio(req.tenantId, req.body);
      res.status(201).json(servicio);
    } catch (error) {
      next(error);
    }
  },

  async actualizarServicio(req, res, next) {
    try {
      const servicio = await adminService.actualizarServicio(req.tenantId, req.params.id, req.body);
      res.json(servicio);
    } catch (error) {
      next(error);
    }
  },

  async eliminarServicio(req, res, next) {
    try {
      await adminService.eliminarServicio(req.tenantId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async obtenerConfig(req, res, next) {
    try {
      const config = await adminService.obtenerConfig(req.tenantId);
      res.json(config);
    } catch (error) {
      next(error);
    }
  },

  async actualizarConfig(req, res, next) {
    try {
      const config = await adminService.actualizarConfig(req.tenantId, req.body);
      res.json(config);
    } catch (error) {
      next(error);
    }
  },

  async obtenerAgenda(req, res, next) {
    try {
      const { desde, hasta } = req.query;
      const agenda = await adminService.obtenerAgenda(req.tenantId, { desde, hasta });
      res.json(agenda);
    } catch (error) {
      next(error);
    }
  },
};
