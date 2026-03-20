import { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAdminStore } from '../../store/adminStore';

export default function AgendaPage() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin, logout } = useAdminStore();

  useEffect(() => {
    api.get('/admin/turnos').then((r) => {
      setTurnos(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-4 flex justify-between">
        <h1 className="font-bold">Panel Admin</h1>
        <button onClick={logout} className="text-sm underline">Cerrar sesión</button>
      </header>
      <main className="p-4">
        <h2 className="text-xl font-bold mb-4">Agenda</h2>
        {loading ? <p>Cargando...</p> : <p>{turnos.length} turnos</p>}
      </main>
    </div>
  );
}
