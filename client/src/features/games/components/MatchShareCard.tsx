import type { ReactElement } from 'react';
import { categoryLabel } from '../lib/match-labels';
import { getMatchOutcome } from '../lib/match-outcome';
import { buildMatchShare } from '../lib/match-share';
import type { MatchDetail } from '../services/get-match-detail';
import { ShareCardTeam } from './ShareCardTeam';

const SUN = '#fad90e';
const WHITE = '#ffffff';
const CARD_PADDING = 48;
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const LOGO_WIDTH = 190;
const LOGO_HEIGHT = 91;
const SCORE_FONT_SIZE = 190;
const FULL_SIZE = '100%';
const SCHEDULED_SEPARATOR = 'X';
const SCORE_SEPARATOR = 'x';

interface MatchShareCardProps {
  detail: MatchDetail;
  backgroundSrc: string;
  logoSrc: string;
}

interface CenterpieceProps {
  scoreA: string;
  scoreB: string;
  isScheduled: boolean;
}

function Centerpiece({ scoreA, scoreB, isScheduled }: Readonly<CenterpieceProps>): ReactElement {
  const text = isScheduled ? SCHEDULED_SEPARATOR : `${scoreA} ${SCORE_SEPARATOR} ${scoreB}`;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        color: SUN,
        fontFamily: 'Bebas',
        fontSize: SCORE_FONT_SIZE,
        lineHeight: 1,
        textShadow: '0 8px 30px rgba(0,10,60,0.6)',
      }}
    >
      {text}
    </div>
  );
}

interface CoverImageProps {
  src: string;
  width: number;
  height: number;
  position?: 'absolute' | 'relative';
}

function CoverImage({
  src,
  width,
  height,
  position = 'relative',
}: Readonly<CoverImageProps>): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        position,
        top: 0,
        left: 0,
        width,
        height,
        backgroundImage: `url(${src})`,
        backgroundSize: `${width}px ${height}px`,
      }}
    />
  );
}

interface CardHeaderProps {
  logoSrc: string;
  title: string;
}

function CardHeader({ logoSrc, title }: Readonly<CardHeaderProps>): ReactElement {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <CoverImage src={logoSrc} width={LOGO_WIDTH} height={LOGO_HEIGHT} />
      <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: SUN }}>
        {title.toUpperCase()}
      </div>
    </div>
  );
}

function CardCaption({ text }: Readonly<{ text: string }>): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        alignSelf: 'center',
        padding: '10px 34px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.16)',
        color: WHITE,
        fontSize: 26,
        fontWeight: 700,
      }}
    >
      {text}
    </div>
  );
}

export function MatchShareCard({
  detail,
  backgroundSrc,
  logoSrc,
}: Readonly<MatchShareCardProps>): ReactElement {
  const { match, teamA, teamB, category } = detail;
  const { sideA, sideB, isWalkover } = getMatchOutcome(match, detail);
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: FULL_SIZE,
        height: FULL_SIZE,
        padding: CARD_PADDING,
        color: WHITE,
        fontFamily: 'Poppins',
      }}
    >
      <CoverImage src={backgroundSrc} width={CARD_WIDTH} height={CARD_HEIGHT} position="absolute" />
      <CardHeader logoSrc={logoSrc} title={categoryLabel(category)} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <ShareCardTeam team={teamA} isDimmed={isWalkover && !sideA.isWinner} />
        <Centerpiece
          scoreA={sideA.score}
          scoreB={sideB.score}
          isScheduled={match.status === 'SCHEDULED'}
        />
        <ShareCardTeam team={teamB} isDimmed={isWalkover && !sideB.isWinner} />
      </div>
      <CardCaption text={buildMatchShare(detail).caption} />
    </div>
  );
}
