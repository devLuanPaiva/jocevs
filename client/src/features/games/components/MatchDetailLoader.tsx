import { notFound, permanentRedirect } from 'next/navigation';
import type { ReactElement } from 'react';
import { isMatchId, matchPath } from '../lib/match-identifier';
import { getMatchDetail } from '../services/get-match-detail';
import { MatchDetailView } from './MatchDetailView';

interface MatchDetailLoaderProps {
  params: Promise<{ matchSlug: string }>;
}

export async function MatchDetailLoader({
  params,
}: Readonly<MatchDetailLoaderProps>): Promise<ReactElement> {
  const { matchSlug } = await params;
  const detail = await getMatchDetail(matchSlug);
  if (!detail) {
    notFound();
  }
  if (isMatchId(matchSlug)) {
    permanentRedirect(matchPath(detail.match.slug));
  }
  return <MatchDetailView detail={detail} />;
}
