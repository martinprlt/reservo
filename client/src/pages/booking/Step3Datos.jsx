import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBookingStore } from '../../store/bookingStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  telefono: z.string().min(8, 'Teléfono inválido'),
});

export default function Step3Datos() {
  const { datosCliente, slotSeleccionado, setDatosCliente } = useBookingStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: datosCliente || {},
  });

  const onSubmit = (data) => {
    setDatosCliente(data);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Tus datos</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre"
          {...register('nombre')}
          error={errors.nombre?.message}
          placeholder="Tu nombre"
        />

        <Input
          label="Apellido"
          {...register('apellido')}
          error={errors.apellido?.message}
          placeholder="Tu apellido"
        />

        <Input
          label="Teléfono"
          type="tel"
          {...register('telefono')}
          error={errors.telefono?.message}
          placeholder="Ej: 5493804123456"
        />

        <p className="text-sm text-gray-500">
          Con tu teléfono te identificamos en tu próxima visita
        </p>

        <Button type="submit" className="w-full">
          Continuar
        </Button>
      </form>
    </div>
  );
}
