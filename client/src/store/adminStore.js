import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  admin: null,
  isAuthenticated: null,
  config: null,

  setAdmin: (admin) => set({ admin, isAuthenticated: true }),
  setConfig: (config) => set({ config }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  logout: () => set({ admin: null, isAuthenticated: false, config: null }),
}));
