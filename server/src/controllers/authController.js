import { login, obtenerAdmin } from '../services/authService.js';

export default {
  async login(req, res, next) {
    try {
      const tenantId = req.body.tenantId || req.query.tenant;
      const result = await login(req.body.email, req.body.password, tenantId);
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
        path: '/',
      });
      res.json({ admin: result.admin });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res) {
    res.clearCookie('token');
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
};
