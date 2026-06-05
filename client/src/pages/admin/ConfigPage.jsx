import { useEffect, useState } from 'react';
import api, { cachedApi } from '../../api/client';
import { useTheme } from '../../store/themeContext';
import { useLanguage } from '../../store/languageContext';
import { useToast } from '../../store/toastContext';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import clsx from 'clsx';

export default function ConfigPage() {
  const [horarios, setHorarios] = useState({});
  const [incentivosActivos, setIncentivosActivos] = useState(true);
  const { supported: pushSupported, subscribed: pushSubscribed, subscribe: subscribePush, unsubscribe: unsubscribePush } = usePushNotifications();
  const [telefonoAdmin, setTelefonoAdmin] = useState('');
  const [mpLink, setMpLink] = useState('');
  const [billeteraVirtual, setBilleteraVirtual] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const { theme, setTheme, customColors, setCustomColors } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [colorPrimario, setColorPrimario] = useState(customColors?.primary || '#4648d4');
  const [colorSecundario, setColorSecundario] = useState(customColors?.secondary || '#4a6363');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminNombre, setAdminNombre] = useState('');
  const [creandoAdmin, setCreandoAdmin] = useState(false);
  const [mensajeBienvenida, setMensajeBienvenida] = useState('');

  // Password change
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordNueva2, setPasswordNueva2] = useState('');
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  useEffect(() => {
    api.get('/admin/config').then(({ data }) => {
      setHorarios(data.horarios || {});
      setTelefonoAdmin(data.telefonoAdmin || '');
      setMpLink(data.mpLink || '');
      setBilleteraVirtual(data.billeteraVirtual || '');
      setNombreNegocio(data.nombreNegocio || '');
      setLogoUrl(data.logoUrl || '');
      setLogoPreview(data.logoUrl || '');
      setIncentivosActivos(data.incentivosActivos !== false);
      setMensajeBienvenida(data.booking?.mensajeBienvenida || '');
    }).catch(() => {});
  }, []);

  const toast = useToast();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return logoUrl;
    setSubiendoLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', logoFile);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.url;
    } catch {
      toast.error('Error al subir logo');
      return logoUrl;
    } finally {
      setSubiendoLogo(false);
    }
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      let finalLogoUrl = logoUrl;
      if (logoFile) {
        finalLogoUrl = await uploadLogo();
      }

      await api.patch('/admin/config', {
        horarios,
        telefonoAdmin,
        mpLink,
        billeteraVirtual,
        nombreNegocio,
        logoUrl: finalLogoUrl,
        colorPrimario: theme === 'custom' ? colorPrimario : undefined,
        colorSecundario: theme === 'custom' ? colorSecundario : undefined,
        incentivosActivos,
        booking: { mensajeBienvenida },
      });
      cachedApi.clear(); // Invalidate config cache
      toast.success('Configuración guardada');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'custom') {
      setCustomColors({ primary: colorPrimario, secondary: colorSecundario });
    }
  };

  const handleColorChange = (type, value) => {
    if (type === 'primary') {
      setColorPrimario(value);
      setCustomColors({ ...customColors, primary: value });
    } else {
      setColorSecundario(value);
      setCustomColors({ ...customColors, secondary: value });
    }
  };

  const handleCrearAdmin = async () => {
    if (!adminEmail || !adminPassword) {
      toast.error('Email y contraseña son obligatorios');
      return;
    }
    setCreandoAdmin(true);
    try {
      await api.post('/admin/add-admin', {
        email: adminEmail,
        password: adminPassword,
        nombre: adminNombre || adminEmail.split('@')[0],
      });
      toast.success('Usuario creado');
      setAdminEmail('');
      setAdminPassword('');
      setAdminNombre('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear usuario');
    } finally {
      setCreandoAdmin(false);
    }
  };

  const handleCambiarPassword = async () => {
    if (!passwordActual || !passwordNueva) {
      toast.error('Todos los campos son obligatorios');
      return;
    }
    if (passwordNueva !== passwordNueva2) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (passwordNueva.length < 6) {
      toast.error('Mínimo 6 caracteres');
      return;
    }
    setCambiandoPassword(true);
    try {
      await api.post('/auth/cambiar-password', {
        passwordActual,
        passwordNueva,
      });
      toast.success('Contraseña cambiada');
      setPasswordActual('');
      setPasswordNueva('');
      setPasswordNueva2('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al cambiar contraseña');
    } finally {
      setCambiandoPassword(false);
    }
  };

  const handleHorarioChange = (dia, campo, valor) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: { ...prev[dia], [campo]: valor },
    }));
  };

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold font-headline tracking-tight" style={{ color: 'var(--on-surface)' }}>
          {t('settings.title')}
        </h1>
        <p className="font-body mt-1" style={{ color: 'var(--on-surface-variant)' }}>
          {t('settings.subtitle')}
        </p>
      </section>

      <div className="space-y-6">
        {/* Mi Negocio */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>store</span>
            Mi negocio
          </h2>
          <p className="text-xs mb-4 font-label" style={{ color: 'var(--on-surface-variant)' }}>
            Estos datos aparecerán en la página de reservas de tus clientes.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
                Nombre del emprendimiento
              </label>
              <input
                value={nombreNegocio}
                onChange={(e) => setNombreNegocio(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
                style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                placeholder="Ej: TusNailsLR, Salón Carolina, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
                Logo del emprendimiento
              </label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img src={logoPreview} alt="Logo preview" className="w-16 h-16 rounded-xl object-cover border border-outline-variant/20" />
                    <button
                      type="button"
                      onClick={() => { setLogoUrl(''); setLogoFile(null); setLogoPreview(''); }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-outline-variant/30 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition">
                    <span className="material-symbols-outlined text-xl text-on-surface-variant/50">add_photo_alternate</span>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>
                    Subí una imagen desde tu dispositivo
                  </p>
                  <p className="text-xs font-label mt-1" style={{ color: 'var(--on-surface-variant)', opacity: 0.6 }}>
                    PNG, JPG hasta 5MB
                  </p>
                </div>
              </div>
            </div>
            {logoUrl && (
              <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)' }}>
                <img src={logoUrl} alt="Logo preview" className="w-12 h-12 rounded-lg object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                <div>
                  <p className="text-sm font-medium font-label" style={{ color: 'var(--on-surface)' }}>Vista previa</p>
                  <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>{nombreNegocio || 'Tu negocio'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje de bienvenida en booking */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>waving_hand</span>
            Mensaje de bienvenida
          </h2>
          <p className="text-xs mb-4 font-label" style={{ color: 'var(--on-surface-variant)' }}>
            Este mensaje se muestra arriba en la página de reservas de tus clientes.
          </p>
          <textarea
            value={mensajeBienvenida}
            onChange={(e) => setMensajeBienvenida(e.target.value)}
            rows={2}
            maxLength={200}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm resize-none"
            style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
            placeholder="Ej: Bienvenidos a TuStudio! Reservá tu turno online."
          />
          <p className="text-xs mt-1 font-label" style={{ color: 'var(--on-surface-variant)', opacity: 0.6 }}>
            {mensajeBienvenida.length}/200 caracteres
          </p>
        </div>

        {/* Theme - 3 options */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>palette</span>
            {t('settings.theme')}
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Light */}
            <button
              onClick={() => handleThemeChange('light')}
              className={clsx(
                'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
                theme === 'light' ? 'ring-2 shadow-lg' : ''
              )}
              style={{
                backgroundColor: theme === 'light' ? 'var(--primary)' : 'var(--surface-container-low)',
                borderColor: theme === 'light' ? 'var(--primary)' : 'var(--outline-variant)',
                color: theme === 'light' ? 'var(--on-primary)' : 'var(--on-surface)',
              }}
            >
              <span className="material-symbols-outlined text-2xl">light_mode</span>
              <span className="text-sm font-medium font-label">Claro</span>
              <div className="w-12 h-8 rounded bg-gray-100 border border-gray-200 mt-1">
                <div className="w-full h-2 bg-primary/40 rounded-t"></div>
              </div>
            </button>

            {/* Dark */}
            <button
              onClick={() => handleThemeChange('dark')}
              className={clsx(
                'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
                theme === 'dark' ? 'ring-2 shadow-lg' : ''
              )}
              style={{
                backgroundColor: theme === 'dark' ? 'var(--primary)' : 'var(--surface-container-low)',
                borderColor: theme === 'dark' ? 'var(--primary)' : 'var(--outline-variant)',
                color: theme === 'dark' ? 'var(--on-primary)' : 'var(--on-surface)',
              }}
            >
              <span className="material-symbols-outlined text-2xl">dark_mode</span>
              <span className="text-sm font-medium font-label">Oscuro</span>
              <div className="w-12 h-8 rounded bg-slate-800 border border-slate-700 mt-1">
                <div className="w-full h-2 bg-primary rounded-t"></div>
              </div>
            </button>

            {/* Custom */}
            <button
              onClick={() => handleThemeChange('custom')}
              className={clsx(
                'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
                theme === 'custom' ? 'ring-2 shadow-lg' : ''
              )}
              style={{
                backgroundColor: theme === 'custom' ? 'var(--primary)' : 'var(--surface-container-low)',
                borderColor: theme === 'custom' ? 'var(--primary)' : 'var(--outline-variant)',
                color: theme === 'custom' ? 'var(--on-primary)' : 'var(--on-surface)',
              }}
            >
              <span className="material-symbols-outlined text-2xl">tune</span>
              <span className="text-sm font-medium font-label">Custom</span>
              <div className="w-12 h-8 rounded border mt-1" style={{ backgroundColor: colorPrimario, borderColor: colorSecundario }}>
                <div className="w-full h-2 rounded-t" style={{ backgroundColor: colorSecundario }}></div>
              </div>
            </button>
          </div>

          {/* Custom colors */}
          {theme === 'custom' && (
            <div className="mt-4 p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)' }}>
              <p className="text-sm font-medium mb-3 font-label" style={{ color: 'var(--on-surface)' }}>
                Colores personalizados
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1 font-label" style={{ color: 'var(--on-surface-variant)' }}>Color principal</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorPrimario}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={colorPrimario}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm font-label"
                      style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1 font-label" style={{ color: 'var(--on-surface-variant)' }}>Color secundario</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorSecundario}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={colorSecundario}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm font-label"
                      style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs mt-3 font-label" style={{ color: 'var(--on-surface-variant)' }}>
                Los colores se aplican a la página de reservas de tus clientes.
              </p>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>translate</span>
            {t('settings.language')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('es')}
              className={clsx('flex items-center gap-3 p-4 rounded-xl border transition-all duration-200')}
              style={{
                backgroundColor: language === 'es' ? 'var(--primary)' : 'var(--surface-container-low)',
                borderColor: language === 'es' ? 'var(--primary)' : 'var(--outline-variant)',
                color: language === 'es' ? 'var(--on-primary)' : 'var(--on-surface)',
              }}
            >
              <span className="text-2xl">🇪🇸</span>
              <span className="font-medium font-label">Español</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={clsx('flex items-center gap-3 p-4 rounded-xl border transition-all duration-200')}
              style={{
                backgroundColor: language === 'en' ? 'var(--primary)' : 'var(--surface-container-low)',
                borderColor: language === 'en' ? 'var(--primary)' : 'var(--outline-variant)',
                color: language === 'en' ? 'var(--on-primary)' : 'var(--on-surface)',
              }}
            >
              <span className="text-2xl">🇺🇸</span>
              <span className="font-medium font-label">English</span>
            </button>
          </div>
        </div>

        {/* Horarios */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>schedule</span>
            {t('settings.schedule')}
          </h2>
          <div className="space-y-4">
            {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map((dia) => (
              <div key={dia} className="flex items-center gap-3 flex-wrap">
                <span className="w-20 text-sm font-medium capitalize font-label" style={{ color: 'var(--on-surface)' }}>{dia}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={horarios[dia]?.activo || false}
                    onChange={(e) => handleHorarioChange(dia, 'activo', e.target.checked)}
                    className="w-4 h-4 rounded border"
                    style={{ borderColor: 'var(--outline-variant)', accentColor: 'var(--primary)' }}
                  />
                  <span className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>{t('settings.active')}</span>
                </label>
                {horarios[dia]?.activo && (
                  <>
                    <input
                      placeholder="09:00"
                      value={horarios[dia]?.apertura || ''}
                      onChange={(e) => handleHorarioChange(dia, 'apertura', e.target.value)}
                      className="w-20 px-3 py-2 rounded-lg border text-sm font-label"
                      style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>→</span>
                    <input
                      placeholder="18:00"
                      value={horarios[dia]?.cierre || ''}
                      onChange={(e) => handleHorarioChange(dia, 'cierre', e.target.value)}
                      className="w-20 px-3 py-2 rounded-lg border text-sm font-label"
                      style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: '#25D366' }}>whatsapp</span>
            {t('settings.whatsapp')}
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
              {t('settings.whatsapp_phone')}
            </label>
            <input
              value={telefonoAdmin}
              onChange={(e) => setTelefonoAdmin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
              placeholder="5493804123456"
            />
          </div>
        </div>

        {/* Push Notifications */}
        {pushSupported && (
          <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
            <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
              <span className="material-symbols-outlined" style={{ color: '#4648d4' }}>notifications</span>
              Notificaciones Push
            </h2>
            <p className="text-xs mb-4 font-label" style={{ color: 'var(--on-surface-variant)' }}>
              Recibí alertas en tu celular cuando se reserve un turno, aun cuando la app no esté abierta.
            </p>
            <button
              onClick={pushSubscribed ? unsubscribePush : subscribePush}
              className={clsx(
                'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
                pushSubscribed
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-primary text-on-primary hover:opacity-90'
              )}
            >
              {pushSubscribed ? '✓ Notificaciones activadas' : 'Activar notificaciones'}
            </button>
          </div>
        )}

        {/* MercadoPago */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: '#009EE3' }}>account_balance</span>
            MercadoPago
          </h2>
          <p className="text-xs mb-4 font-label" style={{ color: 'var(--on-surface-variant)' }}>
            Conectá tu cuenta de MercadoPago para cobrar señas automáticamente.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
                Access Token
              </label>
              <input
                type="password"
                value={horarios.mpAccessToken || ''}
                onChange={(e) => setHorarios(prev => ({ ...prev, mpAccessToken: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
                style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                placeholder="APP_USR-0000000000000000-000000-00000000000000000000000000000000-000000000"
              />
              <p className="text-xs mt-1 font-label" style={{ color: 'var(--on-surface-variant)' }}>
                Lo encontrás en MercadoPago → Tu negocio → Credenciales
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
                Webhook Secret
              </label>
              <input
                type="password"
                value={horarios.mpWebhookSecret || ''}
                onChange={(e) => setHorarios(prev => ({ ...prev, mpWebhookSecret: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
                style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                placeholder="Tu secret del webhook"
              />
            </div>
          </div>
        </div>

        {/* Billetera Virtual */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>account_balance_wallet</span>
            Billetera Virtual
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
                Link de MercadoPago (para cobrar seña)
              </label>
              <input
                value={mpLink}
                onChange={(e) => setMpLink(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
                style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                placeholder="https://mpago.la/XXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 font-label" style={{ color: 'var(--on-surface)' }}>
                CBU / Alias / Cuenta
              </label>
              <input
                value={billeteraVirtual}
                onChange={(e) => setBilleteraVirtual(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
                style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                placeholder="Alias: tu.alias.mp o CBU: 0000000000000000000000"
              />
            </div>
            <p className="text-xs font-label" style={{ color: 'var(--on-surface-variant)' }}>
              Estos datos se mostrarán a tus clientes en la página de reservas para que puedan pagarte por transferencia o MercadoPago.
            </p>
          </div>
        </div>

        {/* Usuarios Admin */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>lock</span>
            Cambiar Contraseña
          </h2>
          <p className="text-xs mb-4 font-label" style={{ color: 'var(--on-surface-variant)' }}>
            Cambiá tu contraseña de acceso al panel.
          </p>
          <div className="space-y-3">
            <input
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              type="password"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
              placeholder="Contraseña actual"
            />
            <input
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              type="password"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
              placeholder="Nueva contraseña"
            />
            <input
              value={passwordNueva2}
              onChange={(e) => setPasswordNueva2(e.target.value)}
              type="password"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
              placeholder="Confirmar nueva contraseña"
            />
            <button
              onClick={handleCambiarPassword}
              disabled={cambiandoPassword || !passwordActual || !passwordNueva}
              className="w-full py-3 rounded-xl font-semibold text-sm border transition active:scale-[0.98] disabled:opacity-40"
              style={{ borderColor: 'var(--primary)', color: 'var(--primary)', backgroundColor: 'var(--surface-container-lowest)' }}
            >
              {cambiandoPassword ? 'Cambiando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </div>

        {/* Usuarios Admin */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>group_add</span>
            Usuarios Admin
          </h2>
          <p className="text-xs mb-4 font-label" style={{ color: 'var(--on-surface-variant)' }}>
            Creá usuarios para que puedan acceder al panel de administración.
          </p>
          <div className="space-y-3">
            <input
              value={adminNombre}
              onChange={(e) => setAdminNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
              placeholder="Nombre (opcional)"
            />
            <input
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
              placeholder="Email"
            />
            <input
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition font-body text-sm"
              style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
              placeholder="Contraseña"
            />
            <button
              onClick={handleCrearAdmin}
              disabled={creandoAdmin || !adminEmail || !adminPassword}
              className="w-full py-3 rounded-xl font-semibold text-sm border transition active:scale-[0.98] disabled:opacity-40"
              style={{ borderColor: 'var(--primary)', color: 'var(--primary)', backgroundColor: 'var(--surface-container-lowest)' }}
            >
              {creandoAdmin ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </div>

        {/* Sistema de Incentivos */}
        <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2" style={{ color: 'var(--on-surface)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>star</span>
            Sistema de Incentivos
          </h2>
          <label className="flex items-center justify-between cursor-pointer" onClick={(e) => {
            e.preventDefault();
            setIncentivosActivos(prev => !prev);
          }}>
            <div>
              <p className="font-medium font-label" style={{ color: 'var(--on-surface)' }}>Puntos y descuentos activos</p>
              <p className="text-xs mt-1 font-label" style={{ color: 'var(--on-surface-variant)' }}>
                Los clientes acumulan puntos por cada servicio y pueden canjear descuentos
              </p>
            </div>
            <div
              className="relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ backgroundColor: incentivosActivos ? 'var(--tertiary)' : 'var(--surface-container-highest)' }}
            >
              <div
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: incentivosActivos ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </div>
          </label>
          {!incentivosActivos && (
            <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: '#fef9c3', borderColor: '#fde047' }}>
              <p className="text-xs font-label" style={{ color: '#854d0e' }}>
                Los incentivos están desactivados. Los clientes no acumularán puntos ni verán descuentos.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="w-full py-3.5 rounded-xl font-semibold font-headline shadow-lg disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }}
        >
          {guardando ? t('settings.saving') : t('settings.save')}
        </button>
      </div>
    </div>
  );
}
