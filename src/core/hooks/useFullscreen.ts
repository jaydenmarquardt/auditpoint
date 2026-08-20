import { useCallback, useEffect } from "react";
import { appStore, setFullscreen, toggleFullscreen, useAppState } from "@/core/state/App.store";
import { readLocal, writeLocal } from "@/utils/Storage.util";

const BODY_CLASS = "auditpoint-fullscreen";
const STORAGE_KEY = "fullscreen";

/** Full screen is a per-user preference, not configuration. */
export function restoreFullscreenPreference(): void {
  setFullscreen(readLocal<boolean>(STORAGE_KEY, false));
}

export function useFullscreen(allowed: boolean): { fullscreen: boolean; toggle: () => void } {
  const fullscreen = useAppState((state) => state.fullscreen) && allowed;

  useEffect(() => {
    if (!allowed) setFullscreen(false);
  }, [allowed]);

  useEffect(() => {
    document.body.classList.toggle(BODY_CLASS, fullscreen);
    const previousOverflow = document.body.style.overflow;
    if (fullscreen) document.body.style.overflow = "hidden";

    return () => {
      document.body.classList.remove(BODY_CLASS);
      document.body.style.overflow = previousOverflow;
    };
  }, [fullscreen]);

  const toggle = useCallback(() => {
    const next = !appStore.getState().fullscreen;
    writeLocal(STORAGE_KEY, next);
    toggleFullscreen();
  }, []);

  return { fullscreen, toggle };
}
