import { useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBookingStore } from '../../store/bookingStore';
import api from '../../api/client';

export default function Confirmacion() {
  const { initPoint, reset, servicioSeleccionado, slotSeleccionado, turnoId, error } = useBookingStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const returnedTurnoId = params.get('turnoId');
    if (status === 'success' && returnedTurnoId) {
      api.get(`/turnos/${returnedTurnoId}/estado`)
        .then((r) => console.log('Turno confirmado:', r.data))
        .catch(() => {});
    }
  }, []);

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-on-surface font-headline mb-3">Hubo un problema</h2>
        <p className="text-on-surface-variant mb-6 font-body">{error}</p>
        <button
          onClick={reset}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-container transition"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  if (initPoint && !turnoId) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-on-surface font-headline mb-3">Redirigiendo al pago...</h2>
        <p className="text-on-surface-variant mb-6 font-body">
          Estás siendo redirigido a MercadoPago para completar el pago.
        </p>
        <button
          onClick={reset}
          className="bg-surface-container-low text-on-surface-variant px-6 py-3 rounded-xl font-semibold hover:bg-surface-container transition"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center py-16">
      {/* Success icon - Stitch style */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <span className="material-symbols-outlined text-4xl text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
      </div>

      <h2 className="text-2xl font-extrabold text-on-surface font-headline mb-3">¡Turno reservado!</h2>
      <p className="text-on-surface-variant mb-6 font-body">
        Te enviamos un WhatsApp con la confirmación. Recordá llegar a horario.
      </p>

      {servicioSeleccionado && slotSeleccionado && (
        <div className="bg-gradient-to-br from-primary-fixed/20 to-primary-container/10 rounded-xl p-5 mb-8 text-left border border-primary/10 shadow-card">
          <p className="font-bold text-lg text-on-surface font-headline">{servicioSeleccionado.nombre}</p>
          <p className="text-on-surface-variant mt-1 font-body">
            {format(new Date(slotSeleccionado.inicio), "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })}
          </p>
        </div>
      )}

      <button
        onClick={reset}
        className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3.5 rounded-xl font-semibold font-headline shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200"
      >
        Agendar otro turno
      </button>
    </div>
  );
}
