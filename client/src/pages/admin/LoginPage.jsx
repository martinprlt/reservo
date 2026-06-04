import { useState } from 'react';
import { useLanguage } from '../../store/languageContext';
import { useTheme } from '../../store/themeContext';
import api from '../../api/client';
import clsx from 'clsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toggle, theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.admin?.role === 'SUPER_ADMIN') {
        window.location.href = '/superadmin';
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      const code = err.response?.data?.error;
      setError(code === 'CREDENCIALES_INVALIDAS' ? t('login.error') : (err.response?.data?.error || t('general.error')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-container to-tertiary-container p-4 font-body dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="fixed top-4 right-4 p-3 bg-white/20 rounded-full backdrop-blur-sm text-white hover:bg-white/30 transition-all"
      >
        <span className="material-symbols-outlined">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-2xl shadow-2xl w-full max-w-sm dark:bg-slate-800">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <span className="text-on-primary text-2xl font-extrabold font-headline">S</span>
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface font-headline dark:text-slate-100">
            {t('login.title')}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1 dark:text-slate-400">
            {t('login.subtitle')}
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl mb-6 text-sm font-body">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label dark:text-slate-200">
              {t('login.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              placeholder="admin@tusnailslr.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 font-label dark:text-slate-200">
              {t('login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-body text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-br from-primary to-primary-container text-on-primary py-3.5 rounded-xl font-semibold font-headline shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
        >
          {loading ? t('login.loading') : t('login.submit')}
        </button>

        <p className="text-center text-on-surface-variant/50 text-xs mt-6 font-label dark:text-slate-500">
          {t('login.footer')}
        </p>
      </form>
    </div>
  );
}
