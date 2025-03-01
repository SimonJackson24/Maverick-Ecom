import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { AdminUser } from '../types/admin';
import {
  ADMIN_LOGIN,
  GET_ADMIN_USER,
  ADMIN_LOGOUT,
  VERIFY_ADMIN_2FA
} from '../services/adminQueries';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Admin auth mutations
  const [adminLogin] = useMutation(ADMIN_LOGIN);
  const [adminLogout] = useMutation(ADMIN_LOGOUT);
  const [verifyAdmin2FA] = useMutation(VERIFY_ADMIN_2FA);

  // Get admin user data
  const { data: adminData, loading: adminLoading, refetch: refetchAdmin } = useQuery(
    GET_ADMIN_USER,
    {
      skip: !isAdminAuthenticated,
    }
  );

  // Check for existing token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const { data } = await refetchAdmin();
          if (data?.adminUser) {
            setIsAdminAuthenticated(true);
            setAdminUser(data.adminUser);
          } else {
            // Token is invalid
            localStorage.removeItem('adminToken');
            setIsAdminAuthenticated(false);
            setAdminUser(null);
          }
        } catch (err) {
          // Token is invalid
          localStorage.removeItem('adminToken');
          setIsAdminAuthenticated(false);
          setAdminUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [refetchAdmin]);

  // Update admin user when data changes
  useEffect(() => {
    if (adminData?.adminUser) {
      setAdminUser(adminData.adminUser);
      setIsAdminAuthenticated(true);
    }
  }, [adminData]);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    try {
      const { data } = await adminLogin({
        variables: { email, password },
      });

      if (data?.adminLogin?.token) {
        localStorage.setItem('adminToken', data.adminLogin.token);
        if (rememberMe) {
          localStorage.setItem('adminRememberMe', 'true');
        }
        setIsAdminAuthenticated(true);
        await refetchAdmin();
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [adminLogin, refetchAdmin]);

  const logout = useCallback(async () => {
    try {
      await adminLogout();
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRememberMe');
      setIsAdminAuthenticated(false);
      setAdminUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [adminLogout]);

  const verifyTwoFactor = useCallback(async (code: string) => {
    try {
      const { data } = await verifyAdmin2FA({
        variables: { code },
      });

      if (data?.verifyAdmin2FA?.success) {
        await refetchAdmin();
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [verifyAdmin2FA, refetchAdmin]);

  const value = {
    adminUser,
    isAdminAuthenticated,
    loading: loading || adminLoading,
    error,
    login,
    logout,
    verifyTwoFactor,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
