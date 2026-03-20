import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useLanguage } from '../../store/languageContext';
import { useTheme } from '../../store/themeContext';
import DashboardPage from './DashboardPage';
import AgendaPage from './AgendaPage';
import ClientesPage from './ClientesPage';
import ServiciosPage from './ServiciosPage';
import IncentivosPage from './IncentivosPage';
import ConfigPage from './ConfigPage';
import clsx from 'clsx';

export default function AdminLayout() {
  const [activePage, setActivePage] = useState('dashboard');
  const { admin, logout } = useAdminStore();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: 'home' },
    { id: 'agenda', label: t('nav.calendar'), icon: 'calendar_today' },
    { id: 'clientes', label: t('nav.clients'), icon: 'group' },
    { id: 'servicios', label: t('nav.services'), icon: 'spa' },
    { id: 'incentivos', label: t('nav.rewards'), icon: 'star' },
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
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24 dark:bg-slate-900 dark:text-slate-100">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden">
            <span className="text-primary font-bold text-sm">
              {admin?.nombre?.charAt(0) || 'A'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-teal-900 dark:text-teal-50 font-headline">
            Reservo
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('config')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-teal-50/50 dark:hover:bg-teal-900/30 transition-colors"
          >
            <span className="material-symbols-outlined text-teal-900 dark:text-teal-50">settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-teal-50/50 dark:hover:bg-teal-900/30 transition-colors"
          >
            <span className="material-symbols-outlined text-teal-900 dark:text-teal-50">logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 max-w-5xl mx-auto">
        {renderPage()}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 pb-6 pt-3 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-md z-50 rounded-t-2xl shadow-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={clsx(
              'flex flex-col items-center justify-center px-2 py-1.5 rounded-xl transition-all duration-200',
              activePage === item.id
                ? 'bg-teal-100/50 dark:bg-teal-800/40 text-teal-900 dark:text-teal-50 scale-95'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-slate-800/30'
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
