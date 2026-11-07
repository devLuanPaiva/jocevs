import type { CategoryService } from '../../category/services/category.service';
import type { TeamService } from '../../team/services/team.service';
import type { MatchRepository } from '../repository/match.repository';
import { MatchSlugService } from './match-slug.service';

const CENTRO = { id: 'team-centro', name: 'Centro' };
const ACUDE = { id: 'team-acude', name: 'Açude' };

function createService(existingSlugs: string[]): MatchSlugService {
  const repository = {
    findSlugsStartingWith: jest.fn().mockResolvedValue([...existingSlugs]),
  };
  const categoryService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ name: 'Sub-15', gender: 'MALE' }),
  };
  const teamService = { listByIds: jest.fn().mockResolvedValue([CENTRO, ACUDE]) };
  return new MatchSlugService(
    repository as unknown as MatchRepository,
    categoryService as unknown as CategoryService,
    teamService as unknown as TeamService,
  );
}

const fixture = { teamAId: CENTRO.id, teamBId: ACUDE.id };

describe('MatchSlugService', () => {
  it('names the match after its teams and category', async () => {
    const slug = await createService([]).assignOne('category', fixture);

    expect(slug).toBe('centro-x-acude-sub-15-masculino');
  });

  it('adds a suffix when the same pairing already exists', async () => {
    const slug = await createService(['centro-x-acude-sub-15-masculino']).assignOne(
      'category',
      fixture,
    );

    expect(slug).toBe('centro-x-acude-sub-15-masculino-2');
  });

  it('keeps slugs unique among matches created in the same batch', async () => {
    const assigned = await createService([]).assignMany('category', [fixture, fixture, fixture]);

    expect(assigned.map(({ slug }) => slug)).toEqual([
      'centro-x-acude-sub-15-masculino',
      'centro-x-acude-sub-15-masculino-2',
      'centro-x-acude-sub-15-masculino-3',
    ]);
  });
});
