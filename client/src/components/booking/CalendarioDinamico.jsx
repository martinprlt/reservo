import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import { useBookingStore } from '../../store/bookingStore';
import clsx from 'clsx';

export default function CalendarioDinamico({ servicioId, onSelect }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const hoy = new Date();
  const semanaActual = startOfWeek(hoy, { weekStartsOn: 1 });
  const dias = Array.from({ length: 14 }, (_, i) => addDays(semanaActual, i));

  useEffect(() => {
    if (fechaSeleccionada) {
      setLoading(true);
      setSlotSeleccionado(null);
      
      const year = fechaSeleccionada.getFullYear();
      const month = String(fechaSeleccionada.getMonth() + 1).padStart(2, '0');
      const day = String(fechaSeleccionada.getDate()).padStart(2, '0');
      const fechaStr = `${year}-${month}-${day}`;
      
      api.get('/disponibilidad', { params: { servicioId, fecha: fechaStr } })
        .then((r) => {
          setSlots(r.data);
          setLoading(false);
        })
        .catch(() => {
          setSlots([]);
          setLoading(false);
        });
    }
  }, [fechaSeleccionada, servicioId]);

  const handleDiaClick = (dia) => {
    if (isBefore(dia, hoy) && !isToday(dia)) return;
    setFechaSeleccionada(dia);
  };

  const handleConfirmar = () => {
    if (slotSeleccionado) {
      onSelect(new Date(slotSeleccionado.inicio), slotSeleccionado);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Elegí el día</h3>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {dias.map((dia) => {
            const disabled = isBefore(dia, hoy) && !isToday(dia);
            return (
              <button
                key={dia.toISOString()}
                onClick={() => handleDiaClick(dia)}
                disabled={disabled}
                className={clsx(
                  'py-2 px-1 rounded-xl text-center transition-all',
                  disabled && 'opacity-40 cursor-not-allowed',
                  isSameDay(dia, fechaSeleccionada) && 'bg-primary text-white shadow-lg shadow-primary/30 scale-105',
                  isToday(dia) && !isSameDay(dia, fechaSeleccionada) && 'bg-primary/10 text-primary font-medium',
                  !isSameDay(dia, fechaSeleccionada) && !disabled && 'bg-white border border-gray-200 hover:border-primary/50 hover:shadow-sm'
                )}
              >
                <div className="text-xs font-medium">{format(dia, 'EEE', { locale: es })}</div>
                <div className="text-lg font-bold leading-tight">{format(dia, 'd')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {fechaSeleccionada && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">
            Horarios — {format(fechaSeleccionada, "d 'de' MMMM", { locale: es })}
          </h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">😔</div>
              <p className="text-gray-500">No hay horarios disponibles</p>
              <p className="text-gray-400 text-sm">Probá con otro día</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map((slot, i) => {
                const slotDate = new Date(slot.inicio);
                return (
                  <button
                    key={i}
                    onClick={() => setSlotSeleccionado(slot)}
                    className={clsx(
                      'py-3 rounded-lg text-center font-medium transition-all',
                      slotSeleccionado?.inicio === slot.inicio
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                    )}
                  >
                    {format(slotDate, 'HH:mm')}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {slotSeleccionado && (
        <button
          onClick={handleConfirmar}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-secondary transition-all shadow-lg shadow-primary/30 hover:shadow-xl"
        >
          Confirmar — {format(new Date(slotSeleccionado.inicio), 'HH:mm')}
        </button>
      )}
    </div>
  );
}
