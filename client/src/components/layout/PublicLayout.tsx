import type { ReactElement, ReactNode } from 'react';
import { CookieConsentBanner } from '@/components/analytics/CookieConsentBanner';
import { GoogleTagManager } from '@/components/analytics/GoogleTagManager';
import { JsonLd } from '@/components/seo/JsonLd';
import { getGoogleTagManagerIds } from '@/lib/config/server-env';
import {
  buildOrganizationStructuredData,
  buildWebSiteStructuredData,
} from '@/lib/seo/structured-data';
import { PublicFooter } from './PublicFooter';
import { PublicHeader } from './PublicHeader';
import { MAIN_CONTENT_ID, SkipLink } from './SkipLink';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: Readonly<PublicLayoutProps>): ReactElement {
  return (
    <>
      <SkipLink />
      <JsonLd data={buildWebSiteStructuredData()} />
      <JsonLd data={buildOrganizationStructuredData()} />
      <PublicHeader />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="outline-none">
        {children}
      </main>
      <PublicFooter />
      <GoogleTagManager />
      {getGoogleTagManagerIds().length > 0 ? <CookieConsentBanner /> : null}
    </>
  );
}
