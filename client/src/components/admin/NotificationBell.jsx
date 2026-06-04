import { useState, useEffect, useRef } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import clsx from 'clsx';

const TIPO_ICONS = {
  NUEVO_TURNO: 'event',
  PAGO_RECIBIDO: 'payments',
  TURNO_MANANA: 'schedule',
};

const TIPO_COLORS = {
  NUEVO_TURNO: '#4648d4',
  PAGO_RECIBIDO: '#22c55e',
  TURNO_MANANA: '#eab308',
};

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchCount = async () => {
    try {
      const { data } = await api.get('/admin/notificaciones/contar');
      setCount(data.count);
    } catch {}
  };

  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/notificaciones', { params: { limit: 15 } });
      setNotificaciones(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) fetchNotificaciones();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarcarLeida = async (id) => {
    try {
      await api.patch(`/admin/notificaciones/${id}/leer`);
      setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
      setCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarcarTodas = async () => {
    try {
      await api.post('/admin/notificaciones/leer-todas');
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      setCount(0);
    } catch {}
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative"
      >
        <span className="material-symbols-outlined text-on-surface-variant">
          {isOpen ? 'notifications' : 'notifications'}
        </span>
        {count > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1"
            style={{ backgroundColor: '#ba1a1a', color: '#ffffff' }}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-12 w-80 rounded-2xl shadow-xl border overflow-hidden z-50"
          style={{ backgroundColor: '#ffffff', borderColor: 'rgba(199, 196, 215, 0.3)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(199, 196, 215, 0.2)' }}>
            <h3 className="font-bold text-sm font-headline text-on-surface">Notificaciones</h3>
            {count > 0 && (
              <button
                onClick={handleMarcarTodas}
                className="text-xs font-medium font-label text-primary"
              >
                Marcar todas leídas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : notificaciones.length === 0 ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-3xl text-outline">
                  notifications_off
                </span>
                <p className="text-xs mt-2 text-on-surface-variant">Sin notificaciones</p>
              </div>
            ) : (
              notificaciones.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.leida && handleMarcarLeida(notif.id)}
                  className={clsx(
                    'flex gap-3 px-4 py-3 border-b cursor-pointer transition-colors',
                    !notif.leida ? 'bg-primary/5' : 'hover:bg-surface-container-low'
                  )}
                  style={{ borderColor: 'rgba(199, 196, 215, 0.1)' }}
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${TIPO_COLORS[notif.tipo]}20` }}
                  >
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ color: TIPO_COLORS[notif.tipo] }}
                    >
                      {TIPO_ICONS[notif.tipo] || 'notifications'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold font-label truncate text-on-surface">
                        {notif.titulo}
                      </p>
                      {!notif.leida && (
                        <span className="w-2 h-2 rounded-full shrink-0 bg-primary" />
                      )}
                    </div>
                    <p className="text-xs mt-0.5 line-clamp-2 text-on-surface-variant">
                      {notif.mensaje}
                    </p>
                    <p className="text-[10px] mt-1 font-label text-outline">
                      {formatDistanceToNow(new Date(notif.creadoEn), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
