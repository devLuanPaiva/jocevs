const MOBILE_QUERY = '(max-width: 767px)';

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: 'landscape') => Promise<void>;
};

export function isMobileViewport(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

async function lockLandscape(): Promise<void> {
  const orientation: LockableOrientation = screen.orientation;
  await orientation.lock?.('landscape');
}

export async function enterLandscapeFullscreen(): Promise<boolean> {
  return document.documentElement
    .requestFullscreen()
    .then(lockLandscape)
    .then(
      () => true,
      () => false,
    );
}

export async function leaveLandscapeFullscreen(): Promise<void> {
  screen.orientation.unlock();
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  }
}
