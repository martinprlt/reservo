import { useState, useEffect } from 'react';

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'danger' }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handler = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const variantStyles = {
    danger: { bg: '#dc2626', hover: '#b91c1c' },
    warning: { bg: '#f59e0b', hover: '#d97706' },
    primary: { bg: '#00464b', hover: '#005a60' },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <h3 className="text-lg font-bold mb-2 font-headline" style={{ color: '#181c20' }}>{title}</h3>
        <p className="text-sm mb-6" style={{ color: '#555550' }}>{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold text-sm border transition"
            style={{ borderColor: '#bec8c9', color: '#3f4949' }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition disabled:opacity-50"
            style={{ backgroundColor: variantStyles[variant].bg }}
          >
            {loading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
