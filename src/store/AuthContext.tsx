import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GENERATE_CUSTOMER_TOKEN,
  CREATE_CUSTOMER,
  GET_CUSTOMER,
  UPDATE_CUSTOMER,
  REVOKE_CUSTOMER_TOKEN,
} from '../services/authQueries';
import type { Customer } from '../types/commerce';

interface AuthContextType {
  customer: Customer | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (firstname: string, lastname: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<Customer>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Get customer data
  const { data: customerData, loading: customerLoading, refetch: refetchCustomer } = useQuery(
    GET_CUSTOMER,
    {
      skip: !isAuthenticated,
    }
  );

  // Auth mutations
  const [generateToken] = useMutation(GENERATE_CUSTOMER_TOKEN);
  const [createCustomer] = useMutation(CREATE_CUSTOMER);
  const [updateCustomerMutation] = useMutation(UPDATE_CUSTOMER);
  const [revokeToken] = useMutation(REVOKE_CUSTOMER_TOKEN);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { data } = await generateToken({
          variables: { email, password },
        });
        const token = data.generateCustomerToken.token;
        localStorage.setItem('customerToken', token);
        setIsAuthenticated(true);
        await refetchCustomer();
        setError(null);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [generateToken, refetchCustomer]
  );

  const logout = useCallback(async () => {
    try {
      await revokeToken();
      localStorage.removeItem('customerToken');
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [revokeToken]);

  const register = useCallback(
    async (firstname: string, lastname: string, email: string, password: string) => {
      try {
        await createCustomer({
          variables: { firstname, lastname, email, password },
        });
        await login(email, password);
        setError(null);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [createCustomer, login]
  );

  const updateProfile = useCallback(
    async (data: Partial<Customer>) => {
      try {
        await updateCustomerMutation({
          variables: { input: data },
        });
        await refetchCustomer();
        setError(null);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [updateCustomerMutation, refetchCustomer]
  );

  return (
    <AuthContext.Provider
      value={{
        customer: customerData?.customer || null,
        loading: customerLoading,
        error,
        isAuthenticated,
        login,
        logout,
        register,
        updateProfile,
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
