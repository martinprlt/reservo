import { useBookingStore } from '../../store/bookingStore';
import { useLanguage } from '../../store/languageContext';
import Step1Servicio from './Step1Servicio';
import Step2Horario from './Step2Horario';
import Step3Datos from './Step3Datos';
import Step4Notas from './Step4Notas';
import Step5Pago from './Step5Pago';
import Confirmacion from './Confirmacion';

export default function BookingPage() {
  const { paso, reset } = useBookingStore();
  const { t } = useLanguage();

  const steps = [
    { num: 1, label: 'Servicio' },
    { num: 2, label: 'Horario' },
    { num: 3, label: 'Datos' },
    { num: 4, label: 'Notas' },
    { num: 5, label: 'Pago' },
  ];

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-slate-50/60 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
            <span className="text-on-primary font-bold text-sm">R</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-teal-900 font-headline">
            Reservo
          </span>
        </div>
        {paso > 1 && typeof paso === 'number' && (
          <button
            onClick={reset}
            className="p-2 rounded-full hover:bg-teal-50/50 transition-colors text-teal-900"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </header>

      {/* Stepper */}
      {typeof paso === 'number' && (
        <div className="fixed top-16 w-full px-4 py-2 bg-slate-50/60 backdrop-blur-md z-40">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${
                  paso === step.num
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : paso > step.num
                    ? 'bg-green-500 text-white'
                    : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {paso > step.num ? (
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  ) : step.num}
                </div>
                <span className={`hidden sm:inline ml-1 text-[10px] font-label font-medium ${
                  paso === step.num ? 'text-primary' : 'text-on-surface-variant/60'
                }`}>
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`hidden sm:block w-4 md:w-8 h-0.5 mx-1 transition-colors ${
                    paso > step.num ? 'bg-green-500' : 'bg-surface-container-highest'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-28 pb-8 px-6 max-w-2xl mx-auto">
        {paso === 1 && <Step1Servicio />}
        {paso === 2 && <Step2Horario />}
        {paso === 3 && <Step3Datos />}
        {paso === 4 && <Step4Notas />}
        {paso === 5 && <Step5Pago />}
        {paso === 'confirmacion' && <Confirmacion />}
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5493804123456?text=Hola!%20Quiero%20consultar%20por%20un%20turno"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:scale-90 transition-all z-50"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <footer className="text-center text-xs text-on-surface-variant/50 py-6 font-label">
        Reservo
      </footer>
    </div>
  );
}
