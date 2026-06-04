import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Creando tenant demo...');

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'tusnailslr' },
    update: {},
    create: {
      nombre: 'TusNailsLR',
      slug: 'tusnailslr',
      plan: 'BASICO',
      activo: true,
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
         telefonoAdmin: '5493804123456',
         colorPrimario: '#E91E63',
         rubros: [
           { id: 'unas', nombre: 'Uñas', icono: 'front_hand', colorPrimario: '#E91E63', colorSecundario: '#9C27B0' },
           { id: 'pelo', nombre: 'Pelo', icono: 'cut', colorPrimario: '#3F51B5', colorSecundario: '#2196F3' },
           { id: 'pestanas', nombre: 'Pestañas', icono: 'visibility', colorPrimario: '#FF9800', colorSecundario: '#FFC107' },
           { id: 'masajes', nombre: 'Masajes', icono: 'spa', colorPrimario: '#4CAF50', colorSecundario: '#8BC34A' },
           { id: 'general', nombre: 'General', icono: 'spa', colorPrimario: '#607D8B', colorSecundario: '#78909C' }
         ]
       },
    },
  });

  console.log(`Tenant creado: ${tenant.nombre} (${tenant.slug})`);

  console.log('Creando admin...');
  const passwordHash = await bcrypt.hash('admin123', 12);

  await prisma.admin.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@tusnailslr.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@tusnailslr.com',
      passwordHash,
      nombre: 'Administrador',
    },
  });

  console.log('Admin creado: admin@tusnailslr.com / admin123');

  console.log('Creando servicios...');
  const servicios = [
    {
      nombre: 'Manicura Muzza Simple',
      rubro: 'uñas',
      duracionMinutos: 60,
      precio: 7000,
      montoSenia: 2100,
    },
    {
      nombre: 'Manicura Muzza con Huevo',
      rubro: 'uñas',
      duracionMinutos: 75,
      precio: 7500,
      montoSenia: 2250,
    },
    {
      nombre: 'Manicura Napolitana',
      rubro: 'uñas',
      duracionMinutos: 90,
      precio: 8000,
      montoSenia: 2400,
    },
    {
      nombre: 'Manicura Especial',
      rubro: 'uñas',
      duracionMinutos: 90,
      precio: 8000,
      montoSenia: 2400,
    },
    {
      nombre: 'Manicura Choclo',
      rubro: 'uñas',
      duracionMinutos: 90,
      precio: 8000,
      montoSenia: 2400,
    },
    {
      nombre: 'Pestañas Pelo por Pelo',
      rubro: 'pestañas',
      duracionMinutos: 120,
      precio: 12000,
      montoSenia: 3600,
    },
  ];

  for (const servicio of servicios) {
    const existing = await prisma.servicio.findFirst({
      where: { tenantId: tenant.id, nombre: servicio.nombre },
    });
    if (existing) {
      await prisma.servicio.update({
        where: { id: existing.id },
        data: servicio,
      });
    } else {
      await prisma.servicio.create({
        data: { tenantId: tenant.id, ...servicio },
      });
    }
  }

  console.log(`${servicios.length} servicios creados`);

  console.log('Creando clientes de prueba...');
  const clientes = [
    { nombre: 'María', apellido: 'García', telefono: '5493804001111' },
    { nombre: 'Ana', apellido: 'López', telefono: '5493804002222' },
    { nombre: 'Sofía', apellido: 'Martínez', telefono: '5493804003333' },
  ];

  for (const cliente of clientes) {
    await prisma.cliente.upsert({
      where: { tenantId_telefono: { tenantId: tenant.id, telefono: cliente.telefono } },
      update: {},
      create: {
        tenantId: tenant.id,
        ...cliente,
        puntos: Math.floor(Math.random() * 10),
      },
    });
  }

  console.log(`${clientes.length} clientes creados`);

  console.log('Creando incentivos...');
  const incentivos = [
    { nombre: 'Descuento 5pts', puntosRequeridos: 5, tipoDescuento: 'PORCENTAJE', valor: 10 },
    { nombre: 'Descuento 10pts', puntosRequeridos: 10, tipoDescuento: 'PORCENTAJE', valor: 20 },
  ];

  for (const inc of incentivos) {
    const existing = await prisma.incentivo.findFirst({
      where: { tenantId: tenant.id, nombre: inc.nombre },
    });
    if (!existing) {
      await prisma.incentivo.create({
        data: { tenantId: tenant.id, ...inc },
      });
    }
  }

  console.log('Seed completado!');
  console.log('\nDatos de acceso:');
  console.log('  Admin: admin@tusnailslr.com');
  console.log('  Password: admin123');
  console.log(`  URL: http://tusnailslr.localhost:3000`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
