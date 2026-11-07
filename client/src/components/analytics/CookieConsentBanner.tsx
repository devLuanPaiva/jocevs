'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';
import { saveConsent } from '@/lib/analytics/consent-store';
import { useConsent } from '@/lib/analytics/use-consent';

const buttonClassName =
  'inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors';

export function CookieConsentBanner(): ReactElement | null {
  const consent = useConsent();
  if (consent !== null) {
    return null;
  }
  return (
    <section
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-60 bg-brand-900 text-white shadow-[0_-8px_32px_rgba(7,59,134,0.4)]"
    >
      <div className="mx-auto flex w-[90%] max-w-(--width-content) flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <h2 id="cookie-banner-title" className="font-semibold text-sun">
            Sua privacidade
          </h2>
          <p className="mt-1 text-sm text-white/90">
            Usamos cookies de medição (Google Analytics) para entender como o site é usado e
            melhorá-lo. Eles só são ativados se você aceitar. Saiba mais na{' '}
            <Link href="/politica-de-cookies" className="underline hover:text-sun">
              política de cookies
            </Link>{' '}
            e na{' '}
            <Link href="/politica-de-privacidade" className="underline hover:text-sun">
              política de privacidade
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveConsent('denied')}
            className={`${buttonClassName} text-white ring-2 ring-white/70 hover:bg-white hover:text-brand-900`}
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => saveConsent('granted')}
            className={`${buttonClassName} bg-sun text-brand-900 hover:brightness-95`}
          >
            Aceitar
          </button>
        </div>
      </div>
    </section>
  );
}
