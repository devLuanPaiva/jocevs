import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCategoryStandings } from '@/features/games/services/get-category-standings';
import { getSubEventCategories } from '@/features/games/services/get-game-categories';
import { getMatches } from '@/features/games/services/get-matches';
import type { Category } from '@/features/games/types';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { getGroupsOverview } from './get-groups-overview';

vi.mock('@/features/schedule/services/get-edition-sub-events');
vi.mock('@/features/games/services/get-game-categories');
vi.mock('@/features/games/services/get-category-standings');
vi.mock('@/features/games/services/get-matches');

function categoryOf(id: string): Category {
  return { id, name: id } as Category;
}

describe('getGroupsOverview', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getEditionSubEvents).mockResolvedValue([
      { id: 'futsal-id', type: 'JOCEV_FUTSAL' },
      { id: 'handball-id', type: 'JOCEV_HANDBALL' },
      { id: 'party-id', type: 'EMANCIPATION_PARTY' },
    ] as Awaited<ReturnType<typeof getEditionSubEvents>>);
    vi.mocked(getSubEventCategories).mockImplementation((subEventId) =>
      Promise.resolve(
        subEventId === 'futsal-id'
          ? [categoryOf('futsal-sub-13'), categoryOf('futsal-sub-15')]
          : [categoryOf('handball-cadete')],
      ),
    );
    vi.mocked(getCategoryStandings).mockResolvedValue([]);
    vi.mocked(getMatches).mockResolvedValue([]);
  });

  it('gathers every category of futsal and handball, tagged with its modality, and ignores other events', async () => {
    const overviews = await getGroupsOverview({ scope: 'proximos' });

    expect(overviews.map((item) => [item.category.id, item.modality])).toEqual([
      ['futsal-sub-13', 'futsal'],
      ['futsal-sub-15', 'futsal'],
      ['handball-cadete', 'handebol'],
    ]);
  });

  it('keeps only the chosen category of the chosen modality', async () => {
    const overviews = await getGroupsOverview({
      scope: 'proximos',
      modality: 'futsal',
      categoryId: 'futsal-sub-15',
    });

    expect(overviews.map((item) => item.category.id)).toEqual(['futsal-sub-15']);
    expect(getCategoryStandings).toHaveBeenCalledTimes(1);
  });

  it('asks for the knockout matches of each category so the bracket shows up only when it exists', async () => {
    await getGroupsOverview({ scope: 'proximos', modality: 'handebol' });

    expect(getMatches).toHaveBeenCalledWith({ categoryId: 'handball-cadete', stage: 'KNOCKOUT' });
  });
});
