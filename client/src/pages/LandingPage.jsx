import { useState, useEffect } from "react";

const features = [
  { icon: "calendar_month", title: "Turnos ilimitados", desc: "Agenda inteligente sin límites" },
  { icon: "payments", title: "Pagos Online", desc: "MercadoPago integrado" },
  { icon: "chat", title: "WhatsApp Automático", desc: "Confirmaciones y recordatorios" },
  { icon: "star", title: "Puntos y Descuentos", desc: "Fidelizá a tus clientes" },
  { icon: "bar_chart", title: "Reportes y Estadísticas", desc: "Datos de tu negocio en tiempo real" },
];

const plans = [
  {
    name: "BÁSICO",
    price: "$149.999",
    monthlyPrice: "$9.990",
    period: "ARS",
    subtext: "PAGO ÚNICO",
    monthlySubtext: "o $9.990/mes",
    desc: "1 profesional",
    icon: "person",
    features: [
      "1 profesional / usuario",
      "WhatsApp automático",
      "MercadoPago (señas y pagos)",
      "Turnos ilimitados",
      "Puntos y descuentos",
    ],
    notIncluded: [],
    featured: false,
    badge: null,
    footer: "Ideal para empezar y crecer",
    footerIcon: "rocket_launch",
  },
  {
    name: "PRO",
    price: "$299.999",
    monthlyPrice: "$19.990",
    period: "ARS",
    subtext: "PAGO ÚNICO",
    monthlySubtext: "o $19.990/mes",
    desc: "Hasta 5 profesionales",
    icon: "group",
    features: [
      "Hasta 5 profesionales",
      "WhatsApp automático",
      "MercadoPago (señas y pagos)",
      "Turnos ilimitados",
      "Puntos y descuentos",
      "Reportes y estadísticas",
    ],
    notIncluded: [],
    featured: true,
    badge: "MÁS POPULAR",
    footer: "Para negocios en crecimiento",
    footerIcon: "trending_up",
  },
  {
    name: "ENTERPRISE",
    price: "A CONVENIR",
    monthlyPrice: null,
    period: "",
    subtext: "PAGO ÚNICO",
    monthlySubtext: "",
    desc: "Personalizado",
    icon: "apartment",
    features: [
      "Código fuente completo",
      "Personalizaciones a medida",
      "Branding propio (tu marca)",
      "Multi-sucursales y roles",
      "Integraciones avanzadas",
      "Soporte prioritario",
    ],
    notIncluded: [],
    featured: false,
    badge: null,
    footer: "Para negocios que quieren más",
    footerIcon: "domain",
  },
];

const monthlyIncludes = [
  { icon: "cloud", text: "Hosting y mantenimiento" },
  { icon: "system_update", text: "Actualizaciones continuas" },
  { icon: "support_agent", text: "Soporte técnico" },
  { icon: "backup", text: "Backups de seguridad" },
  { icon: "monitoring", text: "Monitoreo del sistema" },
];

const comparison = [
  { feature: "Precio", basico: "$149.999\no $9.990/mes", pro: "$299.999\no $19.990/mes", competidor: "$14.999/mes\n(Plan Premium)" },
  { feature: "Profesionales / Usuarios", basico: "1 usuario", pro: "Hasta 5 profesionales", competidor: "Múltiples profesionales" },
  { feature: "WhatsApp Automático", basico: true, pro: true, competidor: true },
  { feature: "MercadoPago (Señas)", basico: true, pro: true, competidor: true },
  { feature: "Puntos y Descuentos", basico: true, pro: true, competidor: false },
  { feature: "Reportes", basico: false, pro: true, competidor: "Estadísticas básicas" },
];

