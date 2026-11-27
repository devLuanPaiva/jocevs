import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { BracketBoard } from '@/features/games/components/BracketBoard';
import { categoryLabel } from '@/features/games/lib/match-labels';
import type { CategoryOverview } from '../types';

interface CategoryBracketsProps {
  overviews: CategoryOverview[];
}

export function CategoryBrackets({
  overviews,
}: Readonly<CategoryBracketsProps>): ReactElement | null {
  const withBracket = overviews.filter((overview) => overview.knockoutMatches.length > 0);
  if (withBracket.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="brackets-title" className="surface-deep">
      <WaveEdge />
      <Container className="flex flex-col gap-16 py-16 md:py-24">
        <h2 id="brackets-title" className="font-display text-5xl md:text-7xl">
          Chaveamento
        </h2>
        {withBracket.map(({ category, knockoutMatches }) => (
          <div key={category.id}>
            <h3 className="font-display text-4xl md:text-5xl">{categoryLabel(category)}</h3>
            <BracketBoard matches={knockoutMatches} />
          </div>
        ))}
      </Container>
    </section>
  );
}
