import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`,
  withCredentials: true,
});

// For public/booking routes, attach tenant from URL params only (not hostname)
api.interceptors.request.use((config) => {
  const isPublicRoute = !config.url?.startsWith('/auth') && !config.url?.startsWith('/admin') && !config.url?.startsWith('/platform');

  if (isPublicRoute && !config.params?.tenant) {
    const urlParams = new URLSearchParams(window.location.search);
    const tenantSlug = urlParams.get('tenant');
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

export default api;
