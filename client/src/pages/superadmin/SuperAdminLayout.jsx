import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useToast } from '../../store/toastContext';
import clsx from 'clsx';

export default function SuperAdminLayout() {
  const [activePage, setActivePage] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, tenantsRes] = await Promise.all([
        api.get('/platform/stats'),
        api.get('/platform/tenants'),
      ]);
      setStats(statsRes.data);
      setTenants(tenantsRes.data.tenants || []);
    } catch {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const loadTenants = async () => {
    try {
      const { data } = await api.get('/platform/tenants');
      setTenants(data.tenants || []);
    } catch {
      toast.error('Error al cargar tenants');
    }
  };

  const loadAdmins = async () => {
    try {
      const { data } = await api.get('/platform/admins');
      setAdmins(data.admins || []);
    } catch {
      toast.error('Error al cargar admins');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    window.location.href = '/admin/login';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'tenants', label: 'Negocios', icon: 'business' },
    { id: 'admins', label: 'Usuarios', icon: 'group' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-body">
      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 font-headline">Slotify</h1>
            <p className="text-[10px] text-gray-500 font-label">Panel de administración</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Salir
        </button>
      </header>

      {/* Nav */}
      <nav className="fixed top-16 left-0 w-full flex gap-1 px-6 py-2 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActivePage(item.id);
              if (item.id === 'tenants') loadTenants();
              if (item.id === 'admins') loadAdmins();
            }}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              activePage === item.id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="pt-32 pb-8 px-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {activePage === 'dashboard' && <Dashboard stats={stats} />}
            {activePage === 'tenants' && <TenantsList tenants={tenants} onRefresh={loadTenants} toast={toast} />}
            {activePage === 'admins' && <AdminsList admins={admins} tenants={tenants} onRefresh={loadAdmins} toast={toast} />}
          </>
        )}
      </main>
    </div>
  );
}

function Dashboard({ stats }) {
  if (!stats) return null;

  const cards = [
    { label: 'Negocios activos', value: stats.tenantsActivos, icon: 'business', color: 'bg-indigo-500' },
    { label: 'Turnos hoy', value: stats.turnosHoy, icon: 'event', color: 'bg-emerald-500' },
    { label: 'Total clientes', value: stats.totalClientes, icon: 'group', color: 'bg-amber-500' },
    { label: 'Ingresos del mes', value: `$${stats.ingresosMes.toLocaleString('es-AR')}`, icon: 'payments', color: 'bg-rose-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-headline">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', card.color)}>
              <span className="material-symbols-outlined text-white text-xl">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 font-headline">{card.value}</p>
            <p className="text-sm text-gray-500 font-label mt-1">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 font-label">
          Total tenants: {stats.totalTenants} · Total admins: {stats.totalAdmins} · Total turnos: {stats.totalTurnos}
        </p>
      </div>
    </div>
  );
}

function TenantsList({ tenants, onRefresh, toast }) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ nombre: '', slug: '', email: '', password: '', plan: 'FREE' });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!form.nombre || !form.slug || !form.email || !form.password) {
      toast.error('Todos los campos son obligatorios');
      return;
    }
    setCreating(true);
    try {
      await api.post('/platform/tenants', form);
      toast.success('Negocio creado');
      setShowCreate(false);
      setForm({ nombre: '', slug: '', email: '', password: '', plan: 'FREE' });
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActivo = async (tenant) => {
    try {
      await api.patch(`/platform/tenants/${tenant.id}`, { activo: !tenant.activo });
      toast.success(tenant.activo ? 'Negocio desactivado' : 'Negocio activado');
      onRefresh();
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const handleDelete = async (tenant) => {
    if (!confirm(`¿Eliminar "${tenant.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/platform/tenants/${tenant.id}`);
      toast.success('Negocio eliminado');
      onRefresh();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-headline">Negocios</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nuevo negocio
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Crear negocio</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Nombre del negocio"
            />
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '') })}
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="slug (ej: mi-salon)"
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Email del admin"
            />
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Contraseña"
            />
            <select
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="FREE">Free</option>
              <option value="BASICO">Básico</option>
              <option value="PRO">Pro</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {creating ? 'Creando...' : 'Crear negocio'}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-6 py-2.5 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tenants.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {t.nombre.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{t.nombre}</p>
                <p className="text-sm text-gray-500">{t.slug}.slotify.app · {t.plan}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{t._count?.servicios || 0} servicios</span>
              <span>{t._count?.clientes || 0} clientes</span>
              <span>{t._count?.turnos || 0} turnos</span>
              <span className={clsx(
                'px-2 py-1 rounded-full text-xs font-bold',
                t.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              )}>
                {t.activo ? 'Activo' : 'Inactivo'}
              </span>
              <button
                onClick={() => handleToggleActivo(t)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title={t.activo ? 'Desactivar' : 'Activar'}
              >
                <span className="material-symbols-outlined text-lg">
                  {t.activo ? 'block' : 'check_circle'}
                </span>
              </button>
              <button
                onClick={() => handleDelete(t)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
                title="Eliminar"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminsList({ admins, tenants, onRefresh, toast }) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', nombre: '', tenantId: '' });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!form.email || !form.password) {
      toast.error('Email y contraseña son obligatorios');
      return;
    }
    setCreating(true);
    try {
      await api.post('/platform/admins', form);
      toast.success('Usuario creado');
      setShowCreate(false);
      setForm({ email: '', password: '', nombre: '', tenantId: '' });
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (admin) => {
    if (!confirm(`¿Eliminar al admin "${admin.email}"?`)) return;
    try {
      await api.delete(`/platform/admins/${admin.id}`);
      toast.success('Admin eliminado');
      onRefresh();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-headline">Usuarios Admin</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Nuevo usuario
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Crear usuario admin</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Nombre"
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Email"
            />
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Contraseña"
            />
            <select
              value={form.tenantId}
              onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Sin negocio (Super Admin)</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {creating ? 'Creando...' : 'Crear usuario'}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-6 py-2.5 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {admins.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {a.nombre?.charAt(0) || a.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{a.nombre || a.email}</p>
                <p className="text-sm text-gray-500">{a.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{a.tenant?.nombre || 'Sin negocio'}</span>
              <span className={clsx(
                'px-2 py-1 rounded-full text-xs font-bold',
                a.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              )}>
                {a.role}
              </span>
              {a.role !== 'SUPER_ADMIN' && (
                <button
                  onClick={() => handleDelete(a)}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
