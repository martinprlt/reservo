import { useEffect, useState } from 'react';
import api from '../../api/client';
import ClientDetailPage from './ClientDetailPage';
import clsx from 'clsx';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, [busqueda, page]);

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

  // Show client detail if selected
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
      {/* Header */}
      <section className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">
              Clientes
            </h1>
            <p className="text-on-surface-variant font-body mt-1">
              Gestiona tu base de clientes
            </p>
          </div>
          <a
            href="/api/admin/export/clientes"
            className="flex items-center gap-2 bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-container-low transition"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Exportar CSV
          </a>
        </div>
      </section>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPage(1);
            }}
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
          <div className="text-4xl mb-3">👥</div>
          <p className="text-on-surface-variant">No hay clientes registrados</p>
        </div>
      ) : (
        <>
          {/* Client Cards - Stitch style */}
          <div className="space-y-4">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                onClick={() => setSelectedClientId(cliente.id)}
                className="group bg-surface-container-lowest p-5 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-outline-variant/10 hover:border-primary/20 cursor-pointer"
              >
                <div className="flex gap-4 items-start">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">
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
                      <div className="bg-tertiary-container/10 text-tertiary px-3 py-1.5 rounded-full font-bold text-xs shrink-0">
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
