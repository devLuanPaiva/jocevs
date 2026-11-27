import {
  modalitySlugOfType,
  subEventsOfModality,
  type GameFilterParams,
  type ModalitySlug,
} from '@/features/games/lib/game-filters';
import { getCategoryStandings } from '@/features/games/services/get-category-standings';
import { getSubEventCategories } from '@/features/games/services/get-game-categories';
import { GAMES_YEAR } from '@/features/games/services/get-game-matches';
import { getMatches } from '@/features/games/services/get-matches';
import type { Category } from '@/features/games/types';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import type { CategoryOverview } from '../types';

interface CategoryTarget {
  category: Category;
  modality: ModalitySlug | undefined;
}

async function loadOverview({ category, modality }: CategoryTarget): Promise<CategoryOverview> {
  const [standings, knockoutMatches] = await Promise.all([
    getCategoryStandings(category.id),
    getMatches({ categoryId: category.id, stage: 'KNOCKOUT' }),
  ]);
  return { category, modality, standings, knockoutMatches };
}

async function findTargets(params: GameFilterParams): Promise<CategoryTarget[]> {
  const subEvents = subEventsOfModality(await getEditionSubEvents(GAMES_YEAR), params.modality);
  const lists = await Promise.all(
    subEvents.map(async (subEvent) => ({
      modality: modalitySlugOfType(subEvent.type),
      categories: await getSubEventCategories(subEvent.id),
    })),
  );
  return lists.flatMap(({ modality, categories }) =>
    categories
      .filter((category) => !params.categoryId || category.id === params.categoryId)
      .map((category) => ({ category, modality })),
  );
}

export async function getGroupsOverview(params: GameFilterParams): Promise<CategoryOverview[]> {
  return Promise.all((await findTargets(params)).map(loadOverview));
}
