import rateLimit from 'express-rate-limit';

// Login rate limit: 5 attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos. Intentá en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit: 100 requests per minute per tenant/IP
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.tenantId || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intentá en un minuto.' },
});

// Booking rate limit: 10 bookings per hour per tenant/IP
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.tenantId || req.ip,
  message: { error: 'Demasiadas reservas. Intentá en una hora.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload rate limit: 20 uploads per hour per tenant/IP
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.tenantId || req.ip,
  message: { error: 'Demasiadas subidas. Intentá en una hora.' },
});

// Platform admin rate limit: 60 requests per minute
export const platformLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => req.adminId || req.ip,
  message: { error: 'Demasiadas solicitudes.' },
});
