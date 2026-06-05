import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { track } from './metricsService.js';

export async function obtenerStats() {
  const [totalTenants, tenantsActivos, totalAdmins, totalClientes, totalTurnos, turnosHoy] = await Promise.all([
    prisma.tenant.count(),
    prisma.tenant.count({ where: { activo: true } }),
    prisma.admin.count({ where: { role: 'ADMIN' } }),
    prisma.cliente.count(),
    prisma.turno.count(),
    prisma.turno.count({
      where: {
        fechaHora: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        estado: { not: 'CANCELADO' },
      },
    }),
  ]);

  const ingresosMes = await prisma.pago.aggregate({
    where: {
      estado: 'APROBADO',
      creadoEn: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
    _sum: { monto: true },
  });

  return {
    totalTenants,
    tenantsActivos,
    totalAdmins,
    totalClientes,
    totalTurnos,
    turnosHoy,
    ingresosMes: ingresosMes._sum.monto || 0,
  };
}

export async function listarTenants({ page = 1, limit = 20, busqueda }) {
  const skip = (page - 1) * limit;
  const where = {};

  if (busqueda) {
    where.OR = [
      { nombre: { contains: busqueda, mode: 'insensitive' } },
      { slug: { contains: busqueda, mode: 'insensitive' } },
    ];
  }

  const [tenants, total] = await Promise.all([
    prisma.tenant.findMany({
      where,
      include: {
        _count: { select: { admins: true, clientes: true, servicios: true, turnos: true } },
      },
      orderBy: { creadoEn: 'desc' },
      skip,
      take: limit,
    }),
    prisma.tenant.count({ where }),
  ]);

  return { tenants, total, page, totalPages: Math.ceil(total / limit) };
}

export async function obtenerTenant(id) {
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      admins: { select: { id: true, email: true, nombre: true, role: true, creadoEn: true } },
      _count: { select: { clientes: true, servicios: true, turnos: true } },
    },
  });

  if (!tenant) throw new Error('RECURSO_NO_ENCONTRADO');
  return tenant;
}

export async function crearTenant({ nombre, slug, plan, email, password }) {
  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (existing) throw new Error('SLUG_YA_EXISTE');

  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        nombre,
        slug,
        plan: plan || 'FREE',
        config: {
          horarios: {
            lunes: { apertura: '09:00', cierre: '18:00', activo: true },
            martes: { apertura: '09:00', cierre: '18:00', activo: true },
            miercoles: { apertura: '09:00', cierre: '18:00', activo: true },
            jueves: { apertura: '09:00', cierre: '18:00', activo: true },
            viernes: { apertura: '09:00', cierre: '18:00', activo: true },
            sabado: { apertura: '10:00', cierre: '14:00', activo: true },
            domingo: { apertura: '00:00', cierre: '00:00', activo: false },
          },
        },
      },
    });

    await tx.admin.create({
      data: {
        tenantId: tenant.id,
        email,
        passwordHash,
        nombre: email.split('@')[0],
        role: 'ADMIN',
      },
    });

    return tenant;
  });
}

export async function actualizarTenant(id, data) {
  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) throw new Error('RECURSO_NO_ENCONTRADO');

  const updateData = {};

  // Basic fields
  if (data.nombre !== undefined) updateData.nombre = data.nombre;
  if (data.slug !== undefined) {
    if (data.slug !== tenant.slug) {
      const existing = await prisma.tenant.findUnique({ where: { slug: data.slug } });
      if (existing) throw new Error('SLUG_YA_EXISTE');
    }
    updateData.slug = data.slug;
  }
  if (data.plan !== undefined) {
    updateData.plan = data.plan;
    // Clear trial when plan is changed manually
    if (data.plan !== 'FREE') {
      updateData.trialFin = null;
    }
    // Track plan change
    if (data.plan !== tenant.plan) {
      const tipo = data.plan === 'FREE' ? 'DOWNGRADE' : 'UPGRADE';
      track(tipo, id, { desde: tenant.plan, hacia: data.plan, razon: 'manual_superadmin' });
    }
  }
  if (data.activo !== undefined) updateData.activo = data.activo;

  // Config merge
  if (data.config) {
    const currentConfig = tenant.config || {};
    updateData.config = { ...currentConfig, ...data.config };
  }

  return prisma.tenant.update({
    where: { id },
    data: updateData,
  });
}

export async function eliminarTenant(id) {
  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) throw new Error('RECURSO_NO_ENCONTRADO');

  return prisma.tenant.delete({ where: { id } });
}

export async function listarAdmins({ page = 1, limit = 20, busqueda }) {
  const skip = (page - 1) * limit;
  const where = { role: 'ADMIN' };

  if (busqueda) {
    where.OR = [
      { email: { contains: busqueda, mode: 'insensitive' } },
      { nombre: { contains: busqueda, mode: 'insensitive' } },
    ];
  }

  const [admins, total] = await Promise.all([
    prisma.admin.findMany({
      where,
      include: { tenant: { select: { id: true, nombre: true, slug: true } } },
      orderBy: { creadoEn: 'desc' },
      skip,
      take: limit,
    }),
    prisma.admin.count({ where }),
  ]);

  return { admins, total, page, totalPages: Math.ceil(total / limit) };
}

export async function crearAdmin({ tenantId, email, password, nombre }) {
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) throw new Error('EMAIL_YA_EXISTE');

  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.admin.create({
    data: {
      tenantId,
      email,
      passwordHash,
      nombre: nombre || email.split('@')[0],
      role: 'ADMIN',
    },
    select: { id: true, email: true, nombre: true, role: true },
  });
}

export async function eliminarAdmin(id) {
  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) throw new Error('RECURSO_NO_ENCONTRADO');
  if (admin.role === 'SUPER_ADMIN') throw new Error('NO_SE_PUEDE_ELIMINAR_SUPER_ADMIN');

  return prisma.admin.delete({ where: { id } });
}

export async function resetAdminPassword(adminId, newPassword) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) throw new Error('RECURSO_NO_ENCONTRADO');

  const passwordHash = await bcrypt.hash(newPassword, 12);
  return prisma.admin.update({
    where: { id: adminId },
    data: { passwordHash },
    select: { id: true, email: true, nombre: true },
  });
}

export async function toggleTenantActivo(id) {
  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) throw new Error('RECURSO_NO_ENCONTRADO');

  return prisma.tenant.update({
    where: { id },
    data: { activo: !tenant.activo },
  });
}
