import { SetupStep } from '../types';

export const setupSteps: SetupStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    path: '/setup/welcome',
    description: 'Welcome to Wick & Wax Co setup',
    component: 'WelcomePage',
  },
  {
    id: 'store',
    title: 'Store Setup',
    path: '/setup/store',
    description: 'Configure your store settings',
    component: 'StoreSetup',
    validations: ['storeName', 'contactEmail', 'currency'],
  },
  {
    id: 'admin',
    title: 'Admin Account',
    path: '/setup/admin',
    description: 'Create your admin account',
    component: 'AdminSetup',
    validations: ['email', 'password'],
  },
  {
    id: 'database',
    title: 'Database',
    path: '/setup/database',
    description: 'Configure and test database connection',
    component: 'DatabaseSetup',
    validations: ['databaseConnection', 'migrations'],
  },
  {
    id: 'security',
    title: 'Security',
    path: '/setup/security',
    description: 'Configure security settings',
    component: 'SecuritySetup',
    validations: ['ssl', 'firewall', 'authentication'],
  },
  {
    id: 'complete',
    title: 'Complete',
    path: '/setup/complete',
    description: 'Setup complete',
    component: 'CompletePage',
  },
];
