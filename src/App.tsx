import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';

// Providers
import { AuthProvider } from './store/AuthContext';
import { AdminAuthProvider } from './store/AdminAuthContext';
import { CommerceProvider } from './store/CommerceContext';
import { WishlistProvider } from './store/WishlistContext';
import { CookieConsentProvider } from './store/CookieConsentContext';

// Components
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import CookieConsent from './components/common/CookieConsent';
import StoreLayout from './components/layout/StoreLayout';
import AdminRoutes from './admin/routes/AdminRoutes';

// Store Pages
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BlogPage from './pages/BlogPage';
import SustainabilityPage from './pages/SustainabilityPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import AdminLoginPage from './admin/pages/auth/LoginPage';

// Account Pages
import AccountLayout from './pages/account/AccountLayout';
import ProfilePage from './pages/account/ProfilePage';
import OrdersPage from './pages/account/OrdersPage';
import OrderDetailsPage from './pages/account/OrderDetailsPage';
import WishlistPage from './pages/account/WishlistPage';
import AddressesPage from './pages/account/AddressesPage';
import SettingsPage from './pages/account/SettingsPage';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider maxSnack={3}>
          <ErrorBoundary>
            <AuthProvider>
              <AdminAuthProvider>
                <CommerceProvider>
                  <WishlistProvider>
                    <CookieConsentProvider>
                      <CookieConsent />
                      <Router>
                        <ScrollToTop />
                        <Routes>
                          {/* Admin routes */}
                          <Route path="/admin/login" element={<AdminLoginPage />} />
                          <Route path="/admin/*" element={<AdminRoutes />} />

                          {/* Auth routes */}
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                          {/* Store routes */}
                          <Route element={<StoreLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="products" element={<ProductListPage />} />
                            <Route path="products/:id" element={<ProductDetailPage />} />
                            <Route path="cart" element={<CartPage />} />
                            <Route path="checkout" element={<CheckoutPage />} />
                            <Route path="blog" element={<BlogPage />} />
                            <Route path="sustainability" element={<SustainabilityPage />} />
                            
                            {/* Account routes */}
                            <Route path="account" element={<AccountLayout />}>
                              <Route index element={<Navigate to="profile" replace />} />
                              <Route path="profile" element={<ProfilePage />} />
                              <Route path="orders" element={<OrdersPage />} />
                              <Route path="orders/:orderId" element={<OrderDetailsPage />} />
                              <Route path="wishlist" element={<WishlistPage />} />
                              <Route path="addresses" element={<AddressesPage />} />
                              <Route path="settings" element={<SettingsPage />} />
                            </Route>
                          </Route>

                          {/* Catch all route */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Router>
                    </CookieConsentProvider>
                  </WishlistProvider>
                </CommerceProvider>
              </AdminAuthProvider>
            </AuthProvider>
          </ErrorBoundary>
        </SnackbarProvider>
      </LocalizationProvider>
    </HelmetProvider>
  );
};

export default App;
