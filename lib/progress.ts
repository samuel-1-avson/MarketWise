import { STORAGE_PREFIX } from "@/lib/constants";

/**
 * Optional, opt-in quiz progress. Nothing is saved until the learner switches saving on; the data is
 * just a list of question ids answered correctly, kept in this browser only.
 */
export const PROGRESS_KEY = `${STORAGE_PREFIX}progress`;

/** Parses the raw stored value; any malformed data counts as "saving is off". */
export function parseProgress(raw: string | null): { enabled: boolean; correct: string[] } {
  if (!raw) return { enabled: false, correct: [] };
  try {
    const value: unknown = JSON.parse(raw);
    if (value && typeof value === "object" && "correct" in value && Array.isArray(value.correct)) {
      return {
        enabled: true,
        correct: value.correct.filter((id): id is string => typeof id === "string"),
      };
    }
  } catch {
    // fall through
  }
  return { enabled: false, correct: [] };
}

export function serializeProgress(correct: readonly string[]): string {
  return JSON.stringify({ correct: [...new Set(correct)].sort() });
}
