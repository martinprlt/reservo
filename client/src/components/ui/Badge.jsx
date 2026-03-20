import clsx from 'clsx';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

export function estadoVariant(estado) {
  const map = {
    RESERVADO: 'warning',
    SENIADO: 'success',
    CONFIRMADO: 'info',
    COMPLETADO: 'default',
    CANCELADO: 'error',
  };
  return map[estado] || 'default';
}
