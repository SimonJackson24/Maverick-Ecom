import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';

class Database {
  private static instance: Database;
  private sequelize: Sequelize | null = null;
  private isConnected = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private readonly maxReconnectAttempts = 5;
  private reconnectAttempts = 0;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected && this.sequelize) {
      logger.info('Using existing database connection');
      return;
    }

    try {
      this.sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB || 'wickandwax',
        logging: (msg) => logger.debug(msg),
        pool: {
          max: 20,
          min: 5,
          acquire: 30000,
          idle: 10000
        },
        dialectOptions: {
          ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
          } : false
        }
      });

      await this.sequelize.authenticate();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      logger.info('Successfully connected to PostgreSQL');

      // Set up error handling
      this.sequelize.addHook('beforeConnect', async (config) => {
        logger.debug('Attempting to connect to PostgreSQL');
      });

      this.sequelize.addHook('afterConnect', async (connection) => {
        logger.info('New PostgreSQL connection established');
      });

    } catch (error) {
      logger.error('Failed to connect to PostgreSQL:', error);
      this.handleConnectionError();
      throw error;
    }
  }

  private handleConnectionError(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error(`Failed to reconnect after ${this.maxReconnectAttempts} attempts`);
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const backoffDelay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 60000);

    this.reconnectTimeout = setTimeout(() => {
      logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }, backoffDelay);
  }

  async disconnect(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.sequelize) {
      await this.sequelize.close();
      this.isConnected = false;
      logger.info('Disconnected from PostgreSQL');
    }
  }

  getSequelize(): Sequelize {
    if (!this.sequelize) {
      throw new Error('Database connection not initialized');
    }
    return this.sequelize;
  }
}

export default Database.getInstance();
