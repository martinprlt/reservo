import { verifyToken } from '../utils/jwt.js';

export default function verifyJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'NO_AUTORIZADO' });

  try {
    const decoded = verifyToken(token);
    req.adminId = decoded.adminId;
    req.tenantId = decoded.tenantId || null;
    req.role = decoded.role || 'ADMIN';
    next();
  } catch {
    return res.status(401).json({ error: 'NO_AUTORIZADO' });
  }
}

export function requireSuperAdmin(req, res, next) {
  if (req.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'ACCESO_RESTRINGIDO' });
  }
  next();
}
