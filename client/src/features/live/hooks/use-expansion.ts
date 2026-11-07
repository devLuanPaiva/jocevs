import { useCallback, useEffect, useState } from 'react';
import {
  enterLandscapeFullscreen,
  isMobileViewport,
  leaveLandscapeFullscreen,
} from '../lib/landscape-fullscreen';

interface Expansion {
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
}

export function useExpansion(): Expansion {
  const [isExpanded, setIsExpanded] = useState(false);

  const expand = useCallback((): void => {
    setIsExpanded(true);
    if (isMobileViewport()) {
      void enterLandscapeFullscreen();
    }
  }, []);

  const collapse = useCallback((): void => {
    setIsExpanded(false);
    void leaveLandscapeFullscreen().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        collapse();
      }
    };
    const closeOnFullscreenExit = (): void => {
      if (!document.fullscreenElement && isMobileViewport()) {
        setIsExpanded(false);
        screen.orientation.unlock();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('fullscreenchange', closeOnFullscreenExit);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('fullscreenchange', closeOnFullscreenExit);
    };
  }, [isExpanded, collapse]);

  const toggle = useCallback((): void => {
    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  }, [isExpanded, expand, collapse]);

  return { isExpanded, expand, collapse, toggle };
}
