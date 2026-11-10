'use client';

import { useSyncExternalStore } from 'react';
import type { ConsentChoice } from './consent';
import { readConsent, readServerConsent, subscribeToConsent } from './consent-store';

export function useConsent(): ConsentChoice | null {
  return useSyncExternalStore(subscribeToConsent, readConsent, readServerConsent);
}
