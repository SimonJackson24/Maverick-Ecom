// Permission type for admin access control
const permissions = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_ORDERS: 'manage_orders',
  MANAGE_CUSTOMERS: 'manage_customers',
  MANAGE_INVENTORY: 'manage_inventory',
  MANAGE_MARKETING: 'manage_marketing',
  MANAGE_CONTENT: 'manage_content',
  MANAGE_SCENTS: 'manage_scents',
  MANAGE_STAFF: 'manage_staff',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_SUPPORT: 'manage_support',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SHIPPING: 'manage_shipping',
} as const;

export type Permission = typeof permissions[keyof typeof permissions];
export { permissions };
