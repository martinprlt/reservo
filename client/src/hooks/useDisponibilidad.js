import { useEffect, useState } from 'react';
import api from '../api/client';

export function useDisponibilidad(servicioId, fecha) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!servicioId || !fecha) {
      setSlots([]);
      return;
    }

    setLoading(true);
    const fechaStr = typeof fecha === 'string' ? fecha : fecha.toISOString().split('T')[0];

    api.get('/disponibilidad', { params: { servicioId, fecha: fechaStr } })
      .then((r) => setSlots(r.data))
      .catch((e) => setError(e.response?.data?.error || 'Error al cargar horarios'))
      .finally(() => setLoading(false));
  }, [servicioId, fecha]);

  return { slots, loading, error };
}
