-- Admin Users Table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Permissions Table
CREATE TABLE admin_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin User Permissions Junction Table
CREATE TABLE admin_user_permissions (
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES admin_permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES admin_users(id),
    PRIMARY KEY (admin_user_id, permission_id)
);

-- Admin Activity Log
CREATE TABLE admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES admin_users(id),
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Settings Table
CREATE TABLE admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    key VARCHAR(255) NOT NULL,
    value JSONB,
    created_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (category, key)
);

-- Create indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_activity_log_user ON admin_activity_log(admin_user_id);
CREATE INDEX idx_admin_activity_log_created ON admin_activity_log(created_at);
CREATE INDEX idx_admin_settings_category_key ON admin_settings(category, key);

-- Insert default permissions
INSERT INTO admin_permissions (name, description) VALUES
    ('VIEW_ORDERS', 'View order details and history'),
    ('MANAGE_ORDERS', 'Create, update, and process orders'),
    ('PROCESS_REFUNDS', 'Process order refunds'),
    ('VIEW_PRODUCTS', 'View product catalog'),
    ('MANAGE_PRODUCTS', 'Create, update, and delete products'),
    ('MANAGE_INVENTORY', 'Manage product inventory'),
    ('VIEW_CUSTOMERS', 'View customer information'),
    ('MANAGE_CUSTOMERS', 'Manage customer accounts'),
    ('MANAGE_CONTENT', 'Manage website content'),
    ('PUBLISH_CONTENT', 'Publish or unpublish content'),
    ('VIEW_ANALYTICS', 'View analytics and reports'),
    ('EXPORT_REPORTS', 'Export analytics reports'),
    ('MANAGE_SETTINGS', 'Manage system settings'),
    ('MANAGE_USERS', 'Manage admin users');

-- Create admin roles view
CREATE VIEW admin_roles_view AS
SELECT 
    au.id,
    au.email,
    au.first_name,
    au.last_name,
    au.role,
    array_agg(ap.name) as permissions
FROM admin_users au
LEFT JOIN admin_user_permissions aup ON au.id = aup.admin_user_id
LEFT JOIN admin_permissions ap ON aup.permission_id = ap.id
GROUP BY au.id, au.email, au.first_name, au.last_name, au.role;
