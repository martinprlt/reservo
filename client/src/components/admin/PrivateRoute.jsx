import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../api/client';
import { useAdminStore } from '../../store/adminStore';

export default function PrivateRoute({ children, requiredRole }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const { admin, setAdmin } = useAdminStore();

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => {
        setAdmin(data);
        setIsAuth(true);
        setChecking(false);
      })
      .catch(() => {
        setIsAuth(false);
        setChecking(false);
      });
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole && admin?.role !== requiredRole) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
