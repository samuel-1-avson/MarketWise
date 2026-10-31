import { useCallback, useMemo, useSyncExternalStore } from "react";
import { STORAGE_PREFIX } from "@/lib/constants";
import { INITIAL_TIMER, parseTimer, type TimerState } from "@/lib/presenter/timer";

/**
 * Deck state that must survive a lab detour or a reload: the timer, whether its panel is open, and
 * whether single-letter shortcuts are on. It lives in sessionStorage (this tab only, gone when the tab
 * closes), never on a server. Speaker-notes visibility is deliberately NOT stored here; see
 * lib/presenter/notesStore.ts.
 */
export const DECK_SESSION_KEY = `${STORAGE_PREFIX}deck`;
const DECK_EVENT = "marketwise:deck-changed";

export type DeckSession = {
  timer: TimerState;
  timerOpen: boolean;
  letterShortcuts: boolean;
};

const DEFAULT_SESSION: DeckSession = {
  timer: INITIAL_TIMER,
  timerOpen: false,
  letterShortcuts: true,
};

export function parseDeckSession(raw: string | null): DeckSession {
  if (!raw) return DEFAULT_SESSION;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    return {
      timer: parseTimer(value.timer),
      timerOpen: value.timerOpen === true,
      letterShortcuts: value.letterShortcuts !== false,
    };
  } catch {
    return DEFAULT_SESSION;
  }
}

function readRaw(): string | null {
  try {
    return window.sessionStorage.getItem(DECK_SESSION_KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(DECK_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DECK_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useDeckSession() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const session = useMemo(() => parseDeckSession(raw), [raw]);

  const update = useCallback((patch: Partial<DeckSession>) => {
    const next = { ...parseDeckSession(readRaw()), ...patch };
    try {
      window.sessionStorage.setItem(DECK_SESSION_KEY, JSON.stringify(next));
    } catch {
      // Storage blocked: the deck still works, it just will not remember across a detour.
    }
    window.dispatchEvent(new Event(DECK_EVENT));
  }, []);

  return { session, update };
}
