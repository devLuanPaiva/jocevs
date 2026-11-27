import type { GameFilterParams } from '@/features/games/lib/game-filters';

export const GROUPS_PATH = '/grupos';

export function buildGroupsHref(params: GameFilterParams): string {
  const query = new URLSearchParams();
  if (params.modality) {
    query.set('modalidade', params.modality);
  }
  if (params.categoryId) {
    query.set('categoria', params.categoryId);
  }
  const queryString = query.toString();
  return queryString ? `${GROUPS_PATH}?${queryString}` : GROUPS_PATH;
}
