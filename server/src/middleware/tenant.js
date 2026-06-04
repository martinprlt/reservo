import prisma from '../config/prisma.js';

/**
 * Resolves tenant from (in order):
 * 1. Query param ?tenant=slug
 * 2. Subdomain (e.g., tusnailslr.slotify.app)
 * 3. Custom header x-tenant-slug
 *
 * For production with subdomains, set up wildcard DNS:
 *   *.slotify.app → CNAME → your-app.onrender.com
 */
export default async function resolveTenant(req, res, next) {
  try {
    // 1. Query param (highest priority)
    let slug = req.query.tenant;

    // 2. Subdomain
    if (!slug) {
      const hostParts = req.hostname.split('.');
      if (hostParts.length > 2) {
        slug = hostParts[0];
      }
    }

    // 3. Custom header
    if (!slug) {
      slug = req.headers['x-tenant-slug'];
    }

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
