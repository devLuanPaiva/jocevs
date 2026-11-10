'use client';

import type { ReactElement } from 'react';
import type { ConsentChoice } from '@/lib/analytics/consent';
import { saveConsent } from '@/lib/analytics/consent-store';
import { useConsent } from '@/lib/analytics/use-consent';

const CHOICE_LABELS: Record<ConsentChoice, string> = {
  granted: 'Cookies de medição aceitos.',
  denied: 'Cookies de medição recusados.',
};

const NO_CHOICE_LABEL = 'Você ainda não escolheu. Os cookies de medição ficam desativados.';

const buttonClassName =
  'inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold ring-2 ring-brand-900 transition-colors';

export function CookiePreferences(): ReactElement {
  const consent = useConsent();
  return (
    <div className="mt-4 rounded-2xl bg-brand-900/5 p-5">
      <p role="status" className="font-medium">
        {consent ? CHOICE_LABELS[consent] : NO_CHOICE_LABEL}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          aria-pressed={consent === 'granted'}
          onClick={() => saveConsent('granted')}
          className={`${buttonClassName} aria-pressed:bg-brand-900 aria-pressed:text-white hover:bg-brand-900 hover:text-white`}
        >
          Aceitar cookies de medição
        </button>
        <button
          type="button"
          aria-pressed={consent === 'denied'}
          onClick={() => saveConsent('denied')}
          className={`${buttonClassName} aria-pressed:bg-brand-900 aria-pressed:text-white hover:bg-brand-900 hover:text-white`}
        >
          Recusar cookies de medição
        </button>
      </div>
    </div>
  );
}
