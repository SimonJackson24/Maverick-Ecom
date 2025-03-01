import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/AuthService';
import { AdminUser } from '../types';

interface AuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          const user = authService.getUser();
          if (user) {
            setAdminUser(user);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('adminToken');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    if (!response.requires2FA) {
      setAdminUser(response.user);
    }
  };

  const logout = async () => {
    await authService.logout();
    setAdminUser(null);
  };

  const refreshUser = async () => {
    try {
      const token = await authService.refreshToken();
      const user = authService.getUser();
      if (user) {
        setAdminUser(user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setAdminUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated: !!adminUser,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
