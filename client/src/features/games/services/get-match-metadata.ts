import type { Metadata } from 'next';
import { buildShareMetadata } from '@/lib/share/build-share-metadata';
import { matchPath } from '../lib/match-identifier';
import { buildMatchShare } from '../lib/match-share';
import { getMatchDetail } from './get-match-detail';

const FALLBACK_TITLE = 'Partida';

function cardPath(slug: string): string {
  return `${matchPath(slug)}/cartao`;
}

export async function getMatchMetadata(identifier: string): Promise<Metadata> {
  const detail = await getMatchDetail(identifier);
  if (!detail) {
    return { title: FALLBACK_TITLE };
  }
  return buildShareMetadata({ ...buildMatchShare(detail), imageUrl: cardPath(detail.match.slug) });
}
