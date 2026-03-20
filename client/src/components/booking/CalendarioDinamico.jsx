import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDisponibilidad } from '../../hooks/useDisponibilidad';
import clsx from 'clsx';

export default function CalendarioDinamico({ servicioId, onSelect }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);

  const semanaActual = startOfWeek(new Date(), { weekStartsOn: 1 });
  const dias = Array.from({ length: 7 }, (_, i) => addDays(semanaActual, i));

  const { slots, loading } = useDisponibilidad(servicioId, fechaSeleccionada);

  const handleDiaClick = (dia) => {
    setFechaSeleccionada(dia);
    setSlotSeleccionado(null);
  };

  const handleSlotClick = (slot) => {
    setSlotSeleccionado(slot);
  };

  const handleConfirmar = () => {
    if (slotSeleccionado) {
      onSelect(fechaSeleccionada, slotSeleccionado);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Elegí el día</h3>
        <div className="grid grid-cols-7 gap-2">
          {dias.map((dia) => (
            <button
              key={dia.toISOString()}
              onClick={() => handleDiaClick(dia)}
              className={clsx(
                'p-2 rounded-lg text-center transition',
                isSameDay(dia, new Date())
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200',
                fechaSeleccionada && isSameDay(dia, fechaSeleccionada)
                  ? 'ring-2 ring-primary'
                  : ''
              )}
            >
              <div className="text-xs">{format(dia, 'EEE', { locale: es })}</div>
              <div className="font-bold">{format(dia, 'd')}</div>
            </button>
          ))}
        </div>
      </div>

      {fechaSeleccionada && (
        <div>
          <h3 className="font-medium mb-3">
            Horarios disponibles — {format(fechaSeleccionada, "d 'de' MMMM", { locale: es })}
          </h3>
          {loading ? (
            <p className="text-gray-500">Cargando horarios...</p>
          ) : slots.length === 0 ? (
            <p className="text-gray-500">No hay horarios disponibles</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => handleSlotClick(slot)}
                  className={clsx(
                    'p-2 rounded border transition',
                    slotSeleccionado?.inicio === slot.inicio
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:border-primary'
                  )}
                >
                  {format(new Date(slot.inicio), 'HH:mm')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {slotSeleccionado && (
        <button
          onClick={handleConfirmar}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-secondary transition"
        >
          Confirmar {format(new Date(slotSeleccionado.inicio), 'HH:mm')}
        </button>
      )}
    </div>
  );
}
