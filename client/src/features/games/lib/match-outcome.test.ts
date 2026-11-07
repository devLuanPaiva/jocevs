import { describe, expect, it } from 'vitest';
import type { Match } from '../types';
import { getMatchOutcome } from './match-outcome';

const TEAM_A = 'team-a';
const TEAM_B = 'team-b';

const scheduled: Match = {
  id: 'match-1',
  categoryId: 'category-1',
  stage: 'GROUP',
  groupId: 'group-1',
  round: null,
  bracketPosition: null,
  scheduledAt: '2026-12-09T22:00:00.000Z',
  location: null,
  status: 'SCHEDULED',
  teamAId: TEAM_A,
  teamBId: TEAM_B,
  resultType: 'PLAYED',
  scoreA: null,
  scoreB: null,
  penaltiesA: null,
  penaltiesB: null,
  winnerId: null,
  finalizedAt: null,
  bestPlayer: null,
};

describe('getMatchOutcome', () => {
  it('shows no score and no winner before the match is played', () => {
    const outcome = getMatchOutcome(scheduled);

    expect(outcome.sideA).toEqual({ score: '–', isWinner: false, penalties: null });
    expect(outcome.sideB).toEqual({ score: '–', isWinner: false, penalties: null });
    expect(outcome.note).toBeNull();
  });

  it('highlights only the winning side of a played match', () => {
    const outcome = getMatchOutcome({
      ...scheduled,
      status: 'FINALIZED',
      scoreA: 3,
      scoreB: 1,
      winnerId: TEAM_A,
    });

    expect([outcome.sideA.score, outcome.sideB.score]).toEqual(['3', '1']);
    expect([outcome.sideA.isWinner, outcome.sideB.isWinner]).toEqual([true, false]);
  });

  it('keeps a goalless draw with no winner', () => {
    const outcome = getMatchOutcome({ ...scheduled, status: 'FINALIZED', scoreA: 0, scoreB: 0 });

    expect([outcome.sideA.score, outcome.sideB.score]).toEqual(['0', '0']);
    expect([outcome.sideA.isWinner, outcome.sideB.isWinner]).toEqual([false, false]);
  });

  it('decides a knockout draw by the penalties without changing the score', () => {
    const outcome = getMatchOutcome({
      ...scheduled,
      status: 'FINALIZED',
      stage: 'KNOCKOUT',
      scoreA: 2,
      scoreB: 2,
      penaltiesA: 3,
      penaltiesB: 4,
      winnerId: TEAM_B,
    });

    expect([outcome.sideA.score, outcome.sideB.score]).toEqual(['2', '2']);
    expect([outcome.sideA.penalties, outcome.sideB.penalties]).toEqual([3, 4]);
    expect(outcome.sideB.isWinner).toBe(true);
  });

  it('marks the team that showed up with W and the absent one with O', () => {
    const outcome = getMatchOutcome(
      { ...scheduled, status: 'FINALIZED', resultType: 'WALKOVER', winnerId: TEAM_B },
      { teamA: { name: 'Alto da Boa Vista' }, teamB: { name: 'Centro Esporte Clube' } },
    );

    expect([outcome.sideA.score, outcome.sideB.score]).toEqual(['O', 'W']);
    expect(outcome.sideB.isWinner).toBe(true);
    expect(outcome.isWalkover).toBe(true);
    expect(outcome.note).toBe('Vitória do Centro Esporte Clube por W.O.');
  });

  it('still explains a walkover when the team names are not at hand', () => {
    const outcome = getMatchOutcome({
      ...scheduled,
      status: 'FINALIZED',
      resultType: 'WALKOVER',
      winnerId: TEAM_A,
    });

    expect(outcome.note).toBe('Vitória por W.O.');
  });

  it('declares no winner when both teams forfeit', () => {
    const outcome = getMatchOutcome({
      ...scheduled,
      status: 'FINALIZED',
      resultType: 'DOUBLE_WALKOVER',
    });

    expect(outcome.note).toBe('W.O. dos dois times');
    expect([outcome.sideA.score, outcome.sideB.score]).toEqual(['–', '–']);
    expect([outcome.sideA.isWinner, outcome.sideB.isWinner]).toEqual([false, false]);
  });
});
