import { useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';

export default function Step2Horario() {
  const { servicioSeleccionado, varianteSeleccionada, seleccionarSlot } = useBookingStore();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Elegí fecha y horario</h2>
      <p className="text-gray-600">
        {servicioSeleccionado.nombre}
        {varianteSeleccionada && ` - ${varianteSeleccionada.nombre}`}
      </p>
    </div>
  );
}
