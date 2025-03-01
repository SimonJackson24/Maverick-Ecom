import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../../.env.development')
});

async function createSchema() {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'wickandwax',
    logging: console.log
  });

  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    // Enable UUID extension
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('Enabled UUID extension');

    // Create User table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Users table');

    // Create Address table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        line1 VARCHAR(255) NOT NULL,
        line2 VARCHAR(255),
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        postal_code VARCHAR(50) NOT NULL,
        country VARCHAR(255) NOT NULL,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Addresses table');

    // Create Products table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        images TEXT[],
        category VARCHAR(255) NOT NULL,
        scent_profile VARCHAR(255) NOT NULL,
        scent_notes TEXT[],
        scent_intensity INTEGER CHECK (scent_intensity BETWEEN 1 AND 5),
        seasonal TEXT[],
        stock INTEGER NOT NULL DEFAULT 0,
        sku VARCHAR(255) NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT true,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Products table');

    // Create Orders table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        payment_id VARCHAR(255) NOT NULL,
        shipping_address_line1 VARCHAR(255) NOT NULL,
        shipping_address_line2 VARCHAR(255),
        shipping_city VARCHAR(255) NOT NULL,
        shipping_state VARCHAR(255) NOT NULL,
        shipping_postal_code VARCHAR(50) NOT NULL,
        shipping_country VARCHAR(255) NOT NULL,
        shipping_method VARCHAR(255) NOT NULL,
        tracking_number VARCHAR(255),
        subtotal DECIMAL(10,2) NOT NULL,
        tax DECIMAL(10,2) NOT NULL,
        shipping_cost DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Orders table');

    // Create Order Items table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID NOT NULL REFERENCES orders(id),
        product_id UUID NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Order Items table');

    // Create Inventory table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        reason VARCHAR(50) NOT NULL,
        reference VARCHAR(255) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Inventory table');

    // Create Promotions table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        code VARCHAR(255) NOT NULL UNIQUE,
        type VARCHAR(50) NOT NULL,
        value DECIMAL(10,2) NOT NULL,
        min_purchase DECIMAL(10,2),
        max_discount DECIMAL(10,2),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        usage_limit INTEGER,
        usage_count INTEGER DEFAULT 0,
        applicable_products UUID[],
        excluded_products UUID[],
        description TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Promotions table');

    // Create Admin Settings table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        store_info JSONB NOT NULL,
        currency_settings JSONB NOT NULL,
        payment_settings JSONB NOT NULL,
        shipping_settings JSONB NOT NULL,
        security_settings JSONB NOT NULL,
        inventory_settings JSONB NOT NULL,
        notification_settings JSONB NOT NULL,
        analytics_settings JSONB NOT NULL,
        seo_settings JSONB NOT NULL,
        cache_settings JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Admin Settings table');

    // Create Payment Config table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS payment_config (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        provider VARCHAR(50) NOT NULL,
        config JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Payment Config table');

    // Create Payment Log table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS payment_log (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID NOT NULL REFERENCES orders(id),
        provider VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        transaction_id VARCHAR(255) NOT NULL,
        response JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Payment Log table');

    // Create Review table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID NOT NULL REFERENCES products(id),
        user_id UUID NOT NULL REFERENCES users(id),
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        verified_purchase BOOLEAN DEFAULT false,
        helpful_votes INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Review table');

    // Create SEO Metrics table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS seo_metrics (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        page_path VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        keywords TEXT[],
        canonical_url VARCHAR(255),
        og_title VARCHAR(255),
        og_description TEXT,
        og_image VARCHAR(255),
        structured_data JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created SEO Metrics table');

    // Create Suspicious Activity table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS suspicious_activities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id),
        ip_address VARCHAR(45) NOT NULL,
        activity_type VARCHAR(50) NOT NULL,
        details JSONB NOT NULL,
        severity VARCHAR(20) NOT NULL,
        is_resolved BOOLEAN DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created Suspicious Activity table');

    // Create Wishlist table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id),
        product_id UUID NOT NULL REFERENCES products(id),
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      );
    `);
    console.log('Created Wishlist table');

    console.log('Database schema created successfully');
    await sequelize.close();

  } catch (error) {
    console.error('Failed to create schema:', error);
    process.exit(1);
  }
}

// Run schema creation
createSchema();
