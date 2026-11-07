import { afterEach, describe, expect, it, vi } from 'vitest';
import { getGoogleOAuthConfig, getGoogleTagManagerIds } from './server-env';

describe('getGoogleOAuthConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is unavailable until both the client id and the secret are set', () => {
    vi.stubEnv('GOOGLE_CLIENT_ID', 'client-id');
    vi.stubEnv('GOOGLE_CLIENT_SECRET', '');

    expect(getGoogleOAuthConfig()).toBeNull();
  });

  it('builds the callback url from the public site url, ignoring a trailing slash', () => {
    vi.stubEnv('GOOGLE_CLIENT_ID', 'client-id');
    vi.stubEnv('GOOGLE_CLIENT_SECRET', 'client-secret');
    vi.stubEnv('SITE_URL', 'https://festividade.example.com/');

    expect(getGoogleOAuthConfig()).toEqual({
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUri: 'https://festividade.example.com/admin/login/google/callback',
    });
  });
});

describe('getGoogleTagManagerIds', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ['GTM-WZPLNHV8', ['GTM-WZPLNHV8']],
    ['GTM-WZPLNHV8, GTM-MHXHMWT9 ', ['GTM-WZPLNHV8', 'GTM-MHXHMWT9']],
    ['', []],
    ['G-ABC123,GTM-abc"></script>', []],
    ['G-ABC123,GTM-MHXHMWT9', ['GTM-MHXHMWT9']],
  ])('reads %j as %j', (configured, expected) => {
    vi.stubEnv('GOOGLE_TAG_MANAGER_IDS', configured);

    expect(getGoogleTagManagerIds()).toEqual(expected);
  });
});
