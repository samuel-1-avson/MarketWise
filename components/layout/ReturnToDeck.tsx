"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { parseReturnTo } from "@/lib/presenter/navigation";

/**
 * Shown on any page opened from a slide (`?returnTo=/present/<slide>`). The target is validated
 * against the real slide list, so it can only ever lead back into the deck.
 */
export function ReturnToDeck() {
  const target = parseReturnTo(useSearchParams().get("returnTo"));
  if (!target) return null;

  return (
    <nav
      aria-label="Return to the presentation"
      className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] print:hidden"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <p className="text-sm text-[var(--text-main)]">You opened this from the presentation.</p>
        <Link
          href={target.href}
          className="inline-flex min-h-11 items-center rounded-none border border-[var(--border-subtle)] bg-[var(--btn-primary)] px-5 text-sm font-semibold text-[var(--btn-primary-text)] hover:bg-[var(--btn-hover)]"
          data-testid="return-to-deck"
        >
          ← Back to slide {target.slide.number}: {target.slide.title}
        </Link>
      </div>
    </nav>
  );
}
