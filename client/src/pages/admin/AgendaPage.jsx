import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import TurnoDetailPage from './TurnoDetailPage';
import clsx from 'clsx';

export default function AgendaPage() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [selectedTurnoId, setSelectedTurnoId] = useState(null);

  const fetchTurnos = async () => {
    setLoading(true);
    try {
      const inicioDia = new Date(fechaSeleccionada);
      inicioDia.setHours(0, 0, 0, 0);
      const finDia = new Date(fechaSeleccionada);
      finDia.setHours(23, 59, 59, 999);

      const { data } = await api.get('/admin/agenda', {
        params: { desde: inicioDia.toISOString(), hasta: finDia.toISOString() },
      });
      setTurnos(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, [fechaSeleccionada]);

  const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));
  const horas = Array.from({ length: 12 }, (_, i) => i + 8);

  const handleDeleteTurno = async (turnoId, e) => {
    e.stopPropagation();
    if (!confirm('¿Cancelar este turno?')) return;
    try {
      await api.delete(`/admin/turnos/${turnoId}`);
      fetchTurnos();
    } catch {
      alert('Error');
    }
  };

  const getTurnosEnHora = (hora) => {
    return turnos.filter((t) => {
      const turnoHora = new Date(t.fechaHora).getHours();
      return turnoHora === hora;
    });
  };

  if (selectedTurnoId) {
    return (
      <TurnoDetailPage
        turnoId={selectedTurnoId}
        onBack={() => {
          setSelectedTurnoId(null);
          fetchTurnos();
        }}
      />
    );
  }

  return (
    <div>
      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="font-label text-sm uppercase tracking-wider mb-1" style={{ color: 'var(--on-surface-variant)' }}>
              Agenda del día
            </p>
            <h2 className="text-3xl font-extrabold font-headline" style={{ color: 'var(--on-surface)' }}>
              {format(fechaSeleccionada, "EEEE, d MMM", { locale: es })}
            </h2>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {diasSemana.map((dia) => {
            const selected = isSameDay(dia, fechaSeleccionada);
            const today = isToday(dia);

            return (
              <button
                key={dia.toISOString()}
                onClick={() => setFechaSeleccionada(dia)}
                className={clsx(
                  'flex flex-col items-center min-w-[56px] py-3 rounded-2xl transition-all duration-200',
                  selected ? 'shadow-xl' : ''
                )}
                style={{
                  backgroundColor: selected ? 'var(--primary)' : 'var(--surface-container-low)',
                  color: selected ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                  boxShadow: selected ? '0 8px 32px rgba(0,70,75,0.2)' : 'none',
                }}
              >
                <span className="text-xs font-medium font-label uppercase">
                  {format(dia, 'EEE', { locale: es }).slice(0, 3)}
                </span>
                <span className="text-lg font-bold font-headline leading-tight">
                  {format(dia, 'd')}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="relative">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
          </div>
        ) : (
          <div className="flex flex-col">
            {horas.map((hora) => {
              const turnosEnHora = getTurnosEnHora(hora);

              return (
                <div key={hora} className="flex min-h-[90px] group">
                  <div className="w-14 pt-2 pr-4 text-right shrink-0">
                    <span className="text-xs font-semibold font-label" style={{ color: 'var(--on-surface-variant)', opacity: 0.6 }}>
                      {String(hora).padStart(2, '0')}:00
                    </span>
                  </div>
                  <div className="flex-1 border-t transition-colors relative" style={{ borderColor: 'var(--outline-variant)', opacity: 0.1 }}>
                    {turnosEnHora.map((turno) => (
                      <div
                        key={turno.id}
                        onClick={() => setSelectedTurnoId(turno.id)}
                        className="absolute top-2 left-2 right-4 bottom-2 p-3 rounded-lg shadow-sm hover:scale-[1.01] transition-transform cursor-pointer border-l-4"
                        style={{
                          backgroundColor: 'var(--primary-fixed)',
                          borderLeftColor: 'var(--primary)',
                          opacity: 0.4,
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold leading-tight" style={{ color: 'var(--on-surface)' }}>
                              {turno.servicio.nombre}
                            </h4>
                            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--on-surface-variant)' }}>
                              <span className="material-symbols-outlined text-[14px]">person</span>
                              {turno.cliente.nombre} {turno.cliente.apellido}
                            </p>
                            {turno.notas && (
                              <p className="text-xs mt-1 italic truncate" style={{ color: 'var(--on-surface-variant)', opacity: 0.7 }}>
                                "{turno.notas}"
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 ml-2">
                            <span className={clsx(
                              'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter',
                              turno.estado === 'SENIADO' ? 'bg-green-100 text-green-800' :
                              turno.estado === 'RESERVADO' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-600'
                            )}>
                              {turno.estado}
                            </span>
                            {turno.estado !== 'CANCELADO' && (
                              <button
                                onClick={(e) => handleDeleteTurno(turno.id, e)}
                                className="p-1 rounded-full hover:bg-red-100 transition text-red-400 hover:text-red-600"
                                title="Cancelar turno"
                              >
                                <span className="material-symbols-outlined text-[16px]">cancel</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
