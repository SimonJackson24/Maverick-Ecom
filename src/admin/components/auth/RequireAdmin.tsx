import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../store/AdminAuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface RequireAdminProps {
  children: React.ReactNode;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { adminUser, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!adminUser) {
    // Redirect to admin login page, but save the attempted URL
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
