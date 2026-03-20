import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import { useLanguage } from '../../store/languageContext';

export default function DashboardPage() {
  const [turnosHoy, setTurnosHoy] = useState([]);
  const [stats, setStats] = useState({ turnosHoy: 0, clientesNuevos: 0, clientesTotal: 0, ingresosMes: 0, turnosPorDia: [0,0,0,0,0,0,0] });
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const hoy = new Date();
      const inicioHoy = new Date(hoy);
      inicioHoy.setHours(0, 0, 0, 0);
      const finHoy = new Date(hoy);
      finHoy.setHours(23, 59, 59, 999);

      const [agendaRes, statsRes] = await Promise.all([
        api.get('/admin/agenda', {
          params: { desde: inicioHoy.toISOString(), hasta: finHoy.toISOString() },
        }),
        api.get('/admin/stats'),
      ]);

      setTurnosHoy(agendaRes.data || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const maxVal = Math.max(...stats.turnosPorDia, 1);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold font-headline tracking-tight" style={{ color: 'var(--on-surface)' }}>
          {t('admin.welcome')}
        </h1>
        <p style={{ color: 'var(--on-surface-variant)' }}>
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl shadow-card flex justify-between items-center hover:opacity-90 transition" style={{ backgroundColor: 'var(--surface-container-lowest)' }}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider font-label" style={{ color: 'var(--on-surface-variant)' }}>Hoy</span>
            <div className="text-2xl font-bold mt-1 font-headline" style={{ color: 'var(--primary)' }}>{stats.turnosHoy}</div>
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-fixed)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>calendar_today</span>
          </div>
        </div>

        <div className="p-5 rounded-xl shadow-card flex justify-between items-center hover:opacity-90 transition" style={{ backgroundColor: 'var(--surface-container-lowest)' }}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider font-label" style={{ color: 'var(--on-surface-variant)' }}>Nuevos</span>
            <div className="text-2xl font-bold mt-1 font-headline text-green-600">{stats.clientesNuevos}</div>
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
            <span className="material-symbols-outlined text-green-600">person_add</span>
          </div>
        </div>

        <div className="p-5 rounded-xl shadow-card flex justify-between items-center hover:opacity-90 transition" style={{ backgroundColor: 'var(--surface-container-lowest)' }}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider font-label" style={{ color: 'var(--on-surface-variant)' }}>Clientes</span>
            <div className="text-2xl font-bold mt-1 font-headline" style={{ color: 'var(--tertiary)' }}>{stats.clientesTotal}</div>
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(49, 82, 160, 0.1)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>group</span>
          </div>
        </div>

        <div className="p-5 rounded-xl shadow-card flex justify-between items-center hover:opacity-90 transition" style={{ backgroundColor: 'var(--surface-container-lowest)' }}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider font-label" style={{ color: 'var(--on-surface-variant)' }}>Ingresos</span>
            <div className="text-2xl font-bold mt-1 font-headline" style={{ color: 'var(--secondary)' }}>${stats.ingresosMes?.toLocaleString('es-AR')}</div>
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--secondary-container)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>payments</span>
          </div>
        </div>
      </section>

      {/* Growth Chart */}
      <section className="p-6 rounded-2xl text-white relative overflow-hidden shadow-card mb-8" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-container))' }}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-headline">Turnos esta semana</h2>
            <p className="opacity-80 text-sm font-body">
              {stats.turnosPorDia.reduce((a, b) => a + b, 0)} turnos en los últimos 7 días
            </p>
          </div>
          <div className="flex items-end gap-2 h-20">
            {stats.turnosPorDia.map((val, i) => (
              <div
                key={i}
                className="w-4 rounded-full transition-all duration-500"
                style={{
                  height: `${Math.max((val / maxVal) * 100, 8)}%`,
                  backgroundColor: `rgba(255,255,255,${0.2 + (val / maxVal) * 0.8})`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* Today's Appointments */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-headline" style={{ color: 'var(--on-surface)' }}>
            {t('admin.today')}
          </h2>
        </div>

        {turnosHoy.length === 0 ? (
          <div className="text-center py-8 rounded-xl shadow-card" style={{ backgroundColor: 'var(--surface-container-lowest)' }}>
            <div className="text-4xl mb-2">📅</div>
            <p style={{ color: 'var(--on-surface-variant)' }}>{t('admin.no_turns')}</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4">
            {turnosHoy.map((turno, i) => (
              <div
                key={turno.id}
                className="min-w-[260px] p-5 rounded-xl shadow-card border-l-4 flex-shrink-0"
                style={{
                  backgroundColor: 'var(--surface-container-lowest)',
                  borderLeftColor: turno.estado === 'SENIADO' ? '#22c55e' : 
                                   turno.estado === 'RESERVADO' ? '#eab308' : 
                                   'var(--primary)',
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-container)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>person</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter font-label ${
                    turno.estado === 'SENIADO' ? 'bg-green-100 text-green-800' :
                    turno.estado === 'RESERVADO' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {turno.estado}
                  </span>
                </div>

                <h3 className="font-bold font-headline" style={{ color: 'var(--on-surface)' }}>
                  {turno.cliente.nombre} {turno.cliente.apellido}
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--on-surface-variant)' }}>
                  {turno.servicio.nombre}
                </p>

                <div className="mt-3 flex items-center gap-2 font-semibold" style={{ color: 'var(--primary)' }}>
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  <span className="text-sm font-label">{format(new Date(turno.fechaHora), 'HH:mm')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
