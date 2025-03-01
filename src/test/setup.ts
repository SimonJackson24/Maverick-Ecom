import { sequelize } from '../server/config/sequelize';

beforeAll(async () => {
  // Connect to test database
  await sequelize.authenticate();
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});

beforeEach(async () => {
  // Clear all tables before each test
  await Promise.all(
    Object.values(sequelize.models).map(model => model.destroy({ truncate: true, cascade: true }))
  );
});
