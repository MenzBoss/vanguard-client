import axios from 'axios';
import toast from 'react-hot-toast';

const DEPLOYED_API_BASE_URL = 'https://vanguard-server-evr7.onrender.com/api';
const envApiBaseUrl = import.meta.env.VITE_API_URL?.trim();
const resolvedApiBaseUrl = envApiBaseUrl || (import.meta.env.DEV ? '/api' : DEPLOYED_API_BASE_URL);

const api = axios.create({
  baseURL: resolvedApiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Something went wrong';
    
    // Handle JWT expiration or unauthorized access
    if (err.response?.status === 401 && msg.toLowerCase().includes('token')) {
      // Clear stored auth data
      localStorage.removeItem('fcv_admin');
      delete api.defaults.headers.common['Authorization'];
      
      // Show error message
      toast.error('Session expired. Please login again.');
      
      // Redirect to login page
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(new Error(msg));
  }
);

export default api;
