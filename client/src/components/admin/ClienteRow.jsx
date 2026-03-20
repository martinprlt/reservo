import { Badge, estadoVariant } from '../ui/Badge';

export default function ClienteRow({ cliente, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer"
    >
      <div>
        <h4 className="font-medium">{cliente.nombre} {cliente.apellido}</h4>
        <p className="text-sm text-gray-500">{cliente.telefono}</p>
      </div>
      <div className="text-right">
        <Badge variant="info">{cliente.puntos} pts</Badge>
      </div>
    </div>
  );
}
