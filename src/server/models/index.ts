import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../../.env.development')
});

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'wickandwax',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  }
});

// Import models
import { User } from './UserSequelize';
import { Product } from './ProductSequelize';
import { Order } from './OrderSequelize';
import { OrderItem } from './OrderItem';
import { Address } from './Address';
import { Inventory } from './Inventory';
import { Promotion } from './Promotion';
import { ScentProfile } from './ScentProfile';
import { UserPreference } from './UserPreference';
import { AdminSettings } from './AdminSettings';
import { PaymentConfig } from './PaymentConfig';
import { PaymentLog } from './PaymentLog';
import { Review } from './Review';
import { SeoMetrics } from './SeoMetrics';
import { SuspiciousActivity } from './SuspiciousActivity';
import { Wishlist } from './Wishlist';

// Initialize models
const models = {
  User,
  Product,
  Order,
  OrderItem,
  Address,
  Inventory,
  Promotion,
  ScentProfile,
  UserPreference,
  AdminSettings,
  PaymentConfig,
  PaymentLog,
  Review,
  SeoMetrics,
  SuspiciousActivity,
  Wishlist
};

// Initialize each model
Object.values(models).forEach((model: any) => {
  if (model.init) {
    model.init(sequelize);
  }
});

// Set up associations
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize };
export default models;
