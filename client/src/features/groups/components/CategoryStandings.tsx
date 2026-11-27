import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { StandingsTable } from '@/features/games/components/StandingsTable';
import { buildGamesHref } from '@/features/games/lib/game-filters';
import { categoryLabel } from '@/features/games/lib/match-labels';
import type { CategoryOverview } from '../types';

interface CategoryStandingsProps {
  overview: CategoryOverview;
}

export function CategoryStandings({ overview }: Readonly<CategoryStandingsProps>): ReactElement {
  const { category, modality, standings } = overview;
  const titleId = `category-${category.id}`;
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id={titleId} className="font-display text-4xl text-brand-900 md:text-6xl">
          {categoryLabel(category)}
        </h2>
        <ButtonLink
          href={buildGamesHref({ modality, categoryId: category.id, scope: 'proximos' })}
          variant="brand"
        >
          Ver jogos da categoria
        </ButtonLink>
      </div>
      {standings.length === 0 ? (
        <EmptyState
          icon="table"
          title="Grupos em definição"
          description="Os grupos desta categoria ainda não foram definidos."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {standings.map((group, index) => (
            <Reveal key={group.groupId} delay={index * 0.1}>
              <StandingsTable group={group} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
