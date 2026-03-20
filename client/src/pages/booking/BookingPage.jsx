import { useEffect } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import Step1Servicio from './Step1Servicio';
import Step2Horario from './Step2Horario';
import Step3Datos from './Step3Datos';
import Step4Pago from './Step4Pago';
import Confirmacion from './Confirmacion';

export default function BookingPage() {
  const paso = useBookingStore((s) => s.paso);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">Reservo</h1>
      </header>
      <main className="container mx-auto p-4">
        {paso === 1 && <Step1Servicio />}
        {paso === 2 && <Step2Horario />}
        {paso === 3 && <Step3Datos />}
        {paso === 4 && <Step4Pago />}
        {paso === 'confirmacion' && <Confirmacion />}
      </main>
    </div>
  );
}
