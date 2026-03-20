import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import { useBookingStore } from '../../store/bookingStore';
import { useLanguage } from '../../store/languageContext';
import { useToast } from '../../store/toastContext';
import clsx from 'clsx';

export default function Step2Horario() {
  const { servicioSeleccionado, seleccionarSlot, goBack } = useBookingStore();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const toast = useToast();

  const hoy = new Date();
  const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 });
  const dias = Array.from({ length: 14 }, (_, i) => addDays(inicioSemana, i));

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
            toast.info('No hay horarios disponibles para este día');
          }
        })
        .catch(() => {
          setSlots([]);
          setLoading(false);
          toast.error('Error al cargar horarios');
        });
    }
  }, [fechaSeleccionada, servicioSeleccionado]);

  const handleConfirmar = () => {
    if (slotSeleccionado) {
      seleccionarSlot(fechaSeleccionada, slotSeleccionado);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={goBack}
          className="text-primary hover:text-primary-container text-sm font-medium mb-4 transition flex items-center gap-1 font-label"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Cambiar servicio
        </button>
        <h2 className="text-2xl font-extrabold font-headline text-on-surface">{t('booking.choose_date')}</h2>
        <div className="mt-3 bg-primary-fixed/20 rounded-xl px-4 py-3 inline-block">
          <p className="text-primary font-bold font-headline">{servicioSeleccionado.nombre}</p>
          <p className="text-sm text-on-surface-variant font-body">
            {servicioSeleccionado.duracionMinutos} {t('general.min')} · ${servicioSeleccionado.precio?.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      {/* Date Picker */}
      <div className="mb-8">
        <h3 className="font-semibold text-on-surface mb-3 font-headline">{t('booking.choose_day')}</h3>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {dias.map((dia) => {
            const disabled = isBefore(dia, hoy) && !isToday(dia);
            const selected = fechaSeleccionada && isSameDay(dia, fechaSeleccionada);
            const today = isToday(dia);

            return (
              <button
                key={dia.toISOString()}
                onClick={() => !disabled && setFechaSeleccionada(dia)}
                disabled={disabled}
                className={clsx(
                  'flex flex-col items-center min-w-[56px] py-3 rounded-2xl transition-all duration-200',
                  disabled && 'opacity-40 cursor-not-allowed',
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {fechaSeleccionada && (
        <div className="mb-8">
          <h3 className="font-semibold text-on-surface mb-3 font-headline">
            Horarios — {format(fechaSeleccionada, "d 'de' MMMM", { locale: es })}
          </h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">😔</div>
              <p className="text-on-surface-variant font-body">{t('booking.no_slots')}</p>
              <p className="text-on-surface-variant/60 text-sm font-body">{t('booking.no_slots_subtitle')}</p>
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
                      selected
                        ? 'shadow-lg scale-105'
                        : 'border hover:border-primary hover:text-primary'
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
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg font-headline shadow-lg shadow-primary/20 hover:shadow-xl active:scale-[0.98] transition-all duration-200"
        >
          {t('booking.select_slot')} — {format(new Date(slotSeleccionado.inicio), 'HH:mm')}
        </button>
      )}
    </div>
  );
}
