import { useState, useEffect } from 'react';
import api from '../../api/client';
import Modal from '../../components/ui/Modal';
import clsx from 'clsx';

export default function NuevoTurnoModal({ isOpen, onClose, onCreated, fechaInicial }) {
  const [servicios, setServicios] = useState([]);
  const [servicioId, setServicioId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [notas, setNotas] = useState('');
  const [aDomicilio, setADomicilio] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/servicios').then(({ data }) => setServicios(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (fechaInicial) {
      const d = new Date(fechaInicial);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setFecha(`${year}-${month}-${day}`);
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setHora(`${h}:${m}`);
    }
  }, [fechaInicial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!servicioId || !fecha || !hora || !nombre || !apellido || !telefono) {
      setError('Completá todos los campos obligatorios');
      return;
    }

    setGuardando(true);
    try {
      const fechaHora = `${fecha}T${hora}:00`;
      const { data } = await api.post('/admin/turnos', {
        servicioId,
        fechaHora,
        nombre,
        apellido,
        telefono,
        notas,
        aDomicilio,
      });

      onCreated(data);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear turno');
    } finally {
      setGuardando(false);
    }
  };

  const handleClose = () => {
    setServicioId('');
    setFecha('');
    setHora('');
    setNombre('');
    setApellido('');
    setTelefono('');
    setNotas('');
    setADomicilio(false);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo turno manual">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg border text-sm font-body" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {/* Servicio */}
        <div>
          <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
            Servicio *
          </label>
          <select
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border text-sm font-body"
            style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
          >
            <option value="">Seleccionar...</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} — ${s.precio?.toLocaleString()} — {s.duracionMinutos}min
              </option>
            ))}
          </select>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
              Fecha *
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border text-sm font-body"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
              Hora *
            </label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border text-sm font-body"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
            />
          </div>
        </div>

        {/* A domicilio */}
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)' }}>
          <input
            type="checkbox"
            checked={aDomicilio}
            onChange={(e) => setADomicilio(e.target.checked)}
            className="w-5 h-5 rounded"
            style={{ accentColor: 'var(--primary)' }}
          />
          <div>
            <p className="font-medium text-sm font-label" style={{ color: 'var(--on-surface)' }}>Servicio a domicilio</p>
            <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>Se agregará "Turno a domicilio" en las notas</p>
          </div>
        </label>

        {/* Datos del cliente */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
              Nombre *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Nombre"
              className="w-full px-4 py-3 rounded-xl border text-sm font-body"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
              Apellido *
            </label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
              placeholder="Apellido"
              className="w-full px-4 py-3 rounded-xl border text-sm font-body"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
            Teléfono *
          </label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            placeholder="5493804XXXXXXX"
            className="w-full px-4 py-3 rounded-xl border text-sm font-body"
            style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
            Notas (opcional)
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas sobre el turno..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border text-sm font-body resize-none"
            style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)', lineHeight: '1.6' }}
          />
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="w-full py-3.5 rounded-xl font-semibold font-headline shadow-lg disabled:opacity-50 active:scale-[0.98] transition-all"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }}
        >
          {guardando ? 'Creando turno...' : 'Crear turno'}
        </button>
      </form>
    </Modal>
  );
}
