import { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useLanguage } from '../../store/languageContext';
import { useTheme } from '../../store/themeContext';
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

export default function AdminLayout() {
  const [activePage, setActivePage] = useState('dashboard');
  const [incentivosActivos, setIncentivosActivos] = useState(true);
  const { admin, logout } = useAdminStore();
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    api.get('/admin/config')
      .then(({ data }) => {
        setIncentivosActivos(data.incentivosActivos !== false);
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: 'home' },
    { id: 'agenda', label: t('nav.calendar'), icon: 'calendar_today' },
    { id: 'clientes', label: t('nav.clients'), icon: 'group' },
    { id: 'servicios', label: t('nav.services'), icon: 'spa' },
    { id: 'reportes', label: 'Reportes', icon: 'bar_chart' },
    ...(incentivosActivos ? [{ id: 'incentivos', label: t('nav.rewards'), icon: 'star' }] : []),
  ];

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

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-slate-50/60 backdrop-blur-md z-50">
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img src="/logo.png" alt="Reservo" style={{ height: 44, width: 'auto', borderRadius: 10 }} />
        </a>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setActivePage('config')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(0,70,75,0.08)] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ color: '#00464b' }}>settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(0,70,75,0.08)] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ color: '#00464b' }}>logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 max-w-5xl mx-auto">
        {renderPage()}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 pb-6 pt-3 bg-slate-50/60 backdrop-blur-md z-50 rounded-t-2xl shadow-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={clsx(
              'flex flex-col items-center justify-center px-2 py-1.5 rounded-xl transition-all duration-200',
              activePage === item.id
                ? 'bg-teal-100/50 text-teal-900 scale-95'
                : 'text-slate-500 hover:bg-slate-200/30'
            )}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={activePage === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className={clsx(
              'text-[11px] mt-1 font-label whitespace-nowrap',
              activePage === item.id ? 'font-bold' : 'font-medium'
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
