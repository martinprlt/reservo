import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import TurnoDetailPage from './TurnoDetailPage';
import NuevoTurnoModal from '../../components/admin/NuevoTurnoModal';
import clsx from 'clsx';

export default function AgendaPage() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());
  const [selectedTurnoId, setSelectedTurnoId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFecha, setModalFecha] = useState(null);

  // Week start based on selected date
  const inicioSemana = startOfWeek(diaSeleccionado, { weekStartsOn: 1 });
  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));

  const fetchTurnos = async () => {
    setLoading(true);
    try {
      // Fetch for the whole week
      const finSemana = addDays(inicioSemana, 6);
      finSemana.setHours(23, 59, 59, 999);

      const { data } = await api.get('/admin/agenda', {
        params: { desde: inicioSemana.toISOString(), hasta: finSemana.toISOString() },
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
  }, [diaSeleccionado]);

  const horas = Array.from({ length: 12 }, (_, i) => i + 8);

  const prevWeek = () => {
    setDiaSeleccionado(d => addDays(d, -7));
  };

  const nextWeek = () => {
    setDiaSeleccionado(d => addDays(d, 7));
  };

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

  // Get turnos for a specific day and hour
  const getTurnosDiaHora = (dia, hora) => {
    return turnos.filter((t) => {
      const fechaTurno = new Date(t.fechaHora);
      return fechaTurno.toDateString() === dia.toDateString() && fechaTurno.getHours() === hora;
    });
  };

  // Get all turnos for a specific day
  const getTurnosDelDia = (dia) => {
    return turnos.filter((t) => {
      const fechaTurno = new Date(t.fechaHora);
      return fechaTurno.toDateString() === dia.toDateString();
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
      {/* Header */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-label text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--on-surface-variant)' }}>
              Agenda semanal
            </p>
            <h2 className="text-2xl font-extrabold font-headline" style={{ color: 'var(--on-surface)' }}>
              {format(inicioSemana, "d", { locale: es })} — {format(addDays(inicioSemana, 6), "d MMM yyyy", { locale: es })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevWeek} className="p-2 rounded-xl transition" style={{ backgroundColor: 'var(--surface-container-low)' }}>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => setDiaSeleccionado(new Date())}
              className="px-3 py-2 rounded-xl text-xs font-bold font-label"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }}
            >
              Hoy
            </button>
            <button onClick={nextWeek} className="p-2 rounded-xl transition" style={{ backgroundColor: 'var(--surface-container-low)' }}>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {diasSemana.map((dia) => {
            const selected = isSameDay(dia, diaSeleccionado);
            const today = isToday(dia);
            const turnosCount = getTurnosDelDia(dia).length;

            return (
              <button
                key={dia.toISOString()}
                onClick={() => setDiaSeleccionado(dia)}
                className="flex flex-col items-center min-w-[56px] py-3 px-2 rounded-2xl transition-all relative"
                style={{
                  backgroundColor: selected ? 'var(--primary)' : 'var(--surface-container-low)',
                  color: selected ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                  boxShadow: selected ? '0 4px 16px rgba(0,70,75,0.2)' : 'none',
                }}
              >
                <span className="text-[10px] font-semibold uppercase font-label">
                  {format(dia, 'EEE', { locale: es }).slice(0, 3)}
                </span>
                <span className="text-lg font-bold font-headline leading-tight">
                  {format(dia, 'd')}
                </span>
                {turnosCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: today ? '#22c55e' : 'var(--tertiary)', color: 'white' }}>
                    {turnosCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Timeline for selected day */}
      <section>
        <h3 className="font-semibold font-headline mb-3" style={{ color: 'var(--on-surface)' }}>
          {format(diaSeleccionado, "EEEE d 'de' MMMM", { locale: es })}
        </h3>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
          </div>
        ) : (
          <div className="flex flex-col">
            {horas.map((hora) => {
              const turnosEnHora = getTurnosDiaHora(diaSeleccionado, hora);

              return (
                <div key={hora} className="flex min-h-[80px]">
                  <div className="w-14 pt-2 pr-3 text-right shrink-0">
                    <span className="text-xs font-semibold font-label" style={{ color: 'var(--on-surface-variant)' }}>
                      {String(hora).padStart(2, '0')}:00
                    </span>
                  </div>
                  <div className="flex-1 border-t relative" style={{ borderColor: 'var(--outline-variant)', opacity: 0.2 }}>
                    {turnosEnHora.map((turno) => (
                      <div
                        key={turno.id}
                        onClick={() => setSelectedTurnoId(turno.id)}
                        className="absolute top-1 left-1 right-3 bottom-1 p-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer border-l-4"
                        style={{
                          backgroundColor: turno.estado === 'CANCELADO' ? 'var(--surface-container)' : 'var(--surface-container-lowest)',
                          borderLeftColor: turno.estado === 'SENIADO' ? '#22c55e' :
                                           turno.estado === 'RESERVADO' ? '#eab308' :
                                           turno.estado === 'CONFIRMADO' ? '#3b82f6' :
                                           'var(--primary)',
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold leading-tight" style={{ color: '#181c20', fontFamily: "'Manrope', sans-serif" }}>
                              {turno.servicio.nombre}
                            </h4>
                            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#3f4949', fontWeight: 500 }}>
                              <span className="material-symbols-outlined text-[14px]">person</span>
                              {turno.cliente.nombre} {turno.cliente.apellido}
                            </p>
                            {turno.notas && (
                              <p className="text-xs mt-1 italic truncate" style={{ color: '#6f7979' }}>
                                "{turno.notas}"
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 ml-2">
                            <span className={clsx(
                              'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter',
                              turno.estado === 'SENIADO' ? 'bg-green-100 text-green-800' :
                              turno.estado === 'RESERVADO' ? 'bg-yellow-100 text-yellow-800' :
                              turno.estado === 'CONFIRMADO' ? 'bg-blue-100 text-blue-800' :
                              turno.estado === 'CANCELADO' ? 'bg-red-100 text-red-600' :
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

                    {/* Empty slot hover hint */}
                    {turnosEnHora.length === 0 && (
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => {
                          const fecha = new Date(diaSeleccionado);
                          fecha.setHours(hora, 0, 0, 0);
                          setModalFecha(fecha);
                          setModalOpen(true);
                        }}
                      >
                        <div className="flex items-center gap-1 opacity-30">
                          <span className="material-symbols-outlined text-lg">add_circle</span>
                          <span className="text-xs font-label">Crear turno</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FAB */}
      <button
        onClick={() => {
          setModalFecha(diaSeleccionado);
          setModalOpen(true);
        }}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center z-40 active:scale-90 transition-transform"
        style={{ background: `linear-gradient(135deg, var(--primary), var(--primary-container))`, color: 'var(--on-primary)' }}
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      <NuevoTurnoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        fechaInicial={modalFecha}
        onCreated={() => fetchTurnos()}
      />
    </div>
  );
}
