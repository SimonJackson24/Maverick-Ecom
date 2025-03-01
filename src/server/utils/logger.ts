import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'wickandwax-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Create a separate logger for payment-related activities
const paymentLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { service: 'payment-service' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/payments/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/payments/suspicious.log', 
      level: 'warn' 
    }),
    new winston.transports.File({ 
      filename: 'logs/payments/combined.log' 
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  paymentLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
