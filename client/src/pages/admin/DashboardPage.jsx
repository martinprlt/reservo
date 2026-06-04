import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api, { cachedApi, setTenantSlug } from '../../api/client';
import { useLanguage } from '../../store/languageContext';
import { useAdminStore } from '../../store/adminStore';

export default function DashboardPage({ onNavigate }) {
  const [turnosHoy, setTurnosHoy] = useState([]);
  const [stats, setStats] = useState({ turnosHoy: 0, clientesNuevos: 0, clientesTotal: 0, ingresosMes: 0, turnosPorDia: [0,0,0,0,0,0,0] });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const { admin } = useAdminStore();

  const bookingUrl = admin?.tenantSlug
    ? `${window.location.origin}/booking?tenant=${admin.tenantSlug}`
    : `${window.location.origin}/booking`;

  useEffect(() => {
    // Persist tenant slug for booking page
    if (admin?.tenantSlug) {
      setTenantSlug(admin.tenantSlug);
    }
    fetchDashboard();
  }, [admin?.tenantSlug]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const hoy = new Date();
      const inicioHoy = new Date(hoy);
      inicioHoy.setHours(0, 0, 0, 0);
      const finHoy = new Date(hoy);
      finHoy.setHours(23, 59, 59, 999);

      const agendaRes = await api.get('/admin/agenda', {
        params: { desde: inicioHoy.toISOString(), hasta: finHoy.toISOString() },
      });
      setTurnosHoy(agendaRes.data || []);

      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    // Persist tenant slug so booking page can resolve it
    if (admin?.tenantSlug) {
      setTenantSlug(admin.tenantSlug);
    }
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt('Copiá este link:', bookingUrl);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sacá tu turno',
          text: 'Reservá tu turno desde acá:',
          url: bookingUrl,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const maxVal = Math.max(...stats.turnosPorDia, 1);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <section className="mb-12">
        <h1 className="font-headline text-headline-xl text-on-background mb-2">
          Bienvenido{admin?.nombre ? `, ${admin.nombre}` : ''}
        </h1>
        <p className="text-on-surface-variant font-body max-w-2xl">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}.{' '}
          {stats.turnosHoy} turnos hoy.
        </p>
      </section>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Metric: Turnos Hoy */}
        <div className="md:col-span-4 glass-card p-6 rounded-xl shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-label text-label-caps text-on-surface-variant uppercase tracking-widest">Turnos Hoy</span>
              <div className="bg-primary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary text-xl">payments</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-headline-lg text-on-background">{stats.turnosHoy}</span>
              <span className="text-sm font-medium text-emerald-600 flex items-center">
                <span className="material-symbols-outlined text-xs">trending_up</span> turnos
              </span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-outline-variant/10">
            <p className="text-xs text-on-surface-variant">Total esta semana: <span className="font-semibold">{stats.turnosPorDia.reduce((a, b) => a + b, 0)}</span></p>
          </div>
        </div>

        {/* Metric: Clientes Nuevos */}
        <div className="md:col-span-4 glass-card p-6 rounded-xl shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-label text-label-caps text-on-surface-variant uppercase tracking-widest">Clientes Nuevos</span>
              <div className="bg-tertiary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-tertiary text-xl">person_add</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-headline-lg text-on-background">{stats.clientesNuevos}</span>
              <span className="text-sm font-medium text-emerald-600 flex items-center">
                <span className="material-symbols-outlined text-xs">trending_up</span> +{stats.clientesNuevos}
              </span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-outline-variant/10">
            <p className="text-xs text-on-surface-variant">Total: <span className="font-semibold">{stats.clientesTotal}</span></p>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="md:col-span-4 glass-card p-6 rounded-xl shadow-card relative overflow-hidden group">
          <span className="font-label text-label-caps text-on-surface-variant uppercase tracking-widest block mb-4">Crecimiento</span>
          <div className="h-24 w-full flex items-end gap-1 px-2">
            {stats.turnosPorDia.map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-primary rounded-t-sm transition-all duration-500"
                style={{ height: `${Math.max((val / maxVal) * 100, 8)}%`, opacity: 0.3 + (val / maxVal) * 0.7 }}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] text-outline font-label">
            <span>LUN</span>
            <span>MAR</span>
            <span>MIÉ</span>
            <span>JUE</span>
            <span>VIE</span>
            <span>SÁB</span>
            <span>DOM</span>
          </div>
        </div>

        {/* Main Content: Appointments List */}
        <div className="md:col-span-8 glass-card rounded-xl shadow-card overflow-hidden">
          <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between">
            <h2 className="font-headline text-headline-lg text-on-background">Próximos Turnos</h2>
            <button
              onClick={() => onNavigate?.('agenda')}
              className="text-primary font-label text-label-caps flex items-center gap-1 hover:underline"
            >
              Ver Agenda <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="divide-y divide-outline-variant/5">
            {turnosHoy.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-on-surface-variant">{t('admin.no_turns')}</p>
              </div>
            ) : (
              turnosHoy.slice(0, 4).map((turno) => (
                <div key={turno.id} className="p-6 hover:bg-surface-container-low transition-colors group flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">person</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-on-background">
                        {turno.cliente.nombre} {turno.cliente.apellido}
                      </h3>
                      <p className="text-sm text-on-surface-variant">{turno.servicio.nombre}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-on-background font-medium">{format(new Date(turno.fechaHora), 'HH:mm')}</div>
                    <div className="text-xs text-outline">{turno.servicio.duracionMinutos} min</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions + Link */}
        <div className="md:col-span-4 space-y-gutter">
          {/* Share Link Card */}
          <div className="glass-card p-6 rounded-xl shadow-card relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            <span className="font-label text-label-caps text-on-surface-variant uppercase tracking-widest block mb-4">Tu Link de Reservas</span>
            <p className="text-xs text-on-surface-variant mb-4">Compartilo con tus clientes</p>
            <div className="bg-surface-container-low rounded-lg px-3 py-2 text-on-surface text-xs font-mono mb-3 truncate">
              {bookingUrl}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="px-4 py-2 rounded-full bg-surface-container-high text-primary text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6 rounded-xl shadow-card">
            <span className="font-label text-label-caps text-on-surface-variant uppercase tracking-widest block mb-4">Acciones Rápidas</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate?.('agenda')}
                className="px-4 py-2 rounded-full bg-surface-container-high text-primary text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all"
              >
                Nuevo Turno
              </button>
              <button
                onClick={() => onNavigate?.('clientes')}
                className="px-4 py-2 rounded-full bg-surface-container-high text-primary text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all"
              >
                Agregar Cliente
              </button>
              <a
                href="/api/admin/export/clientes"
                className="px-4 py-2 rounded-full bg-surface-container-high text-primary text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all"
              >
                Exportar
              </a>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-primary text-on-primary rounded-xl p-8 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <span className="font-label text-label-caps mb-4 opacity-80 block">INGRESOS DEL MES</span>
            <p className="font-headline text-headline-xl font-bold">${stats.ingresosMes?.toLocaleString('es-AR')}</p>
            <div className="mt-4 w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full" style={{ width: `${Math.min((stats.ingresosMes / 100000) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
