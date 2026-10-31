"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { GlossaryTerm } from "@/lib/schemas";

type TopicFilter = "all" | "forex" | "stocks" | "commodities" | "crypto" | "sports-betting";

const TOPIC_LABELS: Record<TopicFilter, string> = {
  all: "All topics",
  forex: "Forex",
  stocks: "Stocks",
  commodities: "Commodities",
  crypto: "Crypto",
  "sports-betting": "Sports betting",
};

export function GlossaryBrowser({
  terms,
  sources,
}: {
  terms: readonly GlossaryTerm[];
  sources: Record<string, { title: string; url?: string }>;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicFilter>("all");

  const byId = useMemo(() => new Map(terms.map((t) => [t.id, t])), [terms]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = terms.filter((t) => {
      if (topic !== "all" && !t.topics.includes(topic)) return false;
      if (!q) return true;
      return (
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.related.some((r) => r.toLowerCase().includes(q))
      );
    });
    return [...filtered].sort((a, b) => a.term.localeCompare(b.term, "en"));
  }, [terms, query, topic]);

  const visibleIds = useMemo(() => new Set(visible.map((t) => t.id)), [visible]);

  const revealTerm = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (visibleIds.has(id)) return;
    event.preventDefault();
    setQuery("");
    setTopic("all");
    window.history.pushState(null, "", `#${id}`);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  };

  const letters = useMemo(() => {
    const groups = new Map<string, GlossaryTerm[]>();
    for (const t of visible) {
      const letter = t.term.charAt(0).toUpperCase();
      groups.set(letter, [...(groups.get(letter) ?? []), t]);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "en"));
  }, [visible]);

  return (
    <div className="space-y-8">
      {/* Search & Topic Filter Bar */}
      <div className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:grid sm:grid-cols-[1fr_15rem] sm:gap-5">
        <div>
          <label
            htmlFor="glossary-search"
            className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Search terms and definitions
          </label>
          <div className="relative mt-2">
            <input
              id="glossary-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. spread, custody, dividend..."
              autoComplete="off"
              className="min-h-12 w-full rounded-none border border-[var(--border-subtle)] bg-[var(--input-bg)] px-4 text-base text-[var(--text-main)] placeholder:text-[var(--text-secondary)] transition-all focus:border-[var(--btn-primary)] focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-none p-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 sm:mt-0">
          <label
            htmlFor="glossary-topic"
            className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Topic
          </label>
          <select
            id="glossary-topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value as TopicFilter)}
            className="mt-2 min-h-12 w-full rounded-none border border-[var(--border-subtle)] bg-[var(--input-bg)] px-3 text-base text-[var(--text-main)] transition-all focus:border-[var(--btn-primary)] focus:outline-none"
          >
            {(Object.keys(TOPIC_LABELS) as TopicFilter[]).map((id) => (
              <option key={id} value={id} className="bg-[var(--bg-surface-elevated)] text-[var(--text-main)]">
                {TOPIC_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-[var(--text-secondary)]">
        <p role="status">
          Showing <strong className="text-[var(--text-main)] font-semibold">{visible.length}</strong> of{" "}
          {terms.length} terms
        </p>
      </div>

      {/* Alphabet Quick Jump Bar */}
      {letters.length > 1 ? (
        <nav aria-label="Jump to letter" className="flex flex-wrap gap-1.5">
          {letters.map(([letter]) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-xs font-bold text-[var(--text-main)] transition-all hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)] active:scale-95"
            >
              {letter}
            </a>
          ))}
        </nav>
      ) : null}

      {visible.length === 0 ? (
        <div className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center">
          <p className="font-display text-xl font-bold text-[var(--text-main)]">No terms match that search</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Try a shorter word, or choose &ldquo;All topics&rdquo; to widen your query.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTopic("all");
            }}
            className="mt-5 inline-flex min-h-10 items-center rounded-none border border-[var(--border-subtle)] bg-[var(--btn-primary)] px-5 text-xs font-semibold text-[var(--btn-primary-text)] transition-colors hover:bg-[var(--btn-hover)]"
          >
            Reset search &amp; filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {letters.map(([letter, group]) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-28">
              <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] font-mono text-lg font-bold text-[var(--text-main)] shadow-none">
                  {letter}
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {group.length} {group.length === 1 ? "term" : "terms"}
                </span>
              </div>

              <dl className="mt-5 space-y-4">
                {group.map((t) => (
                  <div
                    key={t.id}
                    id={t.id}
                    className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all duration-200 hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)]"
                  >
                    <dt role="term" className="font-display text-xl font-bold text-[var(--text-main)]">
                      {t.term}
                    </dt>
                    <dd className="mt-2.5 max-w-[70ch] text-base text-[var(--text-secondary)] leading-relaxed">
                      {t.definition}
                    </dd>
                    <dd className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--text-secondary)]">
                      {t.topics.length > 0 ? (
                        <span className="flex items-center gap-1.5">
                          <span className="font-mono uppercase text-[var(--text-secondary)]">Topics:</span>
                          <span className="font-medium text-[var(--text-main)]">
                            {t.topics.map((id) => TOPIC_LABELS[id]).join(", ")}
                          </span>
                        </span>
                      ) : null}
                      {t.related.length > 0 ? (
                        <span className="flex items-center gap-1.5">
                          <span className="font-mono uppercase text-[var(--text-secondary)]">See also:</span>
                          <span>
                            {t.related.map((id, i) => {
                              const related = byId.get(id);
                              if (!related) return null;
                              return (
                                <span key={id}>
                                  {i > 0 ? ", " : null}
                                  <a
                                    href={`#${id}`}
                                    onClick={(event) => revealTerm(event, id)}
                                    className="font-medium text-[var(--text-main)] underline underline-offset-4 hover:text-[var(--btn-primary)] transition-colors"
                                  >
                                    {related.term}
                                  </a>
                                </span>
                              );
                            })}
                          </span>
                        </span>
                      ) : null}
                      {t.sourceIds.length > 0 ? (
                        <span className="flex items-center gap-1.5">
                          <span className="font-mono uppercase text-[var(--text-secondary)]">Sources:</span>
                          <span>
                            {t.sourceIds.map((id, i) => (
                              <span key={id}>
                                {i > 0 ? ", " : null}
                                <Link
                                  href={`/resources#${id}`}
                                  className="font-medium text-[var(--text-main)] underline underline-offset-4 hover:text-[var(--btn-primary)] transition-colors"
                                >
                                  {sources[id]?.title ?? id}
                                </Link>
                              </span>
                            ))}
                          </span>
                        </span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
