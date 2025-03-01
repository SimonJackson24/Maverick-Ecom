import { UNSAFE_enhanceManualRouteObjects } from '@remix-run/router';
import { Future } from '@remix-run/router/dist/history';

export const routerFutureConfig: Partial<Future> = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};
