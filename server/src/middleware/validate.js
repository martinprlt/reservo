import { z } from 'zod';

export const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function validate(req, res, next) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'VALIDATION_ERROR' });
  }
  next();
}
