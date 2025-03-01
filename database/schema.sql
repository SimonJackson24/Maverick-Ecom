-- Support Schema

-- Chat Sessions Table
CREATE TABLE chat_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    customer_number VARCHAR(20) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES chat_sessions(session_id),
    message_id VARCHAR(255) NOT NULL,  -- WhatsApp message ID
    type VARCHAR(10) NOT NULL CHECK (type IN ('customer', 'agent')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'delivered', 'read', 'replied', 'deleted')),
    whatsapp_status VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Message Cleanup Status Table
CREATE TABLE message_cleanup (
    message_id VARCHAR(255) PRIMARY KEY,
    group_message_id VARCHAR(255) NOT NULL,
    customer_number VARCHAR(20) NOT NULL,
    cleanup_scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    cleaned_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'failed_permanent')),
    retry_count INTEGER DEFAULT 0,
    last_error TEXT,
    last_retry_at TIMESTAMP WITH TIME ZONE,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cleanup Metrics Table
CREATE TABLE cleanup_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_attempts INTEGER DEFAULT 0,
    successful_cleanups INTEGER DEFAULT 0,
    failed_cleanups INTEGER DEFAULT 0,
    retry_count INTEGER DEFAULT 0,
    average_cleanup_time INTERVAL,
    success_rate DECIMAL(5,2)
);

-- Cleanup Service Status Table
CREATE TABLE cleanup_service_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'stopped', 'error')),
    last_run_at TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    current_queue_size INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_chat_sessions_customer_number ON chat_sessions(customer_number);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_message_cleanup_status ON message_cleanup(status);
CREATE INDEX idx_message_cleanup_scheduled ON message_cleanup(cleanup_scheduled_at);
CREATE INDEX idx_message_cleanup_retry ON message_cleanup(retry_count, next_retry_at);
CREATE INDEX idx_cleanup_metrics_timestamp ON cleanup_metrics(timestamp);

-- Update Timestamps Function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Calculate Success Rate Function
CREATE OR REPLACE FUNCTION calculate_success_rate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_attempts > 0 THEN
        NEW.success_rate = (NEW.successful_cleanups::DECIMAL / NEW.total_attempts::DECIMAL) * 100;
    ELSE
        NEW.success_rate = 0;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update Timestamps Triggers
CREATE TRIGGER update_chat_sessions_timestamp
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_chat_messages_timestamp
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_message_cleanup_timestamp
    BEFORE UPDATE ON message_cleanup
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_cleanup_service_status_timestamp
    BEFORE UPDATE ON cleanup_service_status
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Calculate Success Rate Trigger
CREATE TRIGGER calculate_cleanup_success_rate
    BEFORE INSERT OR UPDATE ON cleanup_metrics
    FOR EACH ROW
    EXECUTE FUNCTION calculate_success_rate();

-- Views
CREATE OR REPLACE VIEW v_cleanup_performance AS
SELECT
    date_trunc('hour', timestamp) as hour,
    SUM(total_attempts) as total_attempts,
    SUM(successful_cleanups) as successful_cleanups,
    SUM(failed_cleanups) as failed_cleanups,
    AVG(success_rate) as avg_success_rate,
    AVG(EXTRACT(EPOCH FROM average_cleanup_time)) as avg_cleanup_time_seconds
FROM cleanup_metrics
GROUP BY date_trunc('hour', timestamp)
ORDER BY hour DESC;

CREATE OR REPLACE VIEW v_cleanup_queue_status AS
SELECT
    status,
    COUNT(*) as count,
    MIN(cleanup_scheduled_at) as oldest_scheduled,
    MAX(retry_count) as max_retries,
    AVG(retry_count) as avg_retries
FROM message_cleanup
WHERE status IN ('pending', 'failed')
GROUP BY status;

-- Detailed Analytics Views

-- Hourly Performance Metrics
CREATE OR REPLACE VIEW v_cleanup_hourly_metrics AS
SELECT
    date_trunc('hour', timestamp) as hour,
    COUNT(*) as total_records,
    SUM(total_attempts) as total_attempts,
    SUM(successful_cleanups) as successful_cleanups,
    SUM(failed_cleanups) as failed_cleanups,
    SUM(retry_count) as total_retries,
    AVG(success_rate) as avg_success_rate,
    AVG(EXTRACT(EPOCH FROM average_cleanup_time)) as avg_cleanup_time_seconds,
    MAX(EXTRACT(EPOCH FROM average_cleanup_time)) as max_cleanup_time_seconds,
    MIN(EXTRACT(EPOCH FROM average_cleanup_time)) as min_cleanup_time_seconds
