import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../../api/client';
import ClientDetailPage from './ClientDetailPage';

export default function ClientesPage({ onNavigate }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [debouncedBusqueda, setDebouncedBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const debounceTimer = useRef(null);

  // Debounce search input
  const handleBusqueda = useCallback((value) => {
    setBusqueda(value);
    setPage(1);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedBusqueda(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [debouncedBusqueda, page]);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/clientes', {
        params: { busqueda, page, limit: 20 },
      });
      setClientes(data.clientes || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedClientId) {
    return (
      <ClientDetailPage
        clienteId={selectedClientId}
        onBack={() => setSelectedClientId(null)}
      />
    );
  }

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

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="font-label text-label-caps text-primary tracking-widest">ADMINISTRACIÓN</p>
          <h1 className="font-headline text-headline-xl text-on-background">Clientes</h1>
          <p className="text-on-surface-variant max-w-xl">Gestiona tu base de clientes y su historial de servicios.</p>
        </div>
        <a
          href="/api/admin/export/clientes"
          className="flex items-center gap-2 bg-surface-container-high text-primary px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span className="font-label text-label-caps">EXPORTAR CSV</span>
        </a>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={busqueda}
            onChange={(e) => handleBusqueda(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-body text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : clientes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-on-surface-variant">No hay clientes registrados</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                onClick={() => setSelectedClientId(cliente.id)}
                className="glass-card p-5 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
              >
                <div className="flex gap-4 items-start">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <span className="text-on-primary-container font-bold text-sm">
                      {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-on-surface text-lg font-headline">
                          {cliente.nombre} {cliente.apellido}
                        </h3>
                        <p className="text-on-surface-variant text-sm mt-0.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">phone</span>
                          {cliente.telefono}
                        </p>
                      </div>

                      {/* Points badge */}
                      <div className="slot-pill px-3 py-1.5 rounded-full font-bold text-xs shrink-0 text-primary">
                        {cliente.puntos} PTS
                      </div>
                    </div>

                    {/* Loyalty bar */}
                    <div className="mt-3">
                      <div className="relative w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-fixed rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(cliente.puntos * 10, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-[11px] text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          Desde {new Date(cliente.creadoEn).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <span className="text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        Ver detalle
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1 px-4 py-2 bg-surface-container-low rounded-xl text-on-surface-variant hover:bg-surface-container-high transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
                Anterior
              </button>
              <span className="flex items-center px-4 text-sm text-on-surface-variant font-medium">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1 px-4 py-2 bg-surface-container-low rounded-xl text-on-surface-variant hover:bg-surface-container-high transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
              >
                Siguiente
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
