import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../store/toastContext';
import { useLanguage } from '../../store/languageContext';

const defaultRubroIcons = {
  'uñas': 'front_hand',
  'pelo': 'cut',
  'pestañas': 'visibility',
  'masajes': 'spa',
  'general': 'spa',
};

export default function ServiciosPage() {
  const [servicios, setServicios] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState(null);
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [rubro, setRubro] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [seña, setSeña] = useState('');
  const [foto, setFoto] = useState('');
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [puntos, setPuntos] = useState('1');
  const [esDomicilio, setEsDomicilio] = useState(false);
  const [tiempoDesplazamiento, setTiempoDesplazamiento] = useState('');
  const [customRubro, setCustomRubro] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [planLimits, setPlanLimits] = useState(null);
  const toast = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchServicios();
    fetchConfig();
    api.get('/admin/limits').then(({ data }) => setPlanLimits(data)).catch(() => {});
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
    setDescripcion('');
    setRubro('');
    setPrecio('');
    setDuracion('');
    setSeña('');
    setPuntos('1');
    setEsDomicilio(false);
    setTiempoDesplazamiento('');
    setCustomRubro('');
    setFoto('');
    setFotoFile(null);
    setFotoPreview('');
    setModalOpen(true);
  };

  const fetchConfig = async () => {
    try {
      const { data } = await api.get('/admin/config');
      if (data.rubros && Array.isArray(data.rubros)) {
        setRubros(data.rubros);
      }
    } catch (err) {
      console.error('Error fetching config:', err);
    }
  };

  const getRubroIcon = (rubroId) => {
    if (!rubroId) return 'spa';
    const rubro = rubros.find(r => r.id === rubroId);
    return rubro ? rubro.icono : 'spa';
  };

  const handleEditar = (s) => {
    setEditando(s);
    setNombre(s.nombre);
    setDescripcion(s.descripcion || '');
    setRubro(s.rubro || '');
    setPrecio(String(s.precio));
    setDuracion(String(s.duracionMinutos));
    setSeña(String(s.montoSenia));
    setPuntos(String(s.puntosOtorgados || 1));
    setEsDomicilio(s.esDomicilio || false);
    setTiempoDesplazamiento(String(s.tiempoDesplazamiento || ''));
    setCustomRubro(s.rubro && !['uñas','pelo','pestañas','masajes','general'].includes(s.rubro) ? s.rubro : '');
    setFoto(s.foto || '');
    setFotoFile(null);
    setFotoPreview(s.foto || '');
    setModalOpen(true);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadFoto = async () => {
    if (!fotoFile) return foto;
    setSubiendoFoto(true);
    try {
      const formData = new FormData();
      formData.append('file', fotoFile);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.url;
    } catch {
      toast.error('Error al subir imagen');
      return foto;
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      let fotoUrl = foto;
      if (fotoFile) {
        fotoUrl = await uploadFoto();
      }

      const payload = {
        nombre,
        descripcion: descripcion || null,
        rubro: rubro === 'otro' ? (customRubro || 'general') : (rubro || 'general'),
        precio: parseFloat(precio),
        duracionMinutos: parseInt(duracion),
        montoSenia: parseFloat(seña),
        puntosOtorgados: parseInt(puntos) || 1,
        foto: fotoUrl || null,
        esDomicilio,
        tiempoDesplazamiento: tiempoDesplazamiento ? parseInt(tiempoDesplazamiento) : null,
      };

      if (editando) {
        await api.patch(`/admin/servicios/${editando.id}`, payload);
      } else {
        await api.post('/admin/servicios', payload);
      }

      setModalOpen(false);
      fetchServicios();
      toast.success(editando ? 'Servicio actualizado' : 'Servicio creado');
    } catch (err) {
      toast.error('Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = (id) => {
    setServicioToDelete(id);
    setConfirmOpen(true);
  };

  const confirmEliminar = async () => {
    if (!servicioToDelete) return;
    try {
      await api.delete(`/admin/servicios/${servicioToDelete}`);
      toast.success('Servicio eliminado');
      fetchServicios();
    } catch (err) {
      toast.error('Error al eliminar');
    } finally {
      setServicioToDelete(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="font-label text-label-caps text-primary tracking-widest">ADMINISTRACIÓN</p>
          <h1 className="font-headline text-headline-xl text-on-background">Configuración de Servicios</h1>
          <p className="text-on-surface-variant max-w-xl">
            Personaliza tu catálogo de servicios, durations, y precios para optimizar tu agenda.
          </p>
          {planLimits && planLimits.limits.maxServicios && (
            <p className="text-xs" style={{ color: servicios.length >= planLimits.limits.maxServicios ? '#dc2626' : 'var(--on-surface-variant)' }}>
              {servicios.length}/{planLimits.limits.maxServicios} servicios
              {servicios.length >= planLimits.limits.maxServicios && ' — Límite alcanzado'}
            </p>
          )}
        </div>
        <button
          onClick={handleNuevo}
          disabled={planLimits?.limits?.maxServicios && servicios.length >= planLimits.limits.maxServicios}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="font-label text-label-caps">AGREGAR SERVICIO</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : servicios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-on-surface-variant mb-4">No hay servicios registrados</p>
          <button
            onClick={handleNuevo}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-container transition"
          >
            Crear primer servicio
          </button>
        </div>
      ) : (
        /* Bento Grid for Services */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* First service - Large Card */}
          {servicios.length > 0 && (
            <div className="md:col-span-8 glass-card rounded-2xl p-6 flex flex-col justify-between group hover:shadow-xl hover:shadow-tertiary/5 transition-all duration-300">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {getRubroIcon(servicios[0].rubro)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline text-headline-lg text-on-surface">{servicios[0].nombre}</h3>
                    {servicios[0].foto && (
                      <div className="mt-3 w-full h-40 rounded-xl overflow-hidden">
                        <img src={servicios[0].foto} alt={servicios[0].nombre} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-headline-lg font-bold text-primary">${(servicios[0].precio || 0).toLocaleString()}</span>
                  <span className="text-on-surface-variant text-sm">por sesión</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-6">
                <div className="flex gap-4">
                  <div className="slot-pill px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="font-label text-label-caps">{servicios[0].duracionMinutos} MIN</span>
                  </div>
                  <div className="slot-pill px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">category</span>
                    <span className="font-label text-label-caps">{(servicios[0].rubro || 'general').toUpperCase()}</span>
                  </div>
                  {servicios[0].esDomicilio && (
                    <div className="slot-pill px-4 py-2 rounded-full flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">home</span>
                      <span className="font-label text-label-caps">A DOMICILIO</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleEditar(servicios[0])}
                  className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-outline">edit</span>
                </button>
              </div>
            </div>
          )}

          {/* Stats Card */}
          <div className="md:col-span-4 bg-primary text-on-primary rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div>
              <h4 className="font-label text-label-caps mb-4 opacity-80">SERVICIOS ACTIVOS</h4>
              <p className="text-headline-xl font-bold">{servicios.length}</p>
            </div>
            <div className="space-y-4">
              <p className="text-body-sm opacity-90">
                Tu catálogo está optimizado. Considera agregar servicios para cubrir más horarios.
              </p>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: `${Math.min(servicios.length * 10, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Remaining services - Smaller Cards */}
          {servicios.slice(1).map((s) => (
            <div
              key={s.id}
              className="md:col-span-4 glass-card rounded-2xl p-6 flex flex-col group hover:shadow-xl hover:shadow-tertiary/5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary mb-4">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {getRubroIcon(s.rubro)}
                </span>
              </div>
              <h3 className="font-headline text-headline-lg-mobile font-semibold mb-1">{s.nombre}</h3>
              {s.foto && (
                <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                  <img src={s.foto} alt={s.nombre} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="mt-auto space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-label text-label-caps text-outline">DURACIÓN</span>
                  <span className="font-semibold text-on-surface">{s.duracionMinutos} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label text-label-caps text-outline">PRECIO</span>
                  <span className="font-semibold text-primary">${(s.precio || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label text-label-caps text-outline">SEÑA</span>
                  <span className="font-semibold text-on-surface">${(s.montoSenia || 0).toLocaleString()}</span>
                </div>
                {s.esDomicilio && (
                  <div className="flex items-center gap-2 text-xs text-tertiary font-medium">
                    <span className="material-symbols-outlined text-sm">home</span>
                    A domicilio{s.tiempoDesplazamiento ? ` • ${s.tiempoDesplazamiento} min` : ''}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-outline-variant/30">
                <button
                  onClick={() => handleEditar(s)}
                  className="flex-1 p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button
                  onClick={() => handleEliminar(s.id)}
                  className="p-2 rounded-lg hover:bg-error/10 transition-colors text-on-surface-variant hover:text-error"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}

          {/* Empty Placeholder */}
          <div
            onClick={handleNuevo}
            className="md:col-span-12 border-2 border-dashed border-outline-variant/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline group-hover:text-primary transition-colors mb-3">
              <span className="material-symbols-outlined">add</span>
            </div>
            <p className="font-semibold text-on-surface-variant group-hover:text-primary transition-colors">Añadir otro servicio</p>
            <p className="text-sm text-outline">Define el precio, duración y descripción</p>
          </div>
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
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Nombre</label>
            <input
              placeholder="Ej: Manicura francesa"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Descripción (opcional)</label>
            <textarea
              placeholder="Ej: Incluye limado, esmaltado y cutícula. Durante el servicio podés elegir entre más de 50 colores..."
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm resize-none"
            />
            <p className="text-xs text-on-surface-variant mt-1">Se muestra en el booking cuando el cliente elige el servicio</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Rubro</label>
            <select
              value={rubro}
              onChange={e => setRubro(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm"
            >
              <option value="">Seleccionar...</option>
              <option value="uñas">Uñas</option>
              <option value="pelo">Pelo</option>
              <option value="pestañas">Pestañas</option>
              <option value="masajes">Masajes</option>
              <option value="otro">Otro</option>
            </select>
            {rubro === 'otro' && (
              <input
                type="text"
                placeholder="Escribí tu rubro..."
                value={customRubro}
                onChange={e => setCustomRubro(e.target.value)}
                className="w-full px-4 py-3 mt-2 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Precio ($)</label>
              <input
                type="number"
                placeholder="0"
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Duración (min)</label>
              <input
                type="number"
                placeholder="60"
                value={duracion}
                onChange={e => setDuracion(e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Foto del servicio</label>
            {fotoPreview ? (
              <div className="relative">
                <img src={fotoPreview} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-outline-variant/20" />
                <button
                  type="button"
                  onClick={() => { setFoto(''); setFotoFile(null); setFotoPreview(''); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-outline-variant/30 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition">
                <span className="material-symbols-outlined text-2xl text-on-surface-variant/50 mb-1">add_photo_alternate</span>
                <p className="text-xs text-on-surface-variant font-body">Subir imagen</p>
                <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Seña ($)</label>
              <input
                type="number"
                placeholder="0"
                value={seña}
                onChange={e => setSeña(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">
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
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm"
              />
            </div>
          </div>

          <p className="text-xs text-on-surface-variant font-label">
            {t('services.pointsDescription')}
          </p>

          {/* Home Service Toggle */}
          <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">home</span>
              <div>
                <p className="text-sm font-medium text-on-surface">Servicio a domicilio</p>
                <p className="text-xs text-on-surface-variant">El cliente puede elegir que vayas a su ubicación</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEsDomicilio(!esDomicilio)}
              className={`relative w-12 h-6 rounded-full transition-colors ${esDomicilio ? 'bg-primary' : 'bg-surface-container-highest'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${esDomicilio ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          {esDomicilio && (
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Tiempo de desplazamiento (min)</label>
              <input
                type="number"
                placeholder="30"
                value={tiempoDesplazamiento}
                onChange={e => setTiempoDesplazamiento(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
          >
            {guardando ? 'Guardando...' : 'Guardar servicio'}
          </button>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmEliminar}
        title="Eliminar servicio"
        message="¿Eliminar este servicio? No se podrá usar en nuevas reservas."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
