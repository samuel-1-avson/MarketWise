"use client";

import { useId, useState } from "react";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import type { QuizQuestion } from "@/lib/schemas";

type AnswersState = Record<string, { selected: string | null; checked: boolean }>;

function focusSoon(selector: string) {
  setTimeout(() => {
    const el = document.querySelector<HTMLElement>(selector);
    el?.focus();
  }, 30);
}

export function QuizSet({
  questions,
  sourceTitles = {},
  showProgressControl = true,
  idPrefix: externalIdPrefix,
}: {
  questions: readonly QuizQuestion[];
  sourceTitles?: Record<string, string>;
  showProgressControl?: boolean;
  idPrefix?: string;
}) {
  const [answers, setAnswers] = useState<AnswersState>({});
  const progress = useQuizProgress();
  const autoIdPrefix = useId();
  const idPrefix = externalIdPrefix ?? autoIdPrefix;

  const select = (id: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { selected: optionId, checked: false },
    }));
  };

  const check = (q: QuizQuestion) => {
    const answer = answers[q.id];
    if (!answer?.selected) return;
    const isCorrect = answer.selected === q.correctOptionId;
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { selected: answer.selected, checked: true },
    }));
    if (isCorrect) {
      progress.recordCorrect(q.id);
    }
  };

  const retry = (id: string) => {
    setAnswers((prev) => ({ ...prev, [id]: { selected: null, checked: false } }));
    focusSoon(`input[name="${idPrefix}-${id}"]`);
  };
  const resetAll = () => setAnswers({});

  const checkedCount = Object.values(answers).filter((a) => a.checked).length;
  const correctCount = questions.filter(
    (q) => answers[q.id]?.checked && answers[q.id]?.selected === q.correctOptionId,
  ).length;

  return (
    <div className="space-y-8">
      {showProgressControl ? (
        <div className="surface flex flex-wrap items-center justify-between gap-4 rounded-none border border-[var(--border-subtle)] p-5">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3.5 text-sm font-medium text-[var(--text-main)]">
            <input
              type="checkbox"
              checked={progress.enabled}
              onChange={(event) => (event.target.checked ? progress.enable() : progress.disable())}
              className="h-4 w-4 shrink-0"
            />
            <span>
              Remember which questions I answered correctly, in this browser only
              <span className="block text-xs text-[var(--text-secondary)]">
                Nothing is sent anywhere. Untick to delete it.
              </span>
            </span>
          </label>
          {progress.enabled ? (
            <span className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-1 font-mono text-xs font-semibold text-[var(--text-secondary)]">
              {progress.correctIds.size} saved as answered correctly
            </span>
          ) : null}
        </div>
      ) : null}

      <ol className="space-y-6">
        {questions.map((q, index) => {
          const answer = answers[q.id];
          const checked = answer?.checked ?? false;
          const isCorrect = checked && answer?.selected === q.correctOptionId;
          const correctOption = q.options.find((o) => o.id === q.correctOptionId);
          const groupName = `${idPrefix}-${q.id}`;
          const feedbackId = `${groupName}-feedback`;
          const wasCorrectBefore = !checked && progress.correctIds.has(q.id);

          return (
            <li
              key={q.id}
              className="surface rounded-none border border-[var(--border-subtle)] p-6 sm:p-7 transition-all duration-300"
            >
              <fieldset aria-describedby={checked ? feedbackId : undefined}>
                <legend className="font-display text-lg font-bold leading-snug text-[var(--text-main)] sm:text-xl">
                  <span className="mr-2 font-mono text-[var(--text-secondary)]">Q{index + 1}.</span>
                  {q.prompt}
                </legend>

                {wasCorrectBefore ? (
                  <p className="mt-2 text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                    <span aria-hidden="true">✓</span> You answered this correctly before (saved in
                    this browser)
                  </p>
                ) : null}

                <div className="mt-5 space-y-2.5">
                  {q.options.map((option) => {
                    const chosen = answer?.selected === option.id;
                    const showCorrect = checked && option.id === q.correctOptionId;
                    const showWrong = checked && chosen && option.id !== q.correctOptionId;
                    return (
                      <label
                        key={option.id}
                        className={`flex min-h-12 cursor-pointer items-start gap-3.5 rounded-none border px-4 py-3 text-sm font-medium transition-all duration-[var(--duration-fast)] ${
                          showCorrect
                            ? "border-[var(--btn-primary)] bg-[var(--bg-surface-elevated)] text-[var(--text-main)]"
                            : showWrong
                              ? "border-[var(--text-error)] bg-[var(--bg-surface-elevated)] text-[var(--text-main)]"
                              : chosen
                                ? "border-[var(--btn-primary)] bg-[var(--bg-surface-elevated)] text-[var(--text-main)]"
                                : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--btn-primary)] hover:text-[var(--text-main)]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={groupName}
                          value={option.id}
                          checked={chosen}
                          disabled={checked}
                          onChange={() => select(q.id, option.id)}
                          className="mt-0.5"
                        />
                        <span className="flex-1 leading-relaxed">
                          <span className="mr-2 font-mono font-bold uppercase text-[var(--text-secondary)]">
                            {option.id}.
                          </span>
                          {option.text}
                          {showCorrect ? (
                            <span className="ml-2 font-bold text-[var(--text-main)]">✓ Correct answer</span>
                          ) : null}
                          {showWrong ? (
                            <span className="ml-2 font-bold text-[var(--text-error)]">✗ Your answer</span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {!checked ? (
                  <button
                    key="check"
                    type="button"
                    onClick={() => check(q)}
                    disabled={!answer?.selected}
                    className="inline-flex min-h-10 items-center justify-center rounded-none bg-[var(--btn-primary)] px-5 text-xs font-bold text-[var(--btn-primary-text)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--btn-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Check answer
                  </button>
                ) : (
                  <button
                    key="retry"
                    type="button"
                    data-retry={q.id}
                    onClick={() => retry(q.id)}
                    className="inline-flex min-h-10 items-center justify-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 text-xs font-semibold text-[var(--text-main)] transition-all hover:bg-[var(--bg-surface-elevated)]"
                  >
                    Try again
                  </button>
                )}
              </div>

              <div id={feedbackId} role="status" aria-live="polite">
                {checked ? (
                  <div
                    className={`mt-5 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5 transition-all`}
                  >
                    <p
                      className={`font-display text-base font-bold ${isCorrect ? "text-[var(--text-main)]" : "text-[var(--text-error)]"}`}
                    >
                      {isCorrect
                        ? "✓ Correct."
                        : `✗ Not quite. The best answer is ${correctOption?.id.toUpperCase()}: ${correctOption?.text}`}
                    </p>
                    <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{q.explanation}</p>
                    {q.sourceIds.length > 0 ? (
                      <p className="mt-3 border-t border-[var(--border-subtle)] pt-2.5 text-xs text-[var(--text-secondary)]">
                        <span className="font-semibold text-[var(--text-main)]">Based on: </span>
                        {q.sourceIds.map((id) => sourceTitles[id] ?? id).join("; ")}
                      </p>
                    ) : (
                      <p className="mt-3 border-t border-[var(--border-subtle)] pt-2.5 text-xs text-[var(--text-secondary)]">
                        General explanation — see the lesson for the reasoning.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="surface flex flex-wrap items-center justify-between gap-4 rounded-none border border-[var(--border-subtle)] p-5">
        <p className="text-sm font-medium text-[var(--text-main)]" role="status">
          {checkedCount === 0
            ? `${questions.length} questions. Choose an answer, then check it.`
            : `${correctCount} of ${checkedCount} answered correctly so far (${questions.length} questions).`}
        </p>
        {checkedCount > 0 ? (
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex min-h-10 items-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-xs font-semibold text-[var(--text-main)] transition-all hover:bg-[var(--bg-surface-elevated)]"
          >
            Reset all answers
          </button>
        ) : null}
      </div>
    </div>
  );
}
