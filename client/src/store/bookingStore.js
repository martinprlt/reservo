import { create } from 'zustand';

export const useBookingStore = create((set, get) => ({
  paso: 1,
  servicioSeleccionado: null,
  varianteSeleccionada: null,
  fechaSeleccionada: null,
  slotSeleccionado: null,
  datosCliente: null,
  turnoId: null,
  initPoint: null,
  error: null,

  seleccionarServicio: (servicio, variante = null) =>
    set({
      servicioSeleccionado: servicio,
      varianteSeleccionada: variante,
      paso: 2
    }),

  seleccionarSlot: (fecha, slot) =>
    set({
      fechaSeleccionada: fecha,
      slotSeleccionado: slot,
      paso: 3
    }),

  setDatosCliente: (datos) =>
    set({
      datosCliente: datos,
      paso: 4
    }),

  setTurno: (turnoId, initPoint) =>
    set({ turnoId, initPoint, paso: 'confirmacion' }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      paso: 1,
      servicioSeleccionado: null,
      varianteSeleccionada: null,
      fechaSeleccionada: null,
      slotSeleccionado: null,
      datosCliente: null,
      turnoId: null,
      initPoint: null,
      error: null,
    }),
}));
