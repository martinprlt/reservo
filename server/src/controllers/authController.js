import authService from '../../services/authService.js';

export default {
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body.email, req.body.password, req.body.tenantId);
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000,
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
      const admin = await authService.obtenerAdmin(req.adminId);
      res.json(admin);
    } catch (error) {
      next(error);
    }
  },
};
