import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import { APIError } from './errorHandler';

// Rate limiting configuration
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
export const corsOptions = cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
});

// Session configuration
export const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  },
});

// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    throw new APIError(401, 'Unauthorized');
  }
  next();
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userRole || !roles.includes(req.session.userRole)) {
      throw new APIError(403, 'Forbidden');
    }
    next();
  };
};

// IP whitelist middleware for admin routes
export const adminIpWhitelist = (req: Request, res: Response, next: NextFunction) => {
  const allowedIps = process.env.ADMIN_ALLOWED_IPS?.split(',') || [];
  const clientIp = req.ip;

  if (process.env.NODE_ENV === 'production' && !allowedIps.includes(clientIp)) {
    throw new APIError(403, 'Access denied from this IP address');
  }
  next();
};

// Security headers middleware using helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
  crossOriginOpenerPolicy: process.env.NODE_ENV === 'production',
  crossOriginResourcePolicy: process.env.NODE_ENV === 'production',
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: process.env.NODE_ENV === 'production',
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: true,
  xssFilter: true,
});
