import { useCallback, useSyncExternalStore } from "react";
import { PREFS_EVENT, readStoredMotion, writeStored, MOTION_STORAGE_KEY } from "@/lib/preferences";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener(PREFS_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PREFS_EVENT, onChange);
  };
}

function getSnapshot(): boolean {
  const stored = readStoredMotion();
  if (stored) return stored === "reduced";
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Whether non-essential motion is reduced. An explicit saved choice wins; otherwise the
 * operating-system `prefers-reduced-motion` setting decides.
 */
export function useMotionPreference(): { reduced: boolean; setReduced: (value: boolean) => void } {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setReduced = useCallback((value: boolean) => {
    writeStored(MOTION_STORAGE_KEY, value ? "reduced" : "full");
  }, []);
  return { reduced, setReduced };
}
