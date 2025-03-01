import * as Sentry from '@sentry/nextjs';
import { BrowserTracing } from '@sentry/tracing';
import { CaptureContext } from '@sentry/types';
import React, { Component, ReactNode, MouseEventHandler } from 'react';

interface ErrorWithContext extends Error {
  context?: Record<string, unknown>;
  tags?: Record<string, string>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
}

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface SentryTransactionOptions {
  tags?: Record<string, string>;
  data?: Record<string, unknown>;
}

interface UserFeedback {
  name: string;
  email: string;
  comments: string;
}

interface Breadcrumb {
  message: string;
  category?: string;
  data?: Record<string, unknown>;
}

interface SentryTransaction {
  name: string;
  tags?: Record<string, string>;
  data?: Record<string, unknown>;
}

export const initErrorTracking = (): void => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development'
    });
  }
};

const errorCounts = new Map<string, { count: number; timestamp: number }>();
const ERROR_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export const getErrorCount = (errorMessage: string): number => {
  const now = Date.now();
  const errorData = errorCounts.get(errorMessage);

  if (!errorData || now - errorData.timestamp > ERROR_THRESHOLD_MS) {
    errorCounts.set(errorMessage, { count: 1, timestamp: now });
    return 1;
  }

  const newCount = errorData.count + 1;
  errorCounts.set(errorMessage, { count: newCount, timestamp: now });
  return newCount;
};

export const captureError = (error: ErrorWithContext, context?: CaptureContext): void => {
  const errorCount = getErrorCount(error.message);

  if (errorCount <= 3) {
    Sentry.withScope((scope) => {
      if (error.context) {
        scope.setContext('error_context', error.context);
      }
      if (error.tags) {
        scope.setTags(error.tags);
      }
      if (error.user) {
        scope.setUser(error.user);
      }
      if (context) {
        scope.setContext('additional_context', context);
      }

      scope.setExtra('error_count', errorCount);
      Sentry.captureException(error);
    });
  }
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    captureError(error, {
      extra: {
        componentStack: errorInfo.componentStack
      }
    });
  }

  resetError: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    this.setState({ hasError: false });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>
            We&apos;re sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            type="button"
            onClick={this.resetError}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const startPerformanceTransaction = (
  name: string,
  options?: SentryTransactionOptions
): SentryTransaction => {
  const transaction = Sentry.startTransaction({
    name,
    ...options
  });

  return transaction;
};

export const captureUserFeedback = (feedback: UserFeedback, eventId: string): void => {
  Sentry.captureUserFeedback({
    event_id: eventId,
    name: feedback.name,
    email: feedback.email,
    comments: feedback.comments
  });
};

export const addBreadcrumb = (breadcrumb: Breadcrumb): void => {
  Sentry.addBreadcrumb({
    category: breadcrumb.category || 'custom',
    message: breadcrumb.message,
    data: breadcrumb.data,
    level: 'info'
  });
};
