import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`,
  withCredentials: true,
});

// Simple TTL cache for GET requests
const cache = new Map();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

const cachedApi = {
  async get(url, config) {
    const key = url + JSON.stringify(config?.params || {});
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < CACHE_TTL) {
      return cached.response;
    }
    const response = await api.get(url, config);
    cache.set(key, { response, time: Date.now() });
    return response;
  },
  clear(pattern) {
    for (const key of cache.keys()) {
      if (!pattern || key.includes(pattern)) cache.delete(key);
    }
  }
};

// Tenant resolution: URL param > localStorage > skip
api.interceptors.request.use((config) => {
  const isPublicRoute = !config.url?.startsWith('/auth') && !config.url?.startsWith('/admin') && !config.url?.startsWith('/platform');

  if (isPublicRoute && !config.params?.tenant) {
    const urlParams = new URLSearchParams(window.location.search);
    const tenantSlug = urlParams.get('tenant') || localStorage.getItem('slotify_tenant');
    if (tenantSlug) {
      config.params = { ...config.params, tenant: tenantSlug };
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Helper to persist tenant slug
export function setTenantSlug(slug) {
  if (slug) localStorage.setItem('slotify_tenant', slug);
}

export function getTenantSlug() {
  return localStorage.getItem('slotify_tenant');
}

export { cachedApi };
export default api;
