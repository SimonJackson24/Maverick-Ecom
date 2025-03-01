import { models } from '../models/seo.js';
import database from '../config/database.js';
import logger from '../utils/logger.js';

async function migrateDatabase() {
  try {
    // Connect to PostgreSQL
    await database.connect();
    const sequelize = database.getSequelize();

    // Create all tables
    logger.info('Creating database tables...');
    await sequelize.sync({ force: true }); // Be careful with force: true in production!

    // Add indexes
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_content_health_url" ON "ContentHealths" ("url");
      CREATE INDEX IF NOT EXISTS "idx_meta_tags_url" ON "MetaTags" ("url");
      CREATE INDEX IF NOT EXISTS "idx_url_management_current" ON "UrlManagements" ("currentUrl");
      CREATE INDEX IF NOT EXISTS "idx_keyword_performance_keyword" ON "KeywordPerformances" ("keyword");
    `);

    logger.info('Database migration completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    await database.disconnect();
  }
}

// Run migration
migrateDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
