import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import { useBookingStore } from '../../store/bookingStore';
import { useLanguage } from '../../store/languageContext';
import { useToast } from '../../store/toastContext';
import clsx from 'clsx';

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

export default function Step2Horario() {
  const { servicioSeleccionado, seleccionarSlot, goBack, tenantConfig } = useBookingStore();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const toast = useToast();

  const hoy = new Date();
  const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 });
  const dias = Array.from({ length: 14 }, (_, i) => addDays(inicioSemana, i));

  // Use horarios from tenantConfig in store (loaded once in BookingPage)
  const horarios = tenantConfig?.horarios || {};

  // Fetch slots when date changes
  useEffect(() => {
    if (fechaSeleccionada) {
      setLoading(true);
      setSlotSeleccionado(null);
      const year = fechaSeleccionada.getFullYear();
      const month = String(fechaSeleccionada.getMonth() + 1).padStart(2, '0');
      const day = String(fechaSeleccionada.getDate()).padStart(2, '0');
      const fechaStr = `${year}-${month}-${day}`;

      api.get('/disponibilidad', { params: { servicioId: servicioSeleccionado.id, fecha: fechaStr } })
        .then((r) => {
          setSlots(r.data);
          setLoading(false);
          if (r.data.length === 0) {
            toast.info('No hay horarios disponibles');
          }
        })
        .catch(() => {
          setSlots([]);
          setLoading(false);
        });
    }
  }, [fechaSeleccionada, servicioSeleccionado]);

  const handleConfirmar = () => {
    if (slotSeleccionado) {
      seleccionarSlot(fechaSeleccionada, slotSeleccionado);
    }
  };

  // Check if a day is a working day
  const esDiaLaboral = (dia) => {
    if (!horarios || Object.keys(horarios).length === 0) return true; // Default to working if config not loaded
    const nombreDia = DIAS_SEMANA[dia.getDay()];
    const config = horarios[nombreDia];
    if (!config) return true;
    return config.activo !== false;
  };

  // Get horario text for a day
  const getHorarioTexto = (dia) => {
    if (!horarios || Object.keys(horarios).length === 0) return null;
    const nombreDia = DIAS_SEMANA[dia.getDay()];
    const config = horarios[nombreDia];
    if (!config || config.activo === false || !config.apertura) return null;
    return `${config.apertura} - ${config.cierre}`;
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={goBack}
          className="text-sm font-medium mb-4 transition flex items-center gap-1 font-label"
          style={{ color: 'var(--primary)' }}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Cambiar servicio
        </button>
        <h2 className="text-2xl font-extrabold font-headline" style={{ color: 'var(--on-surface)' }}>{t('booking.choose_date')}</h2>
        <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(161, 239, 247, 0.2)' }}>
          <p className="font-bold font-headline" style={{ color: 'var(--primary)' }}>{servicioSeleccionado.nombre}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--on-surface-variant)' }}>
            {servicioSeleccionado.duracionMinutos} {t('general.min')} · ${servicioSeleccionado.precio?.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      {/* Dias y horarios de atención */}
      {horarios && Object.keys(horarios).length > 0 && (
        <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-lg" style={{ color: 'var(--primary)' }}>schedule</span>
            <h3 className="text-sm font-bold font-label" style={{ color: 'var(--on-surface)' }}>Días y horarios de atención</h3>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((nombre, i) => {
              const diaKey = DIAS_SEMANA[i];
              const config = horarios[diaKey];
              const activo = config && config.activo !== false && config.apertura;
              return (
                <div key={i} className="text-xs">
                  <p className="font-bold font-label" style={{ color: activo ? 'var(--on-surface)' : 'var(--on-surface-variant)', opacity: activo ? 1 : 0.4 }}>
                    {nombre}
                  </p>
                  {activo ? (
                    <p className="text-[10px] font-label" style={{ color: 'var(--on-surface-variant)' }}>
                      {config.apertura?.slice(0,5)}-{config.cierre?.slice(0,5)}
                    </p>
                  ) : (
                    <p className="text-[10px] text-red-400 font-label">Cerrado</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Date Picker - Solo días laborales */}
      <div className="mb-8">
        <h3 className="font-semibold mb-3 font-headline" style={{ color: 'var(--on-surface)' }}>{t('booking.choose_day')}</h3>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {dias.map((dia) => {
            const esLaboral = esDiaLaboral(dia);
            const disabled = !esLaboral || (isBefore(dia, hoy) && !isToday(dia));
            const selected = fechaSeleccionada && isSameDay(dia, fechaSeleccionada);
            const today = isToday(dia);
            const horarioTexto = getHorarioTexto(dia);

            return (
              <button
                key={dia.toISOString()}
                onClick={() => !disabled && setFechaSeleccionada(dia)}
                disabled={disabled}
                className={clsx(
                  'flex flex-col items-center min-w-[56px] py-3 rounded-2xl transition-all duration-200 relative',
                  disabled && 'opacity-30 cursor-not-allowed',
                  today && !selected && 'ring-2 ring-primary/20'
                )}
                style={{
                  backgroundColor: selected ? 'var(--primary)' : 'var(--surface-container-low)',
                  color: selected ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                  boxShadow: selected ? '0 8px 32px rgba(0,70,75,0.2)' : 'none',
                }}
              >
                <span className="text-xs font-semibold uppercase" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em' }}>
                  {format(dia, 'EEE', { locale: es }).slice(0, 3)}
                </span>
                <span className="leading-tight" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '18px' }}>
                  {format(dia, 'd')}
                </span>
                {horarioTexto && !selected && (
                  <span className="text-[9px] mt-0.5 font-label" style={{ color: 'var(--primary)', opacity: 0.7 }}>
                    {horarioTexto.split(' - ')[0]}
                  </span>
                )}
                {!esLaboral && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-red-500">close</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {fechaSeleccionada && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3 font-headline" style={{ color: 'var(--on-surface)' }}>
            Horarios — {format(fechaSeleccionada, "d 'de' MMMM", { locale: es })}
            {getHorarioTexto(fechaSeleccionada) && (
              <span className="text-sm font-normal ml-2" style={{ color: 'var(--on-surface-variant)' }}>
                ({getHorarioTexto(fechaSeleccionada)})
              </span>
            )}
          </h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">😔</div>
              <p style={{ color: 'var(--on-surface-variant)' }}>{t('booking.no_slots')}</p>
              <p className="text-sm" style={{ color: 'var(--on-surface-variant)', opacity: 0.6 }}>{t('booking.no_slots_subtitle')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {slots.map((slot, i) => {
                const slotDate = new Date(slot.inicio);
                const selected = slotSeleccionado?.inicio === slot.inicio;
                return (
                  <button
                    key={i}
                    onClick={() => setSlotSeleccionado(slot)}
                    className={clsx(
                      'py-3 rounded-xl text-center transition-all duration-200',
                      selected ? 'shadow-lg scale-105' : 'border hover:border-primary hover:text-primary'
                    )}
                    style={{
                      backgroundColor: selected ? 'var(--primary)' : 'var(--surface-container-lowest)',
                      color: selected ? 'var(--on-primary)' : 'var(--on-surface)',
                      borderColor: selected ? 'var(--primary)' : 'var(--outline-variant)',
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 700,
                      fontSize: '15px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {format(slotDate, 'HH:mm')}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirm Button */}
      {slotSeleccionado && (
        <button
          onClick={handleConfirmar}
          className="w-full py-4 rounded-xl font-bold text-lg font-headline shadow-lg active:scale-[0.98] transition-all duration-200"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }}
        >
          {t('booking.select_slot')} — {format(new Date(slotSeleccionado.inicio), 'HH:mm')}
        </button>
      )}
    </div>
  );
}
