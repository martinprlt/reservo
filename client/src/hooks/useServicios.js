import { useEffect, useState } from 'react';
import api from '../api/client';

export function useServicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/servicios')
      .then((r) => setServicios(r.data))
      .catch((e) => setError(e.response?.data?.error || 'Error al cargar servicios'))
      .finally(() => setLoading(false));
  }, []);

  return { servicios, loading, error };
}
