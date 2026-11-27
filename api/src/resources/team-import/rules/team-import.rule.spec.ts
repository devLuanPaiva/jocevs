import { planTeamImport, type ExistingCategoryData, type ImportRow } from './team-import.rule';

const FUTSAL_ID = '00000000-0000-4000-8000-000000000001';
const HANDBALL_ID = '00000000-0000-4000-8000-000000000002';

function row(overrides: Partial<ImportRow> = {}): ImportRow {
  return {
    categoryId: FUTSAL_ID,
    group: 'A',
    name: 'Viçosa Futsal',
    city: 'Viçosa',
    abbreviation: 'VIC',
    ...overrides,
  };
}

function existingData(overrides: Partial<ExistingCategoryData> = {}): ExistingCategoryData {
  return { categoryId: FUTSAL_ID, groupNames: [], teamNames: [], teamSlugs: [], ...overrides };
}

describe('planTeamImport groups', () => {
  it('plans each new group once, however many teams it receives', () => {
    const { plan } = planTeamImport(
      [row({ name: 'Um' }), row({ name: 'Dois' }), row({ name: 'Três', group: 'B' })],
      [],
    );

    expect(plan?.groups).toEqual([
      { categoryId: FUTSAL_ID, name: 'A' },
      { categoryId: FUTSAL_ID, name: 'B' },
    ]);
  });

  it('reuses a group that already exists in the category', () => {
    const { plan } = planTeamImport([row()], [existingData({ groupNames: ['A'] })]);

    expect(plan?.groups).toEqual([]);
    expect(plan?.teams[0]).toMatchObject({ groupName: 'A' });
  });

  it('plans the same group name separately for each category', () => {
    const { plan } = planTeamImport([row(), row({ categoryId: HANDBALL_ID, name: 'Outro' })], []);

    expect(plan?.groups).toHaveLength(2);
  });
});

describe('planTeamImport teams', () => {
  it('derives the slug from the name and nulls a missing abbreviation', () => {
    const { plan } = planTeamImport(
      [row({ name: 'Escolinha Garoto Nota 10', abbreviation: undefined })],
      [],
    );

    expect(plan?.teams[0]).toMatchObject({ slug: 'escolinha-garoto-nota-10', abbreviation: null });
  });

  it('accepts the same team name in different categories', () => {
    const { problem } = planTeamImport([row(), row({ categoryId: HANDBALL_ID, group: 'U' })], []);

    expect(problem).toBeNull();
  });

  it.each([
    ['repeated inside the file', [row(), row({ group: 'B' })], []],
    [
      'already registered in the category',
      [row()],
      [existingData({ teamNames: ['Viçosa Futsal'] })],
    ],
  ])('rejects a team name %s', (_description, rows, existing) => {
    const result = planTeamImport(rows, existing);

    expect(result.problem).toMatchObject({ code: 'TEAM_NAME_TAKEN', field: 'name' });
  });

  it('rejects names that differ only by accents or case because the slug would collide', () => {
    const { problem } = planTeamImport([row({ name: 'Viçosa' }), row({ name: 'VICOSA' })], []);

    expect(problem).toMatchObject({ code: 'TEAM_SLUG_TAKEN', row: 2 });
  });

  it('rejects a name with no letters or numbers', () => {
    const { problem } = planTeamImport([row({ name: '---' })], []);

    expect(problem).toMatchObject({ code: 'TEAM_NAME_INVALID', row: 1 });
  });

  it('reports the number of the first offending row and plans nothing', () => {
    const result = planTeamImport(
      [row({ name: 'Um' }), row({ name: 'Dois' }), row({ name: 'Um' })],
      [],
    );

    expect(result).toMatchObject({ plan: null, problem: { row: 3 } });
  });
});
