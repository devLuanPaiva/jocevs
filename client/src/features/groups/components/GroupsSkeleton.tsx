import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { LoadingRegion, Skeleton } from '@/components/loading/Skeleton';
import { WaveEdge } from '@/components/ui/WaveEdge';

const PLACEHOLDER_COUNT = 4;
const ROW_COUNT = 3;

function TablePlaceholder(): ReactElement {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(7,59,134,0.12)]">
      <Skeleton className="h-14 w-full rounded-none" />
      <div className="flex flex-col gap-4 p-5">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-6 w-full rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function GroupsSkeleton(): ReactElement {
  return (
    <section aria-label="Grupos e classificação" className="surface-paper">
      <WaveEdge />
      <Container className="py-16 md:py-24">
        <LoadingRegion label="Carregando grupos" className="flex flex-col gap-8">
          <Skeleton className="h-12 w-2/3 rounded-full md:w-1/3" />
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
              <TablePlaceholder key={index} />
            ))}
          </div>
        </LoadingRegion>
      </Container>
    </section>
  );
}
