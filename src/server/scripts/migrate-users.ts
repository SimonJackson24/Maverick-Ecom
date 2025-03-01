import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import User from '../models/UserSequelize';
import Address from '../models/Address';
import UserPreference from '../models/UserPreference';
import sequelize from '../models/index';

dotenv.config();

async function migrateUsers() {
  try {
    // Connect to MongoDB
    const mongoClient = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = mongoClient.db();
    const mongoUsers = await db.collection('users').find({}).toArray();

    // Connect to PostgreSQL through Sequelize
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    // Sync models with database
    await sequelize.sync({ force: true }); // Be careful with force: true in production!

    // Migrate each user
    for (const mongoUser of mongoUsers) {
      try {
        // Create user
        const user = await User.create({
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
              Address.create({
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
          await UserPreference.create({
            userId: user.id,
            scentPreferences: mongoUser.preferences.scentPreferences || [],
            marketingEmails: mongoUser.preferences.marketingEmails,
            orderNotifications: mongoUser.preferences.orderNotifications,
          });
        }

        console.log(`Successfully migrated user: ${mongoUser.email}`);
      } catch (error) {
        console.error(`Failed to migrate user ${mongoUser.email}:`, error);
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
migrateUsers();
