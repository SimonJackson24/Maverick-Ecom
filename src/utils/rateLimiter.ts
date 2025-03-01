interface RateLimiterOptions {
  maxRequests: number;  // Maximum number of requests
  timeWindow: number;   // Time window in milliseconds
  retryAfter?: number; // Time to wait before retrying in milliseconds
}

export class RateLimiter {
  private requests: number[];
  private readonly maxRequests: number;
  private readonly timeWindow: number;
  private readonly retryAfter: number;

  constructor(options: RateLimiterOptions) {
    this.requests = [];
    this.maxRequests = options.maxRequests;
    this.timeWindow = options.timeWindow;
    this.retryAfter = options.retryAfter || 1000;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    
    // Remove expired timestamps
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      // Calculate time to wait
      const oldestRequest = this.requests[0];
      const timeToWait = Math.max(
        this.timeWindow - (now - oldestRequest),
        this.retryAfter
      );

      // Wait before proceeding
      await new Promise(resolve => setTimeout(resolve, timeToWait));
      
      // Recursive call after waiting
      return this.acquire();
    }

    // Add current request
    this.requests.push(now);
  }
}

// Rate limiter instances for different services
export const serpApiLimiter = new RateLimiter({
  maxRequests: 100,    // 100 requests
  timeWindow: 3600000, // per hour (in milliseconds)
  retryAfter: 2000     // Wait 2 seconds between requests
});

export const urlCheckLimiter = new RateLimiter({
  maxRequests: 60,     // 60 requests
  timeWindow: 60000,   // per minute
  retryAfter: 1000     // Wait 1 second between requests
});

export const contentAnalysisLimiter = new RateLimiter({
  maxRequests: 30,     // 30 requests
  timeWindow: 60000,   // per minute
  retryAfter: 2000     // Wait 2 seconds between requests
});
