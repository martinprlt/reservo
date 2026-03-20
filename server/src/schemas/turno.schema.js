import { z } from 'zod';

export const crearTurnoSchema = z.object({
  servicioId: z.string().min(1),
  varianteId: z.string().optional(),
  fechaHora: z.string().datetime(),
  nombre: z.string().min(2, 'Nombre muy corto'),
  apellido: z.string().min(2, 'Apellido muy corto'),
  telefono: z.string().min(8, 'Teléfono inválido'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña mínima 6 caracteres'),
});

export const crearServicioSchema = z.object({
  nombre: z.string().min(2),
  rubro: z.string().optional(),
  duracionMinutos: z.number().min(15),
  precio: z.number().min(0),
  montoSenia: z.number().min(0).optional(),
  variantes: z.array(z.object({
    id: z.string().optional(),
    nombre: z.string(),
    duracionExtra: z.number().default(0),
    precioExtra: z.number().default(0),
  })).optional(),
});

export const turnoEstadoSchema = z.enum(['RESERVADO', 'SENIADO', 'CONFIRMADO', 'COMPLETADO', 'CANCELADO']);
