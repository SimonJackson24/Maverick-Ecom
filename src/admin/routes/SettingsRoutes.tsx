import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SettingsLayout from '../pages/settings/SettingsLayout';

// Import all settings pages
import GeneralSettings from '../pages/settings/GeneralSettings';
import StoreSettings from '../pages/settings/StoreSettings';
import CompanySettings from '../pages/settings/CompanySettings';
import PaymentSettings from '../pages/settings/PaymentSettings';
import ShippingSettings from '../pages/settings/ShippingSettings';
import TaxSettings from '../pages/settings/TaxSettings';
import CurrencySettings from '../pages/settings/CurrencySettings';
import LocationSettings from '../pages/settings/LocationSettings';
import EmailSettings from '../pages/settings/EmailSettings';
import NotificationSettings from '../pages/settings/NotificationSettings';
import IntegrationSettings from '../pages/settings/IntegrationSettings';
import SecuritySettings from '../pages/settings/SecuritySettings';
import PrivacySettings from '../pages/settings/PrivacySettings';
import SeoSettings from '../pages/settings/SeoSettings';
import ThemeSettings from '../pages/settings/ThemeSettings';
import ProductSettings from '../pages/settings/ProductSettings';
import UpdateSettings from '../pages/settings/UpdateSettings';

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route element={<SettingsLayout />}>
        {/* Redirect root settings to general */}
        <Route index element={<Navigate to="general" replace />} />
        
        {/* Basic Settings */}
        <Route path="general" element={<GeneralSettings />} />
        <Route path="store" element={<StoreSettings />} />
        <Route path="company" element={<CompanySettings />} />
        <Route path="theme" element={<ThemeSettings />} />
        
        {/* Commerce Settings */}
        <Route path="payment" element={<PaymentSettings />} />
        <Route path="shipping" element={<ShippingSettings />} />
        <Route path="tax" element={<TaxSettings />} />
        <Route path="currency" element={<CurrencySettings />} />
        <Route path="location" element={<LocationSettings />} />
        <Route path="products" element={<ProductSettings />} />
        
        {/* Communication Settings */}
        <Route path="email" element={<EmailSettings />} />
        <Route path="notifications" element={<NotificationSettings />} />
        
        {/* Integration & API */}
        <Route path="integrations" element={<IntegrationSettings />} />
        
        {/* Security & Privacy */}
        <Route path="security" element={<SecuritySettings />} />
        <Route path="privacy" element={<PrivacySettings />} />
        
        {/* SEO Settings */}
        <Route path="seo" element={<SeoSettings />} />
        
        {/* Update Settings */}
        <Route path="updates" element={<UpdateSettings />} />
      </Route>
    </Routes>
  );
};

export default SettingsRoutes;
