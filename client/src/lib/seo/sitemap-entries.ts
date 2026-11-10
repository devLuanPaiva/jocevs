import type { MetadataRoute } from 'next';

export interface SitemapEntry {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
}

export const PUBLIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/jogos', changeFrequency: 'hourly', priority: 0.9 },
  { path: '/galeria', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/historia', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/politica-de-privacidade', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/politica-de-cookies', changeFrequency: 'yearly', priority: 0.2 },
];
