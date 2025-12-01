// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return user?.is_staff || user?.is_superuser;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
  };

  return {
    user,
    loading,
    isAdmin: isAdmin(),
    checkAuth,
    logout,
  };
}