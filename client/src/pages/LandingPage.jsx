import { useState, useEffect } from "react";

const features = [
  { icon: "calendar_month", title: "Agenda inteligente", desc: "Tus clientes ven solo los horarios disponibles según el servicio que eligen. Sin solapamientos." },
  { icon: "payments", title: "Seña automática", desc: "Cada reserva cobra la seña a tu cuenta de MercadoPago. Adiós a los turnos fantasma." },
  { icon: "chat", title: "WhatsApp automático", desc: "Confirmación al reservar y recordatorio 24hs antes. Todo sin que toques nada." },
  { icon: "star", title: "Fidelización con puntos", desc: "Tus clientes acumulan puntos por cada servicio y los canjean por descuentos." },
  { icon: "palette", title: "Tu marca, tu link", desc: "Colores y logo propios. Tu link: tupeluqueria.reservo.app — lo compartís en Instagram y listo." },
  { icon: "home", title: "A domicilio o en local", desc: "Tus clientes eligen si van al local o si vos vas. Configurás zonas de cobertura." },
  { icon: "description", title: "Fotos de referencia", desc: "El cliente puede subir fotos al reservar. Llegás al turno sabiendo exactamente qué quiere." },
  { icon: "bar_chart", title: "Reportes y estadísticas", desc: "Ingresos, servicios más pedidos, clientes recurrentes. Tomá decisiones con datos reales." },
];

const testimonials = [
  {
    name: "Valentina M.",
    role: "Manicura a domicilio · La Rioja",
    text: "Antes coordinaba todo por WhatsApp y se me cruzaban los turnos. Ahora mis clientas reservan solas y yo solo confirmo. Me cambió la vida.",
    avatar: "V",
    color: "#e8d5f0",
    textColor: "#6b3fa0",
  },
  {
    name: "Rocío P.",
    role: "Salón de belleza · Córdoba",
    text: "Lo que más me gustó fue el sistema de señas. Ya no tengo cancelaciones de último momento. Si alguien cancela, el dinero está. Punto.",
    avatar: "R",
    color: "#d5e8f0",
    textColor: "#2a6a8a",
  },
  {
    name: "Camila D.",
    role: "Pestañista · Buenos Aires",
    text: "Mis clientas me preguntan cómo hice para tener una app propia. Les digo que es Reservo y no lo pueden creer por el precio que pago.",
    avatar: "C",
    color: "#f0e8d5",
    textColor: "#8a5a2a",
  },
];

const faqs = [
  { q: "¿Necesito saber programar?", a: "Para nada. Te configuramos todo nosotros. Vos solo cargás tus servicios, horarios y listo." },
  { q: "¿Mis clientes tienen que bajarse algo?", a: "No. Entran desde cualquier celular al link que les mandás y reservan. No hay app que instalar." },
  { q: "¿Qué pasa si no tengo MercadoPago?", a: "Podés usar el modo transferencia: el sistema muestra tu CBU o alias y el cliente te avisa por WhatsApp cuando pagó." },
  { q: "¿Puedo probar antes de pagar?", a: "Sí. El plan Free te deja probar el sistema completo con hasta 30 turnos por mes. Sin tarjeta, sin compromiso." },
  { q: "¿Puedo cambiar de plan cuando quiera?", a: "Sí, en cualquier momento. Si crecés y necesitás más, subís. Si querés pausar, bajás. Sin contratos." },
  { q: "¿Funciona para servicio a domicilio?", a: "Sí, está pensado especialmente para eso. Podés definir zonas de cobertura y tus clientes ven si llegás a su barrio." },
];

