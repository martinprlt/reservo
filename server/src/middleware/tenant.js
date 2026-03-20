import prisma from '../config/prisma.js';

export default async function resolveTenant(req, res, next) {
  try {
    const slug = req.hostname.split('.')[0];
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: { id: true, activo: true, config: true },
    });

    if (!tenant?.activo) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }

    req.tenantId = tenant.id;
    req.tenantConfig = tenant.config;
    next();
  } catch (error) {
    next(error);
  }
}
