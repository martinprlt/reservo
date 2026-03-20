import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import TurnoCard from './TurnoCard';
import clsx from 'clsx';

export default function AgendaSemanal({ turnos, semanaActual, onSemanaChange, onTurnoChange }) {
  const inicioSemana = startOfWeek(semanaActual, { weekStartsOn: 1 });
  const dias = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));

  const prevWeek = () => {
    const nueva = new Date(inicioSemana);
    nueva.setDate(nueva.getDate() - 7);
    onSemanaChange(nueva);
  };

  const nextWeek = () => {
    const nueva = new Date(inicioSemana);
    nueva.setDate(nueva.getDate() + 7);
    onSemanaChange(nueva);
  };

  const getTurnosDelDia = (dia) => {
    return turnos.filter((t) => {
      const fechaTurno = new Date(t.fechaHora);
      return fechaTurno.toDateString() === dia.toDateString();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={prevWeek} className="p-2 hover:bg-gray-100 rounded">
          ←
        </button>
        <h3 className="font-bold">
          {format(inicioSemana, "d MMM", { locale: es })} - {format(addDays(inicioSemana, 6), "d MMM yyyy", { locale: es })}
        </h3>
        <button onClick={nextWeek} className="p-2 hover:bg-gray-100 rounded">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dias.map((dia) => {
          const turnosDelDia = getTurnosDelDia(dia);
          const esHoy = dia.toDateString() === new Date().toDateString();

          return (
            <div
              key={dia.toISOString()}
              className={clsx(
                'border rounded-lg p-2 min-h-[200px]',
                esHoy ? 'border-primary bg-primary/5' : ''
              )}
            >
              <div className={clsx('text-center mb-2', esHoy ? 'text-primary font-bold' : '')}>
                <div className="text-xs">{format(dia, 'EEE', { locale: es })}</div>
                <div className="text-lg">{format(dia, 'd')}</div>
              </div>

              <div className="space-y-2">
                {turnosDelDia.map((turno) => (
                  <div key={turno.id} className="bg-white border rounded p-2 text-xs">
                    <div className="font-medium">{format(new Date(turno.fechaHora), 'HH:mm')}</div>
                    <div className="truncate">{turno.cliente.nombre}</div>
                    <div className="truncate text-gray-500">{turno.servicio.nombre}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
