"use client";

import { useState } from "react";
import { SourceRefs } from "@/components/design/SourceRefs";
import { sceneDescription } from "@/content/sceneText";
import { slides } from "@/content/slides";
import { chapterStarts, slideHref } from "@/lib/presenter/navigation";
import { slideNotesWordCount } from "@/lib/schemas";

/**
 * Printable, readable version of the whole deck: every slide's message, cues and (optionally) speaker
 * notes, with sources. It works as a backup if the live deck fails and is the phone-friendly view.
 */
export function Handout() {
  // Audience-safe by default: notes and presenter cues appear only when the presenter ticks the box.
  const [withNotes, setWithNotes] = useState(false);
  const chapters = chapterStarts();

  return (
    <div className="handout space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-base text-ink">
          <input
            type="checkbox"
            checked={withNotes}
            onChange={(event) => setWithNotes(event.target.checked)}
            className="h-5 w-5 accent-forex"
          />
          Include speaker notes
        </label>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 items-center rounded-none border border-[var(--border-subtle)] bg-[var(--btn-primary)] px-6 text-sm font-semibold text-[var(--btn-primary-text)] hover:bg-[var(--btn-hover)]"
        >
          Print or save as PDF
        </button>
      </div>

      <div role="status" aria-live="polite">
        {withNotes ? (
          <p className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 text-base text-[var(--text-main)] print:border-black print:bg-white">
            This copy includes speaker notes and presenter cues. Do not share it with the audience.
          </p>
        ) : (
          <p className="text-base text-muted">
            Audience-safe copy: slide messages and sources only. Tick &ldquo;Include speaker
            notes&rdquo; for the presenter&rsquo;s version.
          </p>
        )}
      </div>

      <nav aria-label="Handout contents" className="print:hidden">
        <h2 className="text-xl font-bold text-ink">Contents</h2>
        <ol className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#slide-${slides[c.first]?.number}`}
                className="inline-flex min-h-11 items-center text-ink underline decoration-muted underline-offset-4"
              >
                {c.label} ({c.count} slide{c.count === 1 ? "" : "s"})
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {chapters.map((c) => (
        <section key={c.id} aria-labelledby={`chapter-${c.id}`} className="space-y-8">
          <h2
            id={`chapter-${c.id}`}
            className="border-b border-line pb-2 font-display text-3xl font-bold text-forex print:text-black"
          >
            {c.label}{" "}
            <span className="text-base font-normal text-muted">· suggested {c.minutes} min</span>
          </h2>
          {slides
            .filter((s) => s.chapter === c.id)
            .map((s) => (
              <article
                key={s.id}
                id={`slide-${s.number}`}
                className="break-inside-avoid-page space-y-3"
              >
                <h3 className="font-display text-2xl font-bold text-ink">
                  {s.number}. {s.title}
                </h3>
                {s.tagline ? <p className="text-base text-muted">{s.tagline}</p> : null}
                <p className="text-lg text-ink">{s.keyMessage}</p>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">
                    What the picture shows
                  </h4>
                  <p className="mt-1 text-base text-ink">{sceneDescription(s.visual)}</p>
                </div>
                {withNotes ? (
                  <div className="space-y-3 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 text-base text-[var(--text-main)] print:border-black">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Speaker notes · about {slideNotesWordCount(s.notes)} words
                    </p>
                    <p>
                      <strong>Say first. </strong>
                      {s.speakerCue} <strong>Interactive cue. </strong>
                      {s.interactiveCue}
                    </p>
                    <p>
                      <strong>Teaching point. </strong>
                      {s.notes.teachingPoint}
                    </p>
                    <ol className="list-decimal space-y-1 pl-5">
                      {s.notes.explanation.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                    <p>
                      <strong>Analogy. </strong>
                      {s.notes.analogy}
                    </p>
                    <p>
                      <strong>Misconception. </strong>
                      {s.notes.misconception}
                    </p>
                    {s.notes.audienceQuestion ? (
                      <p>
                        <strong>Ask the room. </strong>
                        {s.notes.audienceQuestion}
                      </p>
                    ) : null}
                    <p>
                      <strong>Transition. </strong>
                      {s.notes.transition}
                    </p>
                  </div>
                ) : null}
                <SourceRefs ids={s.sourceIds} />
                {withNotes && s.sourceNote ? (
                  <p className="text-sm text-muted">
                    <span className="font-semibold text-ink">Source status: </span>
                    {s.sourceNote}
                  </p>
                ) : null}
                <p className="text-sm text-muted print:hidden">
                  <a
                    href={slideHref(s.id)}
                    className="underline decoration-muted underline-offset-4"
                  >
                    Open this slide in the deck
                    <span className="sr-only">
                      : slide {s.number}, {s.title}
                    </span>
                  </a>
                </p>
              </article>
            ))}
        </section>
      ))}

      <p className="border-t border-line pt-4 text-sm text-muted">
        For learning only. Examples use fictional numbers and synthetic visuals. This material does
        not provide financial advice, trading signals, wagering instructions or live market data.
      </p>
    </div>
  );
}
