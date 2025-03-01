import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function up(queryInterface: QueryInterface) {
  const now = new Date();
  
  // Create default admin user
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  
  await queryInterface.bulkInsert('users', [{
    id: uuidv4(),
    email: 'admin@wickandwax.co',
    password_hash: passwordHash,
    role: 'admin',
    created_at: now,
    updated_at: now
  }]);

  // Create sample products
  const products = [
    {
      id: uuidv4(),
      name: 'Lavender Dreams Candle',
      description: 'A soothing blend of lavender and vanilla',
      price: 24.99,
      stock: 100,
      created_at: now,
      updated_at: now
    },
    {
      id: uuidv4(),
      name: 'Ocean Breeze Candle',
      description: 'Fresh marine scents with a hint of citrus',
      price: 29.99,
      stock: 75,
      created_at: now,
      updated_at: now
    },
    {
      id: uuidv4(),
      name: 'Autumn Spice Candle',
      description: 'Warm cinnamon and nutmeg blend',
      price: 27.99,
      stock: 50,
      created_at: now,
      updated_at: now
    }
  ];

  await queryInterface.bulkInsert('products', products);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('products', {});
  await queryInterface.bulkDelete('users', {});
}
