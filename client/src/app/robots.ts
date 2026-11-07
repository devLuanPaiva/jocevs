import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/config/server-env';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/galeria/download'] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
