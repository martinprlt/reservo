import { verifyToken } from '../utils/jwt.js';

export default function verifyJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'NO_AUTORIZADO' });

  try {
    const decoded = verifyToken(token);
    req.adminId = decoded.adminId;
    req.tenantId = decoded.tenantId;
    next();
  } catch {
    return res.status(401).json({ error: 'NO_AUTORIZADO' });
  }
}
