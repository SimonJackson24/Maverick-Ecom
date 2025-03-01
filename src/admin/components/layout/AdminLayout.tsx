import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../store/AdminAuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AdminSidebar from './AdminSidebar';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Permission } from '../../../types/admin';

interface AdminLayoutProps {
  requirePermission?: Permission;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ requirePermission }) => {
  const { adminUser, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requirePermission && !adminUser.permissions?.includes(requirePermission)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Mobile sidebar */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          ${sidebarOpen ? 'block' : 'hidden'}
        `}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile menu */}
        <div className="fixed inset-y-0 left-0 flex w-64 bg-gray-800">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
              <div className="text-xl font-semibold text-white">
                Wick & Wax Co
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <AdminSidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800">
          <div className="flex items-center h-16 px-4 bg-gray-900">
            <div className="text-xl font-semibold text-white">
              Wick & Wax Co
            </div>
          </div>
          <AdminSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-0 md:w-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center h-16 px-4 bg-white border-b">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <div className="ml-4 text-lg font-semibold">
            Wick & Wax Co
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
