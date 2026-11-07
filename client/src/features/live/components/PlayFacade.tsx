import Image from 'next/image';
import type { ReactElement } from 'react';

const PREVIEW_WIDTH = 1280;
const PREVIEW_HEIGHT = 720;

interface PlayFacadeProps {
  title: string;
  previewUrl: string | null;
  onPlay: () => void;
}

export function PlayFacade({ title, previewUrl, onPlay }: Readonly<PlayFacadeProps>): ReactElement {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Assistir à transmissão: ${title}`}
      className="group absolute inset-0 flex items-center justify-center bg-brand-900"
    >
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt=""
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          unoptimized
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span className="px-6 text-center font-display text-3xl text-white md:text-6xl">
          {title}
        </span>
      )}
      <span
        aria-hidden="true"
        className="relative flex size-10 items-center justify-center rounded-full bg-sun text-base text-brand-900 shadow-[0_3px_0_#c9a900] transition-transform duration-300 group-hover:scale-110 md:size-20 md:text-3xl md:shadow-[0_6px_0_#c9a900]"
      >
        ▶
      </span>
    </button>
  );
}
