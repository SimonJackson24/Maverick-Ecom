import { RevolutPaymentConfig } from '../../types/payment';

interface PaymentAttempt {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  status: 'success' | 'failure' | 'suspicious';
  errorCode?: string;
  errorMessage?: string;
  ipAddress: string;
  deviceInfo: string;
}

interface SuspiciousPattern {
  type: 'multiple_failures' | 'amount_threshold' | 'frequency' | 'location_mismatch';
  severity: 'low' | 'medium' | 'high';
  details: string;
}

class PaymentMonitoringService {
  private static instance: PaymentMonitoringService;
  private readonly FAILURE_THRESHOLD = 3;
  private readonly TIME_WINDOW = 15 * 60 * 1000; // 15 minutes
  private readonly AMOUNT_THRESHOLD = 1000;
  private failedAttempts: Map<string, PaymentAttempt[]>;

  private constructor() {
    this.failedAttempts = new Map();
  }

  static getInstance(): PaymentMonitoringService {
    if (!PaymentMonitoringService.instance) {
      PaymentMonitoringService.instance = new PaymentMonitoringService();
    }
    return PaymentMonitoringService.instance;
  }

  async logPaymentAttempt(attempt: PaymentAttempt): Promise<void> {
    try {
      // Log to backend
      await fetch('/api/payment-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt),
      });

      // Track failed attempts for monitoring
      if (attempt.status === 'failure') {
        this.trackFailedAttempt(attempt);
      }

      // Check for suspicious patterns
      const patterns = this.detectSuspiciousPatterns(attempt);
      if (patterns.length > 0) {
        await this.reportSuspiciousActivity(attempt, patterns);
      }
    } catch (error) {
      console.error('Failed to log payment attempt:', error);
      // Fallback to local storage in case of API failure
      this.logToLocalStorage(attempt);
    }
  }

  private trackFailedAttempt(attempt: PaymentAttempt): void {
    const userAttempts = this.failedAttempts.get(attempt.userId) || [];
    userAttempts.push(attempt);
    
    // Clean up old attempts
    const now = new Date().getTime();
    const recentAttempts = userAttempts.filter(
      a => now - a.timestamp.getTime() < this.TIME_WINDOW
    );
    
    this.failedAttempts.set(attempt.userId, recentAttempts);
  }

  private detectSuspiciousPatterns(attempt: PaymentAttempt): SuspiciousPattern[] {
    const patterns: SuspiciousPattern[] = [];
    const userAttempts = this.failedAttempts.get(attempt.userId) || [];

    // Check for multiple failures
    if (userAttempts.length >= this.FAILURE_THRESHOLD) {
      patterns.push({
        type: 'multiple_failures',
        severity: 'high',
        details: `${userAttempts.length} failed attempts in ${this.TIME_WINDOW / 60000} minutes`,
      });
    }

    // Check amount threshold
    if (attempt.amount > this.AMOUNT_THRESHOLD) {
      patterns.push({
        type: 'amount_threshold',
        severity: 'medium',
        details: `Transaction amount ${attempt.amount} exceeds threshold ${this.AMOUNT_THRESHOLD}`,
      });
    }

    // Check transaction frequency
    const recentAttempts = userAttempts.filter(
      a => new Date().getTime() - a.timestamp.getTime() < 60000 // 1 minute
    );
    if (recentAttempts.length > 5) {
      patterns.push({
        type: 'frequency',
        severity: 'high',
        details: `${recentAttempts.length} attempts in 1 minute`,
      });
    }

    return patterns;
  }

  private async reportSuspiciousActivity(
    attempt: PaymentAttempt,
    patterns: SuspiciousPattern[]
  ): Promise<void> {
    try {
      await fetch('/api/suspicious-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attempt,
          patterns,
          timestamp: new Date(),
        }),
      });
    } catch (error) {
      console.error('Failed to report suspicious activity:', error);
      // Fallback to local storage
      this.logToLocalStorage({
        type: 'suspicious_activity',
        data: { attempt, patterns },
        timestamp: new Date(),
      });
    }
  }

  private logToLocalStorage(data: any): void {
    try {
      const logs = JSON.parse(localStorage.getItem('payment_logs') || '[]');
      logs.push({
        ...data,
        timestamp: new Date(),
      });
      localStorage.setItem('payment_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to log to localStorage:', error);
    }
  }
}

export default PaymentMonitoringService;
