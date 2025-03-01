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
import { seoResolvers } from './resolvers/seoResolvers';
import logger from './utils/logger.js';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();

// Define base schema
const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }
`;

// Load SEO schema
const seoSchema = readFileSync(join(__dirname, 'schema', 'seo.graphql'), 'utf-8');

// Combine schemas and resolvers
const typeDefs = [baseTypeDefs, seoSchema];
const resolvers = [seoResolvers];

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
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3002'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/graphql', limiter);

const startServer = async () => {
  try {
    // Start Apollo Server
    await apolloServer.start();
    
    // Apply Apollo middleware
    app.use(
      '/graphql',
      express.json(),
      expressMiddleware(apolloServer, {
        context: async ({ req }) => ({
          // Add any context you need here
          token: req.headers.authorization,
        }),
      })
    );

    // Start express server
    const PORT = 4001;
    app.listen(PORT, () => {
      logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    throw error;
  }
};

// Initialize server
startServer().catch((error) => {
  logger.error('Unhandled server startup error:', error);
  process.exit(1);
});
