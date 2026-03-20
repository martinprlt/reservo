import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import { useLanguage } from '../../store/languageContext';
import clsx from 'clsx';

export default function DashboardPage() {
  const [turnosHoy, setTurnosHoy] = useState([]);
  const [stats, setStats] = useState({ totalHoy: 0, seniadosHoy: 0, clientesNuevos: 0, ingresosMes: 0 });
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

      const { data: turnos } = await api.get('/admin/agenda', {
        params: { desde: inicioHoy.toISOString(), hasta: finHoy.toISOString() },
      });

      setTurnosHoy(turnos || []);

      const seniados = turnos.filter(t => t.estado === 'SENIADO' || t.estado === 'CONFIRMADO');
      const ingresos = seniados.reduce((sum, t) => sum + (t.montoSenia || 0), 0);

      setStats({
        totalHoy: turnos.length,
        seniadosHoy: seniados.length,
        clientesNuevos: 3, // placeholder
        ingresosMes: ingresos,
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate fake growth data for chart
  const chartData = [40, 55, 45, 70, 60, 85, 100];
  const maxVal = Math.max(...chartData);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">
          {t('admin.welcome')}
        </h1>
        <p className="text-on-surface-variant font-body mt-1">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </section>

      {/* Summary Metrics - Stitch bento */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-card flex justify-between items-center group hover:bg-primary/5 transition-colors">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-label">
              Turnos Hoy
            </span>
            <div className="text-2xl font-bold text-primary mt-1 font-headline">
              {stats.totalHoy}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-fixed-dim/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-card flex justify-between items-center group hover:bg-green-50 transition-colors">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-label">
              Señados
            </span>
            <div className="text-2xl font-bold text-green-600 mt-1 font-headline">
              {stats.seniadosHoy}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600">check_circle</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-card flex justify-between items-center group hover:bg-tertiary/5 transition-colors">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-label">
              Clientes
            </span>
            <div className="text-2xl font-bold text-tertiary mt-1 font-headline">
              {stats.clientesNuevos}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-tertiary-fixed-dim/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary">person_add</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-card flex justify-between items-center group hover:bg-secondary/5 transition-colors">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-label">
              Ingresos
            </span>
            <div className="text-2xl font-bold text-secondary mt-1 font-headline">
              ${stats.ingresosMes.toLocaleString('es-AR')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary">payments</span>
          </div>
        </div>
      </section>

      {/* Growth Chart - Stitch style */}
      <section className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-2xl text-white relative overflow-hidden shadow-card mb-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-headline">Crecimiento Mensual</h2>
            <p className="text-primary-fixed opacity-90 text-sm font-body">
              Has alcanzado el 85% de tu objetivo este mes. ¡Seguí así!
            </p>
          </div>
          <div className="flex items-end gap-2 h-20">
            {chartData.map((val, i) => (
              <div
                key={i}
                className="w-3 rounded-full transition-all duration-500"
                style={{
                  height: `${(val / maxVal) * 100}%`,
                  backgroundColor: `rgba(255,255,255,${0.2 + (val / maxVal) * 0.8})`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* Next Appointments */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-on-surface font-headline">
            {t('admin.today')}
          </h2>
        </div>

        {turnosHoy.length === 0 ? (
          <div className="text-center py-8 bg-surface-container-lowest rounded-xl shadow-card">
            <p className="text-on-surface-variant font-body">{t('admin.no_turns')}</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4">
            {turnosHoy.map((turno, i) => (
              <div
                key={turno.id}
                className={clsx(
                  'min-w-[260px] bg-surface-container-lowest p-5 rounded-xl shadow-card border-l-4',
                  i === 0 ? 'border-primary' : 'border-tertiary'
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant">person</span>
                  </div>
                  <span className={clsx(
                    'text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter font-label',
                    turno.estado === 'SENIADO' ? 'bg-green-100 text-green-800' :
                    turno.estado === 'RESERVADO' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-surface-container-highest text-on-surface-variant'
                  )}>
                    {turno.estado}
                  </span>
                </div>

                <h3 className="font-bold text-on-surface font-headline">
                  {turno.cliente.nombre} {turno.cliente.apellido}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1 font-body">
                  {turno.servicio.nombre}
                </p>

                <div className="mt-4 flex items-center gap-2 text-primary font-semibold">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  <span className="text-sm font-label">
                    {format(new Date(turno.fechaHora), 'HH:mm')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
