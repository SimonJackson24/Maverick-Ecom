import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { customerHandlers } from '../admin/mocks/customerMocks';
import { shippingHandlers } from '../admin/mocks/shippingMocks';
import { authHandlers } from './authMocks';

// Combine all handlers
const allHandlers = [
  ...handlers,
  ...customerHandlers,
  ...shippingHandlers,
  ...authHandlers,
];

// Configure worker with proper options
export const worker = setupWorker(...allHandlers);

// Explicitly handle unhandled requests
worker.events.on('unhandledRequest', ({ request, warning }) => {
  console.warn('Unhandled request:', request.url);
  warning();
});

// Add proper error handling for worker start
export const startWorker = async () => {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  try {
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true, // Reduce console noise
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: {
          scope: '/',
        },
      },
    });
    console.log('[MSW] Mock service worker started successfully');
  } catch (error) {
    console.error('[MSW] Failed to start mock service worker:', error);
  }
};

export default worker;
