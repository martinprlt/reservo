import { create } from 'zustand';

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

  setADomicilio: (value) => set({ aDomicilio: value }),

  seleccionarServicio: (servicio, variante = null) => {
    // Fetch tenant config to check if incentives are active
    fetch('/api/config')
      .then(res => res.json())
      .then(config => {
        const incentivosActivos = config?.horarios?.incentivosActivos !== false;
        set({
          servicioSeleccionado: servicio,
          varianteSeleccionada: variante,
          paso: 2,
          error: null,
          incentivosActivos
        });
      })
      .catch(() => {
        set({
          servicioSeleccionado: servicio,
          varianteSeleccionada: variante,
          paso: 2,
          error: null,
          incentivosActivos: false // Default to false if we can't fetch config
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
    }),
}));
