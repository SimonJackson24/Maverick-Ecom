import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  LOGIN,
  REGISTER,
  LOGOUT,
  GET_CURRENT_USER,
} from '../graphql/auth';
import { UPDATE_CUSTOMER_PROFILE } from '../graphql/customer';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Get user data
  const { loading: userLoading, refetch: refetchUser } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
    onCompleted: (data) => {
      if (data?.currentUser) {
        setUser(data.currentUser);
        setIsAuthenticated(true);
      }
    },
  });

  // Auth mutations
  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [logoutMutation] = useMutation(LOGOUT);
  const [updateProfile] = useMutation(UPDATE_CUSTOMER_PROFILE);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      refetchUser();
    }
  }, [refetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data?.login) {
        localStorage.setItem('token', data.login.token);
        setUser(data.login.user);
        setIsAuthenticated(true);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to login'));
      throw err;
    }
  }, [loginMutation]);

  const register = useCallback(async (registerData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await registerMutation({
        variables: { input: registerData },
      });

      if (data?.register) {
        localStorage.setItem('token', data.register.token);
        setUser(data.register.user);
        setIsAuthenticated(true);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to register'));
      throw err;
    }
  }, [registerMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to logout'));
      throw err;
    }
  }, [logoutMutation]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  const value = {
    user,
    loading: userLoading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
