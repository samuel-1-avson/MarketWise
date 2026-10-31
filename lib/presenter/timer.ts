/**
 * Presenter timer model. It stores wall-clock timestamps rather than ticks, so the elapsed time keeps
 * counting correctly across a lab detour or page reload while it is running.
 */
export type TimerState = {
  /** Milliseconds accumulated while previously running. */
  accumulatedMs: number;
  /** Timestamp (ms) when it was last started, or null when paused. */
  startedAt: number | null;
};

export const INITIAL_TIMER: TimerState = { accumulatedMs: 0, startedAt: null };

export function elapsedMs(state: TimerState, now: number): number {
  const running = state.startedAt === null ? 0 : Math.max(0, now - state.startedAt);
  return Math.max(0, state.accumulatedMs) + running;
}

export function startTimer(state: TimerState, now: number): TimerState {
  return state.startedAt === null ? { ...state, startedAt: now } : state;
}

export function pauseTimer(state: TimerState, now: number): TimerState {
  return state.startedAt === null
    ? state
    : { accumulatedMs: elapsedMs(state, now), startedAt: null };
}

export function resetTimer(): TimerState {
  return INITIAL_TIMER;
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Validates stored data; anything malformed falls back to a fresh timer. */
export function parseTimer(value: unknown): TimerState {
  if (!value || typeof value !== "object") return INITIAL_TIMER;
  const { accumulatedMs, startedAt } = value as Record<string, unknown>;
  const acc =
    typeof accumulatedMs === "number" && Number.isFinite(accumulatedMs) && accumulatedMs >= 0
      ? accumulatedMs
      : 0;
  const started =
    typeof startedAt === "number" && Number.isFinite(startedAt) && startedAt > 0 ? startedAt : null;
  return { accumulatedMs: acc, startedAt: started };
}
