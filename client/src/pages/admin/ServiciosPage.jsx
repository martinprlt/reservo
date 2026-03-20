import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/ui/Modal';
import clsx from 'clsx';

const rubroIcons = {
  'uñas': 'front_hand',
  'pelo': 'cut',
  'pestañas': 'visibility',
  'masajes': 'spa',
  'general': 'spa',
};

export default function ServiciosPage() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [rubro, setRubro] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [seña, setSeña] = useState('');
  const [puntos, setPuntos] = useState('1');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/servicios');
      setServicios(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevo = () => {
    setEditando(null);
    setNombre('');
    setRubro('');
    setPrecio('');
    setDuracion('');
    setSeña('');
    setPuntos('1');
    setModalOpen(true);
  };

  const handleEditar = (s) => {
    setEditando(s);
    setNombre(s.nombre);
    setRubro(s.rubro || '');
    setPrecio(String(s.precio));
    setDuracion(String(s.duracionMinutos));
    setSeña(String(s.montoSenia));
    setPuntos(String(s.puntosOtorgados || 1));
    setModalOpen(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = {
        nombre,
        rubro: rubro || 'general',
        precio: parseFloat(precio),
        duracionMinutos: parseInt(duracion),
        montoSenia: parseFloat(seña),
        puntosOtorgados: parseInt(puntos) || 1,
      };

      if (editando) {
        await api.patch(`/admin/servicios/${editando.id}`, payload);
      } else {
        await api.post('/admin/servicios', payload);
      }

      setModalOpen(false);
      fetchServicios();
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    try {
      await api.delete(`/admin/servicios/${id}`);
      fetchServicios();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="mb-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">
              Servicios
            </h1>
            <p className="text-on-surface-variant font-body mt-1">
              Gestiona tu catálogo de servicios
            </p>
          </div>
          <button
            onClick={handleNuevo}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/10 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            <span>Agregar</span>
          </button>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : servicios.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">💅</div>
          <p className="text-on-surface-variant mb-4">No hay servicios registrados</p>
          <button
            onClick={handleNuevo}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-container transition"
          >
            Crear primer servicio
          </button>
        </div>
      ) : (
        /* Bento Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {servicios.map((s) => (
            <div
              key={s.id}
              className="bg-surface-container-lowest p-6 rounded-xl shadow-card group hover:scale-[1.02] transition-all duration-300 border border-outline-variant/10 hover:border-primary/20 dark:bg-slate-800 dark:border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary-fixed-dim/20 rounded-lg flex items-center justify-center text-primary dark:bg-teal-900/30">
                  <span className="material-symbols-outlined text-2xl">
                    {rubroIcons[s.rubro] || 'spa'}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditar(s)}
                    className="p-2 rounded-full hover:bg-surface-container-low transition text-on-surface-variant hover:text-primary dark:hover:bg-slate-700"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => handleEliminar(s.id)}
                    className="p-2 rounded-full hover:bg-error-container transition text-on-surface-variant hover:text-error dark:hover:bg-red-900/30"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
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
                  ${s.precio?.toLocaleString()}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-medium dark:bg-slate-700 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                  {s.duracionMinutos} min
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-tertiary-container/20 text-tertiary text-sm font-medium dark:bg-teal-900/30 dark:text-teal-300">
                  <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {s.puntosOtorgados || 1} pts
                </span>
              </div>

              <div className="mt-3 text-xs text-on-surface-variant dark:text-slate-500">
                Seña: <span className="font-medium">${s.montoSenia?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editando ? 'Editar servicio' : 'Nuevo servicio'}
      >
        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label dark:text-slate-200">Nombre</label>
            <input
              placeholder="Ej: Manicura francesa"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label dark:text-slate-200">Rubro</label>
            <select
              value={rubro}
              onChange={e => setRubro(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            >
              <option value="">Seleccionar...</option>
              <option value="uñas">Uñas</option>
              <option value="pelo">Pelo</option>
              <option value="pestañas">Pestañas</option>
              <option value="masajes">Masajes</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label dark:text-slate-200">Precio ($)</label>
              <input
                type="number"
                placeholder="0"
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label dark:text-slate-200">Duración (min)</label>
              <input
                type="number"
                placeholder="60"
                value={duracion}
                onChange={e => setDuracion(e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label dark:text-slate-200">Seña ($)</label>
              <input
                type="number"
                placeholder="0"
                value={seña}
                onChange={e => setSeña(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label dark:text-slate-200">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  Puntos
                </span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="1"
                value={puntos}
                onChange={e => setPuntos(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
            </div>
          </div>

          <p className="text-xs text-on-surface-variant dark:text-slate-500 font-label">
            Los puntos se otorgan al cliente cuando se completa el servicio.
          </p>

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
          >
            {guardando ? 'Guardando...' : 'Guardar servicio'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
