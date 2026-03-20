import { Badge, estadoVariant } from '../ui/Badge';
import { formatDateTime } from '../../utils/fechas';

export default function TurnoCard({ turno, onEstadoChange }) {
  const estados = ['RESERVADO', 'SENIADO', 'CONFIRMADO', 'COMPLETADO', 'CANCELADO'];

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold">{turno.cliente.nombre} {turno.cliente.apellido}</h4>
          <p className="text-sm text-gray-600">{turno.servicio.nombre}</p>
        </div>
        <Badge variant={estadoVariant(turno.estado)}>{turno.estado}</Badge>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        {formatDateTime(turno.fechaHora)} · {turno.duracion} min
      </p>

      {onEstadoChange && (
        <select
          value={turno.estado}
          onChange={(e) => onEstadoChange(turno.id, e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          {estados.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}
    </div>
  );
}
