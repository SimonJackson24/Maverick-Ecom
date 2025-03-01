import { MongoClient } from 'mongodb';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../../.env.development')
});

async function migrateData() {
  // Initialize MongoDB connection
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wickandwax';
  const mongoClient = new MongoClient(mongoUri);

  // Initialize PostgreSQL connection
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'wickandwax',
    logging: false
  });

  try {
    // Connect to both databases
    await mongoClient.connect();
    await sequelize.authenticate();
    console.log('Connected to both MongoDB and PostgreSQL');

    const mongodb = mongoClient.db();

    // Migrate Users
    console.log('Migrating users...');
    const users = await mongodb.collection('users').find({}).toArray();
    for (const user of users) {
      await sequelize.query(`
        INSERT INTO users (
          id, email, password, first_name, last_name, role, is_active, last_login, created_at, updated_at
        ) VALUES (
          :id, :email, :password, :firstName, :lastName, :role, :isActive, :lastLogin, :createdAt, :updatedAt
        )
        ON CONFLICT (id) DO NOTHING
      `, {
        replacements: {
          id: user._id.toString(),
          email: user.email,
          password: user.password,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: user.role || 'customer',
          isActive: user.isActive !== false,
          lastLogin: user.lastLogin || new Date(),
          createdAt: user.createdAt || new Date(),
          updatedAt: user.updatedAt || new Date()
        }
      });
    }
    console.log(`Migrated ${users.length} users`);

    // Migrate Addresses
    console.log('Migrating addresses...');
    const addresses = await mongodb.collection('addresses').find({}).toArray();
    for (const address of addresses) {
      await sequelize.query(`
        INSERT INTO addresses (
          id, user_id, type, line1, line2, city, state, postal_code, country, is_default, created_at, updated_at
        ) VALUES (
          :id, :userId, :type, :line1, :line2, :city, :state, :postalCode, :country, :isDefault, :createdAt, :updatedAt
        )
        ON CONFLICT (id) DO NOTHING
      `, {
        replacements: {
          id: address._id.toString(),
          userId: address.userId.toString(),
          type: address.type || 'shipping',
          line1: address.line1,
          line2: address.line2 || '',
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          isDefault: address.isDefault || false,
          createdAt: address.createdAt || new Date(),
          updatedAt: address.updatedAt || new Date()
        }
      });
    }
    console.log(`Migrated ${addresses.length} addresses`);

    // Migrate Products
    console.log('Migrating products...');
    const products = await mongodb.collection('products').find({}).toArray();
    for (const product of products) {
      await sequelize.query(`
        INSERT INTO products (
          id, name, description, price, images, category, scent_profile, scent_notes,
          scent_intensity, seasonal, stock, sku, is_active, metadata, created_at, updated_at
        ) VALUES (
          :id, :name, :description, :price, :images, :category, :scentProfile, :scentNotes,
          :scentIntensity, :seasonal, :stock, :sku, :isActive, :metadata, :createdAt, :updatedAt
        )
        ON CONFLICT (id) DO NOTHING
      `, {
        replacements: {
          id: product._id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images || [],
          category: product.category,
          scentProfile: product.scentProfile,
          scentNotes: product.scentNotes || [],
          scentIntensity: product.scentIntensity || 3,
          seasonal: product.seasonal || [],
          stock: product.stock || 0,
          sku: product.sku,
          isActive: product.isActive !== false,
          metadata: JSON.stringify(product.metadata || {}),
          createdAt: product.createdAt || new Date(),
          updatedAt: product.updatedAt || new Date()
        }
      });
    }
    console.log(`Migrated ${products.length} products`);

    // Migrate Orders
    console.log('Migrating orders...');
    const orders = await mongodb.collection('orders').find({}).toArray();
    for (const order of orders) {
      // Insert order
      await sequelize.query(`
        INSERT INTO orders (
          id, user_id, status, payment_status, payment_id, shipping_address_line1,
          shipping_address_line2, shipping_city, shipping_state, shipping_postal_code,
          shipping_country, shipping_method, tracking_number, subtotal, tax,
          shipping_cost, total, notes, created_at, updated_at
        ) VALUES (
          :id, :userId, :status, :paymentStatus, :paymentId, :shippingAddressLine1,
          :shippingAddressLine2, :shippingCity, :shippingState, :shippingPostalCode,
          :shippingCountry, :shippingMethod, :trackingNumber, :subtotal, :tax,
          :shippingCost, :total, :notes, :createdAt, :updatedAt
        )
        ON CONFLICT (id) DO NOTHING
      `, {
        replacements: {
          id: order._id.toString(),
          userId: order.userId.toString(),
          status: order.status || 'pending',
          paymentStatus: order.paymentStatus || 'pending',
          paymentId: order.paymentId || '',
          shippingAddressLine1: order.shippingAddress?.line1 || '',
          shippingAddressLine2: order.shippingAddress?.line2 || '',
          shippingCity: order.shippingAddress?.city || '',
          shippingState: order.shippingAddress?.state || '',
          shippingPostalCode: order.shippingAddress?.postalCode || '',
          shippingCountry: order.shippingAddress?.country || '',
          shippingMethod: order.shippingMethod || 'standard',
          trackingNumber: order.trackingNumber || '',
          subtotal: order.subtotal || 0,
          tax: order.tax || 0,
          shippingCost: order.shippingCost || 0,
          total: order.total || 0,
          notes: order.notes || '',
          createdAt: order.createdAt || new Date(),
          updatedAt: order.updatedAt || new Date()
        }
      });

      // Insert order items
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          await sequelize.query(`
            INSERT INTO order_items (
              id, order_id, product_id, quantity, price, name, created_at, updated_at
            ) VALUES (
              uuid_generate_v4(), :orderId, :productId, :quantity, :price, :name, :createdAt, :updatedAt
            )
          `, {
            replacements: {
              orderId: order._id.toString(),
              productId: item.productId.toString(),
              quantity: item.quantity,
              price: item.price,
              name: item.name,
              createdAt: order.createdAt || new Date(),
              updatedAt: order.updatedAt || new Date()
            }
          });
        }
      }
    }
    console.log(`Migrated ${orders.length} orders`);

    // Migrate Inventory
    console.log('Migrating inventory...');
    const inventory = await mongodb.collection('inventory').find({}).toArray();
    for (const item of inventory) {
      await sequelize.query(`
        INSERT INTO inventory (
          id, product_id, quantity, type, reason, reference, notes, created_at, updated_at
        ) VALUES (
          :id, :productId, :quantity, :type, :reason, :reference, :notes, :createdAt, :updatedAt
        )
        ON CONFLICT (id) DO NOTHING
      `, {
        replacements: {
          id: item._id.toString(),
          productId: item.productId.toString(),
          quantity: item.quantity,
          type: item.type || 'adjustment',
          reason: item.reason || 'initial',
          reference: item.reference || '',
          notes: item.notes || '',
          createdAt: item.createdAt || new Date(),
          updatedAt: item.updatedAt || new Date()
        }
      });
    }
    console.log(`Migrated ${inventory.length} inventory records`);

    // Migrate Promotions
    console.log('Migrating promotions...');
    const promotions = await mongodb.collection('promotions').find({}).toArray();
    for (const promo of promotions) {
      await sequelize.query(`
        INSERT INTO promotions (
          id, code, type, value, min_purchase, max_discount, start_date, end_date,
          usage_limit, usage_count, applicable_products, excluded_products,
          description, is_active, created_at, updated_at
        ) VALUES (
          :id, :code, :type, :value, :minPurchase, :maxDiscount, :startDate, :endDate,
          :usageLimit, :usageCount, :applicableProducts, :excludedProducts,
          :description, :isActive, :createdAt, :updatedAt
        )
        ON CONFLICT (id) DO NOTHING
      `, {
        replacements: {
          id: promo._id.toString(),
          code: promo.code,
          type: promo.type,
          value: promo.value,
          minPurchase: promo.minPurchase || null,
          maxDiscount: promo.maxDiscount || null,
          startDate: promo.startDate || new Date(),
          endDate: promo.endDate || new Date(),
          usageLimit: promo.usageLimit || null,
          usageCount: promo.usageCount || 0,
          applicableProducts: promo.applicableProducts || [],
          excludedProducts: promo.excludedProducts || [],
          description: promo.description || '',
          isActive: promo.isActive !== false,
          createdAt: promo.createdAt || new Date(),
          updatedAt: promo.updatedAt || new Date()
        }
      });
    }
    console.log(`Migrated ${promotions.length} promotions`);

    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connections
    await mongoClient.close();
    await sequelize.close();
  }
}

// Run migration
migrateData();
