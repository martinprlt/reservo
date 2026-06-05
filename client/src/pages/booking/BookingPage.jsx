import { lazy, Suspense, useEffect, useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import { useLanguage } from '../../store/languageContext';
import api from '../../api/client';

const Step1Servicio = lazy(() => import('./Step1Servicio'));
const Step2Horario = lazy(() => import('./Step2Horario'));
const Step3Datos = lazy(() => import('./Step3Datos'));
const Step4Notas = lazy(() => import('./Step4Notas'));
const Step5Pago = lazy(() => import('./Step5Pago'));
const Confirmacion = lazy(() => import('./Confirmacion'));

export default function BookingPage() {
  const { paso, reset, servicioSeleccionado } = useBookingStore();
  const { t } = useLanguage();
  const [tenantConfig, setTenantConfig] = useState(null);

  useEffect(() => {
    api.get('/config')
      .then(({ data }) => setTenantConfig(data))
      .catch(() => {});
  }, []);

  const nombreNegocio = tenantConfig?.nombre || 'Slotify';

  const steps = [
    { num: 1, label: 'Servicio' },
    { num: 2, label: 'Horario' },
    { num: 3, label: 'Datos' },
    { num: 4, label: 'Notas' },
    { num: 5, label: 'Pago' },
  ];

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-white/60 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          {tenantConfig?.logo ? (
            <img
              src={tenantConfig.logo}
              alt={nombreNegocio}
              className="rounded-xl object-cover"
              style={{ width: 44, height: 44 }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="rounded-xl bg-primary flex items-center justify-center" style={{ width: 44, height: 44 }}>
              <span className="text-white font-bold">{nombreNegocio.charAt(0)}</span>
            </div>
          )}
          <span className="text-xl font-bold tracking-tight text-on-surface font-headline">
            {nombreNegocio}
          </span>
        </div>
        {paso > 1 && typeof paso === 'number' && (
          <button
            onClick={reset}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        )}
      </header>

      {/* Progress Steps */}
      {typeof paso === 'number' && (
        <div className="fixed top-16 w-full px-3 py-3 bg-white/60 backdrop-blur-md z-40">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                      paso === step.num
                        ? 'bg-primary text-white shadow-lg scale-110'
                        : paso > step.num
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {paso > step.num ? (
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    ) : (
                      step.num
                    )}
                  </div>
                  <span className={`mt-1 text-[9px] font-label text-center leading-tight ${
                    paso === step.num ? 'text-primary font-semibold' : paso > step.num ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1.5 mt-[-12px] transition-colors ${
                    paso > step.num ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-32 pb-8 px-4 max-w-2xl mx-auto">
        {/* Welcome Banner - inside main so it's below the fixed step bar */}
        {tenantConfig?.mensajeBienvenida && (
          <div className="mb-4 bg-primary/5 border border-primary/10 px-4 py-3 rounded-xl text-center">
            <p className="text-sm font-medium text-primary/80 font-body">
              {tenantConfig.mensajeBienvenida}
            </p>
          </div>
        )}

        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        }>
          {paso === 1 && <Step1Servicio />}
          {paso === 2 && <Step2Horario />}
          {paso === 3 && <Step3Datos />}
          {paso === 4 && <Step4Notas />}
          {paso === 5 && <Step5Pago />}
          {paso === 'confirmacion' && <Confirmacion />}
        </Suspense>
      </main>

      {/* WhatsApp Button */}
      {tenantConfig?.telefonoAdmin && paso !== 'confirmacion' && (
        <a
          href={`https://wa.me/${tenantConfig.telefonoAdmin.replace(/\D/g, '')}?text=Hola!%20Quiero%20consultar%20sobre%20${servicioSeleccionado?.nombre || 'un turno'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:scale-90 transition-all z-50"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-6">
        {nombreNegocio} · Powered by Slotify
      </footer>
    </div>
  );
}