FROM cleanup_metrics
GROUP BY date_trunc('hour', timestamp)
ORDER BY hour DESC;

-- Daily Performance Metrics
CREATE OR REPLACE VIEW v_cleanup_daily_metrics AS
SELECT
    date_trunc('day', timestamp) as day,
    COUNT(*) as total_records,
    SUM(total_attempts) as total_attempts,
    SUM(successful_cleanups) as successful_cleanups,
    SUM(failed_cleanups) as failed_cleanups,
    SUM(retry_count) as total_retries,
    AVG(success_rate) as avg_success_rate,
    AVG(EXTRACT(EPOCH FROM average_cleanup_time)) as avg_cleanup_time_seconds,
    MAX(EXTRACT(EPOCH FROM average_cleanup_time)) as max_cleanup_time_seconds,
    MIN(EXTRACT(EPOCH FROM average_cleanup_time)) as min_cleanup_time_seconds
FROM cleanup_metrics
GROUP BY date_trunc('day', timestamp)
ORDER BY day DESC;

-- Error Analysis View
CREATE OR REPLACE VIEW v_cleanup_error_analysis AS
SELECT
    last_error,
    COUNT(*) as occurrence_count,
    MIN(created_at) as first_occurrence,
    MAX(updated_at) as last_occurrence,
    AVG(retry_count) as avg_retries,
    COUNT(CASE WHEN status = 'failed_permanent' THEN 1 END) as permanent_failures
FROM message_cleanup
WHERE last_error IS NOT NULL
GROUP BY last_error
ORDER BY occurrence_count DESC;

-- Retry Pattern Analysis
CREATE OR REPLACE VIEW v_cleanup_retry_patterns AS
SELECT
    retry_count,
    COUNT(*) as message_count,
    AVG(EXTRACT(EPOCH FROM (cleaned_at - created_at))) as avg_time_to_cleanup,
    MIN(EXTRACT(EPOCH FROM (cleaned_at - created_at))) as min_time_to_cleanup,
    MAX(EXTRACT(EPOCH FROM (cleaned_at - created_at))) as max_time_to_cleanup,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_cleanups,
    COUNT(CASE WHEN status = 'failed_permanent' THEN 1 END) as permanent_failures
FROM message_cleanup
GROUP BY retry_count
ORDER BY retry_count;

-- Customer Impact Analysis
CREATE OR REPLACE VIEW v_cleanup_customer_impact AS
SELECT
    mc.customer_number,
    COUNT(*) as total_messages,
    COUNT(CASE WHEN mc.status = 'completed' THEN 1 END) as successful_cleanups,
    COUNT(CASE WHEN mc.status IN ('failed', 'failed_permanent') THEN 1 END) as failed_cleanups,
    AVG(mc.retry_count) as avg_retries,
    MAX(mc.retry_count) as max_retries,
    AVG(EXTRACT(EPOCH FROM (mc.cleaned_at - mc.created_at))) as avg_cleanup_time,
    COUNT(DISTINCT cs.session_id) as affected_sessions
FROM message_cleanup mc
LEFT JOIN chat_sessions cs ON mc.customer_number = cs.customer_number
GROUP BY mc.customer_number
ORDER BY total_messages DESC;

-- Time-based Performance Analysis
CREATE OR REPLACE VIEW v_cleanup_time_performance AS
SELECT
    EXTRACT(HOUR FROM timestamp) as hour_of_day,
    EXTRACT(DOW FROM timestamp) as day_of_week,
    COUNT(*) as total_attempts,
    SUM(successful_cleanups) as successful_cleanups,
    SUM(failed_cleanups) as failed_cleanups,
    AVG(success_rate) as avg_success_rate,
    AVG(EXTRACT(EPOCH FROM average_cleanup_time)) as avg_cleanup_time_seconds
