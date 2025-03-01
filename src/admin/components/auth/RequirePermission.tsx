import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../../store/AdminAuthContext';
import { Permission } from '../../types/permissions';

interface RequirePermissionProps {
  children: React.ReactNode;
  permissions: Permission[];
}

const RequirePermission: React.FC<RequirePermissionProps> = ({
  children,
  permissions,
}) => {
  const { adminUser } = useAdminAuth();

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // Admin role has all permissions
  if (adminUser.role === 'admin') {
    return <>{children}</>;
  }

  // Check if user has all required permissions
  const hasAllPermissions = permissions.every((permission) =>
    adminUser.permissions?.includes(permission)
  );

  if (!hasAllPermissions) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RequirePermission;
