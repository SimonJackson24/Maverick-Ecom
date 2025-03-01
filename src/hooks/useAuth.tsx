import { useState, useCallback, useEffect, createContext, useContext, memo, useMemo } from 'react';
import { useOptimizedApi } from './useOptimizedApi';
import { MonitoringService } from '../services/monitoring/MonitoringService';
import { RetryService } from '../services/optimization/RetryService';
import React from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthRequestOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
}

const AUTH_STORAGE_KEY = 'auth_token';
const AUTH_API_ENDPOINT = '/api/auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = memo<AuthProviderProps>(({ children }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { data: userData, mutate } = useOptimizedApi<User | null>('/api/user');
  const monitoring = new MonitoringService();
  const retryService = new RetryService();

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      try {
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Failed to initialize auth'));
      } finally {
        setIsLoading(false);
      }
    };

    void initAuth();
  }, [userData]);

  const makeAuthRequest = useCallback(async (endpoint: string, method: string, data?: unknown): Promise<AuthResponse> => {
    const options: AuthRequestOptions = {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 5000
    };

    return retryService.executeWithRetry(
      async () => {
        const response = await fetch(`${AUTH_API_ENDPOINT}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: data ? JSON.stringify(data) : undefined
        });

        if (!response.ok) {
          throw new Error(`Auth request failed: ${response.statusText}`);
        }

        return response.json();
      },
      options
    );
  }, [retryService]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      const { token, user } = await makeAuthRequest('/login', 'POST', {
        email,
        password
      });

      localStorage.setItem(AUTH_STORAGE_KEY, token);
      setUser(user);
      await mutate(user);

      monitoring.logMetric('login_duration', {
        value: performance.now() - startTime,
        tags: { userId: user.id }
      });

      monitoring.logEvent('user_logged_in', {
        userId: user.id,
        role: user.role
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Login failed'));
      monitoring.logError('login_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'AuthProvider',
        additionalContext: { email }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [makeAuthRequest, mutate, monitoring]);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      await makeAuthRequest('/logout', 'POST');
      
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      await mutate(null);

      monitoring.logMetric('logout_duration', {
        value: performance.now() - startTime
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Logout failed'));
      monitoring.logError('logout_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'AuthProvider'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [makeAuthRequest, mutate, monitoring]);

  const register = useCallback(async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      const { token, user } = await makeAuthRequest('/register', 'POST', {
        email,
        password,
        name
      });

      localStorage.setItem(AUTH_STORAGE_KEY, token);
      setUser(user);
      await mutate(user);

      monitoring.logMetric('registration_duration', {
        value: performance.now() - startTime
      });

      monitoring.logEvent('user_registered', {
        userId: user.id,
        role: user.role
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Registration failed'));
      monitoring.logError('registration_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'AuthProvider',
        additionalContext: { email }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [makeAuthRequest, mutate, monitoring]);

  const resetPassword = useCallback(async (email: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      await makeAuthRequest('/reset-password', 'POST', { email });

      monitoring.logMetric('password_reset_duration', {
        value: performance.now() - startTime
      });

      monitoring.logEvent('password_reset_requested', { email });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Password reset failed'));
      monitoring.logError('password_reset_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'AuthProvider',
        additionalContext: { email }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [makeAuthRequest, monitoring]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      const { user: updatedUser } = await makeAuthRequest('/profile', 'PUT', updates);
      
      setUser(updatedUser);
      await mutate(updatedUser);

      monitoring.logMetric('profile_update_duration', {
        value: performance.now() - startTime
      });

      monitoring.logEvent('profile_updated', {
        userId: updatedUser.id,
        updatedFields: Object.keys(updates)
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Profile update failed'));
      monitoring.logError('profile_update_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'AuthProvider',
        additionalContext: { updates }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [makeAuthRequest, mutate, monitoring]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      logout,
      register,
      resetPassword,
      updateProfile
    }),
    [user, isLoading, error, login, logout, register, resetPassword, updateProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
});

AuthProvider.displayName = 'AuthProvider';

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
