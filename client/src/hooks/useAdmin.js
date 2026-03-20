import { useEffect } from 'react';
import api from '../api/client';
import { useAdminStore } from '../store/adminStore';

export function useAdmin() {
  const { admin, setAdmin, logout, isAuthenticated } = useAdminStore();

  useEffect(() => {
    if (isAuthenticated === null) {
      api.get('/auth/me')
        .then((r) => setAdmin(r.data))
        .catch(() => setAdmin(null));
    }
  }, [isAuthenticated, setAdmin]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAdmin(data.admin);
    return data;
  };

  const refreshTurnos = async (fecha) => {
    const { data } = await api.get('/admin/turnos', { params: { fecha } });
    return data;
  };

  const refreshClientes = async (params) => {
    const { data } = await api.get('/admin/clientes', { params });
    return data;
  };

  const actualizarTurno = async (id, body) => {
    const { data } = await api.patch(`/admin/turnos/${id}`, body);
    return data;
  };

  return { admin, login, logout, isAuthenticated, refreshTurnos, refreshClientes, actualizarTurno };
}
