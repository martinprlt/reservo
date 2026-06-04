import axios from 'axios';

// In development, API runs on port 3000. In production, same origin.
const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`,
  withCredentials: true,
});

// For booking pages, attach tenant slug from URL params or subdomain
api.interceptors.request.use((config) => {
  // Only add tenant param if not already present and not an admin/platform route
  if (!config.params?.tenant && !config.url?.startsWith('/auth') && !config.url?.startsWith('/admin') && !config.url?.startsWith('/platform')) {
    const urlParams = new URLSearchParams(window.location.search);
    const tenantSlug = urlParams.get('tenant') || window.location.hostname.split('.')[0];
    if (tenantSlug && tenantSlug !== 'localhost') {
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
