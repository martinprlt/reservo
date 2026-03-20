import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../api/client';
import { useAdminStore } from '../../store/adminStore';

export default function PrivateRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const { setAdmin, isAuthenticated } = useAdminStore();

  useEffect(() => {
    api.get('/auth/me')
      .then((r) => setAdmin(r.data))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [setAdmin]);

  if (checking) return <div className="p-8 text-center">Cargando...</div>;
  if (isAuthenticated !== true) return <Navigate to="/admin/login" />;
  return children;
}
