import { lazy, Suspense, useState, useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useLanguage } from '../../store/languageContext';
import { cachedApi } from '../../api/client';
import NotificationBell from '../../components/admin/NotificationBell';
import clsx from 'clsx';

const DashboardPage = lazy(() => import('./DashboardPage'));
const AgendaPage = lazy(() => import('./AgendaPage'));
const ClientesPage = lazy(() => import('./ClientesPage'));
const ServiciosPage = lazy(() => import('./ServiciosPage'));
const IncentivosPage = lazy(() => import('./IncentivosPage'));
const ConfigPage = lazy(() => import('./ConfigPage'));
const ReportesPage = lazy(() => import('./ReportesPage'));

const navItems = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'agenda', labelKey: 'nav.calendar', icon: 'calendar_today' },
  { id: 'clientes', labelKey: 'nav.clients', icon: 'group' },
  { id: 'servicios', labelKey: 'nav.services', icon: 'spa' },
  { id: 'reportes', label: 'Reportes', icon: 'bar_chart' },
  { id: 'incentivos', labelKey: 'nav.rewards', icon: 'star', conditional: true },
];

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}

export default function AdminLayout() {
  const [activePage, setActivePage] = useState('dashboard');
  const [incentivosActivos, setIncentivosActivos] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const { admin, logout } = useAdminStore();
  const { t } = useLanguage();

  useEffect(() => {
    cachedApi.get('/admin/config')
      .then(({ data }) => {
        setIncentivosActivos(data.incentivosActivos !== false);
      })
      .catch(() => {});

    // Register push notification service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/push-sw.js').catch(() => {});
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    logout();
    window.location.href = '/admin/login';
  };

  const renderPage = () => {
    const nav = (page) => setActivePage(page);
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={setActivePage} />;
      case 'agenda': return <AgendaPage onNavigate={nav} />;
      case 'clientes': return <ClientesPage onNavigate={nav} />;
      case 'servicios': return <ServiciosPage onNavigate={nav} />;
      case 'incentivos': return <IncentivosPage onNavigate={nav} />;
      case 'config': return <ConfigPage onNavigate={nav} />;
      case 'reportes': return <ReportesPage onNavigate={nav} />;
      default: return <DashboardPage onNavigate={setActivePage} />;
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

      {/* Desktop Sidebar (left icon bar — expands on hover) */}
      <nav
        className="hidden md:flex fixed left-0 top-24 z-10 flex-col gap-1 py-3 bg-surface/90 backdrop-blur-md border-r border-outline-variant/20 rounded-r-2xl shadow-lg transition-all duration-300"
        style={{ width: sidebarHovered ? '180px' : '56px' }}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {visibleNav.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={clsx(
              'flex items-center gap-3 px-3 mx-2 py-2.5 rounded-xl transition-all duration-200',
              activePage === item.id
                ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
            )}
          >
            <span
              className="material-symbols-outlined text-xl shrink-0"
              style={activePage === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className={clsx(
              'text-sm font-medium font-label whitespace-nowrap overflow-hidden transition-all duration-200',
              sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'
            )}>
              {item.label || t(item.labelKey)}
            </span>
          </button>
        ))}
        <div className="border-t border-outline-variant/20 mx-3 my-1" />
        <button
          onClick={() => setActivePage('config')}
          className={clsx(
            'flex items-center gap-3 px-3 mx-2 py-2.5 rounded-xl transition-all duration-200',
            activePage === 'config'
              ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
          )}
        >
          <span className="material-symbols-outlined text-xl shrink-0">tune</span>
          <span className={clsx(
            'text-sm font-medium font-label whitespace-nowrap overflow-hidden transition-all duration-200',
            sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'
          )}>
            Configuración
          </span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-24 md:pb-8 md:pl-20 px-4 md:px-8 max-w-content mx-auto transition-all duration-300">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </main>

      {/* Bottom Navigation (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 h-20 pb-safe bg-surface/90 backdrop-blur-lg border-t border-outline-variant/10 shadow-nav rounded-t-xl overflow-x-auto hide-scrollbar">
        <div className="flex justify-start items-center h-full px-2 gap-1 min-w-max">
          {visibleNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={clsx(
                'flex flex-col items-center justify-center min-w-[56px] px-3 py-1.5 transition-all duration-150',
                activePage === item.id
                  ? 'bg-primary-container text-on-primary-container rounded-full scale-90'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={activePage === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label text-[9px] leading-tight mt-0.5 whitespace-nowrap">
                {item.label || t(item.labelKey)}
              </span>
            </button>
          ))}
          <button
            onClick={() => setActivePage('config')}
            className={clsx(
              'flex flex-col items-center justify-center min-w-[56px] px-3 py-1.5 transition-all duration-150',
              activePage === 'config'
                ? 'bg-primary-container text-on-primary-container rounded-full scale-90'
                : 'text-on-surface-variant hover:text-primary'
            )}
          >
            <span className="material-symbols-outlined text-xl">tune</span>
            <span className="font-label text-[9px] leading-tight mt-0.5 whitespace-nowrap">Config</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