const faqs = [
  { q: "¿Necesito saber programar?", a: "Para nada. Te configuramos todo nosotros. Vos solo cargás tus servicios, horarios y listo." },
  { q: "¿Mis clientes tienen que bajarse algo?", a: "No. Entran desde cualquier celular al link que les mandás y reservan. No hay app que instalar." },
  { q: "¿Qué pasa si no tengo MercadoPago?", a: "Podés usar el modo transferencia: el sistema muestra tu CBU o alias y el cliente te avisa por WhatsApp cuando pagó." },
  { q: "¿Puedo probar antes de pagar?", a: "Sí. El plan Free te deja probar el sistema completo con hasta 30 turnos por mes. Sin tarjeta, sin compromiso." },
  { q: "¿Funciona para servicio a domicilio?", a: "Sí, está pensado especialmente para eso. Podés definir zonas de cobertura y tus clientes ven si llegás a su barrio." },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoNombre, setDemoNombre] = useState('');
  const [demoNegocio, setDemoNegocio] = useState('');
  const [demoTelefono, setDemoTelefono] = useState('');
  const [demoEnviado, setDemoEnviado] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#fcf8ff", color: "#181445", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700&family=Inter:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .hl { font-family: 'Hanken Grotesk', sans-serif; }
        .pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; }
        .btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px; border-radius: 14px; font-weight: 700; font-size: 15px; background: #4648d4; color: #fff; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .btn-primary:hover { background: #3a3cb8; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(70,72,212,0.25); }
        .btn-ghost { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px; border-radius: 14px; font-weight: 600; font-size: 15px; background: transparent; color: #4648d4; border: 1.5px solid #4648d4; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .btn-ghost:hover { background: rgba(70,72,212,0.06); }
        .card { background: #fff; border-radius: 20px; padding: 28px; box-shadow: 0 4px 12px rgba(30,27,75,0.05); transition: all 0.3s; border: 1px solid rgba(224,231,255,0.5); }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(30,27,75,0.1); }
        .msym { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .faq-item { border-bottom: 1px solid rgba(199,196,215,0.3); }
        .faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 20px 0; background: none; border: none; cursor: pointer; font-size: 15px; font-weight: 600; color: #181445; text-align: left; gap: 16px; font-family: 'Inter', sans-serif; }
        .faq-a { font-size: 14px; line-height: 1.7; color: #464554; padding-bottom: 20px; }
        .check-icon { display: inline-flex; width: 20px; height: 20px; border-radius: 50%; align-items: center; justify-content: center; background: rgba(70,72,212,0.1); flex-shrink: 0; }
        .cross-icon { display: inline-flex; width: 20px; height: 20px; border-radius: 50%; align-items: center; justify-content: center; background: rgba(186,26,26,0.1); flex-shrink: 0; }
        .gradient-text { background: linear-gradient(135deg, #4648d4 0%, #6a63f2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } .grid-3 { grid-template-columns: 1fr !important; } .grid-2 { grid-template-columns: 1fr !important; } .hero-btns { flex-direction: column; } .hero-h1 { font-size: 36px !important; } .comparison-table { font-size: 12px !important; } }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, padding: "0 24px", background: scrolled ? "rgba(252,248,255,0.92)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(199,196,215,0.3)" : "none", transition: "all 0.3s", height: 72, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img src="/logo.png" alt="Slotify" style={{ height: 44, width: "auto", borderRadius: 10 }} />
            <span className="hl" style={{ fontSize: 22, fontWeight: 700, color: "#4648d4", letterSpacing: "-0.01em" }}>Slotify</span>
          </a>
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {["Cómo funciona", "Planes", "Comparativa", "Preguntas"].map((item, i) => (
              <a key={i} href={`#${["como-funciona", "planes", "comparativa", "faq"][i]}`} style={{ fontSize: 14, fontWeight: 500, color: "#464554", textDecoration: "none" }}>{item}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="/admin/login" style={{ fontSize: 13, fontWeight: 500, color: "#464554", textDecoration: "none", padding: "10px 18px" }}>Iniciar sesión</a>
            <a href="/registro" className="btn-primary" style={{ padding: "10px 18px", fontSize: 13 }}>Empezá gratis</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 120, paddingBottom: 60, paddingLeft: 24, paddingRight: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(70,72,212,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ marginBottom: 24 }}>
            <span className="pill" style={{ background: "rgba(70,72,212,0.08)", color: "#4648d4" }}>
              <span className="msym" style={{ fontSize: 14 }}>auto_awesome</span>
              Sistema de Turnos Inteligente
            </span>
          </div>
          <h1 className="hero-h1 hl" style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#181445" }}>
            Gestioná tu negocio,<br />
            llená tu agenda,<br />
            <span className="gradient-text">hacé crecer tu marca.</span>
          </h1>
          <p style={{ fontSize: 17, color: "#464554", lineHeight: 1.75, maxWidth: 520, marginBottom: 40, fontWeight: 400 }}>
            Slotify es la solución todo en uno para negocios que trabajan con turnos.
          </p>

          {/* Feature icons */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 48 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 100 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(70,72,212,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="msym" style={{ fontSize: 24, color: "#4648d4" }}>{f.icon}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#181445", textAlign: "center" }}>{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES DE PAGO ÚNICO */}
      <section id="planes" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 className="hl" style={{ fontSize: 40, fontWeight: 700, color: "#181445", marginBottom: 8 }}>PLANES</h2>
            <p style={{ fontSize: 15, color: "#464554", fontWeight: 400 }}>Elegí la modalidad que mejor se adapte a tu negocio</p>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start" }}>
            {plans.map((plan, i) => (
              <div key={i} className="card" style={{ position: "relative", overflow: "hidden", border: plan.featured ? "2px solid #4648d4" : "1px solid rgba(224,231,255,0.5)", transform: plan.featured ? "scale(1.02)" : "scale(1)", boxShadow: plan.featured ? "0 24px 60px rgba(70,72,212,0.15)" : "0 4px 12px rgba(30,27,75,0.05)" }}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "#4648d4", color: "#fff", textAlign: "center", padding: "6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ textAlign: "center", padding: plan.badge ? "32px 0 0" : "0 0 24px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: plan.featured ? "rgba(70,72,212,0.1)" : "rgba(70,72,212,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <span className="msym" style={{ fontSize: 24, color: "#4648d4" }}>{plan.icon}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#181445", marginBottom: 4, letterSpacing: "0.04em" }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: "#464554", marginBottom: 16 }}>{plan.desc}</div>
                  {/* One-time price */}
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 2 }}>
                    <span className="msym" style={{ fontSize: 16, color: "#4648d4" }}>payments</span>
                    <span className="hl" style={{ fontSize: plan.price === "A CONVENIR" ? 24 : 36, fontWeight: 700, color: "#4648d4", lineHeight: 1 }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: 12, color: "#464554", fontWeight: 400 }}>{plan.period}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#767586", marginBottom: 12 }}>{plan.subtext}</div>
                  {/* Monthly price */}
                  {plan.monthlyPrice && (
                    <div style={{ background: "rgba(70,72,212,0.06)", borderRadius: 10, padding: "8px 12px", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                        <span className="msym" style={{ fontSize: 14, color: "#4648d4" }}>credit_card</span>
                        <span className="hl" style={{ fontSize: 20, fontWeight: 700, color: "#181445" }}>{plan.monthlyPrice}</span>
                        <span style={{ fontSize: 12, color: "#464554" }}>/mes</span>
                      </div>
                    </div>
                  )}
                  {plan.monthlySubtext && !plan.monthlyPrice && (
                    <div style={{ fontSize: 12, color: "#767586", marginBottom: 8 }}>{plan.monthlySubtext}</div>
                  )}
                </div>
                <ul style={{ listStyle: "none", marginBottom: 24, display: "flex", flexDirection: "column", gap: 10, padding: "0 20px" }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#181445", fontWeight: 400 }}>
                      <span className="msym check-icon" style={{ fontSize: 14, color: "#4648d4", marginTop: 1 }}>check</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: "1px solid rgba(224,231,255,0.5)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="msym" style={{ fontSize: 18, color: "#4648d4" }}>{plan.footerIcon}</span>
                  <span style={{ fontSize: 12, color: "#464554", fontWeight: 500 }}>{plan.footer}</span>
                </div>
              </div>
            ))}
          </div>

          {/* What's included in monthly */}
          <div style={{ marginTop: 48, background: "rgba(70,72,212,0.04)", borderRadius: 20, padding: "32px", border: "1px solid rgba(224,231,255,0.5)" }}>
            <h3 className="hl" style={{ fontSize: 20, fontWeight: 600, color: "#181445", marginBottom: 20, textAlign: "center" }}>¿Qué incluye el servicio mensual?</h3>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
              {monthlyIncludes.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: "#fff", border: "1px solid rgba(224,231,255,0.5)" }}>
                  <span className="msym" style={{ fontSize: 18, color: "#4648d4" }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: "#181445", fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIVA */}
      <section id="comparativa" style={{ padding: "80px 24px", background: "#fcf8ff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="hl" style={{ fontSize: 36, fontWeight: 700, color: "#181445" }}>
              ¿POR QUÉ ELEGIR <span style={{ color: "#4648d4" }}>SLOTIFY</span>?
            </h2>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 12px rgba(30,27,75,0.05)", border: "1px solid rgba(224,231,255,0.5)" }}>
            <table className="comparison-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(224,231,255,0.5)" }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: 600, color: "#464554", fontSize: 12, letterSpacing: "0.04em" }}>Característica</th>
                  <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: 700, color: "#4648d4", fontSize: 13 }}>Tu Plan Básico</th>
                  <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: 700, color: "#4648d4", fontSize: 13 }}>Tu Plan Pro</th>
                  <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: 600, color: "#767586", fontSize: 12 }}>ReservaSimple<br/><span style={{ fontSize: 11, fontWeight: 400 }}>(Competidor Principal)</span></th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < comparison.length - 1 ? "1px solid rgba(224,231,255,0.3)" : "none" }}>
                    <td style={{ padding: "14px 20px", fontWeight: 500, color: "#181445" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="msym" style={{ fontSize: 16, color: "#767586" }}>
                          {i === 0 ? "payments" : i === 1 ? "group" : i === 2 ? "chat" : i === 3 ? "payments" : i === 4 ? "star" : "bar_chart"}
                        </span>
                        {row.feature}
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      {typeof row.basico === "boolean" ? (
                        row.basico ? <span className="msym check-icon" style={{ color: "#4648d4" }}>check</span> : <span className="msym cross-icon" style={{ color: "#ba1a1a" }}>close</span>
                      ) : <span style={{ fontWeight: 600, color: "#4648d4" }}>{row.basico}</span>}
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      {typeof row.pro === "boolean" ? (
                        row.pro ? <span className="msym check-icon" style={{ color: "#4648d4" }}>check</span> : <span className="msym cross-icon" style={{ color: "#ba1a1a" }}>close</span>
                      ) : <span style={{ fontWeight: 600, color: "#4648d4" }}>{row.pro}</span>}
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center", color: "#767586", whiteSpace: "pre-line" }}>
                      {typeof row.competidor === "boolean" ? (
                        row.competidor ? <span className="msym check-icon" style={{ color: "#767586" }}>check</span> : <span className="msym cross-icon" style={{ color: "#ba1a1a" }}>close</span>
                      ) : row.competidor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="pill" style={{ background: "rgba(70,72,212,0.08)", color: "#4648d4" }}>¿Cómo funciona?</span>
            <h2 className="hl" style={{ fontSize: 40, fontWeight: 700, color: "#181445", marginTop: 16 }}>En tres pasos, arrancás</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { step: "01", icon: "settings", title: "Configurás tu perfil", desc: "Cargás tus servicios con precios, duración y monto de seña. Configurás tus horarios de atención. 15 minutos y listo.", color: "rgba(70,72,212,0.06)" },
              { step: "02", icon: "share", title: "Compartís tu link", desc: "Ponés tunegocio.slotifyapp.site en tu bio de Instagram. Tus clientas entran, eligen servicio, fecha y pagan la seña.", color: "rgba(106,99,242,0.06)" },
              { step: "03", icon: "notifications", title: "Te llega el turno", desc: "Recibís un WhatsApp automático. El turno aparece en tu agenda. La seña está acreditada. No tenés que hacer nada.", color: "rgba(81,72,215,0.06)" },
            ].map((s, i) => (
              <div key={i} className="card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -10, right: -10, fontSize: 64, fontWeight: 700, fontFamily: "'Hanken Grotesk', sans-serif", color: "rgba(70,72,212,0.06)", lineHeight: 1 }}>{s.step}</div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <span className="msym" style={{ fontSize: 22, color: "#4648d4" }}>{s.icon}</span>
                </div>
                <h3 className="hl" style={{ fontSize: 17, fontWeight: 600, color: "#181445", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#464554", lineHeight: 1.7, fontWeight: 400 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section style={{ padding: "80px 24px", background: "#fcf8ff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="pill" style={{ background: "rgba(70,72,212,0.08)", color: "#4648d4" }}>Testimonios</span>
            <h2 className="hl" style={{ fontSize: 40, fontWeight: 700, color: "#181445", marginTop: 16 }}>Lo que dicen quienes ya lo usan</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { name: "Valentina M.", role: "Manicura a domicilio · La Rioja", text: "Antes coordinaba todo por WhatsApp y se me cruzaban los turnos. Ahora mis clientas reservan solas y yo solo confirmo. Me cambió la vida.", avatar: "V", color: "rgba(70,72,212,0.1)" },
              { name: "Rocío P.", role: "Salón de belleza · Córdoba", text: "Lo que más me gustó fue el sistema de señas. Ya no tengo cancelaciones de último momento. Si alguien cancela, el dinero está. Punto.", avatar: "R", color: "rgba(106,99,242,0.1)" },
              { name: "Camila D.", role: "Pestañista · Buenos Aires", text: "Mis clientas me preguntan cómo hice para tener una app propia. Les digo que es Slotify y no lo pueden creer por el precio que pago.", avatar: "C", color: "rgba(81,72,215,0.1)" },
            ].map((t, i) => (
              <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontSize: 32, lineHeight: 1, color: "rgba(70,72,212,0.15)", fontFamily: "serif" }}>"</div>
                <p style={{ fontSize: 14, color: "#464554", lineHeight: 1.8, fontWeight: 400, fontStyle: "italic", flex: 1 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#4648d4", flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#181445" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#767586" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="pill" style={{ background: "rgba(70,72,212,0.08)", color: "#4648d4" }}>Preguntas frecuentes</span>
            <h2 className="hl" style={{ fontSize: 40, fontWeight: 700, color: "#181445", marginTop: 16 }}>¿Tenés dudas?</h2>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "8px 32px", boxShadow: "0 4px 12px rgba(30,27,75,0.05)", border: "1px solid rgba(224,231,255,0.5)" }}>
            {faqs.map((f, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <span className="msym" style={{ fontSize: 20, color: "#4648d4", flexShrink: 0, transition: "transform 0.3s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
                </button>
                {openFaq === i && <p className="faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="contacto" style={{ padding: "80px 24px", background: "#4648d4", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(225,224,255,0.08)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative" }}>
          <div>
            <h2 className="hl" style={{ fontSize: 40, fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
              Más tiempo para vos,<br />más felicidad para tus clientes.
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", marginBottom: 32, lineHeight: 1.7, fontWeight: 400 }}>
              Escribinos y en menos de 2 horas tenés tu Slotify configurado y listo para compartir.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {["Fácil de usar", "Todo en un solo lugar", "Soporte real", "Actualizaciones constantes"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="msym check-icon" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 14 }}>check</span>
                  <span style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="/registro"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 14, background: "#fff", color: "#4648d4", textDecoration: "none", fontWeight: 700, fontSize: 16, transition: "all 0.2s", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
              >
                Empezá gratis
                <span className="msym" style={{ fontSize: 18 }}>arrow_forward</span>
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setDemoModalOpen(true); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 14, background: "rgba(255,255,255,0.15)", color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 15, transition: "all 0.2s", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                Solicitá tu demo
              </a>
            </div>
          </div>
          <div className="hide-mobile" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { icon: "cloud", title: "En la nube", desc: "Accedé desde cualquier dispositivo, en cualquier momento." },
              { icon: "extension", title: "Integraciones", desc: "MercadoPago, WhatsApp (Twilio) y más." },
              { icon: "headset_mic", title: "Soporte real", desc: "Te acompañamos siempre que lo necesites." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "20px", borderRadius: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="msym" style={{ fontSize: 22, color: "#fff" }}>{item.icon}</span>
                </div>
                <div>
                  <h4 className="hl" style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{item.title}</h4>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", background: "#181445", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo.png" alt="Slotify" style={{ height: 36, width: "auto", borderRadius: 8 }} />
            <span className="hl" style={{ fontSize: 18, fontWeight: 700, color: "#c0c1ff" }}>Slotify</span>
          </a>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>
            Sistema SaaS de turnos · Argentina · 2026
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="/terminos" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Términos</a>
            <a href="/privacidad" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Privacidad</a>
            <a href="mailto:admin@slotifyapp.site" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Contacto</a>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {demoModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => { setDemoModalOpen(false); setDemoEnviado(false); }} />
          <div style={{ position: "relative", background: "#fff", borderRadius: 20, padding: 32, maxWidth: 420, width: "100%", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
            <button
              onClick={() => { setDemoModalOpen(false); setDemoEnviado(false); }}
              style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              <span className="msym" style={{ fontSize: 20, color: "#666" }}>close</span>
            </button>

            {demoEnviado ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(70,72,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <span className="msym" style={{ fontSize: 28, color: "#4648d4" }}>check_circle</span>
                </div>
                <h3 className="hl" style={{ fontSize: 20, fontWeight: 700, color: "#181445", marginBottom: 8 }}>¡Solicitud enviada!</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
                  Te vamos a contactar por WhatsApp para coordinar tu demo personalizada.
                </p>
                <button
                  onClick={() => { setDemoModalOpen(false); setDemoEnviado(false); }}
                  style={{ padding: "12px 24px", borderRadius: 12, background: "#4648d4", color: "#fff", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(70,72,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <span className="msym" style={{ fontSize: 28, color: "#4648d4" }}>play_circle</span>
                  </div>
                  <h3 className="hl" style={{ fontSize: 20, fontWeight: 700, color: "#181445", marginBottom: 4 }}>Solicitá tu demo</h3>
                  <p style={{ fontSize: 13, color: "#666" }}>Te mostramos Slotify en acción con tu negocio</p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const msg = `Hola! Quiero una demo de Slotify.\n\nNombre: ${demoNombre}\nNegocio: ${demoNegocio}\nTeléfono: ${demoTelefono}`;
                  window.open(`https://wa.me/542966249491?text=${encodeURIComponent(msg)}`, '_blank');
                  setDemoEnviado(true);
                }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input
                    placeholder="Tu nombre"
                    value={demoNombre}
                    onChange={e => setDemoNombre(e.target.value)}
                    required
                    style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #e0e0e0", fontSize: 14, outline: "none", fontFamily: "'Inter', sans-serif" }}
                  />
                  <input
                    placeholder="Nombre de tu negocio"
                    value={demoNegocio}
                    onChange={e => setDemoNegocio(e.target.value)}
                    required
                    style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #e0e0e0", fontSize: 14, outline: "none", fontFamily: "'Inter', sans-serif" }}
                  />
                  <input
                    placeholder="Tu WhatsApp"
                    value={demoTelefono}
                    onChange={e => setDemoTelefono(e.target.value)}
                    required
                    style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #e0e0e0", fontSize: 14, outline: "none", fontFamily: "'Inter', sans-serif" }}
                  />
                  <button
                    type="submit"
                    style={{ padding: "14px", borderRadius: 12, background: "#4648d4", color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <span className="msym" style={{ fontSize: 18 }}>chat</span>
                    Enviar por WhatsApp
                  </button>
                  <p style={{ fontSize: 11, color: "#999", textAlign: "center" }}>Te respondemos al instante por WhatsApp</p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
