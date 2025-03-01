import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import sequelize, { models } from '../models';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

async function migrateData() {
  try {
    // Connect to MongoDB
    const mongoClient = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = mongoClient.db();

    // Connect to PostgreSQL through Sequelize
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    // Sync all models with database
    await sequelize.sync({ force: true }); // Be careful with force: true in production!

    // Migrate Users, Addresses, and Preferences
    const mongoUsers = await db.collection('users').find({}).toArray();
    for (const mongoUser of mongoUsers) {
      try {
        // Create user
        const user = await models.User.create({
          id: uuidv4(),
          email: mongoUser.email,
          password: mongoUser.password, // Password is already hashed
          firstName: mongoUser.firstName,
          lastName: mongoUser.lastName,
          role: mongoUser.role,
          isActive: mongoUser.isActive,
          lastLogin: mongoUser.lastLogin,
        });

        // Create addresses
        if (mongoUser.addresses && mongoUser.addresses.length > 0) {
          await Promise.all(
            mongoUser.addresses.map((addr: any) =>
              models.Address.create({
                id: uuidv4(),
                userId: user.id,
                type: addr.type,
                line1: addr.line1,
                line2: addr.line2,
                city: addr.city,
                state: addr.state,
                postalCode: addr.postalCode,
                country: addr.country,
                isDefault: addr.isDefault,
              })
            )
          );
        }

        // Create preferences
        if (mongoUser.preferences) {
          await models.UserPreference.create({
            id: uuidv4(),
            userId: user.id,
            scentPreferences: mongoUser.preferences.scentPreferences || [],
            marketingEmails: mongoUser.preferences.marketingEmails,
            orderNotifications: mongoUser.preferences.orderNotifications,
          });
        }
      } catch (error) {
        console.error(`Failed to migrate user ${mongoUser.email}:`, error);
      }
    }

    // Migrate Products
    const mongoProducts = await db.collection('products').find({}).toArray();
    for (const mongoProduct of mongoProducts) {
      try {
        await models.Product.create({
          id: uuidv4(),
          name: mongoProduct.name,
          description: mongoProduct.description,
          price: mongoProduct.price,
          images: mongoProduct.images,
          category: mongoProduct.category,
          scentProfile: mongoProduct.scent.profile,
          scentNotes: mongoProduct.scent.notes,
          scentIntensity: mongoProduct.scent.intensity,
          seasonal: mongoProduct.scent.seasonal,
          stock: mongoProduct.stock,
          sku: mongoProduct.sku,
          isActive: mongoProduct.isActive,
          metadata: mongoProduct.metadata,
        });
      } catch (error) {
        console.error(`Failed to migrate product ${mongoProduct.name}:`, error);
      }
    }

    // Migrate Orders
    const mongoOrders = await db.collection('orders').find({}).toArray();
    for (const mongoOrder of mongoOrders) {
      try {
        const order = await models.Order.create({
          id: uuidv4(),
          userId: mongoOrder.userId,
          status: mongoOrder.status,
          paymentStatus: mongoOrder.paymentStatus,
          paymentId: mongoOrder.paymentId,
          shippingAddressLine1: mongoOrder.shippingAddress.line1,
          shippingAddressLine2: mongoOrder.shippingAddress.line2,
          shippingCity: mongoOrder.shippingAddress.city,
          shippingState: mongoOrder.shippingAddress.state,
          shippingPostalCode: mongoOrder.shippingAddress.postalCode,
          shippingCountry: mongoOrder.shippingAddress.country,
          shippingMethod: mongoOrder.shippingMethod,
          trackingNumber: mongoOrder.trackingNumber,
          subtotal: mongoOrder.subtotal,
          tax: mongoOrder.tax,
          shippingCost: mongoOrder.shippingCost,
          total: mongoOrder.total,
          notes: mongoOrder.notes,
        });

        // Create order items
        if (mongoOrder.items && mongoOrder.items.length > 0) {
          await Promise.all(
            mongoOrder.items.map((item: any) =>
              models.OrderItem.create({
                id: uuidv4(),
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
              })
            )
          );
        }
      } catch (error) {
        console.error(`Failed to migrate order ${mongoOrder._id}:`, error);
      }
    }

    console.log('Migration completed successfully');

    // Close connections
    await mongoClient.close();
    await sequelize.close();

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateData();
