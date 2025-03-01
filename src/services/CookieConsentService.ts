import { MonitoringService } from './monitoring/MonitoringService';

export interface CookieConsent {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  lastUpdated: string;
}

export interface CookieConsentOptions {
  expireDays?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export class CookieConsentService {
  private static instance: CookieConsentService;
  private readonly monitoring: MonitoringService;
  private readonly CONSENT_COOKIE_NAME = 'cookie_consent';
  private readonly defaultOptions: Required<CookieConsentOptions> = {
    expireDays: 365,
    domain: window.location.hostname,
    path: '/',
    secure: true,
    sameSite: 'Strict',
  };

  private constructor() {
    this.monitoring = MonitoringService.getInstance();
  }

  public static getInstance(): CookieConsentService {
    if (!CookieConsentService.instance) {
      CookieConsentService.instance = new CookieConsentService();
    }
    return CookieConsentService.instance;
  }

  public getConsent(): CookieConsent | null {
    try {
      const consentCookie = this.getCookie(this.CONSENT_COOKIE_NAME);
      if (consentCookie) {
        return JSON.parse(consentCookie);
      }
      return null;
    } catch (error) {
      this.monitoring.logError('cookie_consent_parse_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  public setConsent(consent: Partial<CookieConsent>, options?: CookieConsentOptions): void {
    try {
      const currentConsent = this.getConsent() || {
        necessary: true, // Always required
        preferences: false,
        analytics: false,
        marketing: false,
        lastUpdated: new Date().toISOString(),
      };

      const updatedConsent: CookieConsent = {
        ...currentConsent,
        ...consent,
        lastUpdated: new Date().toISOString(),
      };

      const mergedOptions = { ...this.defaultOptions, ...options };
      this.setCookie(
        this.CONSENT_COOKIE_NAME,
        JSON.stringify(updatedConsent),
        mergedOptions
      );

      this.monitoring.logEvent('cookie_consent_updated', {
        consent: updatedConsent,
        timestamp: updatedConsent.lastUpdated,
      });

      // Apply consent changes
      this.applyConsentSettings(updatedConsent);
    } catch (error) {
      this.monitoring.logError('cookie_consent_update_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        consent,
      });
    }
  }

  private applyConsentSettings(consent: CookieConsent): void {
    // Handle analytics cookies
    if (!consent.analytics) {
      this.removeAnalyticsCookies();
    }

    // Handle marketing cookies
    if (!consent.marketing) {
      this.removeMarketingCookies();
    }

    // Handle preference cookies
    if (!consent.preferences) {
      this.removePreferenceCookies();
    }

    // Notify third-party services
    this.updateThirdPartyConsent(consent);
  }

  private removeAnalyticsCookies(): void {
    const analyticsCookies = ['_ga', '_gid', '_gat'];
    analyticsCookies.forEach(name => this.removeCookie(name));
  }

  private removeMarketingCookies(): void {
    const marketingCookies = ['_fbp', '_gcl_au'];
    marketingCookies.forEach(name => this.removeCookie(name));
  }

  private removePreferenceCookies(): void {
    const preferenceCookies = ['theme', 'language', 'currency'];
    preferenceCookies.forEach(name => this.removeCookie(name));
  }

  private updateThirdPartyConsent(consent: CookieConsent): void {
    try {
      // Update Google Analytics
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: consent.analytics ? 'granted' : 'denied',
          ad_storage: consent.marketing ? 'granted' : 'denied',
        });
      }

      // Update Facebook Pixel
      if (window.fbq) {
        if (consent.marketing) {
          window.fbq('consent', 'grant');
        } else {
          window.fbq('consent', 'revoke');
        }
      }

      this.monitoring.logEvent('third_party_consent_updated', {
        consent,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.monitoring.logError('third_party_consent_update_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        consent,
      });
    }
  }

  private setCookie(
    name: string,
    value: string,
    options: Required<CookieConsentOptions>
  ): void {
    try {
      const expires = new Date(
        Date.now() + options.expireDays * 24 * 60 * 60 * 1000
      ).toUTCString();

      document.cookie = [
        `${name}=${encodeURIComponent(value)}`,
        `expires=${expires}`,
        `domain=${options.domain}`,
        `path=${options.path}`,
        options.secure ? 'secure' : '',
        `samesite=${options.sameSite}`,
      ]
        .filter(Boolean)
        .join('; ');
    } catch (error) {
      this.monitoring.logError('cookie_set_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        name,
      });
    }
  }

  private getCookie(name: string): string | null {
    try {
      const matches = document.cookie.match(
        new RegExp(
          '(?:^|; )' +
            name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') +
            '=([^;]*)'
        )
      );
      return matches ? decodeURIComponent(matches[1]) : null;
    } catch (error) {
      this.monitoring.logError('cookie_get_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        name,
      });
      return null;
    }
  }

  private removeCookie(name: string): void {
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    } catch (error) {
      this.monitoring.logError('cookie_remove_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        name,
      });
    }
  }

  public hasConsent(): boolean {
    return this.getConsent() !== null;
  }

  public isConsentValid(consent: CookieConsent): boolean {
    const lastUpdated = new Date(consent.lastUpdated);
    const now = new Date();
    const daysSinceUpdate =
      (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceUpdate <= this.defaultOptions.expireDays;
  }

  public clearConsent(): void {
    try {
      this.removeCookie(this.CONSENT_COOKIE_NAME);
      this.monitoring.logEvent('cookie_consent_cleared', {
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.monitoring.logError('cookie_consent_clear_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

// Add type definitions for third-party services
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params: { [key: string]: string }
    ) => void;
    fbq?: (command: string, action: string) => void;
  }
}
