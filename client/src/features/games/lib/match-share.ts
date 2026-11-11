import type { MatchDetail } from '../services/get-match-detail';
import { courtLocationLabel } from './court-location';
import { formatDayHeading, formatMatchTime } from './match-dates';
import { categoryLabel, stageLabel } from './match-labels';
import { getMatchOutcome } from './match-outcome';

export interface MatchShare {
  title: string;
  description: string;
  caption: string;
}

function penaltiesNote(detail: MatchDetail): string | null {
  const { penaltiesA, penaltiesB } = detail.match;
  return penaltiesA === null || penaltiesB === null
    ? null
    : `${penaltiesA}-${penaltiesB} nos pênaltis`;
}

function buildTitle(detail: MatchDetail): string {
  const { match, teamA, teamB } = detail;
  const { sideA, sideB, isWalkover } = getMatchOutcome(match, detail);
  if (match.status === 'SCHEDULED' || isWalkover || match.resultType === 'DOUBLE_WALKOVER') {
    return `${teamA.name} x ${teamB.name}`;
  }
  return `${teamA.name} ${sideA.score} x ${sideB.score} ${teamB.name}`;
}

function buildStatusLine(detail: MatchDetail): string {
  const { match } = detail;
  if (match.status === 'SCHEDULED') {
    const day = formatDayHeading(match.scheduledAt);
    return [`${day}, ${formatMatchTime(match.scheduledAt)}`, courtLocationLabel(match.location)]
      .filter(Boolean)
      .join(' · ');
  }
  return [getMatchOutcome(match, detail).note, penaltiesNote(detail)].filter(Boolean).join(' · ');
}

export function buildMatchShare(detail: MatchDetail): MatchShare {
  const stage = stageLabel(detail.match, detail.groupName ?? undefined);
  const statusLine = buildStatusLine(detail);
  const description = [stage, categoryLabel(detail.category), statusLine]
    .filter(Boolean)
    .join(' · ');
  const caption = [stage, statusLine].filter(Boolean).join(' · ');
  return { title: buildTitle(detail), description, caption };
}
