"use client";

import { useEffect, useState } from "react";
import { TopicGlyph } from "@/components/design/TopicGlyph";
import type { ComparisonDimension } from "@/lib/schemas";
import { TOPIC_IDS, type TopicId } from "@/lib/schemas";

const NAMES: Record<TopicId, string> = {
  forex: "Forex",
  stocks: "Stocks",
  commodities: "Commodities",
  crypto: "Crypto",
  "sports-betting": "Sports betting",
};

export function CompareExplorer({
  dimensions,
}: {
  dimensions: readonly ComparisonDimension[];
}) {
  const allIds = dimensions.map((d) => d.id);

  const [selected, setSelected] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set(allIds);
    const p = new URLSearchParams(window.location.search).get("dims");
    if (!p) return new Set(allIds);
    const valid = p
      .split(",")
      .map((s) => s.trim())
      .filter((s) => allIds.includes(s));
    return valid.length > 0 ? new Set(valid) : new Set(allIds);
  });

  useEffect(() => {
    const onPop = () => {
      const p = new URLSearchParams(window.location.search).get("dims");
      if (!p) {
        setSelected(new Set(allIds));
      } else {
        const valid = p
          .split(",")
          .map((s) => s.trim())
          .filter((s) => allIds.includes(s));
        setSelected(valid.length > 0 ? new Set(valid) : new Set(allIds));
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [allIds]);

  const update = (next: Set<string>) => {
    setSelected(next);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (next.size === allIds.length) {
        params.delete("dims");
      } else {
        params.set("dims", Array.from(next).join(","));
      }
      const query = params.toString();
      const nextUrl = query ? `?${query}` : window.location.pathname;
      window.history.replaceState(null, "", nextUrl);
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      if (next.size > 1) next.delete(id);
    } else {
      next.add(id);
    }
    update(next);
  };

  const shown = dimensions.filter((d) => selected.has(d.id));

  return (
    <div className="space-y-6">
      <fieldset className="surface rounded-none border border-[var(--border-subtle)] p-6 shadow-none">
        <legend className="font-display text-lg font-bold text-[var(--text-main)]">
          Choose the questions to compare
        </legend>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Select or clear a question to show or hide its row. The address bar updates so you can
          share this exact view.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {dimensions.map((d) => {
            const isSelected = selected.has(d.id);
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle(d.id)}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-none border px-3.5 py-1.5 text-xs font-semibold transition-all duration-[var(--duration-fast)] active:scale-95 ${
                  isSelected
                    ? "border-[var(--btn-primary)] bg-[var(--bg-surface-elevated)] text-[var(--text-main)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--btn-primary)] hover:text-[var(--text-main)]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={isSelected ? "font-bold text-[var(--btn-primary)]" : "text-[var(--text-secondary)]"}
                >
                  {isSelected ? "✓" : "+"}
                </span>
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs">
          <button
            type="button"
            onClick={() => update(new Set(allIds))}
            className="inline-flex min-h-9 items-center font-semibold text-[var(--text-main)] hover:underline transition-colors underline-offset-4"
          >
            Show all questions
          </button>
          <p className="text-[var(--text-secondary)]" role="status">
            Comparing five systems on{" "}
            <strong className="text-[var(--text-main)] font-semibold">{shown.length}</strong> of{" "}
            {dimensions.length} questions
          </p>
        </div>
      </fieldset>

      {/* Wide screens: one accessible table */}
      <div className="surface mt-8 hidden overflow-hidden rounded-none border border-[var(--border-subtle)] shadow-none lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[58rem] border-separate border-spacing-0 text-left">
            <caption className="sr-only">
              Comparison of forex, stocks, commodities, crypto and sports betting on the selected
              questions
            </caption>
            <thead>
              <tr className="bg-[var(--bg-surface-elevated)]">
                <th
                  scope="col"
                  className="sticky left-0 z-10 w-52 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-5 py-5 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] backdrop-blur-md"
                >
                  Question Matrix
                </th>
                {TOPIC_IDS.map((id) => {
                  return (
                    <th
                      key={id}
                      scope="col"
                      className="border-b border-[var(--border-subtle)] px-5 py-5 align-bottom text-[var(--text-main)]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-none text-[var(--text-secondary)]">
                          <TopicGlyph topic={id} size={22} />
                        </span>
                        <span className="font-display text-base font-bold text-[var(--text-main)]">{NAMES[id]}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {shown.map((d, rowIdx) => (
                <tr
                  key={d.id}
                  className={`transition-colors hover:bg-[var(--bg-surface-elevated)] ${rowIdx % 2 === 0 ? "bg-transparent" : "bg-[var(--bg-surface)]/50"}`}
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/95 px-5 py-5 align-top backdrop-blur-md"
                  >
                    <span className="block font-display text-sm font-bold text-[var(--text-main)]">{d.label}</span>
                    <span className="mt-1 block text-xs font-normal text-[var(--text-secondary)] leading-relaxed">
                      {d.question}
                    </span>
                  </th>
                  {TOPIC_IDS.map((id) => (
                    <td
                      key={id}
                      className="border-b border-[var(--border-subtle)] px-5 py-5 align-top text-sm text-[var(--text-secondary)] leading-relaxed"
                    >
                      {d.cells[id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Narrow screens: one accordion per question */}
      <div className="mt-8 space-y-4 lg:hidden">
        {shown.map((d, i) => (
          <details
            key={d.id}
            className="surface group rounded-none border border-[var(--border-subtle)] p-5 shadow-none"
            open={i === 0}
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <div>
                <span className="block font-display text-base font-bold text-[var(--text-main)]">{d.label}</span>
                <span className="block text-xs text-[var(--text-secondary)] leading-relaxed mt-0.5">
                  {d.question}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm text-[var(--text-secondary)] transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <dl className="mt-5 space-y-4 border-t border-[var(--border-subtle)] pt-4">
              {TOPIC_IDS.map((id) => (
                <div
                  key={id}
                  className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3.5"
                >
                  <dt className="flex items-center gap-2 font-display text-sm font-bold text-[var(--text-main)]">
                    <TopicGlyph topic={id} size={20} />
                    {NAMES[id]}
                  </dt>
                  <dd className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">{d.cells[id]}</dd>
                </div>
              ))}
            </dl>
          </details>
        ))}
      </div>
    </div>
  );
}
