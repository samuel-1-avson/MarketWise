import type { ReactNode } from "react";
import { IllustrativeBadge } from "@/components/design/IllustrativeBadge";
import type { Lab } from "@/lib/schemas";

/**
 * Common frame for every lab: the fiction label, the controls and the picture, a live plain-language
 * description of the current state (the text equivalent of the picture), and an explicit statement of
 * what the model does not do.
 */
export function LabShell({
  lab,
  controls,
  visual,
  live,
  children,
}: {
  lab: Lab;
  controls: ReactNode;
  visual: ReactNode;
  /** Plain-language description of the current state, announced politely when it changes. */
  live: string;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-8">
      {/* Simulation status bar */}
      <div className="surface flex flex-wrap items-center justify-between gap-4 rounded-none border border-[var(--border-subtle)] px-5 py-3 shadow-none">
        <div className="flex flex-wrap items-center gap-3">
          <IllustrativeBadge />
          <p className="text-xs font-mono text-[var(--text-secondary)]">
            Fixed, invented values · Educational simulation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-none bg-[var(--btn-primary)] animate-pulse" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
            Active Model
          </span>
        </div>
      </div>

      {/* Main Workstation: Controls + Visual Canvas */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-8">
        <div
          className="surface space-y-6 rounded-none border border-[var(--border-subtle)] p-6 sm:p-7 shadow-none"
          role="group"
          aria-label={`${lab.title} controls`}
        >
          <div className="border-b border-[var(--border-subtle)] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
              Parameter Controls
            </span>
          </div>
          {controls}
        </div>
        <div className="surface flex min-w-0 flex-col justify-center rounded-none border border-[var(--border-subtle)] p-6 sm:p-7 shadow-none">
          {visual}
        </div>
      </div>

      {children}

      {/* Live Telemetry / In Plain Words */}
      <section
        aria-labelledby={`${lab.id}-words`}
        className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-6 sm:p-7 shadow-none"
      >
        <div className="flex items-center gap-2.5">
          <span
            className="h-2 w-2 rounded-none bg-[var(--btn-primary)]"
            aria-hidden="true"
          />
          <h2
            id={`${lab.id}-words`}
            className="font-display text-base font-bold uppercase tracking-wider text-[var(--text-main)]"
          >
            In plain words
          </h2>
        </div>
        <p
          className="mt-3 max-w-[72ch] text-base font-medium text-[var(--text-main)] leading-relaxed"
          role="status"
          aria-live="polite"
          data-testid="lab-live"
        >
          {live}
        </p>
      </section>

      {/* Model Guardrails / What this lab does not do */}
      <section
        aria-labelledby={`${lab.id}-limits`}
        className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-7"
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] font-bold text-xs text-[var(--text-secondary)]"
            aria-hidden="true"
          >
            !
          </span>
          <h2
            id={`${lab.id}-limits`}
            className="font-display text-base font-bold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            What this lab does not do
          </h2>
        </div>
        <p className="mt-3 max-w-[72ch] text-base text-[var(--text-secondary)] font-medium leading-relaxed">
          {lab.limits}
        </p>
      </section>
    </div>
  );
}
