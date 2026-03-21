import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../store/toastContext';
import clsx from 'clsx';

export default function IncentivosPage() {
  const [incentivos, setIncentivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [incentivoToDelete, setIncentivoToDelete] = useState(null);
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [puntosRequeridos, setPuntosRequeridos] = useState('');
  const [tipoDescuento, setTipoDescuento] = useState('PORCENTAJE');
  const [valor, setValor] = useState('');
  const [guardando, setGuardando] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchIncentivos();
  }, []);

  const fetchIncentivos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/incentivos');
      setIncentivos(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevo = () => {
    setEditando(null);
    setNombre('');
    setPuntosRequeridos('');
    setTipoDescuento('PORCENTAJE');
    setValor('');
    setModalOpen(true);
  };

  const handleEditar = (s) => {
    setEditando(s);
    setNombre(s.nombre);
    setPuntosRequeridos(String(s.puntosRequeridos));
    setTipoDescuento(s.tipoDescuento);
    setValor(String(s.valor));
    setModalOpen(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = {
        nombre,
        puntosRequeridos: parseInt(puntosRequeridos),
        tipoDescuento,
        valor: parseFloat(valor),
      };

      if (editando) {
        await api.patch(`/incentivos/${editando.id}`, payload);
      } else {
        await api.post('/incentivos', payload);
      }

      setModalOpen(false);
      fetchIncentivos();
      toast.success(editando ? 'Incentivo actualizado' : 'Incentivo creado');
    } catch (err) {
      toast.error('Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = (id) => {
    setIncentivoToDelete(id);
    setConfirmOpen(true);
  };

  const confirmEliminar = async () => {
    if (!incentivoToDelete) return;
    try {
      await api.delete(`/incentivos/${incentivoToDelete}`);
      toast.success('Incentivo eliminado');
      fetchIncentivos();
    } catch (err) {
      toast.error('Error al eliminar');
    } finally {
      setIncentivoToDelete(null);
    }
  };

  const formatDescuento = (tipo, valor) => {
    if (tipo === 'PORCENTAJE') return `${valor}% off`;
    return `$${valor} off`;
  };

  return (
    <div>
      {/* Header */}
      <section className="mb-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">
              Incentivos
            </h1>
            <p className="text-on-surface-variant font-body mt-1">
              Configura descuentos por puntos de fidelidad
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
      ) : incentivos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🎁</div>
          <p className="text-on-surface-variant mb-4">No hay incentivos configurados</p>
          <button
            onClick={handleNuevo}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-container transition"
          >
            Crear primer incentivo
          </button>
        </div>
      ) : (
        /* Bento Grid - Stitch style */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {incentivos.map((s) => (
            <div
              key={s.id}
              className="bg-surface-container-lowest p-6 rounded-xl shadow-card group hover:scale-[1.02] transition-all duration-300 border border-outline-variant/10 hover:border-primary/20"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-tertiary-fixed-dim/20 rounded-lg flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-2xl">star</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditar(s)}
                    className="p-2 rounded-full hover:bg-surface-container-low transition text-on-surface-variant hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => handleEliminar(s.id)}
                    className="p-2 rounded-full hover:bg-error-container transition text-on-surface-variant hover:text-error"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-on-surface mb-1 font-headline">
                {s.nombre}
              </h3>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-tertiary-container text-on-tertiary text-sm font-medium">
                  {s.puntosRequeridos} puntos
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-medium">
                  {formatDescuento(s.tipoDescuento, s.valor)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editando ? 'Editar incentivo' : 'Nuevo incentivo'}
      >
        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Nombre</label>
            <input
              placeholder="Ej: Descuento por fidelidad"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Puntos requeridos</label>
            <input
              type="number"
              placeholder="5"
              value={puntosRequeridos}
              onChange={e => setPuntosRequeridos(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">Tipo de descuento</label>
            <select
              value={tipoDescuento}
              onChange={e => setTipoDescuento(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
            >
              <option value="PORCENTAJE">Porcentaje (%)</option>
              <option value="MONTO_FIJO">Monto fijo ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">
              Valor del descuento {tipoDescuento === 'PORCENTAJE' ? '(%)' : '($)'}
            </label>
            <input
              type="number"
              placeholder={tipoDescuento === 'PORCENTAJE' ? '10' : '500'}
              value={valor}
              onChange={e => setValor(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
          >
            {guardando ? 'Guardando...' : 'Guardar incentivo'}
          </button>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmEliminar}
        title="Eliminar incentivo"
        message="¿Eliminar este incentivo? Los clientes no podrán canjearlo."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
