const EMBED_BASE_URL = 'https://www.youtube-nocookie.com/embed';

export function buildEmbedUrl(videoId: string): string {
  const parameters = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1' });
  return `${EMBED_BASE_URL}/${encodeURIComponent(videoId)}?${parameters.toString()}`;
}
