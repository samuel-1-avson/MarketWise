/**
 * Whether the speaker notes are showing. Deliberately kept in memory only — not in sessionStorage — so
 * a reload, a duplicated tab or a restored session always starts with the notes hidden. A lab detour
 * is a client-side navigation, so the choice still survives that round trip.
 */
type Listener = () => void;

let open = false;
const listeners = new Set<Listener>();

export const notesStore = {
  get: (): boolean => open,
  set(value: boolean): void {
    if (open === value) return;
    open = value;
    for (const listener of listeners) listener();
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  /** For tests. */
  reset(): void {
    open = false;
    for (const listener of listeners) listener();
  },
};
