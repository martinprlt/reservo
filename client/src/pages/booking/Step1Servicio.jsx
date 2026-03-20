import { useEffect, useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import api from '../../api/client';
import ServicioCard from '../../components/booking/ServicioCard';

export default function Step1Servicio() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const seleccionarServicio = useBookingStore((s) => s.seleccionarServicio);

  useEffect(() => {
    api.get('/servicios').then((r) => {
      setServicios(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-8">Cargando...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Elegí tu servicio</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {servicios.map((s) => (
          <ServicioCard
            key={s.id}
            servicio={s}
            onSelect={(variante) => seleccionarServicio(s, variante)}
          />
        ))}
      </div>
    </div>
  );
}
