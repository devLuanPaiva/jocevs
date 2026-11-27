import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { WaveEdge } from '@/components/ui/WaveEdge';
import type { MatchListItem } from '../types';
import { BracketBoard } from './BracketBoard';

interface BracketSectionProps {
  matches: MatchListItem[];
}

export function BracketSection({ matches }: Readonly<BracketSectionProps>): ReactElement {
  return (
    <section aria-labelledby="bracket-title" className="surface-deep">
      <WaveEdge />
      <Container className="py-16 md:py-24">
        <h2 id="bracket-title" className="font-display text-5xl md:text-7xl">
          Mata-mata
        </h2>
        {matches.length === 0 ? (
          <p className="mt-6 rounded-3xl bg-white/10 p-8 text-center text-white/80">
            O chaveamento será definido ao fim da fase de grupos.
          </p>
        ) : (
          <BracketBoard matches={matches} />
        )}
      </Container>
    </section>
  );
}
