import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import TurnoDetailPage from './TurnoDetailPage';
import NuevoTurnoModal from '../../components/admin/NuevoTurnoModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../store/toastContext';
import { useLanguage } from '../../store/languageContext';

const RUBRO_COLORS = {
  uñas: { bg: 'rgba(70, 72, 212, 0.08)', border: '#4648d4', text: '#4648d4' },
  pelo: { bg: 'rgba(81, 72, 215, 0.08)', border: '#5148d7', text: '#5148d7' },
  pestañas: { bg: 'rgba(90, 72, 210, 0.08)', border: '#5a48d2', text: '#5a48d2' },
  masajes: { bg: 'rgba(106, 99, 242, 0.08)', border: '#6a63f2', text: '#6a63f2' },
  general: { bg: 'rgba(70, 72, 212, 0.08)', border: '#4648d4', text: '#4648d4' },
};

export default function AgendaPage() {
  const [turnos, setTurnos] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configLoading, setConfigLoading] = useState(true);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());
  const [selectedTurnoId, setSelectedTurnoId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFecha, setModalFecha] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [turnoToDelete, setTurnoToDelete] = useState(null);
  const toast = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const hoy = new Date();
  const inicioSemana = addDays(startOfWeek(hoy, { weekStartsOn: 1 }), semanaOffset * 7);
  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));

  const fetchTurnos = async () => {
    setLoading(true);
    try {
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

  const fetchConfig = async () => {
    setConfigLoading(true);
    try {
      const { data } = await api.get('/admin/config');
      if (data.rubros && Array.isArray(data.rubros)) {
        setRubros(data.rubros);
      }
    } catch (err) {
      console.error('Error fetching config:', err);
    } finally {
      setConfigLoading(false);
    }
  };

  const getRubroColor = (rubroId) => {
    if (!rubroId) return RUBRO_COLORS.general;
    const rubro = rubros.find(r => r.id === rubroId);
    if (rubro) {
      return {
        bg: `rgba(${parseInt(rubro.colorPrimario.slice(1,3),16)}, ${parseInt(rubro.colorPrimario.slice(3,5),16)}, ${parseInt(rubro.colorPrimario.slice(5,7),16)}, 0.08)`,
        border: rubro.colorPrimario,
        text: rubro.colorSecundario
      };
    }
    return RUBRO_COLORS.general;
  };

  useEffect(() => {
    fetchTurnos();
    fetchConfig();
  }, [semanaOffset]);

  const horas = Array.from({ length: 12 }, (_, i) => i + 8);
  const currentTimeMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const prevWeek = () => setSemanaOffset(o => o - 1);
  const nextWeek = () => setSemanaOffset(o => o + 1);
  const goToday = () => {
    setSemanaOffset(0);
    setDiaSeleccionado(new Date());
  };

  const handleDeleteTurno = async (turnoId, e) => {
    e.stopPropagation();
    setTurnoToDelete(turnoId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!turnoToDelete) return;
    try {
      await api.delete(`/admin/turnos/${turnoToDelete}`);
      toast.success('Turno cancelado');
      fetchTurnos();
    } catch {
      toast.error('Error al cancelar');
    } finally {
      setTurnoToDelete(null);
    }
  };

  const getTurnosDiaHora = (dia, hora) => {
    return turnos.filter((t) => {
      const fechaTurno = new Date(t.fechaHora);
      return fechaTurno.toDateString() === dia.toDateString() && fechaTurno.getHours() === hora;
    });
  };

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
    <main className="pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-headline text-headline-xl text-on-surface mb-2">
            {format(inicioSemana, "d", { locale: es })} — {format(addDays(inicioSemana, 6), "d MMM yyyy", { locale: es })}
          </h2>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">event</span>
              <span className="font-label text-label-caps uppercase tracking-wider">Agenda Semanal</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              <span className="font-label text-label-caps uppercase tracking-wider">{turnos.length} Turnos</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevWeek} className="p-2 rounded-xl hover:bg-surface-container-high transition">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {semanaOffset !== 0 && (
            <button
              onClick={goToday}
              className="px-3 py-2 rounded-xl text-xs font-bold font-label bg-primary text-on-primary"
            >
              Hoy
            </button>
          )}
          <button onClick={nextWeek} className="p-2 rounded-xl hover:bg-surface-container-high transition">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <button
            onClick={() => {
              setModalFecha(diaSeleccionado);
              setModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label text-label-caps uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group ml-2"
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
            <span className="hidden sm:inline">Nuevo Turno</span>
          </button>
          <a
            href={`/api/admin/export/turnos?desde=${inicioSemana.toISOString()}&hasta=${addDays(inicioSemana, 6).toISOString()}`}
            className="flex items-center justify-center gap-2 bg-surface-container-high text-primary px-4 py-3 rounded-xl font-label text-label-caps uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-all ml-2"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span className="hidden sm:inline">CSV</span>
          </a>
        </div>
      </div>

      {/* Date Picker */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-8">
        {diasSemana.map((dia) => {
          const selected = isSameDay(dia, diaSeleccionado);
          const today = isToday(dia);
          const turnosCount = getTurnosDelDia(dia).length;

          return (
            <button
              key={dia.toISOString()}
              onClick={() => setDiaSeleccionado(dia)}
              className="flex flex-col items-center min-w-[56px] py-3 px-2 rounded-2xl transition-all cursor-pointer relative"
              style={{
                backgroundColor: selected ? '#4648d4' : '#efebff',
                color: selected ? '#ffffff' : '#464554',
                boxShadow: selected ? '0 4px 16px rgba(70, 72, 212, 0.2)' : 'none',
              }}
            >
              <span className="text-[10px] font-semibold font-label uppercase">
                {format(dia, 'EEE', { locale: es }).slice(0, 3)}
              </span>
              <span className="text-lg font-bold font-headline leading-tight">
                {format(dia, 'd')}
              </span>
              {turnosCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: today && !selected ? '#6a63f2' : '#4648d4', color: 'white' }}
                >
                  {turnosCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="glass-card rounded-3xl overflow-hidden relative slot-mesh">
        {/* Timeline Header */}
        <div className="flex border-b border-outline-variant/10 bg-white/50 p-6">
          <div className="w-20 text-outline font-label text-label-caps">HORA</div>
          <div className="flex-1 text-on-surface font-semibold px-4 border-l border-outline-variant/10">
            {format(diaSeleccionado, "EEEE d 'de' MMMM", { locale: es })}
            {isToday(diaSeleccionado) && <span className="ml-2 text-xs text-tertiary font-label">(Hoy)</span>}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="max-h-[800px] overflow-y-auto">
            {horas.map((hora) => {
              const turnosEnHora = getTurnosDiaHora(diaSeleccionado, hora);

              return (
                <div key={hora} className="flex min-h-[100px] group border-b border-outline-variant/5">
                  {/* Time label */}
                  <div className="w-20 p-6 flex flex-col items-end shrink-0">
                    <span className="text-sm font-bold text-on-surface">{String(hora).padStart(2, '0')}:00</span>
                    <span className="text-[10px] text-outline">ART</span>
                  </div>

                  {/* Slot area */}
                  <div className="flex-1 p-3 border-l border-outline-variant/10 relative">
                    {/* Current time indicator */}
                    {isToday(diaSeleccionado) && hora === currentTime.getHours() && (
                      <div
                        className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                        style={{ top: `${(currentTimeMinutes % 60) * (100 / 60)}%` }}
                      >
                        <div className="w-14 text-[10px] font-bold pr-2 text-right text-error">
                          {format(currentTime, 'HH:mm')}
                        </div>
                        <div className="flex-1 relative" style={{ height: '2px', backgroundColor: 'rgba(186, 26, 26, 0.4)' }}>
                          <div
                            className="absolute w-2.5 h-2.5 rounded-full border-2"
                            style={{ backgroundColor: '#ba1a1a', borderColor: '#fcf8ff', left: '-4px', top: '-4px' }}
                          />
                        </div>
                      </div>
                    )}

                    {turnosEnHora.map((turno) => {
                      const rubroColor = getRubroColor(turno.servicio?.rubro);
                      return (
                        <div
                          key={turno.id}
                          onClick={() => setSelectedTurnoId(turno.id)}
                          className="mb-2 p-4 rounded-xl border-l-4 cursor-pointer transition-all hover:shadow-md"
                          style={{
                            backgroundColor: rubroColor.bg,
                            borderLeftColor: rubroColor.border,
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold mb-1" style={{ color: rubroColor.text }}>
                                {turno.servicio.nombre}
                              </h4>
                              <p className="text-sm text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">person</span>
                                {turno.cliente.nombre} {turno.cliente.apellido}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter"
                                style={{ backgroundColor: `${rubroColor.border}15`, color: rubroColor.text }}
                              >
                                {turno.estado}
                              </span>
                              <button
                                onClick={(e) => handleDeleteTurno(turno.id, e)}
                                className="p-1 hover:bg-error/10 rounded-full text-error/60 hover:text-error"
                              >
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Empty slot hover */}
                    {turnosEnHora.length === 0 && (
                      <div
                        className="absolute inset-2 border-2 border-dashed border-outline-variant/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          const fecha = new Date(diaSeleccionado);
                          fecha.setHours(hora, 0, 0, 0);
                          setModalFecha(fecha);
                          setModalOpen(true);
                        }}
                      >
                        <span className="material-symbols-outlined text-outline">add_circle</span>
                      </div>
                    )}

                    {/* Lunch break */}
                    {hora === 12 && turnosEnHora.length === 0 && (
                      <div className="h-full rounded-xl flex items-center px-4 bg-surface-container/30 border border-outline-variant/10 text-on-surface-variant italic text-sm">
                        <span className="material-symbols-outlined text-[18px] mr-2">restaurant</span>
                        Almuerzo
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {turnos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-on-surface-variant mb-2">No hay turnos esta semana</p>
                <button
                  onClick={() => {
                    setModalFecha(diaSeleccionado);
                    setModalOpen(true);
                  }}
                  className="text-primary font-medium text-sm hover:underline"
                >
                  Crear el primero →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <NuevoTurnoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        fechaInicial={modalFecha}
        onCreated={() => fetchTurnos()}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Cancelar turno"
        message="¿Cancelar este turno? Se notificará al cliente."
        confirmText="Cancelar turno"
        variant="warning"
      />
    </main>
  );
}
