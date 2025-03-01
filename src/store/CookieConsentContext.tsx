import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CookieConsent {
  necessary: boolean; // Always true, required cookies
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentContextType {
  consent: CookieConsent;
  hasResponded: boolean;
  updateConsent: (newConsent: Partial<CookieConsent>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
}

const defaultConsent: CookieConsent = {
  necessary: true, // Always true as these are essential
  analytics: false,
  marketing: false,
  preferences: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CONSENT_COOKIE_NAME = 'ww_cookie_consent';
export const CONSENT_VERSION = '1.0.0'; // Increment when consent options change

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    // Load saved consent from cookie
    const savedConsent = getCookieConsent();
    if (savedConsent) {
      setConsent(savedConsent.consent);
      setHasResponded(true);
    }
  }, []);

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    const updatedConsent = {
      ...consent,
      ...newConsent,
      necessary: true, // Always keep necessary cookies enabled
    };
    setConsent(updatedConsent);
    setHasResponded(true);
    saveConsent(updatedConsent);
    applyConsentPreferences(updatedConsent);
  };

  const acceptAll = () => {
    const fullConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setConsent(fullConsent);
    setHasResponded(true);
    saveConsent(fullConsent);
    applyConsentPreferences(fullConsent);
  };

  const rejectAll = () => {
    const minimalConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setConsent(minimalConsent);
    setHasResponded(true);
    saveConsent(minimalConsent);
    applyConsentPreferences(minimalConsent);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasResponded,
        updateConsent,
        acceptAll,
        rejectAll,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

// Helper functions
function getCookieConsent(): { consent: CookieConsent; version: string } | null {
  try {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(CONSENT_COOKIE_NAME + '='));
    
    if (cookie) {
      const value = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
      // If version doesn't match, treat as no consent
      if (value.version !== CONSENT_VERSION) {
        return null;
      }
      return value;
    }
  } catch (error) {
    console.error('Error reading cookie consent:', error);
  }
  return null;
}

function saveConsent(consent: CookieConsent) {
  const value = {
    consent,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  
  // Set cookie with 6 month expiry
  const sixMonths = 180 * 24 * 60 * 60 * 1000;
  const expires = new Date(Date.now() + sixMonths).toUTCString();
  
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(value)
  )}; expires=${expires}; path=/; SameSite=Strict`;
}

function applyConsentPreferences(consent: CookieConsent) {
  // Analytics (Google Analytics, etc.)
  if (!consent.analytics) {
    // Disable analytics tracking
    window['ga-disable-GA_MEASUREMENT_ID'] = true;
    // Clear existing analytics cookies
    deleteCookiesByPrefix('_ga');
    deleteCookiesByPrefix('_gid');
  }

  // Marketing
  if (!consent.marketing) {
    // Clear marketing cookies
    deleteCookiesByPrefix('_fbp');
    deleteCookiesByPrefix('_gcl');
  }

  // Preferences
  if (!consent.preferences) {
    // Clear preference cookies except the consent cookie itself
    const allCookies = document.cookie.split('; ');
    allCookies.forEach(cookie => {
      const name = cookie.split('=')[0];
      if (name !== CONSENT_COOKIE_NAME && !isNecessaryCookie(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
  }
}

function deleteCookiesByPrefix(prefix: string) {
  const cookies = document.cookie.split('; ');
  cookies.forEach(cookie => {
    const name = cookie.split('=')[0];
    if (name.startsWith(prefix)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

function isNecessaryCookie(name: string): boolean {
  const necessaryCookies = [
    CONSENT_COOKIE_NAME,
    'session',
    'XSRF-TOKEN',
    'csrf_token',
  ];
  return necessaryCookies.includes(name);
}
