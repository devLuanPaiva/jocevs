import { describe, expect, it } from 'vitest';
import { buildGroupsHref } from './groups-href';

describe('buildGroupsHref', () => {
  it('points to the plain page when no filter is chosen, without the games scope', () => {
    expect(buildGroupsHref({ scope: 'finalizados' })).toBe('/grupos');
  });

  it('keeps the modality and the category so the filters survive the navigation', () => {
    expect(buildGroupsHref({ scope: 'proximos', modality: 'futsal', categoryId: 'abc' })).toBe(
      '/grupos?modalidade=futsal&categoria=abc',
    );
  });
});
