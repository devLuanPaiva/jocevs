import type { ReactElement } from 'react';

export const MAIN_CONTENT_ID = 'conteudo-principal';

export function SkipLink(): ReactElement {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:rounded-full focus:bg-sun focus:px-6 focus:py-3 focus:font-semibold focus:text-brand-900"
    >
      Pular para o conteúdo
    </a>
  );
}
