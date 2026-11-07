import { cache } from 'react';
import { fetchApiResult } from '@/lib/api/server-fetch';
import { isMatchId } from '../lib/match-identifier';
import type { Category, Match, Team } from '../types';

export interface MatchDetail {
  match: Match;
  teamA: Team;
  teamB: Team;
  category: Category;
  groupName: string | null;
}

async function fetchGroupName(groupId: string | null): Promise<string | null> {
  if (!groupId) {
    return null;
  }
  const group = await fetchApiResult<{ name: string }>(`/groups/${groupId}`);
  return group.name;
}

async function completeMatchDetail(match: Match): Promise<MatchDetail> {
  const [teamA, teamB, category, groupName] = await Promise.all([
    fetchApiResult<Team>(`/teams/${match.teamAId}`),
    fetchApiResult<Team>(`/teams/${match.teamBId}`),
    fetchApiResult<Category>(`/categories/${match.categoryId}`),
    fetchGroupName(match.groupId),
  ]);
  return { match, teamA, teamB, category, groupName };
}

export async function fetchMatchDetail(matchId: string): Promise<MatchDetail> {
  return completeMatchDetail(await fetchApiResult<Match>(`/matches/${matchId}`));
}

async function fetchMatchDetailBySlug(slug: string): Promise<MatchDetail> {
  const path = `/matches/slug/${encodeURIComponent(slug)}`;
  return completeMatchDetail(await fetchApiResult<Match>(path));
}

export const getMatchDetail = cache(async (identifier: string): Promise<MatchDetail | null> => {
  try {
    return await (isMatchId(identifier)
      ? fetchMatchDetail(identifier)
      : fetchMatchDetailBySlug(identifier));
  } catch {
    return null;
  }
});
