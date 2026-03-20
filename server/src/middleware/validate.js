export function validate(schema) {
  return (req, res, next) => {
    if (!schema) return next();
    
    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.error('Validation error:', result.error.flatten());
      return res.status(400).json({ error: 'VALIDATION_ERROR' });
    }
    req.body = result.data;
    next();
  };
}
