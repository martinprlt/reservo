export default function ServicioCard({ servicio, onSelect }) {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
      onClick={() => onSelect(null)}
    >
      <h3 className="font-bold text-lg">{servicio.nombre}</h3>
      {servicio.descripcion && (
        <p className="text-gray-600 text-sm mt-1">{servicio.descripcion}</p>
      )}
      <div className="mt-3 flex justify-between items-center">
        <span className="text-primary font-bold">${servicio.precio}</span>
        <span className="text-gray-500 text-sm">{servicio.duracionMinutos} min</span>
      </div>
    </div>
  );
}
