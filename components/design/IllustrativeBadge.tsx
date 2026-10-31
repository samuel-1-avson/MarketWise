import { ILLUSTRATIVE_LABEL } from "@/lib/constants";

/**
 * Required beside every synthetic numeric visual. The label is text (not colour-only) and is
 * exposed to assistive technology as a note.
 */
export function IllustrativeBadge({ className = "" }: { className?: string }) {
  return (
    <p
      role="note"
      className={`inline-flex items-center gap-2 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-1 text-sm font-semibold tracking-wide text-[var(--text-secondary)] ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path
          d="M8 1.5 15 14H1L8 1.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8 6.5v3.4M8 11.8v.1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {ILLUSTRATIVE_LABEL}
    </p>
  );
}
