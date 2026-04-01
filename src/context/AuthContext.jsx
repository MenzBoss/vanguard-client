import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('fcv_admin');
    return stored ? JSON.parse(stored) : null;
  });

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

  useEffect(() => {
    if (admin?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
    }
  }, [admin]);

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
