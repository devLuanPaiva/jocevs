import { describe, expect, it } from 'vitest';
import {
  findDraftProblems,
  findFailedDraftKey,
  groupDraftsByCategory,
  removeDraft,
  toImportPayload,
  updateDraft,
} from './team-import-drafts';
import type { ImportDraft } from '../types';

function draft(overrides: Partial<ImportDraft> = {}): ImportDraft {
  return {
    key: 'row-0',
    categoryId: 'category-1',
    sport: 'FUTSAL',
    categoryName: 'Sub-13',
    group: 'A',
    name: 'Viçosa Futsal',
    city: 'Viçosa',
    abbreviation: 'VIC',
    ...overrides,
  };
}

describe('findDraftProblems', () => {
  it('reports nothing for a complete list', () => {
    expect(findDraftProblems([draft(), draft({ key: 'row-1', name: 'Outro' })])).toEqual({});
  });

  it.each([
    ['a category that was not found', { categoryId: null }, 'Categoria não encontrada'],
    ['a missing group', { group: '' }, 'Informe o grupo.'],
    ['a missing name', { name: '' }, 'Informe o nome do time.'],
    ['a missing city', { city: '' }, 'Informe a cidade.'],
    ['an abbreviation that is too short', { abbreviation: 'V' }, 'A abreviação deve ter de 2 a 10'],
  ])('blocks %s', (_description, overrides, expected) => {
    expect(findDraftProblems([draft(overrides)])['row-0']).toContain(expected);
  });

  it('accepts a row without abbreviation', () => {
    expect(findDraftProblems([draft({ abbreviation: '' })])).toEqual({});
  });

  it('flags a repeated name in the same category, ignoring case, only from the second one', () => {
    const problems = findDraftProblems([
      draft(),
      draft({ key: 'row-1', name: 'VIÇOSA FUTSAL', group: 'B' }),
    ]);

    expect(Object.keys(problems)).toEqual(['row-1']);
  });

  it('allows the same name in different categories', () => {
    const problems = findDraftProblems([
      draft(),
      draft({ key: 'row-1', categoryId: 'category-2', categoryName: 'Sub-15' }),
    ]);

    expect(problems).toEqual({});
  });
});

describe('editing the list', () => {
  it('changes only the chosen row and keeps the abbreviation in upper case', () => {
    const result = updateDraft([draft(), draft({ key: 'row-1' })], 'row-1', 'abbreviation', 'vi');

    expect(result.map((item) => item.abbreviation)).toEqual(['VIC', 'VI']);
  });

  it('removes the row by key', () => {
    const result = removeDraft([draft(), draft({ key: 'row-1' })], 'row-0');

    expect(result.map((item) => item.key)).toEqual(['row-1']);
  });
});

describe('toImportPayload', () => {
  it('trims the text and leaves out an empty abbreviation', () => {
    const payload = toImportPayload([draft({ name: ' Time ', abbreviation: '' })]);

    expect(payload).toEqual([
      { categoryId: 'category-1', group: 'A', name: 'Time', city: 'Viçosa' },
    ]);
  });

  it('never sends a row whose category was not found', () => {
    expect(toImportPayload([draft({ categoryId: null })])).toEqual([]);
  });
});

describe('groupDraftsByCategory', () => {
  it('groups by category keeping the file order and counts the groups', () => {
    const sections = groupDraftsByCategory([
      draft(),
      draft({ key: 'row-1', group: 'B' }),
      draft({ key: 'row-2', group: 'B' }),
      draft({ key: 'row-3', sport: 'HANDBALL', categoryName: 'Cadete' }),
    ]);

    expect(
      sections.map((section) => [section.title, section.groupCount, section.drafts.length]),
    ).toEqual([
      ['Futsal · Sub-13', 2, 3],
      ['Handebol · Cadete', 1, 1],
    ]);
  });
});

describe('findFailedDraftKey', () => {
  const drafts = [draft({ categoryId: null }), draft({ key: 'row-1' }), draft({ key: 'row-2' })];

  it('maps the api row index to the draft, skipping rows that are not sent', () => {
    expect(findFailedDraftKey(drafts, 'rows.1.name')).toBe('row-2');
  });

  it.each([[null], ['name'], ['rows.9.name']])('finds no row for the error field %s', (field) => {
    expect(findFailedDraftKey(drafts, field)).toBeNull();
  });
});
