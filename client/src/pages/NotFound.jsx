import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface font-body p-4">
      <div className="text-center">
        <div className="text-6xl font-extrabold text-primary/20 font-headline mb-4">404</div>
        <h2 className="text-2xl font-bold text-on-surface font-headline mb-2">Página no encontrada</h2>
        <p className="text-on-surface-variant mb-6 font-body">La página que buscas no existe.</p>
        <Link
          to="/booking"
          className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-semibold font-headline shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Ir al booking
        </Link>
      </div>
    </div>
  );
}
