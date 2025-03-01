import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wick & Wax Co API',
      version: '1.0.0',
      description: 'API documentation for Wick & Wax Co e-commerce platform',
      contact: {
        name: 'API Support',
        email: 'support@wickandwax.co'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    './src/server/routes/*.ts',
    './src/server/models/*.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
