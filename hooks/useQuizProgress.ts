import { useCallback, useMemo, useSyncExternalStore } from "react";
import { PREFS_EVENT, readStored, removeStored, writeStored } from "@/lib/preferences";
import { PROGRESS_KEY, parseProgress, serializeProgress } from "@/lib/progress";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(PREFS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PREFS_EVENT, onChange);
  };
}

const getSnapshot = (): string | null => readStored(PROGRESS_KEY);
const getServerSnapshot = (): string | null => null;

export function useQuizProgress() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { enabled, correct } = useMemo(() => parseProgress(raw), [raw]);
  const correctIds = useMemo(() => new Set(correct), [correct]);

  const enable = useCallback(() => writeStored(PROGRESS_KEY, serializeProgress([])), []);
  const disable = useCallback(() => removeStored(PROGRESS_KEY), []);
  const recordCorrect = useCallback((id: string) => {
    const current = parseProgress(readStored(PROGRESS_KEY));
    if (current.enabled && !current.correct.includes(id)) {
      writeStored(PROGRESS_KEY, serializeProgress([...current.correct, id]));
    }
  }, []);

  return { enabled, correctIds, enable, disable, recordCorrect };
}
