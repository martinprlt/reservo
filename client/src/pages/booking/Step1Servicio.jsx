import { useEffect, useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import { useLanguage } from '../../store/languageContext';
import api from '../../api/client';
import clsx from 'clsx';

const rubroIcons = {
  'uñas': 'front_hand',
  'pelo': 'cut',
  'pestañas': 'visibility',
  'masajes': 'spa',
  'general': 'spa',
};

export default function Step1Servicio() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { seleccionarServicio } = useBookingStore();
  const { t } = useLanguage();

  useEffect(() => {
    api.get('/servicios')
      .then((r) => {
        setServicios(r.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || t('general.error'));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-body">{t('general.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">😕</div>
        <p className="text-error mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-primary font-medium hover:underline">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">
          {t('booking.choose_service')}
        </h2>
        <p className="text-on-surface-variant mt-1 font-body">
          {t('booking.choose_service_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {servicios.map((s) => (
          <div
            key={s.id}
            onClick={() => seleccionarServicio(s)}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-card group hover:scale-[1.02] hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-outline-variant/10 hover:border-primary/20 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-teal-600"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary-fixed-dim/20 rounded-lg flex items-center justify-center text-primary dark:bg-teal-900/30">
                <span className="material-symbols-outlined text-2xl">
                  {rubroIcons[s.rubro] || 'spa'}
                </span>
              </div>
              <span className="text-on-surface-variant/50 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                Seleccionar →
              </span>
            </div>

            <h3 className="text-xl font-bold text-on-surface mb-1 font-headline dark:text-slate-100">
              {s.nombre}
            </h3>

            {s.rubro && (
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-label font-medium dark:text-slate-400">
                {s.rubro}
              </span>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-medium">
                ${s.precio?.toLocaleString('es-AR')}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-medium dark:bg-slate-700 dark:text-slate-400">
                <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                {s.duracionMinutos} {t('general.min')}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: 'rgba(49, 82, 160, 0.1)', color: 'var(--tertiary)' }}>
                <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                +{s.puntosOtorgados || 1} pts
              </span>
            </div>

            <div className="mt-3 text-xs text-on-surface-variant dark:text-slate-500">
              {t('services.deposit')}: <span className="font-medium">${s.montoSenia?.toLocaleString('es-AR')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
