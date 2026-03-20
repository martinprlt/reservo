import { z } from 'zod';

export const clienteSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  telefono: z.string().min(8),
  email: z.string().email().optional(),
});

export const identificarClienteSchema = z.object({
  telefono: z.string().min(8),
  nombre: z.string().min(2).optional(),
  apellido: z.string().min(2).optional(),
});
