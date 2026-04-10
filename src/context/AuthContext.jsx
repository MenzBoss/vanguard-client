import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('fcv_admin');
    return stored ? JSON.parse(stored) : null;
  });
  const [isValidating, setIsValidating] = useState(true);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAdmin(data);
    localStorage.setItem('fcv_admin', JSON.stringify(data));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('fcv_admin');
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (admin?.token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
          // Try to verify the token is still valid
          await api.get('/auth/profile');
        } catch (error) {
          // Token is invalid or expired
          console.error('Token validation failed:', error.message);
          setAdmin(null);
          localStorage.removeItem('fcv_admin');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setIsValidating(false);
    };

    validateToken();
  }, []);

  // Set authorization header when admin changes
  useEffect(() => {
    if (admin?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
    }
  }, [admin]);

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin, isValidating }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
