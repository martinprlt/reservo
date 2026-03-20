import { useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import api from '../../api/client';
import Button from '../../components/ui/Button';
import ResumenTurno from '../../components/booking/ResumenTurno';

export default function Step4Pago() {
  const { servicioSeleccionado, varianteSeleccionada, fechaSeleccionada, slotSeleccionado, datosCliente, setTurno, setError, error } = useBookingStore();
  const [loading, setLoading] = useState(false);

  const handlePagar = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/turnos', {
        servicioId: servicioSeleccionado.id,
        varianteId: varianteSeleccionada?.id,
        fechaHora: slotSeleccionado.inicio,
        nombre: datosCliente.nombre,
        apellido: datosCliente.apellido,
        telefono: datosCliente.telefono,
      });

      setTurno(data.turnoId, data.initPoint);
    } catch (err) {
      const code = err.response?.data?.error;
      if (code === 'SLOT_NO_DISPONIBLE') {
        setError('El horario ya no está disponible. Elegí otro.');
      } else {
        setError('Ocurrió un error. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Confirmar y pagar seña</h2>

      <ResumenTurno />

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        onClick={handlePagar}
        disabled={loading}
        className="w-full py-3 text-lg"
      >
        {loading ? 'Procesando...' : 'Pagar seña'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Al pagar aceptás los términos y condiciones del servicio.
      </p>
    </div>
  );
}
