import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useBookingStore } from '../../store/bookingStore';
import api from '../../api/client';

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  telefono: z.string().min(8, 'Teléfono inválido'),
});

export default function Step3Datos() {
  const { datosCliente, setDatosCliente, goBack } = useBookingStore();
  const [puntosInfo, setPuntosInfo] = useState(null);
  const [verificando, setVerificando] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: datosCliente || { nombre: '', apellido: '', telefono: '' },
  });

  const telefonoValue = watch('telefono');

  const handleVerificarPuntos = async () => {
    if (!telefonoValue || telefonoValue.length < 8) return;
    setVerificando(true);
    try {
      const { data } = await api.get(`/clientes/puntos/${telefonoValue}`);
      setPuntosInfo(data);
    } catch {
      setPuntosInfo(null);
    } finally {
      setVerificando(false);
    }
  };

  const onSubmit = (data) => setDatosCliente(data);

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <button
          onClick={goBack}
          className="text-primary hover:text-primary-container text-sm font-medium mb-4 transition flex items-center gap-1 font-label"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver
        </button>
        <h2 className="text-2xl font-extrabold font-headline text-on-surface">Tus datos</h2>
        <p className="text-on-surface-variant mt-1 font-body text-sm">
          Necesitamos tus datos para confirmar el turno
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Teléfono first - for loyalty check */}
        <Controller
          name="telefono"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">
                Teléfono
              </label>
              <div className="flex gap-2">
                <input
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  type="tel"
                  className="flex-1 px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
                  placeholder="Ej: 5493804123456"
                  onBlur={handleVerificarPuntos}
                />
                <button
                  type="button"
                  onClick={handleVerificarPuntos}
                  disabled={verificando}
                  className="px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 hover:bg-surface-container-high transition text-on-surface-variant"
                >
                  {verificando ? (
                    <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full block"></span>
                  ) : (
                    <span className="material-symbols-outlined text-xl">search</span>
                  )}
                </button>
              </div>
              {errors.telefono && (
                <p className="text-error text-xs mt-1 font-label">{errors.telefono.message}</p>
              )}
            </div>
          )}
        />

        {/* WhatsApp Consent */}
        <label className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <input
            type="checkbox"
            checked={useBookingStore.getState().aceptaNotificaciones}
            onChange={(e) => useBookingStore.getState().setAceptaNotificaciones(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
          />
          <div>
            <p className="text-sm font-medium text-on-surface font-label">Acepto recibir notificaciones por WhatsApp</p>
            <p className="text-xs text-on-surface-variant font-label mt-0.5">Recordatorios, confirmaciones y cancelaciones de tus turnos</p>
          </div>
        </label>

        {/* Loyalty Card - Stitch style */}
        {puntosInfo?.encontrado && puntosInfo?.incentivosActivos !== false && (
          <div className="bg-gradient-to-br from-tertiary-fixed/20 to-primary-fixed/10 rounded-xl p-5 border border-primary/10 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-fixed-dim/30 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface font-headline">{puntosInfo.nombre}</h4>
                <p className="text-xs text-on-surface-variant font-label">Cliente frecuente</p>
              </div>
              <div className="ml-auto">
                <span className="bg-tertiary-container text-on-tertiary px-3 py-1.5 rounded-full font-bold text-sm font-headline">
                  {puntosInfo.puntos} PTS
                </span>
              </div>
            </div>

            {/* Progress bar */}
            {puntosInfo.proximoIncentivo && (
              <div>
                <div className="relative w-full h-2 bg-surface-container-highest rounded-full overflow-hidden mb-2">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-fixed rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((puntosInfo.puntos / puntosInfo.proximoIncentivo.puntosRequeridos) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-on-surface-variant font-label">
                  {puntosInfo.puntosParaProximo} puntos para <strong>{puntosInfo.proximoIncentivo.nombre}</strong>
                </p>
              </div>
            )}

            {/* Available rewards */}
            {puntosInfo.incentivosDisponibles?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {puntosInfo.incentivosDisponibles.map((inc) => (
                  <span
                    key={inc.id}
                    className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium font-label"
                  >
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    {inc.nombre}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* A domicilio */}
        <label className="flex items-center justify-between p-4 rounded-xl border cursor-pointer" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }} onClick={(e) => {
          e.preventDefault();
          const store = useBookingStore.getState();
          store.setADomicilio(!store.aDomicilio);
        }}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>home</span>
            <div>
              <p className="font-medium text-sm font-label" style={{ color: 'var(--on-surface)' }}>Servicio a domicilio</p>
              <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>Vamos hasta tu ubicación</p>
            </div>
          </div>
          <div
            className="relative w-12 h-7 rounded-full transition-colors"
            style={{ backgroundColor: useBookingStore.getState().aDomicilio ? 'var(--primary)' : 'var(--surface-container-highest)' }}
          >
            <div
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform"
              style={{ transform: useBookingStore.getState().aDomicilio ? 'translateX(20px)' : 'translateX(0)' }}
            />
          </div>
        </label>

        {/* Nombre y Apellido */}
        <Controller
          name="nombre"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Nombre</label>
              <input
                {...rest}
                value={value || ''}
                onChange={onChange}
                className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
                placeholder="Tu nombre"
              />
              {errors.nombre && (
                <p className="text-error text-xs mt-1 font-label">{errors.nombre.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="apellido"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Apellido</label>
              <input
                {...rest}
                value={value || ''}
                onChange={onChange}
                className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
                placeholder="Tu apellido"
              />
              {errors.apellido && (
                <p className="text-error text-xs mt-1 font-label">{errors.apellido.message}</p>
              )}
            </div>
          )}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3.5 rounded-xl font-semibold font-headline shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200"
        >
          Continuar
        </button>
      </form>
    </div>
  );
}
