export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public status: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
    };
  }
}

export type ErrorCode =
  // Authentication Errors
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_TOKEN_INVALID'
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_EMAIL_EXISTS'
  | 'AUTH_PASSWORD_WEAK'
  | 'AUTH_UNAUTHORIZED'
  | 'AUTH_FORBIDDEN'

  // Validation Errors
  | 'VALIDATION_REQUIRED'
  | 'VALIDATION_FORMAT'
  | 'VALIDATION_LENGTH'
  | 'VALIDATION_RANGE'
  | 'VALIDATION_UNIQUE'
  | 'VALIDATION_REFERENCE'

  // Resource Errors
  | 'RESOURCE_NOT_FOUND'
  | 'RESOURCE_ALREADY_EXISTS'
  | 'RESOURCE_CONFLICT'
  | 'RESOURCE_GONE'
  | 'RESOURCE_RATE_LIMIT'

  // Business Logic Errors
  | 'PRODUCT_OUT_OF_STOCK'
  | 'PRODUCT_DISCONTINUED'
  | 'ORDER_INVALID_STATUS'
  | 'ORDER_ALREADY_PROCESSED'
  | 'PAYMENT_DECLINED'
  | 'PAYMENT_EXPIRED'
  | 'COUPON_INVALID'
  | 'COUPON_EXPIRED'
  | 'COUPON_USED'
  | 'WISHLIST_LIMIT_EXCEEDED'

  // Integration Errors
  | 'API_ERROR'
  | 'API_TIMEOUT'
  | 'API_RATE_LIMIT'
  | 'API_INVALID_RESPONSE'
  | 'DATABASE_ERROR'
  | 'CACHE_ERROR'
  | 'QUEUE_ERROR'

  // File Errors
  | 'FILE_TOO_LARGE'
  | 'FILE_TYPE_INVALID'
  | 'FILE_UPLOAD_FAILED'
  | 'FILE_DOWNLOAD_FAILED'

  // System Errors
  | 'SYSTEM_ERROR'
  | 'NETWORK_ERROR'
  | 'MAINTENANCE_MODE'
  | 'SERVICE_UNAVAILABLE';

export interface ErrorResponse {
  error: {
    name: string;
    message: string;
    code: ErrorCode;
    status: number;
    details?: Record<string, any>;
    timestamp: string;
    requestId?: string;
  };
}

export interface ErrorMetadata {
  userId?: string;
  sessionId?: string;
  url?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  referer?: string;
  stack?: string;
}

export interface ErrorLog extends ErrorResponse {
  metadata: ErrorMetadata;
  environment: string;
  version: string;
  severity: ErrorSeverity;
}

export type ErrorSeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical';

export interface ErrorFilter {
  code?: ErrorCode[];
  severity?: ErrorSeverity[];
  startDate?: string;
  endDate?: string;
  userId?: string;
  environment?: string;
  version?: string;
  sortBy?: 'timestamp' | 'severity' | 'code';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ErrorStats {
  total: number;
  bySeverity: Record<ErrorSeverity, number>;
  byCode: Record<ErrorCode, number>;
  byHour: {
    hour: string;
    count: number;
    severity: Record<ErrorSeverity, number>;
  }[];
  topErrors: {
    code: ErrorCode;
    count: number;
    lastOccurrence: string;
  }[];
  affectedUsers: number;
  averageResponseTime: number;
  errorRate: number;
}
