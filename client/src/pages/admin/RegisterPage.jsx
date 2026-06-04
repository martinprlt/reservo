import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function RegisterPage() {
  const [form, setForm] = useState({ nombreNegocio: '', nombreAdmin: '', email: '', password: '', telefono: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [slug, setSlug] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', form);
      setSlug(data.slug);
      setSuccess(true);
    } catch (err) {
      const code = err.response?.data?.error;
      if (code === 'EMAIL_YA_REGISTRADO') {
        setError('Ese email ya está registrado. Probá iniciar sesión.');
      } else {
        setError(err.response?.data?.error || 'Algo salió mal. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-container to-tertiary-container p-4 font-body">
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface font-headline mb-2">
            ¡Listo!
          </h1>
          <p className="text-on-surface-variant text-sm mb-6">
            Tu negocio <strong>{form.nombreNegocio}</strong> ya está creado. Ahora configurá tus servicios y horarios.
          </p>
          <a
            href={`/admin?tenant=${slug}`}
            className="block w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3.5 rounded-xl font-semibold font-headline shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200 no-underline"
          >
            Ir al panel de administración
          </a>
          <p className="text-on-surface-variant/50 text-xs mt-4 font-label">
            Tu URL: <strong>{slug}.slotify.app</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-container to-tertiary-container p-4 font-body">
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 no-underline">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
              <span className="text-on-primary text-2xl font-extrabold font-headline">S</span>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-on-surface font-headline">
            Creá tu Slotify
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Gratis, sin tarjeta, sin compromiso
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl mb-6 text-sm font-body">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">
              Nombre de tu negocio
            </label>
            <input
              type="text"
              name="nombreNegocio"
              value={form.nombreNegocio}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
              placeholder="Ej: Tus Nails LR"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">
              Tu nombre
            </label>
            <input
              type="text"
              name="nombreAdmin"
              value={form.nombreAdmin}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
              placeholder="Ej: Laura"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label">
              Teléfono <span className="text-on-surface-variant/50">(opcional)</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm"
              placeholder="Ej: 2966123456"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-br from-primary to-primary-container text-on-primary py-3.5 rounded-xl font-semibold font-headline shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
        >
          {loading ? 'Creando...' : 'Crear mi Slotify'}
        </button>

        <p className="text-center text-on-surface-variant/50 text-xs mt-6 font-label">
          Ya tenés cuenta?{' '}
          <a href="/admin/login" className="text-primary font-medium no-underline">
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
}
