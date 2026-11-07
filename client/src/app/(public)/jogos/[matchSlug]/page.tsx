import type { Metadata } from 'next';
import { MatchDetailSkeleton } from '@/components/loading/MatchDetailSkeleton';
import { Suspense, type ReactElement } from 'react';
import { MatchDetailLoader } from '@/features/games/components/MatchDetailLoader';
import { getMatchMetadata } from '@/features/games/services/get-match-metadata';

interface MatchRouteProps {
  params: Promise<{ matchSlug: string }>;
}

export async function generateMetadata({ params }: Readonly<MatchRouteProps>): Promise<Metadata> {
  const { matchSlug } = await params;
  return getMatchMetadata(matchSlug);
}

export default function MatchRoute({ params }: Readonly<MatchRouteProps>): ReactElement {
  return (
    <Suspense fallback={<MatchDetailSkeleton />}>
      <MatchDetailLoader params={params} />
    </Suspense>
  );
}
