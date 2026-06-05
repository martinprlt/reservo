import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../api/client';
import { useLanguage } from '../../store/languageContext';
import clsx from 'clsx';

const estadoColors = {
  RESERVADO: 'bg-yellow-100 text-yellow-800',
  SENIADO: 'bg-green-100 text-green-800',
  CONFIRMADO: 'bg-blue-100 text-blue-800',
  COMPLETADO: 'bg-gray-100 text-gray-600',
  CANCELADO: 'bg-red-100 text-red-600',
};

export default function ReportesPage({ onNavigate }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('turnos');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;

      let endpoint;
      if (activeTab === 'turnos') endpoint = '/admin/reportes/turnos';
      else if (activeTab === 'ganancias') endpoint = '/admin/reportes/ganancias';
      else endpoint = '/admin/reportes/trabajos';

      const { data } = await api.get(endpoint, { params });
      setData(data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchData();
  };

  const tabs = [
    { id: 'turnos', label: 'Turnos', icon: 'calendar_today' },
    { id: 'ganancias', label: 'Ganancias', icon: 'attach_money' },
    { id: 'trabajos', label: 'Trabajos', icon: 'work' },
  ];

  return (
    <div>
      {/* Back Button */}
      {onNavigate && (
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-sm font-medium mb-4 transition flex items-center gap-1 font-label"
          style={{ color: 'var(--primary)' }}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver al inicio
        </button>
      )}

      <section className="mb-8">
        <h1 className="text-3xl font-extrabold font-headline tracking-tight" style={{ color: 'var(--on-surface)' }}>
          Reportes
        </h1>
        <p className="font-body mt-1" style={{ color: 'var(--on-surface-variant)' }}>
          Estadísticas y análisis de tu negocio
        </p>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition',
              activeTab === tab.id ? 'shadow-md' : 'border'
            )}
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--surface-container-low)',
              color: activeTab === tab.id ? 'var(--on-primary)' : 'var(--on-surface)',
              borderColor: 'var(--outline-variant)',
            }}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border mb-6 flex flex-wrap gap-4 items-end" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
        <div>
          <label className="block text-xs mb-1 font-label" style={{ color: 'var(--on-surface-variant)' }}>Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm font-label"
            style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
          />
        </div>
        <div>
          <label className="block text-xs mb-1 font-label" style={{ color: 'var(--on-surface-variant)' }}>Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm font-label"
            style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
          />
        </div>
        <button
          onClick={handleFilter}
          className="px-4 py-2 rounded-lg font-medium text-sm"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }}
        >
          Filtrar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          {activeTab === 'turnos' && data.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>Total Turnos</p>
                <p className="text-2xl font-bold font-headline" style={{ color: 'var(--on-surface)' }}>{data.stats.total}</p>
              </div>
              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>Señados</p>
                <p className="text-2xl font-bold font-headline" style={{ color: 'var(--on-surface)' }}>{data.stats.porEstado?.SENIADO || 0}</p>
              </div>
              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>Completados</p>
                <p className="text-2xl font-bold font-headline" style={{ color: 'var(--on-surface)' }}>{data.stats.porEstado?.COMPLETADO || 0}</p>
              </div>
              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>Cancelados</p>
                <p className="text-2xl font-bold font-headline" style={{ color: 'var(--on-surface)' }}>{data.stats.porEstado?.CANCELADO || 0}</p>
              </div>
            </div>
          )}

          {activeTab === 'ganancias' && data.stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>Total Señado</p>
                <p className="text-2xl font-bold font-headline" style={{ color: 'var(--on-surface)' }}>${(data.stats.totalSenias || 0).toLocaleString('es-AR')}</p>
              </div>
              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>Por MercadoPago</p>
                <p className="text-2xl font-bold font-headline" style={{ color: 'var(--on-surface)' }}>${(data.stats.porMetodoPago?.MP || 0).toLocaleString('es-AR')}</p>
              </div>
              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>Manual/Efectivo</p>
                <p className="text-2xl font-bold font-headline" style={{ color: 'var(--on-surface)' }}>${(data.stats.porMetodoPago?.MANUAL || 0).toLocaleString('es-AR')}</p>
              </div>
            </div>
          )}

          {activeTab === 'trabajos' && data.stats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>Trabajos Completados</p>
                <p className="text-2xl font-bold font-headline" style={{ color: 'var(--on-surface)' }}>{data.stats.totalCompletados}</p>
              </div>
            </div>
          )}

          {/* Top Servicios */}
          {data.stats?.serviciosMasPopulares && (
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
              <h3 className="font-bold mb-3 font-headline" style={{ color: 'var(--on-surface)' }}>Servicios más populares</h3>
              <div className="space-y-2">
                {data.stats.serviciosMasPopulares.map((s, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span style={{ color: 'var(--on-surface)' }}>{s.nombre}</span>
                    <span className="font-bold" style={{ color: 'var(--primary)' }}>{s.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.stats?.porServicio && (
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
              <h3 className="font-bold mb-3 font-headline" style={{ color: 'var(--on-surface)' }}>Trabajos por servicio</h3>
              <div className="space-y-2">
                {data.stats.porServicio.map((s, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span style={{ color: 'var(--on-surface)' }}>{s.nombre}</span>
                    <span className="font-bold" style={{ color: 'var(--primary)' }}>{s.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* List */}
          {activeTab === 'turnos' && data.turnos && (
            <div className="space-y-3">
              {data.turnos.slice(0, 20).map(turno => (
                <div key={turno.id} className="p-4 rounded-xl border flex justify-between items-center" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                  <div>
                    <p className="font-bold font-headline" style={{ color: 'var(--on-surface)' }}>{turno.servicio.nombre}</p>
                    <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      {turno.cliente.nombre} {turno.cliente.apellido} · {format(new Date(turno.fechaHora), "d MMM HH:mm", { locale: es })}
                    </p>
                  </div>
                  <span className={clsx('text-xs px-2 py-1 rounded-full font-bold', estadoColors[turno.estado])}>
                    {turno.estado}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ganancias' && data.turnos && (
            <div className="space-y-3">
              {data.turnos.slice(0, 20).map(turno => (
                <div key={turno.id} className="p-4 rounded-xl border flex justify-between items-center" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                  <div>
                    <p className="font-bold font-headline" style={{ color: 'var(--on-surface)' }}>{turno.servicio.nombre}</p>
                    <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      {format(new Date(turno.fechaHora), "d MMM", { locale: es })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: 'var(--primary)' }}>${(turno.montoSenia || 0).toLocaleString('es-AR')}</p>
                    <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {turno.pagos?.[0]?.metodoPago === 'MP' ? 'MercadoPago' : 'Manual'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trabajos' && data.trabajos && (
            <div className="space-y-3">
              {data.trabajos.slice(0, 20).map(trabajo => (
                <div key={trabajo.id} className="p-4 rounded-xl border flex justify-between items-center" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
                  <div>
                    <p className="font-bold font-headline" style={{ color: 'var(--on-surface)' }}>{trabajo.servicio.nombre}</p>
                    <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      {trabajo.cliente.nombre} {trabajo.cliente.apellido} · {format(new Date(trabajo.fechaHora), "d MMM", { locale: es })}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-bold bg-gray-100 text-gray-600">
                    COMPLETADO
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <p style={{ color: 'var(--on-surface-variant)' }}>No hay datos disponibles</p>
        </div>
      )}
    </div>
  );
}
