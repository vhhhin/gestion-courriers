import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (fullName: string, password: string) => {
    try {
      setLoading(true);
      // Simuler une connexion réussie
      const userData = { name: fullName };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'dummy-token');
      setIsAuthenticated(true);
      setUser(userData);
      return { user: userData };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };
}; 