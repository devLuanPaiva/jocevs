import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { GroupStandings, StandingRow } from '../types';
import { StandingsTable } from './StandingsTable';

function row(overrides: Partial<StandingRow>): StandingRow {
  return {
    position: 1,
    teamId: 'team-1',
    teamName: 'Bairro Centro',
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    walkoverLosses: 0,
    tied: true,
    qualifiedPosition: null,
    ...overrides,
  };
}

function groupOf(...rows: StandingRow[]): GroupStandings {
  return { groupId: 'group-1', groupName: 'A', rows };
}

describe('StandingsTable', () => {
  it('lists the teams of a group that has no games yet without inventing a ranking', () => {
    render(
      <StandingsTable
        group={groupOf(
          row({ teamName: 'Bairro Centro' }),
          row({ teamId: 'team-2', teamName: 'Vila Nova', position: 2 }),
        )}
      />,
    );

    expect(screen.getByText('Bairro Centro')).toBeInTheDocument();
    expect(screen.getByText('Vila Nova')).toBeInTheDocument();
    expect(screen.getAllByText('–')).toHaveLength(2);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('shows the positions and flags unresolved ties once the group has played', () => {
    render(
      <StandingsTable
        group={groupOf(
          row({ teamName: 'Bairro Centro', played: 1, wins: 1, points: 3, tied: false }),
          row({ teamId: 'team-2', teamName: 'Vila Nova', position: 2, played: 1, tied: true }),
        )}
      />,
    );

    expect(screen.queryByText('–')).not.toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
