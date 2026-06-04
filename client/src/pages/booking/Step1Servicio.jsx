import { useEffect, useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import { useLanguage } from '../../store/languageContext';
import { cachedApi } from '../../api/client';

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
  const [incentivosActivos, setIncentivosActivos] = useState(true);
  const [servicioExpandido, setServicioExpandido] = useState(null);
  const { seleccionarServicio } = useBookingStore();
  const { t } = useLanguage();

  useEffect(() => {
    Promise.all([
      cachedApi.get('/servicios'),
      cachedApi.get('/config'),
    ])
      .then(([servRes, configRes]) => {
        setServicios(servRes.data);
        setIncentivosActivos(configRes.data.incentivosActivos !== false);
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

  // Expanded view — show photo + description
  if (servicioExpandido) {
    const s = servicioExpandido;
    return (
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => setServicioExpandido(null)}
          className="text-primary hover:text-primary-container text-sm font-medium mb-4 transition flex items-center gap-1 font-label"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver
        </button>

        {/* Photo */}
        {s.foto ? (
          <img
            src={s.foto}
            alt={s.nombre}
            className="w-full h-56 object-cover rounded-2xl mb-6"
          />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-primary/10 to-primary-container/10 flex items-center justify-center rounded-2xl mb-6">
            <span className="material-symbols-outlined text-7xl text-primary/30">
              {rubroIcons[s.rubro] || 'spa'}
            </span>
          </div>
        )}

        {/* Service Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-xl">
              {rubroIcons[s.rubro] || 'spa'}
            </span>
            {s.rubro && (
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-label font-medium">
                {s.rubro}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold font-headline text-on-surface">
            {s.nombre}
          </h2>
        </div>

        {/* Description */}
        {s.descripcion && (
          <div className="bg-surface-container-low rounded-xl p-4 mb-6 border border-outline-variant/10">
            <p className="text-sm text-on-surface-variant font-body leading-relaxed whitespace-pre-line">
              {s.descripcion}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="slot-pill inline-flex items-center px-3 py-1.5 rounded-full text-primary text-sm font-medium">
            ${(s.precio || 0).toLocaleString('es-AR')}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium">
            <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
            {s.duracionMinutos} {t('general.min')}
          </span>
          {s.esDomicilio && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-tertiary-fixed text-tertiary text-sm font-medium">
              <span className="material-symbols-outlined text-[16px] mr-1">home</span>
              A domicilio
            </span>
          )}
          {incentivosActivos && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-tertiary-fixed text-tertiary text-sm font-medium">
              <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              +{s.puntosOtorgados || 1} pts
            </span>
          )}
        </div>

        <div className="text-sm text-on-surface-variant mb-6">
          {t('services.deposit')}: <span className="font-medium">${(s.montoSenia || 0).toLocaleString('es-AR')}</span>
        </div>

        <button
          onClick={() => seleccionarServicio(s)}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-semibold font-headline shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200 text-lg"
        >
          Seleccionar y elegir horario →
        </button>
      </div>
    );
  }

  // Service list
  return (
    <div>
      <div className="mb-8">
        <h2 className="font-headline text-headline-xl text-on-background tracking-tight">
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
            onClick={() => setServicioExpandido(s)}
            className="glass-card rounded-2xl shadow-card group hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Service Image */}
            {s.foto ? (
              <div className="w-full h-40 overflow-hidden">
                <img
                  src={s.foto}
                  alt={s.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-primary/30">
                  {rubroIcons[s.rubro] || 'spa'}
                </span>
              </div>
            )}

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">
                    {rubroIcons[s.rubro] || 'spa'}
                  </span>
                </div>
                <span className="text-on-surface-variant/50 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                  Ver más →
                </span>
              </div>

              <h3 className="text-xl font-bold text-on-surface mb-1 font-headline">
                {s.nombre}
              </h3>

              {s.descripcion && (
                <p className="text-sm text-on-surface-variant line-clamp-2 mb-2 font-body">
                  {s.descripcion}
                </p>
              )}

              {s.rubro && (
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-label font-medium">
                  {s.rubro}
                </span>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="slot-pill inline-flex items-center px-3 py-1.5 rounded-full text-primary text-sm font-medium">
                  ${(s.precio || 0).toLocaleString('es-AR')}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium">
                  <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                  {s.duracionMinutos} {t('general.min')}
                </span>
                {s.esDomicilio && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-tertiary-fixed text-tertiary text-sm font-medium">
                    <span className="material-symbols-outlined text-[16px] mr-1">home</span>
                    A domicilio
                  </span>
                )}
                {incentivosActivos && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-tertiary-fixed text-tertiary text-sm font-medium">
                    <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    +{s.puntosOtorgados || 1} pts
                  </span>
                )}
              </div>

              <div className="mt-3 text-xs text-on-surface-variant">
                {t('services.deposit')}: <span className="font-medium">${(s.montoSenia || 0).toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
