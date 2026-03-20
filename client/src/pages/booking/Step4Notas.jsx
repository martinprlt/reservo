import { useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import clsx from 'clsx';

export default function Step4Notas() {
  const { notas: currentNotas, setNotas, goBack } = useBookingStore();
  const [notas, setNotasLocal] = useState(currentNotas || '');
  const [fotoPreview, setFotoPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    setNotas(notas, fotoPreview);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <button
          onClick={goBack}
          className="text-primary hover:text-primary-container text-sm font-medium mb-4 transition flex items-center gap-1 font-label"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver
        </button>
        <h2 className="text-2xl font-extrabold font-headline text-on-surface">
          Detalles del turno
        </h2>
        <p className="text-on-surface-variant mt-1 font-body text-sm">
          Dejá un comentario o subí una foto de referencia
        </p>
      </div>

      <div className="space-y-6">
        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
            Comentario (opcional)
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotasLocal(e.target.value)}
            placeholder="Ej: Quiero un corte como el de la foto, con degradado en los costados..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition text-sm resize-none leading-relaxed"
            style={{
              backgroundColor: 'var(--surface-container-lowest)',
              borderColor: 'var(--outline-variant)',
              color: 'var(--on-surface)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              lineHeight: '1.7',
            }}
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">
            Foto de referencia (opcional)
          </label>

          {fotoPreview ? (
            <div className="relative">
              <img
                src={fotoPreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl border border-outline-variant/20"
              />
              <button
                onClick={() => setFotoPreview(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant/30 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition dark:border-slate-600 dark:hover:border-teal-500 dark:hover:bg-teal-900/10">
              <div className="flex flex-col items-center justify-center py-6">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/50 mb-2">add_photo_alternate</span>
                <p className="text-sm text-on-surface-variant font-body">
                  Tocá para subir una foto
                </p>
                <p className="text-xs text-on-surface-variant/50 mt-1">
                  JPG, PNG hasta 5MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Examples */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 dark:bg-slate-800 dark:border-slate-700">
          <p className="text-xs text-on-surface-variant font-label mb-2 font-medium">Ejemplos de notas:</p>
          <ul className="space-y-1 text-xs text-on-surface-variant font-body">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[14px] mt-0.5 text-primary">check</span>
              "Quiero un estilo como el de la foto adjunta"
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[14px] mt-0.5 text-primary">check</span>
              "Soy alérgica a ciertos esmaltes, por favor consultarme"
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[14px] mt-0.5 text-primary">check</span>
              "Prefiero horario de la tarde si es posible"
            </li>
          </ul>
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3.5 rounded-xl font-semibold font-headline shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200"
        >
          Continuar al pago
        </button>
      </div>
    </div>
  );
}
