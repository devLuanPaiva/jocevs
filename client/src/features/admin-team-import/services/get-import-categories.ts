import type { ModalitySlug } from '@/features/games/lib/game-filters';
import { fetchChampionshipCategories } from '@/features/admin-teams/services/fetch-championship-categories';
import type { ImportCategory, ImportSport } from '../types';

const SPORT_BY_MODALITY: Record<ModalitySlug, ImportSport> = {
  futsal: 'FUTSAL',
  handebol: 'HANDBALL',
};

export async function getImportCategories(): Promise<ImportCategory[]> {
  const modalities = await fetchChampionshipCategories();
  return modalities.flatMap(({ modality, categories }) =>
    categories.map((category) => ({
      id: category.id,
      sport: SPORT_BY_MODALITY[modality.slug],
      name: category.name,
    })),
  );
}
