import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminLoginPage from '../pages/auth/AdminLoginPage';
import { RequireAdmin } from '../components/auth/RequireAdmin';
import RequirePermission from '../components/auth/RequirePermission';
import { Permission } from '../types/permissions';

// Dashboard
import AdminDashboard from '../pages/dashboard/AdminDashboard';

// Product Routes
import ProductListPage from '../pages/products/ProductListPage';
import ProductForm from '../pages/products/ProductForm';
import ProductCategoriesPage from '../pages/products/ProductCategoriesPage';
import ScentsPage from '../pages/products/ScentsPage';
import CollectionsPage from '../pages/products/CollectionsPage';

// Order Routes
import OrdersDashboard from '../pages/orders/OrdersDashboard';
import PendingOrdersPage from '../pages/orders/PendingOrdersPage';
import FulfillmentPage from '../pages/orders/FulfillmentPage';
import BulkLabelGenerator from '../components/shipping/BulkLabelGenerator';

// Customer Routes
import CustomerListPage from '../pages/customers/CustomerListPage';
import CustomerDetailsPage from '../pages/customers/CustomerDetailsPage';

// Settings Routes
import SettingsRoutes from './SettingsRoutes';
import SecuritySettings from '../pages/settings/SecuritySettings';
import IntegrationSettings from '../pages/settings/IntegrationSettings';
import EmailSettings from '../pages/settings/EmailSettings';
import ShippingSettingsPage from '../pages/settings/ShippingSettingsPage';

// Support Routes
import SupportPage from '../pages/support/SupportPage';
import SupportRoutes from './SupportRoutes';

// Subscription Routes
import SubscriptionsPage from '../pages/subscriptions/SubscriptionsPage';

// Content Routes
import ContentManagementPage from '../pages/content/ContentManagementPage';

// Marketing Routes
import MarketingDashboard from '../pages/marketing/MarketingDashboard';
import SeoDashboard from '../pages/marketing/SeoDashboard';

// Inventory Routes
import InventoryPage from '../pages/inventory/InventoryPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      
      <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        {/* Dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Products */}
        <Route path="products">
          <Route 
            index
            element={
              <RequirePermission permission={Permission.VIEW_PRODUCTS}>
                <ProductListPage />
              </RequirePermission>
            }
          />
          <Route
            path="new"
            element={
              <RequirePermission permission={Permission.CREATE_PRODUCTS}>
                <ProductForm />
              </RequirePermission>
            }
          />
          <Route
            path="edit/:id"
            element={
              <RequirePermission permission={Permission.EDIT_PRODUCTS}>
                <ProductForm />
              </RequirePermission>
            }
          />
          <Route
            path="categories"
            element={
              <RequirePermission permission={Permission.MANAGE_CATEGORIES}>
                <ProductCategoriesPage />
              </RequirePermission>
            }
          />
          <Route
            path="scents"
            element={
              <RequirePermission permission={Permission.MANAGE_SCENTS}>
                <ScentsPage />
              </RequirePermission>
            }
          />
          <Route
            path="collections"
            element={
              <RequirePermission permission={Permission.MANAGE_COLLECTIONS}>
                <CollectionsPage />
              </RequirePermission>
            }
          />
        </Route>

        {/* Inventory */}
        <Route path="inventory">
          <Route
            index
            element={
              <RequirePermission permission={Permission.MANAGE_INVENTORY}>
                <InventoryPage />
              </RequirePermission>
            }
          />
        </Route>

        {/* Orders */}
        <Route path="orders">
          <Route
            index
            element={
              <RequirePermission permission={Permission.VIEW_ORDERS}>
                <OrdersDashboard />
              </RequirePermission>
            }
          />
          <Route
            path="pending"
            element={
              <RequirePermission permission={Permission.VIEW_ORDERS}>
                <PendingOrdersPage />
              </RequirePermission>
            }
          />
          <Route
            path="fulfillment"
            element={
              <RequirePermission permission={Permission.MANAGE_ORDERS}>
                <FulfillmentPage />
              </RequirePermission>
            }
          />
          <Route
            path="bulk-labels"
            element={
              <RequirePermission permission={Permission.MANAGE_SHIPPING}>
                <BulkLabelGenerator />
              </RequirePermission>
            }
          />
        </Route>

        {/* Customers */}
        <Route path="customers">
          <Route
            index
            element={
              <RequirePermission permission={Permission.VIEW_CUSTOMERS}>
                <CustomerListPage />
              </RequirePermission>
            }
          />
          <Route
            path=":id"
            element={
              <RequirePermission permission={Permission.VIEW_CUSTOMERS}>
                <CustomerDetailsPage />
              </RequirePermission>
            }
          />
        </Route>

        {/* Marketing */}
        <Route path="marketing">
          <Route
            index
            element={
              <RequirePermission permission={Permission.MANAGE_MARKETING}>
                <MarketingDashboard />
              </RequirePermission>
            }
          />
          <Route
            path="email"
            element={
              <RequirePermission permission={Permission.MANAGE_MARKETING}>
                <EmailSettings />
              </RequirePermission>
            }
          />
          <Route
            path="seo"
            element={
              <RequirePermission permission={Permission.MANAGE_MARKETING}>
                <SeoDashboard />
              </RequirePermission>
            }
          />
        </Route>

        {/* Settings */}
        <Route path="settings/*" element={
          <RequirePermission permission={Permission.MANAGE_SETTINGS}>
            <SettingsRoutes />
          </RequirePermission>
        } />

        {/* Support */}
        <Route path="support/*" element={
          <RequirePermission permission={Permission.VIEW_SUPPORT}>
            <SupportRoutes />
          </RequirePermission>
        } />

        {/* Subscriptions */}
        <Route path="subscriptions">
          <Route
            index
            element={
              <RequirePermission permission={Permission.MANAGE_SUBSCRIPTIONS}>
                <SubscriptionsPage />
              </RequirePermission>
            }
          />
        </Route>

        {/* Content Management */}
        <Route path="content">
          <Route
            index
            element={
              <RequirePermission permission={Permission.MANAGE_CONTENT}>
                <ContentManagementPage />
              </RequirePermission>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
