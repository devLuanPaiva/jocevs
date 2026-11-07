import { describe, expect, it } from 'vitest';
import { isMatchId, matchPath } from './match-identifier';

describe('isMatchId', () => {
  it.each([
    { identifier: '7bf0ab3c-81b7-4608-8046-812989b2fce9', expected: true },
    { identifier: '7BF0AB3C-81B7-4608-8046-812989B2FCE9', expected: true },
    { identifier: 'centro-x-acude-sub-15-masculino', expected: false },
    { identifier: '7bf0ab3c-81b7-4608-8046', expected: false },
  ])('treats $identifier as an id: $expected', ({ identifier, expected }) => {
    expect(isMatchId(identifier)).toBe(expected);
  });
});

describe('matchPath', () => {
  it('points the public page at the slug', () => {
    expect(matchPath('centro-x-acude-sub-15-masculino')).toBe(
      '/jogos/centro-x-acude-sub-15-masculino',
    );
  });
});
