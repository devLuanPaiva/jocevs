import { CONSENT_STORAGE_KEY, isConsentChoice, type ConsentChoice } from './consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const listeners = new Set<() => void>();

export function subscribeToConsent(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function readConsent(): ConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return isConsentChoice(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function readServerConsent(): ConsentChoice {
  return 'denied';
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    return;
  }
  window.gtag?.('consent', 'update', { analytics_storage: choice });
  listeners.forEach((notify) => notify());
}
