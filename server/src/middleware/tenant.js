import prisma from '../config/prisma.js';

export default async function resolveTenant(req, res, next) {
  try {
    // Always prioritize query param for tenant (works on any domain)
    let slug = req.query.tenant;

    // Fallback to subdomain if no query param
    if (!slug) {
      slug = req.hostname.split('.')[0];
    }

    // Skip if no slug
    if (!slug) {
      return res.status(400).json({ error: 'Falta el parámetro tenant' });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: { id: true, activo: true, config: true },
    });

    if (!tenant || !tenant.activo) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }

    req.tenantId = tenant.id;
    req.tenantConfig = tenant.config;
    next();
  } catch (error) {
    next(error);
  }
}
