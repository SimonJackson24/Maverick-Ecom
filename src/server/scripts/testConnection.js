const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load production environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI?.substring(0, process.env.MONGODB_URI.indexOf('?')));
    
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      authSource: 'admin',
      ssl: true,
    });

    console.log('\n✅ Successfully connected to MongoDB!');
    
    // Test database operations
    const collections = await connection.connection.db.collections();
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.collectionName}`);
    });

    // Get database stats
    const stats = await connection.connection.db.stats();
    console.log('\nDatabase stats:');
    console.log(`- Database size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Collections: ${stats.collections}`);
    console.log(`- Objects: ${stats.objects}`);

  } catch (error) {
    console.error('\n❌ Failed to connect to MongoDB:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testConnection();
