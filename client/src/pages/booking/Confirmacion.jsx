import { useEffect } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import api from '../../api/client';
import Button from '../../components/ui/Button';
import { Badge, estadoVariant } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/fechas';

export default function Confirmacion() {
  const { turnoId, initPoint, reset, error, setError } = useBookingStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const returnedTurnoId = params.get('turnoId');

    if (status === 'success' && returnedTurnoId) {
      api.get(`/turnos/${returnedTurnoId}/estado`)
        .then((r) => {
          console.log('Turno confirmado:', r.data);
        })
        .catch(() => {});
    }
  }, []);

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Hubo un problema</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={reset}>Volver al inicio</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center p-8">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold mb-4">¡Turno reservado!</h2>
      <p className="text-gray-600 mb-6">
        Te enviamos un WhatsApp con la confirmación. Recordá llegar a horario.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500">Vas a ser redirigido al pago...</p>
      </div>

      <Button variant="secondary" onClick={reset}>
        Volver al inicio
      </Button>
    </div>
  );
}
