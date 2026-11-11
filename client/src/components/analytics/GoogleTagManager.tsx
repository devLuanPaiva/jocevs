import Script from 'next/script';
import type { ReactElement } from 'react';
import {
  buildGoogleTagManagerNoscriptUrl,
  buildGoogleTagManagerScript,
} from '@/lib/analytics/gtm-script';
import { getGoogleTagManagerIds } from '@/lib/config/server-env';

export function GoogleTagManager(): ReactElement | null {
  const containerIds = getGoogleTagManagerIds();
  if (containerIds.length === 0) {
    return null;
  }
  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {buildGoogleTagManagerScript(containerIds)}
      </Script>
      <noscript>
        {containerIds.map((containerId) => (
          <iframe
            key={containerId}
            title="Google Tag Manager"
            src={buildGoogleTagManagerNoscriptUrl(containerId)}
            width="0"
            height="0"
            className="hidden"
          />
        ))}
      </noscript>
    </>
  );
}
