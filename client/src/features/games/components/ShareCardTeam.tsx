import type { ReactElement } from 'react';
import type { Team } from '../types';

const INITIALS_LENGTH = 3;
const BADGE_SIZE = 150;
const TEAM_COLUMN_WIDTH = 340;
const BRAND_BLUE = '#1263eb';
const SUN = '#fad90e';
const WHITE = '#ffffff';
const DIMMED_OPACITY = 0.6;

interface ShareCardTeamProps {
  team: Pick<Team, 'name' | 'abbreviation'>;
  isDimmed: boolean;
}

export function ShareCardTeam({ team, isDimmed }: Readonly<ShareCardTeamProps>): ReactElement {
  const initials = (team.abbreviation ?? team.name).slice(0, INITIALS_LENGTH).toUpperCase();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: TEAM_COLUMN_WIDTH,
        opacity: isDimmed ? DIMMED_OPACITY : 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: BADGE_SIZE,
          height: BADGE_SIZE,
          borderRadius: BADGE_SIZE,
          background: BRAND_BLUE,
          border: `6px solid ${SUN}`,
          color: WHITE,
          fontFamily: 'Bebas',
          fontSize: 78,
          letterSpacing: 2,
        }}
      >
        {initials}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 22,
          textAlign: 'center',
          justifyContent: 'center',
          color: WHITE,
          fontFamily: 'Bebas',
          fontSize: 56,
          lineHeight: 1,
        }}
      >
        {team.name}
      </div>
    </div>
  );
}
