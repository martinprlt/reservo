import { z } from 'zod';

// XSS prevention: strip dangerous HTML/JS from strings
function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '');
}

function sanitizeValue(value) {
  if (typeof value === 'string') return stripHtml(value);
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, sanitizeValue(v)])
    );
  }
  return value;
}

// Middleware to sanitize all request body/query/params
export function sanitizeInput(req, res, next) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}

// Common validation schemas
export const schemas = {
  email: z.string().email('Email inválido').max(255),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(100),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/, 'Teléfono inválido'),
  name: z.string().min(1).max(100).regex(/^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s'-]+$/, 'Nombre contiene caracteres inválidos'),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  positiveInt: z.number().int().positive(),
  positiveFloat: z.number().positive(),
};

// Validation middleware factory
export function validate(schema) {
  return (req, res, next) => {
    if (!schema) return next();
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', details: result.error.flatten() });
    }
    req.body = result.data;
    next();
  };
}
