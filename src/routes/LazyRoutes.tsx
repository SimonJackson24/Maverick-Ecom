import React, { Suspense, useCallback, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { MonitoringService } from '../services/monitoring/MonitoringService';

// Lazy load route components with retry
const retryImport = (importFn: () => Promise<any>, retries = 3) => {
  return new Promise((resolve, reject) => {
    const attempt = async (attemptsLeft: number) => {
      try {
        const result = await importFn();
        resolve(result);
      } catch (error) {
        if (attemptsLeft === 0) {
          reject(error);
        } else {
          setTimeout(() => attempt(attemptsLeft - 1), 1000);
        }
      }
    };
    attempt(retries);
  });
};

// Route configurations with preload functions
const routes = {
  home: {
    path: '/',
    component: React.lazy(() => retryImport(() => import('../pages/HomePage'))),
    preload: () => import('../pages/HomePage'),
  },
  productList: {
    path: '/products',
    component: React.lazy(() => retryImport(() => import('../pages/ProductListPage'))),
    preload: () => import('../pages/ProductListPage'),
  },
  productDetail: {
    path: '/products/:id',
    component: React.lazy(() => retryImport(() => import('../pages/ProductDetailPage'))),
    preload: () => import('../pages/ProductDetailPage'),
  },
  cart: {
    path: '/cart',
    component: React.lazy(() => retryImport(() => import('../pages/CartPage'))),
    preload: () => import('../pages/CartPage'),
  },
  checkout: {
    path: '/checkout',
    component: React.lazy(() => retryImport(() => import('../pages/BrandedCheckoutPage'))),
    preload: () => import('../pages/BrandedCheckoutPage'),
  },
  wishlist: {
    path: '/wishlist',
    component: React.lazy(() => retryImport(() => import('../pages/WishlistPage'))),
    preload: () => import('../pages/WishlistPage'),
  },
  orderTracking: {
    path: '/track-order',
    component: React.lazy(() => retryImport(() => import('../pages/OrderTrackingPage'))),
    preload: () => import('../pages/OrderTrackingPage'),
  },
  support: {
    path: '/support',
    component: React.lazy(() => retryImport(() => import('../pages/SupportPage'))),
    preload: () => import('../pages/SupportPage'),
  },
  account: {
    path: '/account/*',
    component: React.lazy(() => retryImport(() => import('../pages/AccountPage'))),
    preload: () => import('../pages/AccountPage'),
  },
  // Admin routes
  adminDashboard: {
    path: '/admin',
    component: React.lazy(() => retryImport(() => import('../admin/pages/Dashboard'))),
    preload: () => import('../admin/pages/Dashboard'),
  },
  adminProducts: {
    path: '/admin/products',
    component: React.lazy(() => retryImport(() => import('../admin/pages/ProductManagement'))),
    preload: () => import('../admin/pages/ProductManagement'),
  },
  adminOrders: {
    path: '/admin/orders',
    component: React.lazy(() => retryImport(() => import('../admin/pages/OrderManagement'))),
    preload: () => import('../admin/pages/OrderManagement'),
  },
  adminCustomers: {
    path: '/admin/customers',
    component: React.lazy(() => retryImport(() => import('../admin/pages/CustomerManagement'))),
    preload: () => import('../admin/pages/CustomerManagement'),
  },
  adminSettings: {
    path: '/admin/settings',
    component: React.lazy(() => retryImport(() => import('../admin/pages/settings/SystemSettingsPage'))),
    preload: () => import('../admin/pages/settings/SystemSettingsPage'),
  },
  notFound: {
    path: '*',
    component: React.lazy(() => retryImport(() => import('../pages/NotFoundPage'))),
    preload: () => import('../pages/NotFoundPage'),
  },
};

const monitoring = MonitoringService.getInstance();

const withErrorBoundary = (Component: React.ComponentType) => (
  <ErrorBoundary>
    <Component />
  </ErrorBoundary>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    }
  >
    {withErrorBoundary(Component)}
  </Suspense>
);

// Preload adjacent routes
const preloadAdjacentRoutes = (currentPath: string) => {
  const adjacentRoutes = new Set<string>();

  // Add related routes based on current path
  if (currentPath.startsWith('/products/')) {
    adjacentRoutes.add('/cart');
    adjacentRoutes.add('/wishlist');
  } else if (currentPath === '/cart') {
    adjacentRoutes.add('/checkout');
  } else if (currentPath === '/checkout') {
    adjacentRoutes.add('/track-order');
  } else if (currentPath.startsWith('/admin')) {
    adjacentRoutes.add('/admin/products');
    adjacentRoutes.add('/admin/orders');
  }

  // Preload adjacent routes
  adjacentRoutes.forEach(path => {
    const route = Object.values(routes).find(r => r.path === path);
    if (route) {
      route.preload().catch(error => {
        monitoring.logError('route_preload_failed', {
          path,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      });
    }
  });
};

export const LazyRoutes: React.FC = () => {
  const location = useLocation();

  // Monitor route changes and performance
  useEffect(() => {
    const startTime = performance.now();
    const cleanupObserver = monitorRoutePerformance();

    // Preload adjacent routes after current route is loaded
    const timeout = setTimeout(() => {
      preloadAdjacentRoutes(location.pathname);
    }, 1000);

    return () => {
      cleanupObserver();
      clearTimeout(timeout);
      monitoring.logMetric('route_cleanup_time', {
        duration: performance.now() - startTime,
        path: location.pathname,
      });
    };
  }, [location.pathname]);

  const monitorRoutePerformance = useCallback(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          monitoring.logMetric('route_change_performance', {
            path: location.pathname,
            duration: entry.duration,
            domInteractive: entry.domInteractive,
            loadEventEnd: entry.loadEventEnd,
            type: entry.type,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <Routes>
      {Object.values(routes).map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={withSuspense(Component)}
        />
      ))}
    </Routes>
  );
};

// Expose preload functions for manual preloading
export const preloadRoute = (path: string) => {
  const route = Object.values(routes).find(r => r.path === path);
  if (route) {
    return route.preload();
  }
  return Promise.reject(new Error(`Route not found: ${path}`));
};
