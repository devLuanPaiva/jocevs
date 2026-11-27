import type { ReactElement, ReactNode } from 'react';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import {
  buildGamesHref,
  MATCH_SCOPES,
  MODALITIES,
  subEventsOfModality,
  type FilterHrefBuilder,
  type GameFilterParams,
} from '../lib/game-filters';
import { categoryLabel } from '../lib/match-labels';
import { getSubEventCategories } from '../services/get-game-categories';
import { GAMES_YEAR } from '../services/get-game-matches';
import { FilterChip } from './FilterChip';

interface FilterRowProps {
  label: string;
  children: ReactNode;
}

interface FilterRowsProps {
  params: GameFilterParams;
  buildHref: FilterHrefBuilder;
}

interface GameFiltersProps {
  params: GameFilterParams;
  buildHref?: FilterHrefBuilder;
  showScope?: boolean;
}

function FilterRow({ label, children }: Readonly<FilterRowProps>): ReactElement {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 w-full text-xs font-semibold uppercase tracking-wider text-white/70 sm:w-24">
        {label}
      </span>
      {children}
    </div>
  );
}

function ScopeRow({ params, buildHref }: Readonly<FilterRowsProps>): ReactElement {
  return (
    <FilterRow label="Jogos">
      {MATCH_SCOPES.map((item) => (
        <FilterChip
          key={item.scope}
          href={buildHref({ ...params, scope: item.scope })}
          isActive={params.scope === item.scope}
          label={item.label}
        />
      ))}
    </FilterRow>
  );
}

function ModalityRow({ params, buildHref }: Readonly<FilterRowsProps>): ReactElement {
  return (
    <FilterRow label="Modalidade">
      <FilterChip
        href={buildHref({ scope: params.scope })}
        isActive={!params.modality}
        label="Todas"
      />
      {MODALITIES.map((item) => (
        <FilterChip
          key={item.slug}
          href={buildHref({ scope: params.scope, modality: item.slug })}
          isActive={params.modality === item.slug}
          label={item.label}
        />
      ))}
    </FilterRow>
  );
}

async function CategoryRow({
  params,
  buildHref,
}: Readonly<FilterRowsProps>): Promise<ReactElement> {
  const subEvents = subEventsOfModality(await getEditionSubEvents(GAMES_YEAR), params.modality);
  const lists = await Promise.all(subEvents.map((subEvent) => getSubEventCategories(subEvent.id)));
  return (
    <FilterRow label="Categoria">
      <FilterChip
        href={buildHref({ ...params, categoryId: undefined })}
        isActive={!params.categoryId}
        label="Todas"
      />
      {lists.flat().map((category) => (
        <FilterChip
          key={category.id}
          href={buildHref({ ...params, categoryId: category.id })}
          isActive={params.categoryId === category.id}
          label={categoryLabel(category)}
        />
      ))}
    </FilterRow>
  );
}

export function GameFilters({
  params,
  buildHref = buildGamesHref,
  showScope = true,
}: Readonly<GameFiltersProps>): ReactElement {
  return (
    <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-brand-900/70 p-5 ring-1 ring-white/20 backdrop-blur-md">
      {showScope ? <ScopeRow params={params} buildHref={buildHref} /> : null}
      <ModalityRow params={params} buildHref={buildHref} />
      {params.modality ? <CategoryRow params={params} buildHref={buildHref} /> : null}
    </div>
  );
}
