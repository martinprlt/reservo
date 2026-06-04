import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { signToken } from '../utils/jwt.js';

export async function login(email, password, tenantSlugOrId) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) throw new Error('CREDENCIALES_INVALIDAS');

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw new Error('CREDENCIALES_INVALIDAS');

  // Super admin doesn't need a tenant
  if (admin.role === 'SUPER_ADMIN') {
    const token = signToken({ adminId: admin.id, role: 'SUPER_ADMIN' });
    return {
      token,
      admin: { id: admin.id, email: admin.email, nombre: admin.nombre, role: admin.role },
    };
  }

  // Regular admin needs a tenant
  if (!tenantSlugOrId) {
    // If admin already has a tenantId, use it directly
    if (admin.tenantId) {
      const token = signToken({ adminId: admin.id, tenantId: admin.tenantId, role: 'ADMIN' });
      return {
        token,
        admin: { id: admin.id, email: admin.email, nombre: admin.nombre, role: admin.role },
      };
    }
    throw new Error('VALIDATION_ERROR');
  }

  let tenant;
  if (tenantSlugOrId.includes('-')) {
    tenant = await prisma.tenant.findUnique({ where: { id: tenantSlugOrId } });
  } else {
    tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlugOrId } });
  }

  if (!tenant) throw new Error('VALIDATION_ERROR');
  if (admin.tenantId !== tenant.id) throw new Error('CREDENCIALES_INVALIDAS');

  const token = signToken({ adminId: admin.id, tenantId: admin.tenantId, role: 'ADMIN' });

  return {
    token,
    admin: { id: admin.id, email: admin.email, nombre: admin.nombre, role: admin.role },
  };
}

export async function obtenerAdmin(adminId) {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, nombre: true, tenantId: true, role: true },
  });

  if (!admin) throw new Error('RECURSO_NO_ENCONTRADO');

  // Include tenant slug for regular admins
  if (admin.tenantId) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: admin.tenantId },
      select: { slug: true },
    });
    return { ...admin, tenantSlug: tenant?.slug || null };
  }

  return admin;
}

export async function crearAdmin(tenantId, email, password, nombre) {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.admin.create({
    data: { tenantId, email, passwordHash, nombre },
    select: { id: true, email: true, nombre: true },
  });
}
