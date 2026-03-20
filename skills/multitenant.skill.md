# Skill: Reservo — Multi-tenancy

## Regla de oro — NUNCA ignorar

**Todo query a Prisma debe incluir `tenantId` como filtro.**
Un query sin `tenantId` expone datos de todos los tenants. Es la
vulnerabilidad más grave que puede tener el sistema.

## Cómo se resuelve el tenant

El tenant se resuelve en `middleware/tenant.js` a partir del subdominio:

```js
// middleware/tenant.js
const slug = req.hostname.split('.')[0]; // 'tusnailslr' de tusnailslr.reservo.app
const tenant = await prisma.tenant.findUnique({
  where: { slug },
  select: { id: true, activo: true, config: true }
});
if (!tenant?.activo) return res.status(404).json({ error: 'Negocio no encontrado' });
req.tenantId = tenant.id;
req.tenantConfig = tenant.config;
next();
```

`req.tenantId` está disponible en todos los handlers que vienen después.

## Patrón obligatorio en services

Toda función de service que accede a recursos recibe `tenantId` como
primer parámetro y SIEMPRE lo incluye en el query:

```js
// CORRECTO
async function obtener(tenantId, id) {
  const item = await prisma.modelo.findUnique({ where: { id } });
  if (!item || item.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO'); // mismo error: no revelar si existe
  }
  return item;
}

// INCORRECTO — nunca hacer esto
async function obtener(id) {
  return prisma.modelo.findUnique({ where: { id } }); // fuga de datos
}
```

## Anti-IDOR

Antes de devolver O modificar cualquier recurso, verificar siempre:

```js
if (recurso.tenantId !== tenantId) {
  throw new Error('RECURSO_NO_ENCONTRADO'); // 404, no 403 — no revelar existencia
}
```

Devolver siempre el **mismo error** tanto si el recurso no existe como si
pertenece a otro tenant. Nunca revelar la diferencia.

## Índices críticos en Prisma

Cada modelo tiene `@@index([tenantId])`. El turno además tiene
`@@index([tenantId, fechaHora])` porque el turnero consulta por tenant + fecha
constantemente. Sin estos índices, los queries se vuelven full table scans.

## Unique constraint de clientes

```prisma
@@unique([tenantId, telefono])
```

El mismo teléfono puede existir en dos tenants distintos. La unicidad
es siempre DENTRO del tenant, nunca global.
