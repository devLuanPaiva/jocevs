import { describe, expect, it } from 'vitest';
import { parseTeamImportCsv } from './team-import-csv';
import type { ImportCategory } from '../types';

const CATEGORIES: ImportCategory[] = [
  { id: 'futsal-sub-13', sport: 'FUTSAL', name: 'Sub-13' },
  { id: 'handball-sub-18', sport: 'HANDBALL', name: 'Sub-18 Feminino' },
];

const HEADER = 'sport,category,group,name,city,abbreviation';

function parse(...lines: string[]): ReturnType<typeof parseTeamImportCsv> {
  return parseTeamImportCsv([HEADER, ...lines].join('\n'), CATEGORIES);
}

describe('parseTeamImportCsv', () => {
  it('links each row to the category that has the same modality and name', () => {
    const result = parse('FUTSAL,Sub-13,A,Viçosa Futsal,Viçosa,VIC');

    expect(result).toMatchObject({
      ok: true,
      drafts: [
        { categoryId: 'futsal-sub-13', group: 'A', name: 'Viçosa Futsal', abbreviation: 'VIC' },
      ],
    });
  });

  it('does not mix categories of different modalities that share a name', () => {
    const result = parse('HANDBALL,Sub-13,A,Time,Cidade,TIM');

    expect(result).toMatchObject({ ok: true, drafts: [{ categoryId: null }] });
  });

  it('matches modality and category regardless of case and surrounding spaces', () => {
    const result = parse(' futsal , sub-13 ,A,Time,Cidade,');

    expect(result).toMatchObject({ ok: true, drafts: [{ categoryId: 'futsal-sub-13' }] });
  });

  it('upper-cases the abbreviation and accepts a file without that column', () => {
    const withColumn = parse('FUTSAL,Sub-13,A,Time,Cidade,vic');
    const withoutColumn = parseTeamImportCsv(
      'sport,category,group,name,city\nFUTSAL,Sub-13,A,Time,Cidade',
      CATEGORIES,
    );

    expect(withColumn).toMatchObject({ ok: true, drafts: [{ abbreviation: 'VIC' }] });
    expect(withoutColumn).toMatchObject({ ok: true, drafts: [{ abbreviation: '' }] });
  });

  it('names the required columns that are missing', () => {
    const result = parseTeamImportCsv('sport,category\nFUTSAL,Sub-13', CATEGORIES);

    expect(result).toEqual({ ok: false, message: 'Faltam colunas no arquivo: group, name, city.' });
  });

  it.each([
    ['an empty file', ''],
    ['a file with only the header', HEADER],
  ])('refuses %s', (_description, text) => {
    expect(parseTeamImportCsv(text, CATEGORIES).ok).toBe(false);
  });

  it('refuses a file with more teams than the api accepts in one import', () => {
    const lines = Array.from(
      { length: 301 },
      (_, index) => `FUTSAL,Sub-13,A,Time ${index},Cidade,`,
    );

    expect(parse(...lines)).toMatchObject({ ok: false });
  });
});
