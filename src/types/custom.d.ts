import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toBeVisible(): R;
    }
  }
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.ico';
declare module '*.webp';

declare module '@heroicons/react/outline' {
  export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ShoppingBagIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const TagIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const CogIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module '@testing-library/react' {
  export * from '@testing-library/react';
}

declare module '@testing-library/jest-dom' {
  export * from '@testing-library/jest-dom';
}

declare module 'recharts' {
  export * from 'recharts';
}

declare module '@mui/lab' {
  export * from '@mui/lab';
}

declare module '@sentry/nextjs' {
  export * from '@sentry/nextjs';
  export interface Hub {
    getClient(): any;
    getScope(): any;
    pushScope(): any;
    popScope(): any;
    bindClient(client: any): void;
    captureException(exception: any): string;
    captureMessage(message: string): string;
    lastEventId(): string | undefined;
    addBreadcrumb(breadcrumb: any): void;
    setUser(user: any): void;
    setTags(tags: { [key: string]: string }): void;
    setExtra(key: string, extra: any): void;
    setContext(name: string, context: any): void;
  }
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.styl' {
  const classes: { [key: string]: string };
  export default classes;
}
