import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Container } from '@/components/layout/Container';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { StandingsLegend } from '@/features/games/components/StandingsLegend';
import { parseGameFilterParams, type SearchParams } from '@/features/games/lib/game-filters';
import { getGroupsOverview } from '../services/get-groups-overview';
import { CategoryBrackets } from './CategoryBrackets';
import { CategoryStandings } from './CategoryStandings';

interface GroupsContentProps {
  searchParams: Promise<SearchParams>;
}

export async function GroupsContent({
  searchParams,
}: Readonly<GroupsContentProps>): Promise<ReactElement> {
  const overviews = await getGroupsOverview(parseGameFilterParams(await searchParams));
  return (
    <>
      <section aria-label="Grupos e classificação" className="surface-paper">
        <WaveEdge />
        <Container className="flex flex-col gap-16 py-16 md:py-24">
          {overviews.length === 0 ? (
            <EmptyState
              icon="table"
              title="Nenhuma categoria encontrada"
              description="Os grupos aparecem aqui assim que a organização cadastrar as categorias."
            />
          ) : (
            overviews.map((overview) => (
              <CategoryStandings key={overview.category.id} overview={overview} />
            ))
          )}
          <StandingsLegend />
        </Container>
      </section>
      <CategoryBrackets overviews={overviews} />
    </>
  );
}
