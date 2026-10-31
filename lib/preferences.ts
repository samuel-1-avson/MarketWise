import { STORAGE_PREFIX } from "@/lib/constants";

/**
 * Local-only preference storage. Nothing here leaves the browser; every read/write is wrapped
 * because storage can be blocked (private windows, site-data settings) and must never break
 * rendering.
 */

export const PREFS_EVENT = "marketwise:prefs-changed";
export const MOTION_STORAGE_KEY = `${STORAGE_PREFIX}motion`;

export type MotionPreference = "reduced" | "full";

export function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the preference simply does not persist.
  }
  window.dispatchEvent(new Event(PREFS_EVENT));
}

export function removeStored(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage unavailable: nothing to remove.
  }
  window.dispatchEvent(new Event(PREFS_EVENT));
}

export function readStoredMotion(): MotionPreference | null {
  const value = readStored(MOTION_STORAGE_KEY);
  return value === "reduced" || value === "full" ? value : null;
}

/** Removes every key written by this site. Backs the visible "clear saved data" control. */
export function clearAllLocalData(): number {
  let removed = 0;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) keys.push(key);
    }
    for (const key of keys) {
      window.localStorage.removeItem(key);
      removed += 1;
    }
  } catch {
    // Nothing stored, or storage blocked.
  }
  window.dispatchEvent(new Event(PREFS_EVENT));
  return removed;
}
