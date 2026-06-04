import { create } from 'zustand';
import { cachedApi } from '../api/client';

export const useBookingStore = create((set, get) => ({
  paso: 1,
  servicioSeleccionado: null,
  varianteSeleccionada: null,
  fechaSeleccionada: null,
  slotSeleccionado: null,
  datosCliente: null,
  notas: '',
  fotoUrl: null,
  aDomicilio: false,
  turnoId: null,
  initPoint: null,
  error: null,
  incentivosActivos: false,
  tenantConfig: null,

  setADomicilio: (value) => set({ aDomicilio: value }),

  seleccionarServicio: (servicio, variante = null) => {
    cachedApi.get('/config')
      .then(({ data }) => {
        const incentivosActivos = data?.incentivosActivos !== false;
        set({
          servicioSeleccionado: servicio,
          varianteSeleccionada: variante,
          paso: 2,
          error: null,
          incentivosActivos,
          tenantConfig: data
        });
      })
      .catch(() => {
        set({
          servicioSeleccionado: servicio,
          varianteSeleccionada: variante,
          paso: 2,
          error: null,
          incentivosActivos: false,
          tenantConfig: null
        });
      });
  },

  seleccionarSlot: (fecha, slot) =>
    set({
      fechaSeleccionada: fecha,
      slotSeleccionado: slot,
      paso: 3,
      error: null,
    }),

  setDatosCliente: (datos) =>
    set({
      datosCliente: datos,
      paso: 4,
      error: null,
    }),

  setNotas: (notas, fotoUrl = null) =>
    set({
      notas,
      fotoUrl,
      paso: 5,
      error: null,
    }),

  setTurno: (turnoId, initPoint) =>
    set({ turnoId, initPoint, paso: 'confirmacion', error: null }),

  setError: (error) => set({ error }),

  setTenantConfig: (config) =>
    set({ tenantConfig: config }),

  goBack: () => {
    const { paso } = get();
    if (paso === 2) return set({ paso: 1 });
    if (paso === 3) return set({ paso: 2 });
    if (paso === 4) return set({ paso: 3 });
    if (paso === 5) return set({ paso: 4 });
  },

  reset: () =>
    set({
      paso: 1,
      servicioSeleccionado: null,
      varianteSeleccionada: null,
      fechaSeleccionada: null,
      slotSeleccionado: null,
      datosCliente: null,
      notas: '',
      fotoUrl: null,
      aDomicilio: false,
      turnoId: null,
      initPoint: null,
      error: null,
      incentivosActivos: false,
      tenantConfig: null,
    }),
}));
