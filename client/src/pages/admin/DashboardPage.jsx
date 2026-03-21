import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';

export default function DashboardPage() {
  const [turnosHoy, setTurnosHoy] = useState([]);
  const [stats, setStats] = useState({ turnosHoy: 0, clientesNuevos: 0, clientesTotal: 0, ingresosMes: 0, turnosPorDia: [0,0,0,0,0,0,0] });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const bookingUrl = `${window.location.origin}/booking`;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (e) {
      console.error('Stats error:', e);
    }

    try {
      const hoy = new Date();
      const inicioHoy = new Date(hoy);
      inicioHoy.setHours(0, 0, 0, 0);
      const finHoy = new Date(hoy);
      finHoy.setHours(23, 59, 59, 999);

      const res = await api.get('/admin/agenda', {
        params: { desde: inicioHoy.toISOString(), hasta: finHoy.toISOString() },
      });
      setTurnosHoy(res.data || []);
    } catch (e) {
      console.error('Agenda error:', e);
    }

    setLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt('Copiá este link:', bookingUrl);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#00464b' }}></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold font-headline tracking-tight" style={{ color: '#181c20' }}>
          Bienvenido
        </h1>
        <p style={{ color: '#3f4949' }}>
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </section>

      {/* Share Link */}
      <section className="mb-8 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, #00464b, #006066)', boxShadow: '0 12px 32px -4px rgba(0,70,75,0.15)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg font-headline mb-1">Tu link de reservas</h2>
            <p className="text-white/70 text-sm mb-3">Compartilo con tus clientes</p>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-white/10 rounded-lg px-4 py-2 text-white font-mono text-sm">
                {bookingUrl}
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">link</span>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl shadow-card flex justify-between items-center" style={{ backgroundColor: '#ffffff' }}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3f4949' }}>Hoy</span>
            <div className="text-2xl font-bold mt-1 font-headline" style={{ color: '#00464b' }}>{stats.turnosHoy}</div>
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(161,239,247,0.2)' }}>
            <span className="material-symbols-outlined" style={{ color: '#00464b' }}>calendar_today</span>
          </div>
        </div>

        <div className="p-5 rounded-xl shadow-card flex justify-between items-center" style={{ backgroundColor: '#ffffff' }}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3f4949' }}>Nuevos</span>
            <div className="text-2xl font-bold mt-1 font-headline text-green-600">{stats.clientesNuevos}</div>
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
            <span className="material-symbols-outlined text-green-600">person_add</span>
          </div>
        </div>

        <div className="p-5 rounded-xl shadow-card flex justify-between items-center" style={{ backgroundColor: '#ffffff' }}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3f4949' }}>Clientes</span>
            <div className="text-2xl font-bold mt-1 font-headline" style={{ color: '#133a87' }}>{stats.clientesTotal}</div>
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(49, 82, 160, 0.1)' }}>
            <span className="material-symbols-outlined" style={{ color: '#133a87' }}>group</span>
          </div>
        </div>

        <div className="p-5 rounded-xl shadow-card flex justify-between items-center" style={{ backgroundColor: '#ffffff' }}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3f4949' }}>Ingresos</span>
            <div className="text-2xl font-bold mt-1 font-headline" style={{ color: '#4a6363' }}>${stats.ingresosMes?.toLocaleString('es-AR') || 0}</div>
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(204, 232, 231, 0.5)' }}>
            <span className="material-symbols-outlined" style={{ color: '#4a6363' }}>payments</span>
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="p-6 rounded-2xl text-white relative overflow-hidden mb-8" style={{ background: 'linear-gradient(135deg, #00464b, #006066)', boxShadow: '0 12px 32px -4px rgba(0,70,75,0.15)' }}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-headline">Turnos esta semana</h2>
            <p className="opacity-80 text-sm">
              {stats.turnosPorDia.reduce((a, b) => a + b, 0)} turnos en los últimos 7 días
            </p>
          </div>
          <div className="flex items-end gap-2 h-20">
            {stats.turnosPorDia.map((val, i) => (
              <div
                key={i}
                className="w-4 rounded-full transition-all"
                style={{
                  height: `${Math.max((val / Math.max(...stats.turnosPorDia, 1)) * 100, 8)}%`,
                  backgroundColor: `rgba(255,255,255,${0.2 + (val / Math.max(...stats.turnosPorDia, 1)) * 0.8})`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* Today's Appointments */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-headline" style={{ color: '#181c20' }}>
          Turnos de hoy
        </h2>

        {turnosHoy.length === 0 ? (
          <div className="text-center py-8 rounded-xl shadow-card" style={{ backgroundColor: '#ffffff' }}>
            <div className="text-4xl mb-2">📅</div>
            <p style={{ color: '#3f4949' }}>No hay turnos hoy</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4">
            {turnosHoy.map((turno) => (
              <div
                key={turno.id}
                className="min-w-[260px] p-5 rounded-xl shadow-card border-l-4 flex-shrink-0"
                style={{
                  backgroundColor: '#ffffff',
                  borderLeftColor: turno.estado === 'SENIADO' ? '#22c55e' :
                                   turno.estado === 'RESERVADO' ? '#eab308' : '#00464b',
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f1f4fa' }}>
                    <span className="material-symbols-outlined" style={{ color: '#3f4949' }}>person</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${
                    turno.estado === 'SENIADO' ? 'bg-green-100 text-green-800' :
                    turno.estado === 'RESERVADO' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {turno.estado}
                  </span>
                </div>

                <h3 className="font-bold font-headline" style={{ color: '#181c20' }}>
                  {turno.cliente.nombre} {turno.cliente.apellido}
                </h3>
                <p className="text-sm mt-1" style={{ color: '#3f4949' }}>
                  {turno.servicio.nombre}
                </p>

                <div className="mt-3 flex items-center gap-2 font-semibold" style={{ color: '#00464b' }}>
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  <span className="text-sm">{format(new Date(turno.fechaHora), 'HH:mm')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
