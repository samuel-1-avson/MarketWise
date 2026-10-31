"use client";

import { useState } from "react";
import { ChoiceGroup, LabButton, RangeControl } from "@/components/labs/controls";
import { LabShell } from "@/components/labs/LabShell";
import { getLab } from "@/content/labs";
import {
  FX_DEFAULT_DIRECTION,
  FX_DEFAULT_STEP,
  FX_STEPS,
  fxQuote,
  type FxDirection,
} from "@/lib/labs/fx";
import { palette } from "@/lib/tokens";

const lab = getLab("fx-quote");

export function FxQuoteLab() {
  const [direction, setDirection] = useState<FxDirection>(FX_DEFAULT_DIRECTION);
  // `from` is the quote the learner was viewing before this one, so the text compares with it.
  const [view, setView] = useState<{ step: number; from: number | undefined }>({
    step: FX_DEFAULT_STEP,
    from: undefined,
  });

  const quote = fxQuote(view.step, direction, view.from);
  const goTo = (step: number) => setView((prev) => ({ step, from: prev.step }));
  const reset = () => {
    setDirection(FX_DEFAULT_DIRECTION);
    setView({ step: FX_DEFAULT_STEP, from: undefined });
  };

  const controls = (
    <>
      <ChoiceGroup
        legend="Read the pair as"
        name="fx-direction"
        value={direction}
        onChange={setDirection}
        options={[
          { value: "usd-base", label: "USD/GHS (dollar is the base)" },
          { value: "ghs-base", label: "GHS/USD (cedi is the base)" },
        ]}
      />
      <RangeControl
        id="fx-step"
        label={`Invented list of quotes (not a timeline): quote ${quote.stepIndex + 1} of ${quote.stepCount}`}
        min={1}
        max={FX_STEPS.length}
        value={quote.stepIndex + 1}
        valueText={`Quote ${quote.stepIndex + 1} of ${quote.stepCount}, ${quote.pair} ${quote.rateText}`}
        onChange={(v) => goTo(v - 1)}
      />
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={() => goTo(quote.stepIndex - 1)} disabled={quote.stepIndex === 0}>
          ← Previous quote
        </LabButton>
        <LabButton
          onClick={() => goTo(quote.stepIndex + 1)}
          disabled={quote.stepIndex === quote.stepCount - 1}
        >
          Next quote →
        </LabButton>
      </div>
      <LabButton onClick={reset} className="w-full">
        Reset
      </LabButton>
    </>
  );

  const visual = (
    <div>
      <svg
        viewBox="0 0 580 220"
        role="img"
        aria-label={`${quote.pair} ${quote.rateText}. ${quote.reading}`}
        className="h-auto w-full"
      >
        <rect
          x="10"
          y="40"
          width="190"
          height="130"
          rx="0"
          fill="var(--bg-surface-elevated, #262624)"
          stroke="var(--border-subtle, #3F3F39)"
          strokeWidth="1.5"
        />
        <text
          x="105"
          y="92"
          textAnchor="middle"
          fontSize="40"
          fontWeight="700"
          fill="var(--color-ink)"
        >
          {quote.base}
        </text>
        <text x="105" y="128" textAnchor="middle" fontSize="20" fill="var(--color-muted)">
          1 unit
        </text>
        <text x="105" y="156" textAnchor="middle" fontSize="15" fill="var(--color-muted)">
          {quote.base === "USD" ? "US dollar" : "Ghana cedi"} · the base
        </text>

        <line
          x1="212"
          y1="95"
          x2="368"
          y2="95"
          stroke={palette.forex}
          strokeWidth="3"
          markerEnd="url(#fx-arrow)"
        />
        <text x="290" y="82" textAnchor="middle" fontSize="18" fill="var(--color-muted)">
          is worth
        </text>
        <text
          x="290"
          y="135"
          textAnchor="middle"
          fontSize="34"
          fontWeight="700"
          fill={palette.forex}
        >
          {quote.rateText}
        </text>
        <text x="290" y="160" textAnchor="middle" fontSize="16" fill="var(--color-muted)">
          {quote.pair} · invented
        </text>

        <rect
          x="380"
          y="40"
          width="190"
          height="130"
          rx="0"
          fill="var(--bg-surface-elevated, #262624)"
          stroke="var(--border-subtle, #3F3F39)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text
          x="475"
          y="92"
          textAnchor="middle"
          fontSize="40"
          fontWeight="700"
          fill="var(--color-ink)"
        >
          {quote.quote}
        </text>
        <text x="475" y="128" textAnchor="middle" fontSize="20" fill="var(--color-muted)">
          {quote.rateText} units
        </text>
        <text x="475" y="156" textAnchor="middle" fontSize="15" fill="var(--color-muted)">
          {quote.quote === "USD" ? "US dollars" : "Ghana cedis"} · the quote
        </text>
        <defs>
          <marker
            id="fx-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 10 5 0 10z" fill={palette.forex} />
          </marker>
        </defs>
      </svg>

      <dl className="mt-4 grid gap-3 text-base sm:grid-cols-2">
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 sm:col-span-2">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">How to read it</dt>
          <dd className="mt-1 text-[var(--text-main)]">{quote.reading}</dd>
        </div>
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">Dealer prices (fictional)</dt>
          <dd className="mt-1 text-[var(--text-main)]">
            Bid {quote.bidText} · Ask {quote.askText}
          </dd>
          <dd className="mt-1 text-sm text-[var(--text-secondary)]">
            The dealer buys 1 {quote.base} at the bid and sells it at the ask. The gap is the
            spread, one way a dealer is paid; fees can be separate. A quote is only a price:
            delivering the currencies (settlement) is a separate step.
          </dd>
        </div>
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">
            Compared with the last quote you viewed
          </dt>
          <dd className="mt-1 text-[var(--text-main)]">{quote.movement}</dd>
        </div>
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 sm:col-span-2">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">
            In practice (a fixed fictional invoice)
          </dt>
          <dd className="mt-1 text-[var(--text-main)]">{quote.invoiceText}</dd>
        </div>
      </dl>
    </div>
  );

  return (
    <LabShell
      lab={lab}
      controls={controls}
      visual={visual}
      live={`${quote.reading} ${quote.movement}`}
    />
  );
}
