import type { ModalitySlug } from '@/features/games/lib/game-filters';
import type { Category, GroupStandings, MatchListItem } from '@/features/games/types';

export interface CategoryOverview {
  category: Category;
  modality: ModalitySlug | undefined;
  standings: GroupStandings[];
  knockoutMatches: MatchListItem[];
}
