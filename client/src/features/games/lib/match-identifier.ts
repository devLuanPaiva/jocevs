const MATCH_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isMatchId(identifier: string): boolean {
  return MATCH_ID_PATTERN.test(identifier);
}

export function matchPath(slug: string): string {
  return `/jogos/${encodeURIComponent(slug)}`;
}
