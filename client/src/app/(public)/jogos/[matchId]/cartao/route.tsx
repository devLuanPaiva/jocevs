import { ImageResponse } from 'next/og';
import { MatchShareCard } from '@/features/games/components/MatchShareCard';
import { getMatchDetail } from '@/features/games/services/get-match-detail';

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const NOT_FOUND_STATUS = 404;
const BEBAS_FONT_PATH = '/share/BebasNeue-Regular.otf';
const POPPINS_FONT_PATH = '/share/Poppins-Bold.ttf';
const BACKGROUND_PATH = '/share/match-card-background.jpg';
const BACKGROUND_TYPE = 'image/jpeg';
const LOGO_PATH = '/share/logo-white.png';
const LOGO_TYPE = 'image/png';
const BOLD_WEIGHT = 700;

interface MatchCardRouteContext {
  params: Promise<{ matchId: string }>;
}

async function loadAsset(origin: string, path: string): Promise<ArrayBuffer> {
  const response = await fetch(`${origin}${path}`);
  return response.arrayBuffer();
}

function toDataUri(data: ArrayBuffer, contentType: string): string {
  return `data:${contentType};base64,${Buffer.from(data).toString('base64')}`;
}

export async function GET(
  request: Request,
  { params }: Readonly<MatchCardRouteContext>,
): Promise<Response> {
  const { matchId } = await params;
  const { origin } = new URL(request.url);
  const [detail, bebas, poppins, background, logo] = await Promise.all([
    getMatchDetail(matchId),
    loadAsset(origin, BEBAS_FONT_PATH),
    loadAsset(origin, POPPINS_FONT_PATH),
    loadAsset(origin, BACKGROUND_PATH),
    loadAsset(origin, LOGO_PATH),
  ]);
  if (!detail) {
    return new Response(null, { status: NOT_FOUND_STATUS });
  }
  return new ImageResponse(
    <MatchShareCard
      detail={detail}
      backgroundSrc={toDataUri(background, BACKGROUND_TYPE)}
      logoSrc={toDataUri(logo, LOGO_TYPE)}
    />,
    {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      fonts: [
        { name: 'Bebas', data: bebas, weight: 400, style: 'normal' },
        { name: 'Poppins', data: poppins, weight: BOLD_WEIGHT, style: 'normal' },
      ],
    },
  );
}