const plans = [
  {
    name: "Free",
    price: "Gratis",
    period: "",
    desc: "Para conocer el sistema",
    color: "#f1f4fa",
    textColor: "#181c20",
    btnBg: "#e5e8ee",
    btnText: "#00464b",
    features: ["1 servicio activo", "Hasta 30 turnos por mes", "Panel de administración", "Calendario de agenda", "Sin MercadoPago"],
    notIncluded: ["WhatsApp automático", "Puntos y descuentos"],
    featured: false,
    cta: "Probar gratis",
  },
  {
    name: "Básico",
    price: "$9.990",
    period: "/ mes",
    desc: "Para emprendimientos en crecimiento",
    color: "#00464b",
    textColor: "#ffffff",
    btnBg: "#ffffff",
    btnText: "#00464b",
    features: ["Hasta 8 servicios", "Turnos ilimitados", "WhatsApp automático", "Seña con MercadoPago", "Puntos y descuentos", "Gestión de clientes", "Fotos de referencia"],
    notIncluded: ["Múltiples profesionales"],
    featured: true,
    cta: "Empezar ahora",
  },
  {
    name: "Pro",
    price: "$19.990",
    period: "/ mes",
    desc: "Para salones y equipos",
    color: "#f1f4fa",
    textColor: "#181c20",
    btnBg: "#00464b",
    btnText: "#ffffff",
    features: ["Servicios ilimitados", "Turnos ilimitados", "Todo del plan Básico", "Hasta 5 profesionales", "Reportes y estadísticas", "Control de stock básico", "Soporte prioritario"],
    notIncluded: [],
    featured: false,
    cta: "Empezar ahora",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#fafaf8", color: "#1a1a18", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@300;400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .serif { font-family: 'Manrope', sans-serif; }
        .pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 500; }
        .btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px; border-radius: 14px; font-weight: 700; font-size: 15px; background: #00464b; color: #fff; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .btn-primary:hover { background: #005a60; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,70,75,0.25); }
        .btn-ghost { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px; border-radius: 14px; font-weight: 600; font-size: 15px; background: transparent; color: #00464b; border: 1.5px solid #00464b; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .btn-ghost:hover { background: rgba(0,70,75,0.06); }
        .card { background: #fff; border-radius: 20px; padding: 28px; box-shadow: 0 2px 20px rgba(0,0,0,0.06); transition: all 0.3s; border: 1px solid rgba(0,0,0,0.05); }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); }
        .msym { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
        .faq-item { border-bottom: 1px solid rgba(0,0,0,0.08); }
        .faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 20px 0; background: none; border: none; cursor: pointer; font-size: 15px; font-weight: 600; color: #1a1a18; text-align: left; gap: 16px; font-family: 'Inter', sans-serif; }
        .faq-a { font-size: 14px; line-height: 1.7; color: #555550; padding-bottom: 20px; }
        .check { display: inline-flex; width: 18px; height: 18px; border-radius: 50%; align-items: center; justify-content: center; background: rgba(0,70,75,0.1); flex-shrink: 0; }
        .cross { display: inline-flex; width: 18px; height: 18px; border-radius: 50%; align-items: center; justify-content: center; background: rgba(0,0,0,0.06); flex-shrink: 0; }
        .gradient-text { background: linear-gradient(135deg, #00464b 0%, #4a9e8a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .marquee-track { display: flex; gap: 32px; animation: marquee 20s linear infinite; width: max-content; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .float { animation: float 4s ease-in-out infinite; }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } .grid-3 { grid-template-columns: 1fr !important; } .grid-2 { grid-template-columns: 1fr !important; } .hero-btns { flex-direction: column; } .hero-h1 { font-size: 38px !important; } }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, padding: "0 24px", background: scrolled ? "rgba(250,250,248,0.92)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "none", transition: "all 0.3s", height: 72, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img src="/logo.png" alt="Reservo" style={{ height: 52, width: "auto", borderRadius: 10 }} />
          </a>
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {["Cómo funciona", "Planes", "Preguntas"].map((item, i) => (
              <a key={i} href={`#${["como-funciona", "planes", "faq"][i]}`} style={{ fontSize: 14, fontWeight: 500, color: "#555550", textDecoration: "none" }}>{item}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="/admin/login" style={{ fontSize: 13, fontWeight: 500, color: "#555550", textDecoration: "none", padding: "10px 18px" }}>Iniciar sesión</a>
            <a href="#contacto" className="btn-primary" style={{ padding: "10px 18px", fontSize: 13 }}>Empezar gratis</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,70,75,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ marginBottom: 32 }}>
            <img src="/logo.png" alt="Reservo" style={{ height: 80, width: "auto", borderRadius: 16, marginBottom: 24, boxShadow: "0 8px 32px rgba(0,70,75,0.15)" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <span className="pill" style={{ background: "rgba(0,70,75,0.08)", color: "#00464b" }}>
              <span className="msym" style={{ fontSize: 14 }}>auto_awesome</span>
              Sistema de turnos para emprendimientos
            </span>
          </div>
          <h1 className="hero-h1 serif" style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#1a1a18" }}>
            Tu agenda online.<br />
            <span className="gradient-text">Sin llamadas, sin quilombos.</span>
          </h1>
          <p style={{ fontSize: 17, color: "#555550", lineHeight: 1.75, maxWidth: 580, margin: "0 auto 40px", fontWeight: 300 }}>
            Tus clientas reservan solas desde el celular, pagan la seña automáticamente y vos recibís un WhatsApp cuando hay un turno nuevo. Así de simple.
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
            <a href="#contacto" className="btn-primary" style={{ fontSize: 16, padding: "16px 32px" }}>
              Quiero mi Reservo gratis
              <span className="msym" style={{ fontSize: 18 }}>arrow_forward</span>
            </a>
            <a href="#como-funciona" className="btn-ghost" style={{ fontSize: 16, padding: "16px 32px" }}>Ver cómo funciona</a>
          </div>

          {/* Mock preview */}
          <div className="float" style={{ background: "#fff", borderRadius: 24, padding: 8, boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)", display: "inline-block", maxWidth: 360, width: "100%" }}>
            <div style={{ background: "#f1f4fa", borderRadius: 18, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#00464b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>TN</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18" }}>TusNailsLR</div>
                  <div style={{ fontSize: 11, color: "#6f7979" }}>tusnailslr.reservo.app</div>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18", marginBottom: 10 }}>Elegí un servicio</div>
              {[
                { name: "Manicura Muzza Simple", price: "$7.000", time: "60 min" },
                { name: "Pestañas Pelo por Pelo", price: "$12.000", time: "2 hs" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", border: i === 0 ? "1.5px solid #00464b" : "1px solid rgba(0,0,0,0.08)" }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#1a1a18" }}>{s.name}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#00464b" }}>{s.price}</div>
                    <div style={{ fontSize: 10, color: "#6f7979" }}>{s.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ background: "#00464b", borderRadius: 12, padding: "11px", textAlign: "center", marginTop: 12, fontSize: 13, fontWeight: 700, color: "#fff" }}>
                Elegir horario →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: "32px 0", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)", overflow: "hidden", background: "#fff" }}>
        <div style={{ overflow: "hidden" }}>
          <div className="marquee-track">
            {[...Array(2)].map((_, rep) =>
              ["Manicuras · Peluquerías · Salones de belleza · Estéticas · Barberías · Masajistas · Cejas y pestañas · Maquillaje · Micropigmentación · Depilación"].map((item, i) =>
                <span key={`${rep}-${i}`} style={{ fontSize: 13, fontWeight: 500, color: "#6f7979", whiteSpace: "nowrap", padding: "0 24px", borderRight: "1px solid rgba(0,0,0,0.08)" }}>{item}</span>
              )
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "80px 24px", background: "#00464b", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, position: "relative" }}>
          {[
            { num: "15 min", label: "Para configurar tu Reservo desde cero" },
            { num: "0%", label: "Comisión sobre tus ventas. Lo que facturás es tuyo." },
            { num: "24/7", label: "Tus clientes reservan cuando quieren, incluso de madrugada" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "24px 16px" }}>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 44, fontWeight: 900, color: "#a1eff7", lineHeight: 1, marginBottom: 12 }}>{s.num}</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontWeight: 300 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: "96px 24px", background: "#fafaf8" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="pill" style={{ background: "rgba(0,70,75,0.08)", color: "#00464b", marginBottom: 16 }}>¿Cómo funciona?</span>
            <h2 className="serif" style={{ fontSize: 40, fontWeight: 900, color: "#1a1a18", marginTop: 16 }}>En tres pasos, arrancás</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { step: "01", icon: "settings", title: "Configurás tu perfil", desc: "Cargás tus servicios con precios, duración y monto de seña. Configurás tus horarios de atención. 15 minutos y listo.", color: "#e8f4f0" },
              { step: "02", icon: "share", title: "Compartís tu link", desc: "Ponés tupeluqueria.reservo.app en tu bio de Instagram. Tus clientas entran, eligen servicio, fecha y pagan la seña.", color: "#f0e8f4" },
              { step: "03", icon: "notifications", title: "Te llega el turno", desc: "Recibís un WhatsApp automático. El turno aparece en tu agenda. La seña está acreditada. No tenés que hacer nada.", color: "#f4f0e8" },
            ].map((s, i) => (
              <div key={i} className="card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -10, right: -10, fontSize: 64, fontWeight: 900, fontFamily: "'Manrope', sans-serif", color: "rgba(0,70,75,0.06)", lineHeight: 1 }}>{s.step}</div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <span className="msym" style={{ fontSize: 22, color: "#00464b" }}>{s.icon}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a18", marginBottom: 10, fontFamily: "'Manrope', sans-serif" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#555550", lineHeight: 1.7, fontWeight: 300 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="pill" style={{ background: "rgba(0,70,75,0.08)", color: "#00464b", marginBottom: 16 }}>Funcionalidades</span>
            <h2 className="serif" style={{ fontSize: 40, fontWeight: 900, color: "#1a1a18", marginTop: 16 }}>Todo lo que necesitás,<br />nada de lo que no</h2>
          </div>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "20px", borderRadius: 16, background: "#fafaf8", border: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(0,70,75,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="msym" style={{ fontSize: 20, color: "#00464b" }}>{f.icon}</span>
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a18", marginBottom: 4, fontFamily: "'Manrope', sans-serif" }}>{f.title}</h4>
                  <p style={{ fontSize: 13, color: "#555550", lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 24px", background: "#fafaf8" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="pill" style={{ background: "rgba(0,70,75,0.08)", color: "#00464b", marginBottom: 16 }}>Testimonios</span>
            <h2 className="serif" style={{ fontSize: 40, fontWeight: 900, color: "#1a1a18", marginTop: 16 }}>Lo que dicen quienes ya lo usan</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontSize: 32, lineHeight: 1, color: "rgba(0,70,75,0.15)", fontFamily: "serif" }}>"</div>
                <p style={{ fontSize: 14, color: "#3a3a38", lineHeight: 1.8, fontWeight: 300, fontStyle: "italic", flex: 1 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: t.textColor, flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#6f7979" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="pill" style={{ background: "rgba(0,70,75,0.08)", color: "#00464b", marginBottom: 16 }}>Planes y precios</span>
            <h2 className="serif" style={{ fontSize: 40, fontWeight: 900, color: "#1a1a18", marginTop: 16 }}>Empezá gratis.<br />Crecé cuando estés lista.</h2>
            <p style={{ fontSize: 15, color: "#555550", marginTop: 16, fontWeight: 300 }}>Sin contratos. Sin permanencia. Cancelás cuando querés.</p>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "start" }}>
            {plans.map((plan, i) => (
              <div key={i} style={{ borderRadius: 24, padding: "32px 28px", position: "relative", background: plan.color, border: plan.featured ? "none" : "1px solid rgba(0,0,0,0.07)", boxShadow: plan.featured ? "0 24px 60px rgba(0,70,75,0.25)" : "none", transform: plan.featured ? "scale(1.03)" : "scale(1)" }}>
                {plan.featured && (
                  <div style={{ position: "absolute", top: 16, right: 16 }}>
                    <span className="pill" style={{ background: "rgba(161,239,247,0.2)", color: "#a1eff7", fontSize: 11 }}>⭐ Más popular</span>
                  </div>
                )}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: plan.featured ? "rgba(255,255,255,0.7)" : "#6f7979", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 42, fontWeight: 900, color: plan.featured ? "#a1eff7" : "#00464b", lineHeight: 1 }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: 14, color: plan.featured ? "rgba(255,255,255,0.6)" : "#6f7979", fontWeight: 300 }}>{plan.period}</span>}
                  </div>
                  <p style={{ fontSize: 13, color: plan.featured ? "rgba(255,255,255,0.65)" : "#555550", fontWeight: 300 }}>{plan.desc}</p>
                </div>
                <ul style={{ listStyle: "none", marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: plan.featured ? "rgba(255,255,255,0.9)" : "#3a3a38", fontWeight: 400 }}>
                      <span className="msym check" style={{ background: plan.featured ? "rgba(255,255,255,0.15)" : "rgba(0,70,75,0.1)", fontSize: 12, color: plan.featured ? "#a1eff7" : "#00464b", marginTop: 1 }}>check</span>
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f, j) => (
                    <li key={`no-${j}`} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: plan.featured ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)", fontWeight: 300 }}>
                      <span className="msym cross" style={{ fontSize: 12, color: plan.featured ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)", marginTop: 1 }}>remove</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contacto" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "all 0.2s", background: plan.btnBg, color: plan.btnText }}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "#6f7979", fontWeight: 300 }}>
            Los precios están expresados en ARS. Podés pagar mensualmente. No requiere tarjeta para el plan Free.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "80px 24px", background: "#fafaf8" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="pill" style={{ background: "rgba(0,70,75,0.08)", color: "#00464b", marginBottom: 16 }}>Preguntas frecuentes</span>
            <h2 className="serif" style={{ fontSize: 40, fontWeight: 900, color: "#1a1a18", marginTop: 16 }}>¿Tenés dudas?</h2>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "8px 32px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}>
            {faqs.map((f, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <span className="msym" style={{ fontSize: 20, color: "#00464b", flexShrink: 0, transition: "transform 0.3s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
                </button>
                {openFaq === i && <p className="faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="contacto" style={{ padding: "96px 24px", background: "#00464b", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(161,239,247,0.06)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 className="serif" style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginBottom: 20, lineHeight: 1.1 }}>
            Empezá hoy.<br />Es gratis.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 40, lineHeight: 1.7, fontWeight: 300 }}>
            Escribinos por WhatsApp y en menos de 2 horas tenés tu Reservo configurado y listo para compartir con tus clientas.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://wa.me/5493804100986?text=Hola!%20Quiero%20empezar%20con%20Reservo"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 14, background: "#25D366", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 16, transition: "all 0.2s", boxShadow: "0 8px 24px rgba(37,211,102,0.3)" }}
            >
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Escribinos por WhatsApp
            </a>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
            Te respondemos en menos de 2 horas · Lunes a sábado de 9 a 20hs
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", background: "#0d2b2e", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo.png" alt="Reservo" style={{ height: 44, width: "auto", borderRadius: 8 }} />
          </a>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
            Sistema SaaS de turnos · Argentina · 2026
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Términos", "Privacidad", "Contacto"].map((item, i) => (
              <a key={i} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
