export const CONSENT_STORAGE_KEY = 'jocevs:analytics-consent';

export type ConsentChoice = 'granted' | 'denied';

export function isConsentChoice(value: string | null): value is ConsentChoice {
  return value === 'granted' || value === 'denied';
}
