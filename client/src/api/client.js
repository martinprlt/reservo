import axios from 'axios';

// Determine baseURL based on hostname
// For localhost, point to local backend (default port 3000)
// For any other host (e.g., GitHub Pages), point to the Render backend
const api = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://reservo-7jdl.onrender.com/api',
  withCredentials: true,
  params: {
    tenant: 'tusnailslr',
  },
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
