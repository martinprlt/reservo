import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBookingStore } from '../../store/bookingStore';

export default function ResumenTurno() {
  const {
    servicioSeleccionado,
    varianteSeleccionada,
    slotSeleccionado,
    datosCliente,
  } = useBookingStore();

  if (!servicioSeleccionado) return null;

  const precioTotal = servicioSeleccionado.precio + (varianteSeleccionada?.precioExtra || 0);
  const seña = servicioSeleccionado.montoSenia + (varianteSeleccionada?.precioExtra || 0);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border">
      <h3 className="font-bold text-gray-800 mb-4">Resumen del turno</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Servicio</span>
          <span className="font-semibold text-gray-800">
            {servicioSeleccionado.nombre}
            {varianteSeleccionada && ` - ${varianteSeleccionada.nombre}`}
          </span>
        </div>

        {slotSeleccionado && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-500">Fecha</span>
              <span className="font-semibold text-gray-800">
                {format(new Date(slotSeleccionado.inicio), "EEEE d 'de' MMMM", { locale: es })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Hora</span>
              <span className="font-semibold text-gray-800">
                {format(new Date(slotSeleccionado.inicio), 'HH:mm')}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <span className="text-gray-500">Duración</span>
          <span className="font-medium text-gray-700">{servicioSeleccionado.duracionMinutos} min</span>
        </div>

        {datosCliente && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-500">Cliente</span>
              <span className="font-semibold text-gray-800">
                {datosCliente.nombre} {datosCliente.apellido}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Teléfono</span>
              <span className="font-medium text-gray-700">{datosCliente.telefono}</span>
            </div>
          </>
        )}

        <hr className="border-gray-200" />

        <div className="flex justify-between">
          <span className="text-gray-500">Precio total</span>
          <span className="font-bold text-gray-800">${precioTotal.toLocaleString('es-AR')}</span>
        </div>

        <div className="flex justify-between text-lg">
          <span className="font-bold text-primary">Seña a pagar</span>
          <span className="font-bold text-primary">${seña.toLocaleString('es-AR')}</span>
        </div>
      </div>
    </div>
  );
}
