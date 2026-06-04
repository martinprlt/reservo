import { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useLanguage } from '../../store/languageContext';
import api from '../../api/client';
import DashboardPage from './DashboardPage';
import AgendaPage from './AgendaPage';
import ClientesPage from './ClientesPage';
import ServiciosPage from './ServiciosPage';
import IncentivosPage from './IncentivosPage';
import ConfigPage from './ConfigPage';
import ReportesPage from './ReportesPage';
import NotificationBell from '../../components/admin/NotificationBell';
import clsx from 'clsx';

const navItems = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'agenda', labelKey: 'nav.calendar', icon: 'calendar_today' },
  { id: 'clientes', labelKey: 'nav.clients', icon: 'group' },
  { id: 'servicios', labelKey: 'nav.services', icon: 'spa' },
  { id: 'reportes', label: 'Reportes', icon: 'bar_chart' },
  { id: 'incentivos', labelKey: 'nav.rewards', icon: 'star', conditional: true },
];

export default function AdminLayout() {
  const [activePage, setActivePage] = useState('dashboard');
  const [incentivosActivos, setIncentivosActivos] = useState(true);
  const { admin, logout } = useAdminStore();
  const { t } = useLanguage();

  useEffect(() => {
    api.get('/admin/config')
      .then(({ data }) => {
        setIncentivosActivos(data.incentivosActivos !== false);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    logout();
    window.location.href = '/admin/login';
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'agenda': return <AgendaPage />;
      case 'clientes': return <ClientesPage />;
      case 'servicios': return <ServiciosPage />;
      case 'incentivos': return <IncentivosPage />;
      case 'config': return <ConfigPage />;
      case 'reportes': return <ReportesPage />;
      default: return <DashboardPage />;
    }
  };

  const visibleNav = navItems.filter(item => !item.conditional || incentivosActivos);

  return (
    <div className="bg-background font-body text-on-surface min-h-screen">
      {/* Top Header */}
      <header className="fixed top-0 w-full h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 shadow-sm shadow-tertiary/5 flex justify-between items-center px-4 md:px-16 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Slotify" className="w-8 h-8 rounded-lg" />
          <span className="font-headline text-headline-lg tracking-tight font-bold text-primary hidden sm:block">Slotify</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setActivePage('config')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">logout</span>
          </button>
        </div>
      </header>

      {/* Desktop Sidebar (left icon bar) */}
      <nav className="hidden md:flex fixed left-0 top-24 z-10 flex-col gap-4 px-4">
        {visibleNav.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={clsx(
              'p-3 rounded-2xl transition-all duration-200 group relative',
              activePage === item.id
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                : 'text-on-surface-variant hover:text-primary hover:bg-white hover:shadow-md'
            )}
            title={item.label || t(item.labelKey)}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={activePage === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-inverse-surface text-inverse-on-surface text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.label || t(item.labelKey)}
            </span>
          </button>
        ))}
        <button
          onClick={() => setActivePage('config')}
          className={clsx(
            'p-3 rounded-2xl transition-all duration-200 group relative',
            activePage === 'config'
              ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
              : 'text-on-surface-variant hover:text-primary hover:bg-white hover:shadow-md'
          )}
          title="Configuración"
        >
          <span className="material-symbols-outlined text-2xl">tune</span>
          <span className="absolute left-full ml-3 px-3 py-1.5 bg-inverse-surface text-inverse-on-surface text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            Configuración
          </span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-24 md:pb-8 md:pl-24 px-4 md:px-8 max-w-content mx-auto">
        {renderPage()}
      </main>

      {/* Bottom Navigation (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/10 shadow-nav rounded-t-xl">
        {visibleNav.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={clsx(
              'flex flex-col items-center justify-center px-5 py-1.5 transition-all duration-150',
              activePage === item.id
                ? 'bg-primary-container text-on-primary-container rounded-full scale-90'
                : 'text-on-surface-variant hover:text-primary'
            )}
          >
            <span
              className="material-symbols-outlined"
              style={activePage === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label text-label-caps mt-1">
              {item.label || t(item.labelKey)}
            </span>
          </button>
        ))}
        <button
          onClick={() => setActivePage('config')}
          className={clsx(
            'flex flex-col items-center justify-center px-5 py-1.5 transition-all duration-150',
            activePage === 'config'
              ? 'bg-primary-container text-on-primary-container rounded-full scale-90'
              : 'text-on-surface-variant hover:text-primary'
          )}
        >
          <span className="material-symbols-outlined">tune</span>
          <span className="font-label text-label-caps mt-1">Config</span>
        </button>
      </nav>
    </div>
  );
}
