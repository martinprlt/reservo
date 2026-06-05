import { login, obtenerAdmin, register, verificarEmail, cambiarPassword } from '../services/authService.js';
import { registerSchema } from '../schemas/turno.schema.js';

export default {
  async login(req, res, next) {
    try {
      const tenantId = req.body.tenantId || req.query.tenant;
      const result = await login(req.body.email, req.body.password, tenantId);
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
        path: '/',
      });
      res.json({ admin: result.admin });
    } catch (error) {
      next(error);
    }
  },

  async register(req, res, next) {
    try {
      const parsed = registerSchema.parse(req.body);
      const result = await register(parsed);
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
        path: '/',
      });
      res.status(201).json({ admin: result.admin, slug: result.slug });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.json({ ok: true });
  },

  async me(req, res, next) {
    try {
      const admin = await obtenerAdmin(req.adminId);
      res.json(admin);
    } catch (error) {
      next(error);
    }
  },

  async verificarEmail(req, res, next) {
    try {
      const admin = await verificarEmail(req.adminId);
      res.json(admin);
    } catch (error) {
      next(error);
    }
  },

  async cambiarPassword(req, res, next) {
    try {
      const { passwordActual, passwordNueva } = req.body;
      if (!passwordActual || !passwordNueva) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
      if (passwordNueva.length < 6) {
        return res.status(400).json({ error: 'Contraseña mínima 6 caracteres' });
      }
      await cambiarPassword(req.adminId, passwordActual, passwordNueva);
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
};
