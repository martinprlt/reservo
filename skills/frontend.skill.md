# Skill: Reservo — Frontend (React + Vite PWA)

## Arquitectura de estado

- **Zustand** para estado global (booking wizard y sesión admin)
- **react-hook-form + Zod** para formularios — mismos schemas que el back
- **axios** con interceptores para las llamadas a la API
- Sin Redux, sin Context para estado global

## Convenciones de componentes

- Archivos: `PascalCase.jsx`
- Componentes: funcionales con hooks, sin class components
- Props: siempre desestructuradas en la firma
- Estilos: Tailwind utility classes únicamente, sin CSS modules

## Llamadas a la API

Todas las llamadas van por `src/api/client.js`:

```js
import axios from 'axios';
const api = axios.create({
  baseURL: window.location.origin + '/api',
  withCredentials: true, // necesario para la cookie HttpOnly del admin
});
export default api;
```

Nunca llamar a `fetch` o `axios` directamente desde componentes.
Siempre pasar por el cliente centralizado.

## Booking flow — wizard de 4 pasos

El wizard vive todo en `/booking` (una sola ruta).
El paso actual se maneja en `bookingStore.paso`.
No usar `useNavigate` entre pasos — solo cambiar el estado del store.

```
paso 1 → Step1Servicio   (elegir servicio)
paso 2 → Step2Horario    (elegir fecha y slot)
paso 3 → Step3Datos      (nombre, apellido, teléfono)
paso 4 → Step4Pago       (resumen + pagar seña)
```

## Manejo de errores en el front

```js
try {
  const { data } = await api.post('/turnos', body);
  store.setTurno(data.turnoId, data.initPoint);
} catch (err) {
  const code = err.response?.data?.error;
  if (code === 'SLOT_NO_DISPONIBLE') {
    store.setError('El horario ya no está disponible. Elegí otro.');
    store.seleccionarServicio(store.servicioSeleccionado); // vuelve al paso 2
  } else {
    store.setError('Ocurrió un error. Intentá de nuevo.');
  }
}
```

## Personalización por tenant (theming)

`src/utils/tema.js` lee `tenant.config` e inyecta CSS variables:

```js
document.documentElement.style.setProperty('--color-primary', config.colorPrimario);
```

Los componentes usan `var(--color-primary)` para adaptarse a cada tenant.

## PWA

`vite-plugin-pwa` genera `manifest.json` y `service-worker` automáticamente.
No modificar el SW manualmente.
El manifest está configurado en `vite.config.js` con:
- `display: 'standalone'`
- `theme_color: '#1E3A5F'` (o el del tenant si se configura)

## Rutas protegidas (admin)

```jsx
// PrivateRoute.jsx
function PrivateRoute({ children }) {
  const [ok, setOk] = useState(null);
  useEffect(() => {
    api.get('/auth/me').then(() => setOk(true)).catch(() => setOk(false));
  }, []);
  if (ok === null) return <Spinner />;
  if (!ok) return <Navigate to="/admin/login" />;
  return children;
}
```

## Hooks personalizados

- `useServicios()` — fetch + cache de servicios del tenant
- `useDisponibilidad(servicioId, fecha)` — slots disponibles
- `useAdmin()` — sesión del admin, agenda, clientes

Los hooks encapsulan el loading/error state. Los componentes no manejan
loading directamente — lo delegan al hook.
