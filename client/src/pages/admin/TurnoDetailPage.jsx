import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import clsx from 'clsx';

const estadoColors = {
  RESERVADO: 'bg-yellow-100 text-yellow-800',
  SENIADO: 'bg-green-100 text-green-800',
  CONFIRMADO: 'bg-blue-100 text-blue-800',
  COMPLETADO: 'bg-gray-100 text-gray-600',
  CANCELADO: 'bg-red-100 text-red-600',
};

const ESTADOS = ['RESERVADO', 'SENIADO', 'CONFIRMADO', 'COMPLETADO', 'CANCELADO'];

export default function TurnoDetailPage({ turnoId, onBack }) {
  const [turno, setTurno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    api.get(`/admin/turnos/${turnoId}`)
      .then(({ data }) => {
        setTurno(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [turnoId]);

  const handleEstadoChange = async (nuevoEstado) => {
    setCambiandoEstado(true);
    try {
      const { data } = await api.patch(`/admin/turnos/${turnoId}`, { estado: nuevoEstado });
      setTurno(data);
    } catch {
      alert('Error al cambiar estado');
    } finally {
      setCambiandoEstado(false);
    }
  };

  const handleEliminar = async () => {
    if (!confirm('¿Cancelar este turno?')) return;
    setEliminando(true);
    try {
      await api.delete(`/admin/turnos/${turnoId}`);
      onBack();
    } catch {
      alert('Error al eliminar');
    } finally {
      setEliminando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
      </div>
    );
  }

  if (!turno) {
    return (
      <div className="text-center py-16">
        <p style={{ color: 'var(--on-surface-variant)' }}>Turno no encontrado</p>
        <button onClick={onBack} className="font-medium mt-4 hover:underline" style={{ color: 'var(--primary)' }}>Volver</button>
      </div>
    );
  }

  const telefonoLimpio = turno.cliente.telefono.replace(/\D/g, '');
  const fecha = new Date(turno.fechaHora);

  return (
    <div>
      <button
        onClick={onBack}
        className="text-sm font-medium mb-6 transition flex items-center gap-1 font-label"
        style={{ color: 'var(--primary)' }}
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Volver a agenda
      </button>

      {/* Turno Card */}
      <div className="p-6 rounded-xl shadow-card border mb-6" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold font-headline" style={{ color: 'var(--on-surface)' }}>
              {turno.servicio.nombre}
            </h2>
            <p className="text-sm mt-1 font-body" style={{ color: 'var(--on-surface-variant)' }}>
              {format(fecha, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })}
            </p>
          </div>
          <span className={clsx('text-xs px-3 py-1.5 rounded-full font-bold uppercase font-label', estadoColors[turno.estado])}>
            {turno.estado}
          </span>
        </div>

        {/* Estado selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 font-label" style={{ color: 'var(--on-surface)' }}>
            Cambiar estado
          </label>
          <div className="flex flex-wrap gap-2">
            {ESTADOS.map((estado) => (
              <button
                key={estado}
                onClick={() => handleEstadoChange(estado)}
                disabled={cambiandoEstado || turno.estado === estado}
                className={clsx(
                  'text-xs px-3 py-1.5 rounded-full font-medium font-label transition',
                  turno.estado === estado ? 'opacity-50 cursor-default' : 'hover:opacity-80 cursor-pointer'
                )}
                style={{
                  backgroundColor: turno.estado === estado ? 'var(--primary)' : 'var(--surface-container-low)',
                  color: turno.estado === estado ? 'var(--on-primary)' : 'var(--on-surface)',
                  borderColor: 'var(--outline-variant)',
                  borderWidth: '1px',
                }}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p style={{ color: 'var(--on-surface-variant)' }}>Duración</p>
            <p className="font-medium" style={{ color: 'var(--on-surface)' }}>{turno.duracion} min</p>
          </div>
          <div>
            <p style={{ color: 'var(--on-surface-variant)' }}>Precio total</p>
            <p className="font-medium" style={{ color: 'var(--on-surface)' }}>${turno.precioTotal?.toLocaleString('es-AR')}</p>
          </div>
          <div>
            <p style={{ color: 'var(--on-surface-variant)' }}>Seña</p>
            <p className="font-medium" style={{ color: 'var(--on-surface)' }}>${turno.montoSenia?.toLocaleString('es-AR')}</p>
          </div>
          <div>
            <p style={{ color: 'var(--on-surface-variant)' }}>Creado</p>
            <p className="font-medium" style={{ color: 'var(--on-surface)' }}>
              {format(new Date(turno.creadoEn), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>

        {/* Notas del cliente */}
        {turno.notas && (
          <div className="mt-4 p-4 rounded-lg border" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1 font-label" style={{ color: 'var(--on-surface-variant)' }}>
              Nota del cliente
            </p>
            <p className="text-sm italic font-body" style={{ color: 'var(--on-surface)' }}>
              "{turno.notas}"
            </p>
          </div>
        )}

        {turno.expiraEn && turno.estado === 'RESERVADO' && (
          <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="text-xs text-yellow-800 font-label">
              ⏳ Expira: {format(new Date(turno.expiraEn), 'HH:mm')} — Se cancelará automáticamente si no se paga la seña.
            </p>
          </div>
        )}
      </div>

      {/* Cliente Card */}
      <div className="p-6 rounded-xl shadow-card border mb-6" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
        <h3 className="text-lg font-bold font-headline mb-4" style={{ color: 'var(--on-surface)' }}>Cliente</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--primary-fixed)', color: 'var(--primary)' }}>
            {turno.cliente.nombre.charAt(0)}{turno.cliente.apellido.charAt(0)}
          </div>
          <div>
            <p className="font-bold font-headline" style={{ color: 'var(--on-surface)' }}>
              {turno.cliente.nombre} {turno.cliente.apellido}
            </p>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {turno.cliente.telefono} · {turno.cliente.puntos} puntos
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={`tel:${turno.cliente.telefono}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm shadow-lg transition active:scale-95"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }}
          >
            <span className="material-symbols-outlined text-lg">call</span>
            Llamar
          </a>
          <a
            href={`https://wa.me/${telefonoLimpio}?text=Hola!%20Te%20escribo%20de%20Reservo%20para%20confirmar%20tu%20turno`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition active:scale-95"
            style={{ borderColor: 'var(--outline-variant)', color: 'var(--on-surface)', backgroundColor: 'var(--surface-container-lowest)' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Acciones */}
      <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
        <h3 className="text-lg font-bold font-headline mb-4" style={{ color: 'var(--on-surface)' }}>Acciones</h3>
        <button
          onClick={handleEliminar}
          disabled={eliminando || turno.estado === 'CANCELADO'}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition active:scale-95 disabled:opacity-40"
          style={{ borderColor: '#dc2626', color: '#dc2626', backgroundColor: 'var(--surface-container-lowest)' }}
        >
          <span className="material-symbols-outlined text-lg">cancel</span>
          {turno.estado === 'CANCELADO' ? 'Ya cancelado' : 'Cancelar turno'}
        </button>
      </div>
    </div>
  );
}
