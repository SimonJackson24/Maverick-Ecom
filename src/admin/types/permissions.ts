export enum Permission {
  // Product Permissions
  VIEW_PRODUCTS = 'view_products',
  MANAGE_PRODUCTS = 'manage_products',
  DELETE_PRODUCTS = 'delete_products',

  // Order Permissions
  VIEW_ORDERS = 'view_orders',
  MANAGE_ORDERS = 'manage_orders',
  PROCESS_REFUNDS = 'process_refunds',

  // Customer Permissions
  VIEW_CUSTOMERS = 'view_customers',
  MANAGE_CUSTOMERS = 'manage_customers',

  // Content Permissions
  VIEW_CONTENT = 'view_content',
  MANAGE_CONTENT = 'manage_content',

  // Settings Permissions
  VIEW_SETTINGS = 'view_settings',
  MANAGE_SETTINGS = 'manage_settings',

  // Support Permissions
  VIEW_SUPPORT = 'view_support',
  MANAGE_SUPPORT = 'manage_support',

  // Subscription Permissions
  VIEW_SUBSCRIPTIONS = 'view_subscriptions',
  MANAGE_SUBSCRIPTIONS = 'manage_subscriptions',

  // Analytics Permissions
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_ANALYTICS = 'export_analytics',

  // User Management Permissions
  VIEW_USERS = 'view_users',
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',

  // Advanced Permissions
  MANAGE_INTEGRATIONS = 'manage_integrations',
  MANAGE_API_KEYS = 'manage_api_keys',
  VIEW_SYSTEM_LOGS = 'view_system_logs'
}

export interface UserPermissions {
  permissions: Permission[];
}

export const isPermitted = (
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean => {
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};
