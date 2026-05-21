const translations = {
  es: {
    // Navigation
    'nav.calendar': 'Calendario',
    'nav.clients': 'Clientes',
    'nav.services': 'Servicios',
    'nav.rewards': 'Recompensas',
    'nav.settings': 'Configuración',
    'nav.logout': 'Salir',

    // Admin
    'admin.welcome': 'Bienvenido de nuevo',
    'admin.today': 'Agenda del día',
    'admin.no_turns': 'Sin turnos',
    'admin.new_booking': 'Nueva reserva',

     // Services
     'services.title': 'Servicios',
     'services.subtitle': 'Gestiona tu catálogo de servicios',
     'services.add': 'Agregar',
     'services.edit': 'Editar',
     'services.delete': 'Eliminar',
     'services.name': 'Nombre',
     'services.category': 'Rubro',
     'services.price': 'Precio',
     'services.duration': 'Duración',
     'services.deposit': 'Seña',
     'services.pointsDescription': 'Los puntos se otorgan al cliente cuando se completa el servicio.',
     'services.save': 'Guardar servicio',
     'services.saving': 'Guardando...',
     'services.new': 'Nuevo servicio',
     'services.editing': 'Editar servicio',
     'services.empty': 'No hay servicios registrados',
     'services.empty_subtitle': 'Crea tu primer servicio para empezar',

    // Clients
    'clients.title': 'Clientes',
    'clients.subtitle': 'Gestiona tu base de clientes',
    'clients.search': 'Buscar por nombre o teléfono...',
    'clients.empty': 'No hay clientes registrados',
    'clients.since': 'Desde',
    'clients.points': 'puntos',
    'clients.detail': 'Ver detalle',
    'clients.back': 'Volver a clientes',
    'clients.call': 'Llamar',
    'clients.whatsapp': 'WhatsApp',
    'clients.history': 'Historial',
    'clients.notes': 'Notas',
    'clients.total_turns': 'Total Turnos',
    'clients.completed': 'Completados',
    'clients.cancelled': 'Cancelados',
    'clients.total_spent': 'Total Señado',
    'clients.loyalty': 'Puntos de Fidelidad',
    'clients.premium': 'Premium Client',
    'clients.no_history': 'No hay turnos registrados',

    // Settings
    'settings.title': 'Configuración',
    'settings.subtitle': 'Personaliza tu negocio',
    'settings.schedule': 'Horarios de atención',
    'settings.active': 'Activo',
    'settings.whatsapp': 'WhatsApp',
    'settings.whatsapp_phone': 'Teléfono para notificaciones',
    'settings.save': 'Guardar configuración',
    'settings.saving': 'Guardando...',
    'settings.theme': 'Tema',
    'settings.theme_light': 'Claro',
    'settings.theme_dark': 'Oscuro',
    'settings.theme_system': 'Sistema',
    'settings.language': 'Idioma',
    'settings.language_es': 'Español',
    'settings.language_en': 'Inglés',

    // Rewards
    'rewards.title': 'Incentivos',
    'rewards.subtitle': 'Configura descuentos por puntos de fidelidad',
    'rewards.add': 'Agregar',
    'rewards.name': 'Nombre',
    'rewards.points_required': 'Puntos requeridos',
    'rewards.discount_type': 'Tipo de descuento',
    'rewards.percentage': 'Porcentaje (%)',
    'rewards.fixed': 'Monto fijo ($)',
    'rewards.value': 'Valor del descuento',
    'rewards.save': 'Guardar incentivo',
    'rewards.new': 'Nuevo incentivo',
    'rewards.editing': 'Editar incentivo',
    'rewards.empty': 'No hay incentivos configurados',
    'rewards.empty_subtitle': 'Configura descuentos por puntos de fidelidad',

    // Booking
    'booking.choose_service': 'Elegí tu servicio',
    'booking.choose_service_subtitle': 'Seleccioná el servicio que necesitás',
    'booking.choose_date': 'Elegí fecha y horario',
    'booking.choose_day': 'Elegí el día',
    'booking.your_data': 'Tus datos',
    'booking.your_data_subtitle': 'Necesitamos tus datos para confirmar el turno',
     'booking.confirm': 'Confirmar y pagar seña',
     'booking.confirm_button': 'Confirmar',
     'booking.reserved': '¡Turno reservado!',
     'booking.reserved_subtitle': 'Te enviamos un WhatsApp con la confirmación.',
     'booking.another': 'Agendar otro turno',
     'booking.name': 'Nombre',
     'booking.lastname': 'Apellido',
     'booking.phone': 'Teléfono',
     'booking.phone_subtitle': 'Con tu teléfono te identificamos en tu próxima visita',
     'booking.continue': 'Continuar',
     'booking.pay': 'Pagar seña',
     'booking.processing': 'Procesando...',
     'booking.redirecting': 'Redirigiendo al pago...',
     'booking.no_slots': 'No hay horarios disponibles',
     'booking.no_slots_subtitle': 'Probá con otro día',
     'booking.select_slot': 'Confirmar',
     'booking.summary': 'Resumen del turno',
     'booking.service': 'Servicio',
     'booking.date': 'Fecha',
     'booking.time': 'Hora',
     'booking.duration': 'Duración',
     'booking.client': 'Cliente',
     'booking.total_price': 'Precio total',
     'booking.deposit_amount': 'Seña a pagar',
     'booking.points_earned_label': 'Puntos que ganarás:',
     'booking.points_earned_value': '10 PTS',
     'booking.terms': 'Al pagar aceptás los términos y condiciones del servicio.',
     'booking.loyal_client': 'Cliente frecuente',
     'booking.next_reward': 'puntos para',

    // Login
    'login.title': 'Reservo',
    'login.subtitle': 'Panel de Administración',
    'login.email': 'Email',
    'login.password': 'Contraseña',
    'login.submit': 'Ingresar',
    'login.loading': 'Ingresando...',
    'login.error': 'Email o contraseña incorrectos',
    'login.footer': 'Reservo — Sistema de gestión de turnos',

    // General
    'general.loading': 'Cargando...',
    'general.error': 'Ocurrió un error',
    'general.save': 'Guardar',
    'general.cancel': 'Cancelar',
    'general.delete': 'Eliminar',
    'general.confirm': 'Confirmar',
    'general.back': 'Volver',
    'general.next': 'Siguiente',
    'general.previous': 'Anterior',
    'general.of': 'de',
    'general.min': 'min',
    'general.pts': 'PTS',
  },

  en: {
    // Navigation
    'nav.calendar': 'Calendar',
    'nav.clients': 'Clients',
    'nav.services': 'Services',
    'nav.rewards': 'Rewards',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',

    // Admin
    'admin.welcome': 'Welcome back',
    'admin.today': 'Today\'s Schedule',
    'admin.no_turns': 'No appointments',
    'admin.new_booking': 'New Booking',

     // Services
     'services.title': 'Services',
     'services.subtitle': 'Manage your service catalog',
     'services.add': 'Add',
     'services.edit': 'Edit',
     'services.delete': 'Delete',
     'services.name': 'Name',
     'services.category': 'Category',
     'services.price': 'Price',
     'services.duration': 'Duration',
     'services.deposit': 'Deposit',
     'services.pointsDescription': 'Points are awarded to the client when the service is completed.',
     'services.save': 'Save service',
     'services.saving': 'Saving...',
     'services.new': 'New service',
     'services.editing': 'Edit service',
     'services.empty': 'No services registered',
     'services.empty_subtitle': 'Create your first service to get started',

    // Clients
    'clients.title': 'Clients',
    'clients.subtitle': 'Manage your client base',
    'clients.search': 'Search by name or phone...',
    'clients.empty': 'No clients registered',
    'clients.since': 'Since',
    'clients.points': 'points',
    'clients.detail': 'View details',
    'clients.back': 'Back to clients',
    'clients.call': 'Call',
    'clients.whatsapp': 'WhatsApp',
    'clients.history': 'History',
    'clients.notes': 'Notes',
    'clients.total_turns': 'Total Appointments',
    'clients.completed': 'Completed',
    'clients.cancelled': 'Cancelled',
    'clients.total_spent': 'Total Deposited',
    'clients.loyalty': 'Loyalty Points',
    'clients.premium': 'Premium Client',
    'clients.no_history': 'No appointments recorded',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your business',
    'settings.schedule': 'Business Hours',
    'settings.active': 'Active',
    'settings.whatsapp': 'WhatsApp',
    'settings.whatsapp_phone': 'Phone for notifications',
    'settings.save': 'Save settings',
    'settings.saving': 'Saving...',
    'settings.theme': 'Theme',
    'settings.theme_light': 'Light',
    'settings.theme_dark': 'Dark',
    'settings.theme_system': 'System',
    'settings.language': 'Language',
    'settings.language_es': 'Spanish',
    'settings.language_en': 'English',

    // Rewards
    'rewards.title': 'Rewards',
    'rewards.subtitle': 'Configure loyalty point discounts',
    'rewards.add': 'Add',
    'rewards.name': 'Name',
    'rewards.points_required': 'Points required',
    'rewards.discount_type': 'Discount type',
    'rewards.percentage': 'Percentage (%)',
    'rewards.fixed': 'Fixed amount ($)',
    'rewards.value': 'Discount value',
    'rewards.save': 'Save reward',
    'rewards.new': 'New reward',
    'rewards.editing': 'Edit reward',
    'rewards.empty': 'No rewards configured',
    'rewards.empty_subtitle': 'Create discounts for loyalty points',

    // Booking
    'booking.choose_service': 'Choose your service',
    'booking.choose_service_subtitle': 'Select the service you need',
    'booking.choose_date': 'Choose date and time',
    'booking.choose_day': 'Choose the day',
    'booking.your_data': 'Your details',
    'booking.your_data_subtitle': 'We need your details to confirm the appointment',
     'booking.confirm': 'Confirm and pay deposit',
     'booking.confirm_button': 'Confirm',
     'booking.reserved': 'Appointment booked!',
     'booking.reserved_subtitle': 'We sent you a WhatsApp confirmation.',
     'booking.another': 'Book another appointment',
     'booking.name': 'First name',
     'booking.lastname': 'Last name',
     'booking.phone': 'Phone',
     'booking.phone_subtitle': 'We use your phone to identify you on your next visit',
     'booking.continue': 'Continue',
     'booking.pay': 'Pay deposit',
     'booking.processing': 'Processing...',
     'booking.redirecting': 'Redirecting to payment...',
     'booking.no_slots': 'No available times',
     'booking.no_slots_subtitle': 'Try another day',
     'booking.select_slot': 'Confirm',
     'booking.summary': 'Appointment summary',
     'booking.service': 'Service',
     'booking.date': 'Date',
     'booking.time': 'Time',
     'booking.duration': 'Duration',
     'booking.client': 'Client',
     'booking.total_price': 'Total price',
     'booking.deposit_amount': 'Deposit to pay',
     'booking.points_earned_label': 'Points you will earn:',
     'booking.points_earned_value': '10 PTS',
     'booking.terms': 'By paying you agree to the service terms and conditions.',
     'booking.loyal_client': 'Frequent client',
     'booking.next_reward': 'points for',

    // Login
    'login.title': 'Reservo',
    'login.subtitle': 'Admin Panel',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Sign in',
    'login.loading': 'Signing in...',
    'login.error': 'Invalid email or password',
    'login.footer': 'Reservo — Appointment Management System',

    // General
    'general.loading': 'Loading...',
    'general.error': 'An error occurred',
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    'general.delete': 'Delete',
    'general.confirm': 'Confirm',
    'general.back': 'Back',
    'general.next': 'Next',
    'general.previous': 'Previous',
    'general.of': 'of',
    'general.min': 'min',
    'general.pts': 'PTS',
  },
};

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reservo-lang');
      if (saved) return saved;
      return navigator.language.startsWith('es') ? 'es' : 'en';
    }
    return 'es';
  });

  useEffect(() => {
    localStorage.setItem('reservo-lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => translations[language]?.[key] || translations['es']?.[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
