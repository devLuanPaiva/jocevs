import type { ReactElement } from 'react';
import {
  parseGameFilterParams,
  type FilterHrefBuilder,
  type SearchParams,
} from '../lib/game-filters';
import { GameFilters } from './GameFilters';

interface GameFiltersFromUrlProps {
  searchParams: Promise<SearchParams>;
  buildHref?: FilterHrefBuilder;
  showScope?: boolean;
}

export async function GameFiltersFromUrl({
  searchParams,
  buildHref,
  showScope,
}: Readonly<GameFiltersFromUrlProps>): Promise<ReactElement> {
  return (
    <GameFilters
      params={parseGameFilterParams(await searchParams)}
      buildHref={buildHref}
      showScope={showScope}
    />
  );
}
