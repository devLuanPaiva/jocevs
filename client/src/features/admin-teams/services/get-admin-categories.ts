import { categoryLabel } from '@/features/games/lib/match-labels';
import type { ModalityCategories } from '../types';
import { fetchChampionshipCategories } from './fetch-championship-categories';

export async function getAdminCategories(): Promise<ModalityCategories[]> {
  const modalities = await fetchChampionshipCategories();
  return modalities.map(({ modality, categories }) => ({
    modalityLabel: modality.label,
    categories: categories.map((category) => ({
      id: category.id,
      label: categoryLabel(category),
    })),
  }));
}
