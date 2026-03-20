import { z } from 'zod';

export const servicioSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  rubro: z.string(),
  duracionMinutos: z.number(),
  precio: z.number(),
  montoSenia: z.number(),
  variantes: z.array(z.object({
    id: z.string(),
    nombre: z.string(),
    duracionExtra: z.number(),
    precioExtra: z.number(),
  })).optional(),
});

export const slotSchema = z.object({
  inicio: z.string().datetime(),
  fin: z.string().datetime(),
});
