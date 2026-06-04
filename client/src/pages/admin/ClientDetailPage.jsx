import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../store/toastContext';
import clsx from 'clsx';

const estadoVariant = (estado) => {
  const map = {
    RESERVADO: 'bg-yellow-100 text-yellow-800',
    SENIADO: 'bg-green-100 text-green-800',
    CONFIRMADO: 'bg-blue-100 text-blue-800',
    COMPLETADO: 'bg-gray-100 text-gray-600',
    CANCELADO: 'bg-red-100 text-red-600',
  };
  return map[estado] || 'bg-gray-100 text-gray-600';
};

export default function ClientDetailPage({ clienteId, onBack }) {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');
  const [eliminando, setEliminando] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});
  const toast = useToast();

  const fetchCliente = () => {
    api.get(`/admin/clientes/${clienteId}`)
      .then(({ data }) => {
        setCliente(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCliente();
  }, [clienteId]);

  const handleDeleteHistory = () => {
    setDialogConfig({
      title: 'Eliminar historial',
      message: `¿Cancelar todos los turnos de ${cliente?.nombre} ${cliente?.apellido}? Los turnos cancelados no se pueden recuperar.`,
      confirmText: 'Eliminar todo',
      variant: 'danger',
      onConfirm: async () => {
        setEliminando(true);
        try {
          const { data } = await api.delete(`/admin/clientes/${clienteId}/turnos`);
          toast?.success?.(`${data.eliminados || 0} turnos cancelados`);
          fetchCliente();
        } catch (err) {
          console.error('Error deleting history:', err);
          toast?.error?.('Error al eliminar historial');
        } finally {
          setEliminando(false);
        }
      },
    });
    setDialogOpen(true);
  };

  const handleDeleteTurno = (turnoId) => {
    setDialogConfig({
      title: 'Cancelar turno',
      message: '¿Cancelar este turno? Se notificará al cliente.',
      confirmText: 'Cancelar turno',
      variant: 'warning',
      onConfirm: async () => {
        try {
          await api.delete(`/admin/turnos/${turnoId}`);
          toast.success('Turno cancelado');
          fetchCliente();
        } catch {
          toast.error('Error al cancelar turno');
        }
      },
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="text-center py-16">
        <p className="text-on-surface-variant">Cliente no encontrado</p>
        <button onClick={onBack} className="text-primary font-medium mt-4 hover:underline">Volver</button>
      </div>
    );
  }

  const { turnos, stats, incentivosDisponibles, proximoIncentivo, puntosParaProximo } = cliente;

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-primary hover:text-primary-container text-sm font-medium mb-6 transition flex items-center gap-1 font-label"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Volver a clientes
      </button>

      {/* Hero Section - Stitch editorial style */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative w-32 h-40 md:w-40 md:h-48 shrink-0 overflow-hidden rounded-xl shadow-card transform rotate-2 hover:rotate-0 transition-transform duration-500 bg-gradient-to-br from-primary-fixed/40 to-primary-container/20 flex items-center justify-center">
            <span className="text-5xl font-extrabold text-primary/60 font-headline">
              {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 pt-2">
            <div>
              <span className="text-primary font-semibold tracking-wider uppercase text-xs mb-1 block font-label">
                {stats.completados > 5 ? 'Premium Client' : 'Cliente'}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight leading-none font-headline">
                {cliente.nombre} {cliente.apellido}
              </h1>
              <p className="text-on-surface-variant mt-1 text-sm font-body">
                Desde {new Date(cliente.creadoEn).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })} · {stats.totalTurnos} turnos totales
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${cliente.telefono}`}
                className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/10 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                Llamar
              </a>
              <a
                href={`https://wa.me/${cliente.telefono.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-surface-container-lowest text-primary border border-outline-variant/20 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:bg-primary-fixed/10 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                WhatsApp
              </a>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">phone</span>
                {cliente.telefono}
              </span>
              {cliente.notas && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">note</span>
                  {cliente.notas}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Loyalty & Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Loyalty Card - spans 2 */}
        <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant/10 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface font-headline">Puntos de Fidelidad</h3>
              <p className="text-on-surface-variant text-sm mt-1 font-body">
                {incentivosDisponibles.length > 0
                  ? `${incentivosDisponibles.length} descuento(s) disponible(s)`
                  : 'Sin descuentos disponibles aún'
                }
              </p>
            </div>
            <div className="bg-tertiary-container/10 text-tertiary px-4 py-2 rounded-full font-bold text-sm font-headline">
              {cliente.puntos} PTS
            </div>
          </div>

          {proximoIncentivo && (
            <div className="space-y-3">
              <div className="relative w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-fixed rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((cliente.puntos / proximoIncentivo.puntosRequeridos) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-on-surface-variant font-body">
                  {puntosParaProximo} puntos para <strong className="text-primary">{proximoIncentivo.nombre}</strong>
                </span>
                <span className="text-primary font-bold font-headline">
                  {proximoIncentivo.tipoDescuento === 'PORCENTAJE' ? `${proximoIncentivo.valor}%` : `$${proximoIncentivo.valor}`} off
                </span>
              </div>
            </div>
          )}

          {incentivosDisponibles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {incentivosDisponibles.map((inc) => (
                <span
                  key={inc.id}
                  className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium font-label"
                >
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  {inc.nombre}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats Card */}
        <div className="bg-surface-container-low rounded-xl p-5 space-y-4 border border-outline-variant/10">
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-on-surface-variant font-label mb-1">Total Turnos</p>
            <p className="text-3xl font-extrabold text-on-surface font-headline">{stats.totalTurnos}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-on-surface-variant font-label">Completados</p>
              <p className="font-bold text-green-600 font-headline">{stats.completados}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-label">Cancelados</p>
              <p className="font-bold text-error font-headline">{stats.cancelados}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-label">Total Señado</p>
            <p className="text-xl font-bold text-primary font-headline">${stats.totalGastado?.toLocaleString('es-AR')}</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface-container-low rounded-xl p-1">
        {[
          { id: 'history', label: 'Historial', icon: 'history' },
          { id: 'info', label: 'Notas', icon: 'note' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium font-label transition-all',
              activeTab === tab.id
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'history' && (
        <section className="space-y-3">
          {turnos.length > 0 && (
            <div className="flex justify-end mb-2">
              <button
                onClick={handleDeleteHistory}
                disabled={eliminando}
                className="text-xs px-3 py-1.5 rounded-lg border font-medium font-label transition disabled:opacity-40"
                style={{ borderColor: '#dc2626', color: '#dc2626' }}
              >
                <span className="material-symbols-outlined text-[14px] mr-1">delete</span>
                Eliminar historial
              </button>
            </div>
          )}
          {turnos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant font-body">No hay turnos registrados</p>
            </div>
          ) : (
            turnos.map((turno) => (
              <div
                key={turno.id}
                className={clsx(
                  'group flex gap-4 p-4 rounded-xl border transition-all duration-300',
                  turno.estado === 'CANCELADO'
                    ? 'bg-surface-container-low opacity-60 border-outline-variant/10'
                    : 'bg-surface-container-lowest shadow-sm hover:shadow-card border-outline-variant/10 hover:border-primary/20'
                )}
              >
                {/* Date */}
                <div className="text-center shrink-0 w-14 bg-surface-container-low rounded-lg py-2">
                  <span className="block text-xl font-black text-on-surface font-headline">
                    {format(new Date(turno.fechaHora), 'd')}
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">
                    {format(new Date(turno.fechaHora), 'MMM', { locale: es })}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-on-surface font-headline">{turno.servicio.nombre}</h4>
                      <p className="text-xs text-on-surface-variant font-body flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {format(new Date(turno.fechaHora), 'HH:mm')} · {turno.duracion} min
                      </p>
                    </div>
                    <span className={clsx(
                      'text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-tight font-label',
                      estadoVariant(turno.estado)
                    )}>
                      {turno.estado}
                    </span>
                  </div>

                  {turno.notas && (
                    <p className="text-xs text-on-surface-variant italic leading-relaxed font-body">
                      {turno.notas}
                    </p>
                  )}

                  <div className="flex gap-3 pt-1 items-center">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-primary font-label">
                      <span className="material-symbols-outlined text-[13px]">payments</span>
                      ${turno.precioTotal?.toLocaleString('es-AR')}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant font-label">
                      Seña: ${turno.montoSenia?.toLocaleString('es-AR')}
                    </span>
                    {turno.estado !== 'CANCELADO' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteTurno(turno.id); }}
                        className="ml-auto text-[11px] text-red-500 hover:text-red-700 font-label"
                      >
                        <span className="material-symbols-outlined text-[14px]">cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {activeTab === 'info' && (
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant/10">
          <h3 className="font-bold text-on-surface mb-3 font-headline">Notas del cliente</h3>
          <p className="text-on-surface-variant text-sm font-body">
            {cliente.notas || 'Sin notas registradas'}
          </p>
        </section>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={dialogConfig.onConfirm}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmText={dialogConfig.confirmText}
        variant={dialogConfig.variant}
      />
    </div>
  );
}
