import { buildMatchSlugBase, pickAvailableSlug } from './match-slug.rule';

const parts = {
  teamAName: 'Centro Esporte Clube',
  teamBName: 'Alto da Boa Vista',
  categoryName: 'Sub-15',
  categoryGender: 'MALE',
};

describe('buildMatchSlugBase', () => {
  it.each([
    {
      case: 'joins both teams and the category with its gender',
      input: parts,
      expected: 'centro-esporte-clube-x-alto-da-boa-vista-sub-15-masculino',
    },
    {
      case: 'drops accents and symbols from the names',
      input: { ...parts, teamAName: 'São José', teamBName: 'Sítio Lagoa (B)' },
      expected: 'sao-jose-x-sitio-lagoa-b-sub-15-masculino',
    },
    {
      case: 'does not repeat the gender already written in the category name',
      input: { ...parts, categoryName: 'Adulto Feminino', categoryGender: 'FEMALE' },
      expected: 'centro-esporte-clube-x-alto-da-boa-vista-adulto-feminino',
    },
  ])('$case', ({ input, expected }) => {
    expect(buildMatchSlugBase(input)).toBe(expected);
  });
});

describe('pickAvailableSlug', () => {
  it.each([
    { taken: [], expected: 'a-x-b' },
    { taken: ['a-x-b'], expected: 'a-x-b-2' },
    { taken: ['a-x-b', 'a-x-b-2'], expected: 'a-x-b-3' },
    { taken: ['a-x-b-2'], expected: 'a-x-b' },
  ])('picks $expected when $taken is taken', ({ taken, expected }) => {
    expect(pickAvailableSlug('a-x-b', taken)).toBe(expected);
  });
});
