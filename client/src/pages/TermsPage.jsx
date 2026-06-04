import { Link } from 'react-router-dom';

export default function TermsPage() {
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
        <h1 className="font-headline text-headline-xl text-on-surface mb-2">Términos y Condiciones</h1>
        <p className="text-on-surface-variant text-sm mb-8">Última actualización: Junio 2026</p>

        <div className="space-y-8 text-on-surface" style={{ lineHeight: 1.8, fontSize: 15 }}>
          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">1. Aceptación</h2>
            <p>
              Al usar Slotify, aceptás estos Términos y Condiciones. Si no estás de acuerdo,
              no utilices la plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">2. Descripción del servicio</h2>
            <p>
              Slotify es una plataforma SaaS de gestión de turnos para negocios de servicios.
              Ofrece reservas online, recordatorios por WhatsApp, integración con MercadoPago
              y herramientas de administración.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">3. Cuenta del usuario</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sos responsable de mantener la confidencialidad de tu cuenta</li>
              <li>Sos responsable de toda la información que cargás en la plataforma</li>
              <li>No podés compartir credenciales de acceso con terceros</li>
              <li>Debés notificarnos ante uso no autorizado de tu cuenta</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">4. Disponibilidad del servicio</h2>
            <p>
              Slotify es una herramienta de gestión. <strong>No garantizamos la disponibilidad
              continua de servicios de terceros</strong> como WhatsApp (Twilio), MercadoPago
              o Cloudinary. Interrupciones en estos servicios no constituyen falla de Slotify.
            </p>
            <p className="mt-2">
              Realizamos copias de seguridad periódicas, pero <strong>el usuario es responsable
              de verificar la información crítica de su negocio</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">5. Pagos</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Los pagos de turnos se procesan directamente a través de la cuenta de MercadoPago del negocio</li>
              <li>Slotify no recibe ni retiene fondos de los clientes del negocio</li>
              <li>Las tarifas de Slotify (plan Básico/Pro) se facturan según la modalidad elegida</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">6. Notificaciones WhatsApp</h2>
            <p>
              Al proporcionar tu número de teléfono, aceptás recibir notificaciones relacionadas
              con tus turnos (confirmaciones, recordatorios, cancelaciones). No enviamos
              marketing ni promociones sin consentimiento.
            </p>
            <p className="mt-2">
              Los clientes que reservan turnos aceptan recibir notificaciones relacionadas
              con su reserva a través del checkbox de consentimiento.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">7. Propiedad intelectual</h2>
            <p>
              Todo el código, diseño y contenido de Slotify es propiedad de Slotify.
              No podés copiar, modificar o distribuir la plataforma sin autorización.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">8. Limitación de responsabilidad</h2>
            <p>
              Slotify no se hace responsable por:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Pérdida de datos causada por errores del usuario</li>
              <li>Interrupciones en servicios de terceros</li>
              <li>Daños indirectos o consecuentes</li>
              <li>Uso indebido de la plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">9. Suspensión</h2>
            <p>
              Nos reservamos el derecho de suspender cuentas que:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Incumplan estos términos</li>
              <li>Realicen uso indebido de la plataforma</li>
              <li>Envíen spam o mensajes masivos no autorizados</li>
              <li>Presenten riesgo para otros usuarios</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">10. Cambios</h2>
            <p>
              Podemos actualizar estos términos en cualquier momento. Los cambios significativos
              se notificarán a los usuarios.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-title-lg text-on-surface mb-3">11. Contacto</h2>
            <p>
              Para consultas: <strong>admin@slotifyapp.site</strong>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
