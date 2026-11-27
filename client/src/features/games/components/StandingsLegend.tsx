import type { ReactElement } from 'react';

export function StandingsLegend(): ReactElement {
  return (
    <p className="mt-6 text-xs text-ink-soft">
      J jogos · V vitórias · E empates · D derrotas · SG saldo de gols · Pts pontos. Linhas verdes:
      classificados confirmados. * Os critérios não separaram os times.
    </p>
  );
}
