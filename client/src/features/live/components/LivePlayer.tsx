'use client';

import { useState, type ReactElement } from 'react';
import { useExpansion } from '../hooks/use-expansion';
import { isMobileViewport } from '../lib/landscape-fullscreen';
import { buildEmbedUrl } from '../lib/youtube-links';
import { PlayFacade } from './PlayFacade';

const EMBED_PERMISSIONS = 'autoplay; encrypted-media; picture-in-picture; fullscreen';

const COLLAPSED_CLASS_NAME = 'relative w-full';
const EXPANDED_CLASS_NAME =
  'fixed inset-0 z-50 flex items-center justify-center bg-black p-3 sm:p-8';
const COLLAPSED_FRAME_CLASS_NAME = 'w-full max-w-6xl';
const EXPANDED_FRAME_CLASS_NAME = 'w-[min(100%,calc((100dvh-1.5rem)*1.7778))] sm:max-w-6xl';

interface LivePlayerProps {
  title: string;
  videoId: string;
  previewUrl: string | null;
}

export function LivePlayer({
  title,
  videoId,
  previewUrl,
}: Readonly<LivePlayerProps>): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const { isExpanded, expand, collapse, toggle } = useExpansion();

  const play = (): void => {
    setIsPlaying(true);
    if (isMobileViewport()) {
      expand();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className={isExpanded ? EXPANDED_CLASS_NAME : COLLAPSED_CLASS_NAME}>
        <div
          className={`relative aspect-video overflow-hidden rounded-2xl bg-black ring-4 ring-sun md:rounded-3xl ${
            isExpanded ? EXPANDED_FRAME_CLASS_NAME : COLLAPSED_FRAME_CLASS_NAME
          }`}
        >
          {isPlaying ? (
            <iframe
              title={title}
              src={buildEmbedUrl(videoId)}
              allow={EMBED_PERMISSIONS}
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full"
            />
          ) : (
            <PlayFacade title={title} previewUrl={previewUrl} onPlay={play} />
          )}
        </div>
        {isExpanded ? (
          <button
            type="button"
            onClick={collapse}
            className="absolute right-2 top-2 min-h-8 rounded-full bg-white/90 px-3 text-xs font-semibold text-brand-900 sm:right-8 sm:top-8 sm:min-h-11 sm:px-5 sm:text-base"
          >
            Fechar
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-white">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex min-h-11 items-center rounded-full px-5 font-semibold ring-2 ring-white/70 hover:bg-white hover:text-brand-900"
        >
          {isExpanded ? 'Reduzir' : 'Expandir'}
        </button>
      </div>
    </div>
  );
}
