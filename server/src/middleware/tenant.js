import prisma from '../config/prisma.js';

export default async function resolveTenant(req, res, next) {
  try {
    let slug = req.hostname.split('.')[0];
    
    if (slug === 'localhost' || slug === '127.0.0.1') {
      slug = req.query.tenant || 'tusnailslr';
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: { id: true, activo: true, config: true },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }

    if (!tenant.activo) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }

    req.tenantId = tenant.id;
    req.tenantConfig = tenant.config;
    next();
  } catch (error) {
    next(error);
  }
}
