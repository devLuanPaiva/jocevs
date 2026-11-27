import { MODALITIES, type Modality } from '@/features/games/lib/game-filters';
import type { Category } from '@/features/games/types';
import type { Edition, SubEvent } from '@/features/schedule/types';
import { fetchApiPage } from '@/lib/api/server-fetch';
import { FESTIVAL_YEAR } from '@/lib/config/festival';

const MAX_CATEGORIES = 100;

export interface ModalityCategoryList {
  modality: Modality;
  categories: Category[];
}

async function fetchSubEvents(): Promise<SubEvent[]> {
  const [edition] = await fetchApiPage<Edition>(`/editions?year=${FESTIVAL_YEAR}&limit=1`);
  return edition ? fetchApiPage<SubEvent>(`/editions/${edition.id}/sub-events`) : [];
}

async function fetchCategories(subEvent: SubEvent | undefined): Promise<Category[]> {
  return subEvent
    ? fetchApiPage<Category>(`/sub-events/${subEvent.id}/categories?limit=${MAX_CATEGORIES}`)
    : [];
}

export async function fetchChampionshipCategories(): Promise<ModalityCategoryList[]> {
  const subEvents = await fetchSubEvents();
  return Promise.all(
    MODALITIES.map(async (modality) => ({
      modality,
      categories: await fetchCategories(
        subEvents.find((subEvent) => subEvent.type === modality.type),
      ),
    })),
  );
}
