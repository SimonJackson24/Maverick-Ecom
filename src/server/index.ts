import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import logger from './utils/logger.js';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();

// Load all GraphQL schemas
const schemaFiles = loadFilesSync(join(__dirname, '..', 'graphql', 'schema', '*.graphql'));
const resolverFiles = loadFilesSync(join(__dirname, '..', 'graphql', 'resolvers', '*.ts'));

// Merge schemas and resolvers
const typeDefs = mergeTypeDefs(schemaFiles);
const resolvers = mergeResolvers(resolverFiles);

logger.info('Successfully loaded GraphQL schemas and resolvers');

// Create Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    logger.error('GraphQL Error:', error);
    return error;
  },
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://wickandwax.co'
    : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://127.0.0.1:3000',
      'http://192.168.5.7:3000'
    ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight']
});

app.use(cors(corsOptions));

// Apply CORS to all routes
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Start server
async function startServer() {
  try {
    await apolloServer.start();

    app.use(
      '/graphql',
      cors(corsOptions),
      express.json(),
      expressMiddleware(apolloServer, {
        context: async ({ req }) => {
          // Get the user token from the headers
          const token = req.headers.authorization || '';

          // Add user authentication logic here
          const user = token ? await getUserFromToken(token) : null;

          return { user };
        },
      })
    );

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      logger.info(`🚀 Server ready at http://localhost:${PORT}`);
      logger.info(`🚀 GraphQL endpoint at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    throw error;
  }
}

// Initialize server
startServer().catch((error) => {
  logger.error('Unhandled server startup error:', error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  try {
    await apolloServer.stop();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});
