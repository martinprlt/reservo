import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { signToken } from '../utils/jwt.js';

export async function login(email, password, tenantSlugOrId) {
  if (!tenantSlugOrId) throw new Error('VALIDATION_ERROR');

  let tenant;
  if (tenantSlugOrId.includes('-')) {
    tenant = await prisma.tenant.findUnique({ where: { id: tenantSlugOrId } });
  } else {
    tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlugOrId } });
  }

  if (!tenant) throw new Error('VALIDATION_ERROR');

  const admin = await prisma.admin.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email } },
  });

  if (!admin) throw new Error('CREDENCIALES_INVALIDAS');

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw new Error('CREDENCIALES_INVALIDAS');

  const token = signToken({ adminId: admin.id, tenantId: admin.tenantId });

  return {
    token,
    admin: { id: admin.id, email: admin.email, nombre: admin.nombre },
  };
}

export async function obtenerAdmin(adminId) {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, nombre: true, tenantId: true },
  });

  if (!admin) throw new Error('RECURSO_NO_ENCONTRADO');
  return admin;
}

export async function crearAdmin(tenantId, email, password, nombre) {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.admin.create({
    data: { tenantId, email, passwordHash, nombre },
    select: { id: true, email: true, nombre: true },
  });
}
