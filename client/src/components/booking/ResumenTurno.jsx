import { useBookingStore } from '../../store/bookingStore';
import { formatDateTime, formatTime } from '../../utils/fechas';

export default function ResumenTurno() {
  const {
    servicioSeleccionado,
    varianteSeleccionada,
    fechaSeleccionada,
    slotSeleccionado,
    datosCliente,
  } = useBookingStore();

  if (!servicioSeleccionado) return null;

  const precio = servicioSeleccionionado.precio + (varianteSeleccionada?.precioExtra || 0);
  const seña = servicioSeleccionado.montoSenia + (varianteSeleccionada?.precioExtra || 0);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-bold mb-3">Resumen del turno</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Servicio:</span>
          <span className="font-medium">
            {servicioSeleccionado.nombre}
            {varianteSeleccionada && ` - ${varianteSeleccionada.nombre}`}
          </span>
        </div>

        {slotSeleccionado && (
          <div className="flex justify-between">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-medium">{formatDateTime(slotSeleccionado.inicio)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">Duración:</span>
          <span className="font-medium">{servicioSeleccionado.duracionMinutos} min</span>
        </div>

        {datosCliente && (
          <div className="flex justify-between">
            <span className="text-gray-600">Cliente:</span>
            <span className="font-medium">
              {datosCliente.nombre} {datosCliente.apellido}
            </span>
          </div>
        )}

        <hr className="my-2" />

        <div className="flex justify-between">
          <span className="text-gray-600">Precio total:</span>
          <span className="font-bold">${precio}</span>
        </div>

        <div className="flex justify-between text-primary">
          <span className="font-medium">Seña a pagar:</span>
          <span className="font-bold text-lg">${seña}</span>
        </div>
      </div>
    </div>
  );
}
