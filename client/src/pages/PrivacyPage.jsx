import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background font-body" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-lg border-b" style={{ backgroundColor: 'rgba(252,248,255,0.9)', borderColor: 'var(--outline-variant)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4648d4' }}>
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="font-headline font-bold text-on-surface">Slotify</span>
          </Link>
          <Link to="/" className="text-sm text-primary no-underline font-medium">Volver al inicio</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-headline text-headline-xl text-on-surface mb-2">Política de Privacidad</h1>
        <p className="text-on-surface-variant text-sm mb-8">Última actualización: Junio 2026</p>

        <div className="space-y-8 text-on-surface" style={{ lineHeight: 1.8, fontSize: 15 }}>
          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">1. Datos que recopilamos</h2>
            <p>Slotify recopila los siguientes datos cuando un usuario se registra o utiliza la plataforma:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Nombre y apellido</strong> del administrador del negocio</li>
              <li><strong>Email</strong> (usado para iniciar sesión)</li>
              <li><strong>Teléfono</strong> del negocio (opcional, para notificaciones WhatsApp)</li>
              <li><strong>Nombre del negocio</strong> y configuración</li>
            </ul>
            <p className="mt-3">Cuando un cliente reserva un turno a través de Slotify:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Nombre, apellido y teléfono</strong> del cliente</li>
              <li><strong>Foto de referencia</strong> del servicio (opcional, eliminada al completar el turno)</li>
              <li><strong>Historial de turnos</strong> y estado de pagos</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">2. Para qué usamos tus datos</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Gestionar turnos, reservas y pagos del negocio</li>
              <li>Enviar notificaciones de turnos al administrador y clientes (WhatsApp y push)</li>
              <li>Recordatorios de turnos próximos</li>
              <li>Mejorar el funcionamiento de la plataforma</li>
              <li>Cumplir obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">3. Protección de datos</h2>
            <p>
              Tus datos se almacenan en servidores seguros con cifrado SSL/TLS.
              No vendemos ni compartimos tus datos con terceros para fines de marketing.
              El acceso a datos de otros negocios está técnicamente bloqueado por aislamiento multi-tenant.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">4. Tus derechos</h2>
            <p>Puedes solicitar en cualquier momento:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Acceder a tus datos personales</li>
              <li>Corregir datos inexactos</li>
              <li>Solicitar la eliminación de tu cuenta y datos</li>
              <li>Exportar tus datos en formato legible</li>
            </ul>
            <p className="mt-3">Para ejercer estos derechos, escribinos a <strong>admin@slotifyapp.site</strong></p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">5. Servicios de terceros</h2>
            <p>Slotify utiliza servicios de terceros para funcionar:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>MercadoPago</strong> — procesamiento de pagos (sujeto a su propia política)</li>
              <li><strong>Twilio</strong> — envío de mensajes de WhatsApp</li>
              <li><strong>Cloudinary</strong> — almacenamiento de imágenes</li>
            </ul>
            <p className="mt-3">Estos servicios tienen sus propias políticas de privacidad.</p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">6. Cookies</h2>
            <p>
              Slotify utiliza cookies estrictamente necesarias para el funcionamiento de la plataforma
              (autenticación, preferencias). No utilizamos cookies de rastreo publicitario.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">7. Cambios en esta política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política. Los cambios significativos se
              notificarán a los usuarios a través de la plataforma o por email.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">8. Contacto</h2>
            <p>
              Para consultas sobre privacidad: <strong>admin@slotifyapp.site</strong>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
