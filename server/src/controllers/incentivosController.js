import * as incentivosService from '../services/incentivosService.js';

export default {
  async listar(req, res, next) {
    try {
      const incentivos = await incentivosService.listar(req.tenantId);
      res.json(incentivos);
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const incentivo = await incentivosService.crear(req.tenantId, req.body);
      res.status(201).json(incentivo);
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const incentivo = await incentivosService.actualizar(req.tenantId, req.params.id, req.body);
      res.json(incentivo);
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await incentivosService.eliminar(req.tenantId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
