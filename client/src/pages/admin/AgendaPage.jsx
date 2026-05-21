import { useEffect, useState, useRef } from 'react';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import TurnoDetailPage from './TurnoDetailPage';
import NuevoTurnoModal from '../../components/admin/NuevoTurnoModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../store/toastContext';
import { useLanguage } from '../../store/languageContext';

const RUBRO_COLORS = {
  uñas: { bg: 'rgba(0, 70, 75, 0.12)', border: '#00464b', text: '#004f54' },
  pelo: { bg: 'rgba(19, 58, 135, 0.12)', border: '#133a87', text: '#1f428f' },
  pestañas: { bg: 'rgba(74, 99, 99, 0.12)', border: '#4a6363', text: '#324b4b' },
  masajes: { bg: 'rgba(49, 82, 160, 0.12)', border: '#3152a0', text: '#1f428f' },
  general: { bg: 'rgba(0, 70, 75, 0.12)', border: '#00464b', text: '#004f54' },
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

  // Calculate week based on offset from today
  const hoy = new Date();
  const inicioSemana = addDays(startOfWeek(hoy, { weekStartsOn: 1 }), semanaOffset * 7);
  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));

  // Find today in current week
  const todayInWeek = diasSemana.find(d => isToday(d));

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
      // Fallback to default rubros if config fetch fails
      setRubros([
        { id: 'unas', nombre: 'Uñas', colorPrimario: '#00464b', colorSecundario: '#4a6363' },
        { id: 'pelo', nombre: 'Pelo', colorPrimario: '#133a87', colorSecundario: '#1f428f' },
        { id: 'pestanas', nombre: 'Pestañas', colorPrimario: '#4a6363', colorSecundario: '#324b4b' },
        { id: 'masajes', nombre: 'Masajes', colorPrimario: '#3152a0', colorSecundario: '#1f428f' },
        { id: 'general', nombre: 'General', colorPrimario: '#00464b', colorSecundario: '#004f54' }
      ]);
    } finally {
      setConfigLoading(false);
    }
  };

  const getRubroColor = (rubroId) => {
    if (!rubroId) return { bg: 'rgba(0, 70, 75, 0.12)', border: '#00464b', text: '#004f54' };
    const rubro = rubros.find(r => r.id === rubroId);
    if (rubro) {
      return {
        bg: `rgba(${parseInt(rubro.colorPrimario.slice(1,3),16)}, ${parseInt(rubro.colorPrimario.slice(3,5),16)}, ${parseInt(rubro.colorPrimario.slice(5,7),16)}, 0.12)`,
        border: rubro.colorPrimario,
        text: rubro.colorSecundario
      };
    }
    // Fallback to general
    return { bg: 'rgba(0, 70, 75, 0.12)', border: '#00464b', text: '#004f54' };
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

  const getRubroColor = (rubro) => RUBRO_COLORS[rubro] || RUBRO_COLORS.general;

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
      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[#3f4949] text-sm uppercase tracking-wider mb-1 font-label">
              Agenda
            </p>
            <h2 className="text-2xl font-extrabold font-headline" style={{ color: '#181c20' }}>
              {format(inicioSemana, "d", { locale: es })} — {format(addDays(inicioSemana, 6), "d MMM yyyy", { locale: es })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevWeek} className="p-2 rounded-xl hover:bg-[#f1f4fa] transition">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {semanaOffset !== 0 && (
              <button
                onClick={goToday}
                className="px-3 py-2 rounded-xl text-xs font-bold font-label"
                style={{ backgroundColor: '#00464b', color: '#ffffff' }}
              >
                Hoy
              </button>
            )}
            <button onClick={nextWeek} className="p-2 rounded-xl hover:bg-[#f1f4fa] transition">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <button
              onClick={() => {
                setModalFecha(diaSeleccionado);
                setModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl font-semibold shadow-lg flex items-center gap-2 transition-transform active:scale-95 ml-2"
              style={{ background: 'linear-gradient(135deg, #00464b, #006066)', color: '#ffffff' }}
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="hidden sm:inline">Nuevo turno</span>
            </button>
          </div>
        </div>

        {/* Date Picker */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
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
                  backgroundColor: selected ? '#00464b' : '#f1f4fa',
                  color: selected ? '#ffffff' : '#3f4949',
                  boxShadow: selected ? '0 4px 16px rgba(0, 70, 75, 0.2)' : 'none',
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
                    style={{ backgroundColor: today && !selected ? '#22c55e' : '#133a87', color: 'white' }}
                  >
                    {turnosCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="relative">
        <h3 className="font-semibold font-headline mb-3" style={{ color: '#181c20' }}>
          {format(diaSeleccionado, "EEEE d 'de' MMMM", { locale: es })}
          {isToday(diaSeleccionado) && <span className="ml-2 text-xs text-green-600 font-label">(Hoy)</span>}
        </h3>

        {/* Current Time Indicator - only for today */}
        {isToday(diaSeleccionado) && (
          <div
            className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
            style={{ top: `${32 + ((currentTimeMinutes - 8 * 60) / 60) * 100}px` }}
          >
            <div className="w-14 text-[10px] font-bold pr-2 text-right" style={{ color: '#ba1a1a' }}>
              {format(currentTime, 'HH:mm')}
            </div>
            <div className="flex-1 relative" style={{ height: '2px', backgroundColor: 'rgba(186, 26, 26, 0.4)' }}>
              <div
                className="absolute w-2.5 h-2.5 rounded-full border-2"
                style={{ backgroundColor: '#ba1a1a', borderColor: '#f7f9ff', left: '-4px', top: '-4px' }}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#00464b' }}></div>
          </div>
        ) : (
          <div className="flex flex-col">
            {horas.map((hora) => {
              const turnosEnHora = getTurnosDiaHora(diaSeleccionado, hora);

              return (
                <div key={hora} className="flex min-h-[100px] group">
                  {/* Time label */}
                  <div className="w-14 pt-2 pr-4 text-right shrink-0">
                    <span className="text-xs font-semibold font-label" style={{ color: '#3f4949', opacity: 0.6 }}>
                      {String(hora).padStart(2, '0')}:00
                    </span>
                  </div>

                  {/* Slot area */}
                  <div
                    className="flex-1 border-t relative group"
                    style={{ borderColor: 'rgba(190, 200, 201, 0.2)' }}
                  >
                    {turnosEnHora.map((turno) => {
                      const rubroColor = getRubroColor(turno.servicio?.rubro);
                      return (
                        <div
                          key={turno.id}
                          onClick={() => setSelectedTurnoId(turno.id)}
                          className="absolute top-1 left-1 right-3 bottom-1 p-3 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4"
                          style={{
                            backgroundColor: rubroColor.bg,
                            borderLeftColor: rubroColor.border,
                          }}
                        >
                          <div className="flex justify-between items-start h-full">
                            <div className="flex-1 min-w-0">
                              <h4
                                className="text-sm font-bold leading-tight"
                                style={{ color: '#181c20', fontFamily: "'Manrope', sans-serif" }}
                              >
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
                              {turno.notas?.includes('domicilio') && (
                                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-[#00464b] bg-[rgba(0,70,75,0.1)] px-1.5 py-0.5 rounded">
                                  <span className="material-symbols-outlined text-[12px]">home</span>
                                  A domicilio
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter"
                                style={{
                                  backgroundColor: rubroColor.bg,
                                  color: rubroColor.text,
                                }}
                              >
                                {turno.servicio.rubro || 'Servicio'}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                turno.estado === 'SENIADO' ? 'bg-green-100 text-green-800' :
                                turno.estado === 'RESERVADO' ? 'bg-yellow-100 text-yellow-800' :
                                turno.estado === 'CONFIRMADO' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {turno.estado}
                              </span>
                              <button
                                onClick={(e) => handleDeleteTurno(turno.id, e)}
                                className="p-1 rounded-full hover:bg-red-100 transition text-red-400 hover:text-red-600"
                                title="Cancelar"
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
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => {
                          const fecha = new Date(diaSeleccionado);
                          fecha.setHours(hora, 0, 0, 0);
                          setModalFecha(fecha);
                          setModalOpen(true);
                        }}
                      >
                        <div className="flex items-center gap-2" style={{ color: 'rgba(0, 70, 75, 0.3)' }}>
                          <span className="material-symbols-outlined">add_circle</span>
                          <span className="text-xs font-semibold font-label">Crear turno</span>
                        </div>
                      </div>
                    )}

                    {/* Lunch break */}
                    {hora === 12 && turnosEnHora.length === 0 && (
                      <div className="flex items-center gap-2 mt-4 ml-4 opacity-30">
                        <span className="material-symbols-outlined text-sm">restaurant</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Almuerzo</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {turnos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-[#6f7979] mb-2">No hay turnos esta semana</p>
                <button
                  onClick={() => {
                    setModalFecha(diaSeleccionado);
                    setModalOpen(true);
                  }}
                  className="text-[#00464b] font-medium text-sm hover:underline"
                >
                  Crear el primero →
                </button>
              </div>
            )}
          </div>
        )}
      </section>

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
