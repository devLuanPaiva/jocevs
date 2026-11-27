import type { ReactElement } from 'react';
import { buildBracket } from '../lib/build-bracket-tree';
import { roundLabel } from '../lib/match-labels';
import type { MatchListItem } from '../types';
import { BracketExtraMatches } from './BracketExtraMatches';
import { BracketTree } from './BracketTree';

interface BracketBoardProps {
  matches: MatchListItem[];
}

export function BracketBoard({ matches }: Readonly<BracketBoardProps>): ReactElement {
  const { tree, thirdPlace, others } = buildBracket(matches);
  return (
    <>
      {tree ? (
        <>
          <p className="mt-6 text-sm text-white/70 md:hidden">
            Deslize para os lados para ver a chave completa.
          </p>
          <BracketTree tree={tree} />
        </>
      ) : null}
      <BracketExtraMatches
        title={roundLabel('THIRD_PLACE')}
        matches={thirdPlace ? [thirdPlace] : []}
      />
      <BracketExtraMatches title="Outras partidas do mata-mata" matches={others} />
    </>
  );
}
