import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBookingStore } from '../../store/bookingStore';
import { useLanguage } from '../../store/languageContext';
import { useToast } from '../../store/toastContext';
import api from '../../api/client';

const SLOT_HOLD_MINUTES = 15;

export default function Step5Pago() {
  const { servicioSeleccionado, varianteSeleccionada, slotSeleccionado, datosCliente, notas, fotoFile, aDomicilio, setTurno, setError, error, goBack, reset, incentivosActivos } = useBookingStore();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(SLOT_HOLD_MINUTES * 60);
  const countdownRef = useRef(null);
  const { t } = useLanguage();
  const toast = useToast();

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, []);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const isUrgent = countdown <= 180;

  const precioTotal = (servicioSeleccionado?.precio || 0) + (varianteSeleccionada?.precioExtra || 0);
  const seña = (servicioSeleccionado?.montoSenia || 0) + (varianteSeleccionada?.precioExtra || 0);

  const handlePagar = async () => {
    setLoading(true);
    setError(null);
    try {
      let fotoUrl = null;
      let fotoPublicId = null;

      if (fotoFile) {
        const formData = new FormData();
        formData.append('file', fotoFile);
        const { data: uploadData } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        fotoUrl = uploadData.url;
        fotoPublicId = uploadData.publicId;
      }

      const notasFinales = [notas, aDomicilio ? '(A domicilio)' : ''].filter(Boolean).join(' ');
      const { data } = await api.post('/turnos', {
        servicioId: servicioSeleccionado.id,
        varianteId: varianteSeleccionada?.id,
        fechaHora: slotSeleccionado.inicio,
        nombre: datosCliente.nombre,
        apellido: datosCliente.apellido,
        telefono: datosCliente.telefono,
        notas: notasFinales,
        ...(fotoUrl && { fotoUrl, fotoPublicId }),
      });
      
      clearInterval(countdownRef.current);
      
      if (data.initPoint) {
        toast.success('Turno creado. Redirigiendo al pago...');
      } else {
        toast.success('¡Turno reservado!');
      }
      
      setTurno(data.turnoId, data.initPoint);
    } catch (err) {
      const code = err.response?.data?.error;
      if (code === 'SLOT_NO_DISPONIBLE') {
        setError('El horario ya no está disponible.');
        toast.error('El horario ya no está disponible');
        goBack();
      } else {
        const msg = err.response?.data?.error || 'Ocurrió un error.';
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (countdown <= 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-5xl mb-4">⏰</div>
        <h2 className="text-2xl font-bold text-on-surface font-headline mb-3">Tiempo expirado</h2>
        <p className="text-on-surface-variant mb-6 font-body">
          El horario reservado se liberó porque no se completó el pago a tiempo. Elegí otro horario para continuar.
        </p>
        <button
          onClick={reset}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-container transition"
        >
          Elegir otro horario
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="mb-4">
        <button
          onClick={goBack}
          className="text-primary hover:text-primary-container text-sm font-medium mb-4 transition flex items-center gap-1 font-label"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver
        </button>
      </div>

      <h2 className="text-2xl font-extrabold font-headline text-on-surface">{t('booking.confirm')}</h2>

      {/* Slot hold countdown */}
      <div className={`rounded-xl p-3 flex items-center gap-3 border ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
        <span className={`material-symbols-outlined text-2xl ${isUrgent ? 'text-red-500' : 'text-amber-600'}`}>timer</span>
        <div>
          <p className={`text-sm font-semibold ${isUrgent ? 'text-red-700' : 'text-amber-800'}`}>
            {t('booking.slot_held')} {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </p>
          <p className={`text-xs ${isUrgent ? 'text-red-500' : 'text-amber-600'}`}>
            {t('booking.slot_expires')}
          </p>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-xl p-6 shadow-card border border-outline-variant/10">
        <h3 className="font-bold text-on-surface mb-4 font-headline">{t('booking.summary')}</h3>

        <div className="space-y-3 text-sm font-body">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">{t('booking.service')}</span>
            <span className="font-semibold text-on-surface">{servicioSeleccionado.nombre}</span>
          </div>

          {slotSeleccionado && (
            <>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{t('booking.date')}</span>
                <span className="font-semibold text-on-surface">
                  {format(new Date(slotSeleccionado.inicio), "d 'de' MMMM", { locale: es })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{t('booking.time')}</span>
                <span className="font-semibold text-on-surface">
                  {format(new Date(slotSeleccionado.inicio), 'HH:mm')}
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between">
            <span className="text-on-surface-variant">{t('booking.duration')}</span>
            <span className="font-medium text-on-surface">{servicioSeleccionado.duracionMinutos} {t('general.min')}</span>
          </div>

          {datosCliente && (
            <>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{t('booking.client')}</span>
                <span className="font-semibold text-on-surface">
                  {datosCliente.nombre} {datosCliente.apellido}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{t('booking.phone')}</span>
                <span className="font-medium text-on-surface">{datosCliente.telefono}</span>
              </div>
            </>
          )}

          <hr className="border-outline-variant/20" />

          <div className="flex justify-between">
            <span className="text-on-surface-variant">{t('booking.total_price')}</span>
            <span className="font-bold text-on-surface">${precioTotal.toLocaleString('es-AR')}</span>
          </div>

           <div className="flex justify-between text-lg">
             <span className="font-bold text-primary font-headline">{t('booking.deposit_amount')}</span>
             <span className="font-bold text-primary">${seña.toLocaleString('es-AR')}</span>
           </div>

           {incentivosActivos && (
             <div className="flex justify-between mt-3 text-sm font-body">
               <span className="text-on-surface-variant">{t('booking.points_earned_label')}</span>
               <span className="font-semibold text-on-surface">{t('booking.points_earned_value')}</span>
             </div>
           )}
         </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm font-body">
          {error}
        </div>
      )}

      <button
        onClick={handlePagar}
        disabled={loading}
        className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg font-headline shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {t('booking.processing')}
          </span>
        ) : t('booking.pay')}
      </button>

      <p className="text-xs text-on-surface-variant/50 text-center font-label">
        {t('booking.terms')}
      </p>
    </div>
  );
}
