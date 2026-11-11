import { getSiteUrl } from '@/lib/config/server-env';
import { SHARE_IMAGE, SITE_NAME } from './site-metadata';

const SCHEMA_CONTEXT = 'https://schema.org';

export function buildWebSiteStructuredData(): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${siteUrl}/#organization` },
  };
}

export function buildOrganizationStructuredData(): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: SITE_NAME,
    alternateName: 'Jornada Cultural e Esportiva de Viçosa',
    url: siteUrl,
    logo: `${siteUrl}${SHARE_IMAGE.url}`,
    areaServed: {
      '@type': 'City',
      name: 'Viçosa',
      containedInPlace: 'Rio Grande do Norte, Brasil',
    },
  };
}

export function serializeStructuredData(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