FROM cleanup_metrics
GROUP BY EXTRACT(HOUR FROM timestamp), EXTRACT(DOW FROM timestamp)
ORDER BY day_of_week, hour_of_day;

-- Queue Health Analysis
CREATE OR REPLACE VIEW v_cleanup_queue_health AS
SELECT
    date_trunc('hour', updated_at) as hour,
    status,
    COUNT(*) as message_count,
    AVG(retry_count) as avg_retries,
    MAX(retry_count) as max_retries,
    MIN(cleanup_scheduled_at) as oldest_scheduled,
    MAX(cleanup_scheduled_at) as newest_scheduled,
    COUNT(CASE WHEN retry_count >= 3 THEN 1 END) as high_retry_count,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_time_in_queue
FROM message_cleanup
WHERE status IN ('pending', 'failed')
GROUP BY date_trunc('hour', updated_at), status
ORDER BY hour DESC, status;

-- Service Health Metrics
CREATE OR REPLACE VIEW v_cleanup_service_health AS
SELECT
    date_trunc('hour', updated_at) as hour,
    status,
    COUNT(*) as status_count,
    MAX(current_queue_size) as max_queue_size,
    MIN(current_queue_size) as min_queue_size,
    AVG(current_queue_size) as avg_queue_size,
    COUNT(CASE WHEN last_error IS NOT NULL THEN 1 END) as error_count
FROM cleanup_service_status
GROUP BY date_trunc('hour', updated_at), status
ORDER BY hour DESC, status;

-- E-commerce Schema

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    scent_profile TEXT,
    burn_time INTEGER, -- in hours
    weight DECIMAL(10,2), -- in grams
    dimensions VARCHAR(50), -- format: "length x width x height"
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'discontinued')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product Categories Junction Table
CREATE TABLE product_categories (
    product_id UUID REFERENCES products(id),
    category_id UUID REFERENCES categories(id),
    PRIMARY KEY (product_id, category_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wishlists Table
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist Items Table
CREATE TABLE wishlist_items (
    wishlist_id UUID REFERENCES wishlists(id),
    product_id UUID REFERENCES products(id),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (wishlist_id, product_id)
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    user_id UUID REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Coupons Table
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_purchase DECIMAL(10,2),
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    times_used INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- E-commerce Indexes
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_status ON coupons(status);

-- E-commerce Views

-- Featured Products View
CREATE OR REPLACE VIEW v_featured_products AS
SELECT 
    p.*,
    COALESCE(r.avg_rating, 0) as average_rating,
    COALESCE(r.review_count, 0) as review_count
FROM products p
LEFT JOIN (
    SELECT 
        product_id,
        AVG(rating) as avg_rating,
        COUNT(*) as review_count
    FROM reviews
    WHERE status = 'approved'
    GROUP BY product_id
) r ON p.id = r.product_id
WHERE p.is_featured = true
AND p.status = 'active';

-- Product Performance View
CREATE OR REPLACE VIEW v_product_performance AS
SELECT
    p.id,
    p.name,
    p.price,
    p.stock,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(oi.quantity) as total_units_sold,
    SUM(oi.quantity * oi.price_at_time) as total_revenue,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(DISTINCT r.id) as review_count,
    COUNT(DISTINCT w.wishlist_id) as wishlist_count
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
LEFT JOIN reviews r ON p.id = r.product_id AND r.status = 'approved'
LEFT JOIN wishlist_items w ON p.id = w.product_id
GROUP BY p.id, p.name, p.price, p.stock
ORDER BY total_revenue DESC NULLS LAST;

-- User Orders View
CREATE OR REPLACE VIEW v_user_orders AS
SELECT
    u.id as user_id,
    u.email,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.total_amount) as total_spent,
    MAX(o.created_at) as last_order_date,
    COUNT(DISTINCT r.id) as total_reviews,
    COALESCE(AVG(r.rating), 0) as average_rating
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN reviews r ON u.id = r.user_id AND r.status = 'approved'
GROUP BY u.id, u.email
ORDER BY total_spent DESC NULLS LAST;

-- Update Timestamps Triggers
CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_products_timestamp
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_categories_timestamp
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_orders_timestamp
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_wishlists_timestamp
    BEFORE UPDATE ON wishlists
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reviews_timestamp
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_coupons_timestamp
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
