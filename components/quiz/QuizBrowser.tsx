"use client";

import { useState } from "react";
import { QuizSet } from "@/components/quiz/QuizSet";
import type { QuizQuestion } from "@/lib/schemas";

type Topic = "all" | QuizQuestion["topic"];

const TOPICS: ReadonlyArray<{ id: Topic; label: string }> = [
  { id: "all", label: "All questions" },
  { id: "forex", label: "Forex" },
  { id: "stocks", label: "Stocks" },
  { id: "commodities", label: "Commodities" },
  { id: "crypto", label: "Crypto" },
  { id: "sports-betting", label: "Sports betting" },
  { id: "cross-system", label: "Across systems" },
];

export function QuizBrowser({
  questions,
  sourceTitles,
}: {
  questions: readonly QuizQuestion[];
  sourceTitles: Readonly<Record<string, string>>;
}) {
  const [topic, setTopic] = useState<Topic>("all");
  const visible = questions.filter((q) => topic === "all" || q.topic === topic);

  return (
    <div className="space-y-8">
      <div className="surface rounded-none border border-[var(--border-subtle)] p-5">
        <div role="group" aria-label="Choose a topic" className="flex flex-wrap gap-2.5">
          {TOPICS.map((t) => {
            const isSelected = topic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setTopic(t.id)}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-none border px-4 py-1.5 text-xs font-semibold transition-all duration-[var(--duration-fast)] active:scale-95 ${
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
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p role="status" className="px-1 text-xs text-[var(--text-secondary)]">
        Showing <strong className="text-[var(--text-main)] font-semibold">{visible.length}</strong>{" "}
        {visible.length === 1 ? "question" : "questions"}:{" "}
        {TOPICS.find((t) => t.id === topic)?.label.toLowerCase()}. Changing topic starts that set
        fresh.
      </p>

      {/* Re-keying by topic gives each topic its own fresh answer state. */}
      <QuizSet
        key={topic}
        questions={visible}
        sourceTitles={sourceTitles}
        idPrefix={`quiz-${topic}`}
        showProgressControl
      />
    </div>
  );
}
