"use client";

import { useMotionPreference } from "@/hooks/useMotionPreference";

export function MotionToggle({ className = "" }: { className?: string }) {
  const { reduced, setReduced } = useMotionPreference();

  // The accessible name stays "Reduce motion"; aria-pressed carries the state, so it is announced
  // once. The visible "on/off" text is a sighted-user hint only.
  return (
    <button
      type="button"
      aria-pressed={reduced}
      onClick={() => setReduced(!reduced)}
      className={`inline-flex min-h-9 items-center gap-2 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--btn-primary)] hover:text-[var(--text-main)] aria-pressed:border-[var(--btn-primary)] aria-pressed:bg-[var(--bg-surface-elevated)] aria-pressed:text-[var(--text-main)] ${className}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-2 w-2 rounded-none border ${reduced ? "border-[var(--btn-primary)] bg-[var(--btn-primary)]" : "border-[var(--border-subtle)]"}`}
      />
      <span>Reduce motion</span>
      <span aria-hidden="true">: {reduced ? "on" : "off"}</span>
    </button>
  );
}
