import type { Match, Team } from '../types';

export interface SideOutcome {
  score: string;
  isWinner: boolean;
  penalties: number | null;
}

export interface MatchOutcome {
  sideA: SideOutcome;
  sideB: SideOutcome;
  note: string | null;
  isWalkover: boolean;
}

export interface OutcomeTeams {
  teamA: Pick<Team, 'name'>;
  teamB: Pick<Team, 'name'>;
}

const NO_SCORE = '–';
const WALKOVER_WINNER_SCORE = 'W';
const WALKOVER_LOSER_SCORE = 'O';

function formatScore(score: number | null): string {
  return score === null ? NO_SCORE : String(score);
}

function winnerName(match: Match, teams?: OutcomeTeams): string | null {
  if (!teams || match.winnerId === null) {
    return null;
  }
  return match.winnerId === match.teamAId ? teams.teamA.name : teams.teamB.name;
}

function resultNote(match: Match, teams?: OutcomeTeams): string | null {
  if (match.status === 'SCHEDULED') {
    return null;
  }
  if (match.resultType === 'DOUBLE_WALKOVER') {
    return 'W.O. dos dois times';
  }
  if (match.resultType !== 'WALKOVER') {
    return null;
  }
  const winner = winnerName(match, teams);
  return winner ? `Vitória do ${winner} por W.O.` : 'Vitória por W.O.';
}

function sideScore(match: Match, score: number | null, isWinner: boolean): string {
  if (match.resultType === 'WALKOVER' && match.winnerId !== null) {
    return isWinner ? WALKOVER_WINNER_SCORE : WALKOVER_LOSER_SCORE;
  }
  return formatScore(score);
}

function buildSide(match: Match, side: 'A' | 'B'): SideOutcome {
  const isTeamA = side === 'A';
  const teamId = isTeamA ? match.teamAId : match.teamBId;
  const isWinner = match.winnerId !== null && match.winnerId === teamId;
  return {
    score: sideScore(match, isTeamA ? match.scoreA : match.scoreB, isWinner),
    isWinner,
    penalties: isTeamA ? match.penaltiesA : match.penaltiesB,
  };
}

export function getMatchOutcome(match: Match, teams?: OutcomeTeams): MatchOutcome {
  return {
    sideA: buildSide(match, 'A'),
    sideB: buildSide(match, 'B'),
    note: resultNote(match, teams),
    isWalkover: match.status === 'FINALIZED' && match.resultType === 'WALKOVER',
  };
}
