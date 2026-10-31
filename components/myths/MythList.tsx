"use client";

import { useState } from "react";
import type { Myth } from "@/lib/schemas";

type Filter = "all" | Myth["topic"];

const FILTERS: ReadonlyArray<{ id: Filter; label: string }> = [
  { id: "all", label: "All myths" },
  { id: "forex", label: "Forex" },
  { id: "stocks", label: "Stocks" },
  { id: "commodities", label: "Commodities" },
  { id: "crypto", label: "Crypto" },
  { id: "sports-betting", label: "Sports betting" },
  { id: "cross-system", label: "Across systems" },
];

type MythSource = {
  title: string;
  url: string;
  publisher?: string;
};

export function MythList({
  myths,
  sources,
}: {
  myths: readonly Myth[];
  sources: Record<string, MythSource>;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = myths.filter((m) => filter === "all" || m.topic === filter);
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  const toggle = (id: string, isOpen: boolean) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(id);
      else next.delete(id);
      return next;
    });

  const allOpen = visible.every((m) => open.has(m.id));
  const setAll = (value: boolean) =>
    setOpen((prev) => {
      const next = new Set(prev);
      for (const m of visible) {
        if (value) next.add(m.id);
        else next.delete(m.id);
      }
      return next;
    });

  return (
    <div className="space-y-6">
      <div className="surface flex flex-wrap items-center justify-between gap-4 rounded-none border border-[var(--border-subtle)] p-5">
        <div role="group" aria-label="Filter myths by topic" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isSelected = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setFilter(f.id)}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-none border px-3.5 py-1.5 text-xs font-semibold transition-all duration-[var(--duration-fast)] active:scale-95 ${
                  isSelected
                    ? "border-[var(--btn-primary)] bg-[var(--bg-surface-elevated)] text-[var(--text-main)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--btn-primary)] hover:text-[var(--text-main)]"
                }`}
              >
                {isSelected ? (
                  <span aria-hidden="true" className="font-bold text-[var(--btn-primary)]">
                    ✓{" "}
                  </span>
                ) : null}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setAll(!allOpen)}
          className="inline-flex min-h-10 items-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-xs font-semibold text-[var(--text-main)] transition-all hover:bg-[var(--bg-surface-elevated)]"
        >
          {allOpen ? "Hide all answers" : "Reveal all answers"}
        </button>
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-[var(--text-secondary)]">
        <p role="status">
          Showing <strong className="text-[var(--text-main)] font-semibold">{visible.length}</strong> of{" "}
          {myths.length} myths
        </p>
      </div>

      <ul className="space-y-4">
        {visible.map((myth) => {
          const isOpen = open.has(myth.id);
          return (
            <li key={myth.id}>
              <details
                className={`surface group rounded-none border transition-all duration-300 p-6 sm:p-7 ${
                  isOpen
                    ? "border-[var(--btn-primary)] bg-[var(--bg-surface-elevated)]"
                    : "border-[var(--border-subtle)] hover:border-[var(--btn-primary)]"
                }`}
                open={isOpen}
                onToggle={(event) => toggle(myth.id, event.currentTarget.open)}
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <div>
                    <span
                      className="inline-block rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-0.5 text-[0.7rem] font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      {FILTERS.find((f) => f.id === myth.topic)?.label}
                    </span>
                    <h2 className="mt-2 font-display text-xl font-bold leading-snug text-[var(--text-main)] sm:text-2xl">
                      Myth: &ldquo;{myth.claim}&rdquo;
                    </h2>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-main)] group-open:hidden"
                  >
                    Tap to reveal
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 hidden shrink-0 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-main)] group-open:inline"
                  >
                    Hide
                  </span>
                </summary>

                <div className="mt-6 border-t border-[var(--border-subtle)] pt-6 space-y-4">
                  <div>
                    <p className="inline-flex items-center gap-2 rounded-none border border-[var(--text-error)] bg-[var(--bg-surface)] px-3.5 py-1 text-xs font-bold text-[var(--text-error)]">
                      <span aria-hidden="true">✕</span> Verdict: {myth.verdict}
                    </p>
                  </div>
                  <p className="font-display text-lg font-bold text-[var(--text-main)] sm:text-xl leading-snug">
                    {myth.correction}
                  </p>
                  <p className="max-w-[70ch] text-sm text-[var(--text-secondary)] leading-relaxed">
                    {myth.explanation}
                  </p>

                  {myth.sourceIds.length > 0 ? (
                    <div className="border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--text-main)]">Verified Sources: </span>
                      {myth.sourceIds.map((id, i) => {
                        const source = sources[id];
                        if (!source) return null;
                        return (
                          <span key={id}>
                            {i > 0 ? " · " : ""}
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-[var(--text-main)] underline underline-offset-2 hover:text-[var(--btn-primary)]"
                            >
                              <span>{source.publisher ? `${source.publisher} — ` : ""}{source.title}</span>
                              <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
