import { Suspense, type ReactElement } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { GameFiltersFromUrl } from '@/features/games/components/GameFiltersFromUrl';
import type { SearchParams } from '@/features/games/lib/game-filters';
import { GroupsContent } from './components/GroupsContent';
import { GroupsSkeleton } from './components/GroupsSkeleton';
import { buildGroupsHref } from './lib/groups-href';

interface GroupsPageProps {
  searchParams: Promise<SearchParams>;
}

export function GroupsPage({ searchParams }: Readonly<GroupsPageProps>): ReactElement {
  return (
    <>
      <PageHero
        eyebrow="JOCEV’S 2026"
        title="Grupos e classificação"
        description="Os times de cada grupo, a tabela de classificação e, quando chegar a hora, o chaveamento."
      >
        <div className="mt-8">
          <ButtonLink href="/jogos" variant="outline">
            Ver jogos e resultados
          </ButtonLink>
        </div>
        <Suspense fallback={null}>
          <GameFiltersFromUrl
            searchParams={searchParams}
            buildHref={buildGroupsHref}
            showScope={false}
          />
        </Suspense>
      </PageHero>
      <Suspense fallback={<GroupsSkeleton />}>
        <GroupsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
