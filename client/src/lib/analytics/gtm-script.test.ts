import { describe, expect, it } from 'vitest';
import { CONSENT_STORAGE_KEY } from './consent';
import { buildGoogleTagManagerScript } from './gtm-script';

describe('buildGoogleTagManagerScript', () => {
  it('starts with analytics storage denied unless the visitor already accepted', () => {
    const script = buildGoogleTagManagerScript(['GTM-ABC123']);

    expect(script).toContain(
      "analytics_storage: storedConsent === 'granted' ? 'granted' : 'denied'",
    );
    expect(script).toContain(JSON.stringify(CONSENT_STORAGE_KEY));
  });

  it('never grants advertising storage', () => {
    const script = buildGoogleTagManagerScript(['GTM-ABC123']);

    expect(script).toContain("ad_storage: 'denied'");
    expect(script).toContain("ad_personalization: 'denied'");
  });

  it('loads every configured container', () => {
    const script = buildGoogleTagManagerScript(['GTM-ABC123', 'GTM-XYZ789']);

    expect(script).toContain('["GTM-ABC123","GTM-XYZ789"]');
  });
});
