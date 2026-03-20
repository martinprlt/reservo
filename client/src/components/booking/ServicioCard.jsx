import clsx from 'clsx';

export default function ServicioCard({ servicio, onSelect }) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 cursor-pointer transition-all duration-200 overflow-hidden group"
      onClick={() => onSelect(servicio)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition">
              {servicio.nombre}
            </h3>
            {servicio.rubro && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full mt-1 uppercase font-medium">
                {servicio.rubro}
              </span>
            )}
          </div>
          <div className="bg-primary/10 text-primary font-bold text-lg px-3 py-1 rounded-lg">
            ${servicio.precio?.toLocaleString('es-AR')}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{servicio.duracionMinutos} min</span>
          </div>
          <span>
            Seña: <strong className="text-gray-700">${servicio.montoSenia?.toLocaleString('es-AR')}</strong>
          </span>
        </div>

        <div className="mt-3 flex items-center justify-end text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition">
          Seleccionar →
        </div>
      </div>
    </div>
  );
}
