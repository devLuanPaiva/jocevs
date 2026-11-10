import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/config/server-env';
import { PUBLIC_SITEMAP_ENTRIES } from '@/lib/seo/sitemap-entries';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return PUBLIC_SITEMAP_ENTRIES.map((entry) => ({
    url: `${siteUrl}${entry.path}`,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
