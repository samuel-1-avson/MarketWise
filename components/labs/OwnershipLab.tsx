"use client";

import { useState } from "react";
import { ChoiceGroup, LabButton, RangeControl } from "@/components/labs/controls";
import { LabShell } from "@/components/labs/LabShell";
import { getLab } from "@/content/labs";
import {
  DEFAULT_SHARES,
  MOSAIC_COLS,
  MOSAIC_ROWS,
  TOTAL_SHARES,
  clampShares,
  mosaicPaths,
  ownership,
  type DividendScenario,
} from "@/lib/labs/ownership";

const lab = getLab("ownership-lens");
const PRESETS = [1, 10, 25, 100, 500] as const;

export function OwnershipLab() {
  const [shares, setShares] = useState(DEFAULT_SHARES);
  const [scenario, setScenario] = useState<DividendScenario>("none");

  const view = ownership(shares, scenario);
  const { ownedD, restD } = mosaicPaths(view.shares);

  const controls = (
    <>
      <RangeControl
        id="own-shares-range"
        label="Hypothetical shares you hold"
        min={0}
        max={TOTAL_SHARES}
        value={view.shares}
        valueText={`${view.shares} of ${TOTAL_SHARES} shares, ${view.percentText}`}
        onChange={(v) => setShares(clampShares(v))}
      />
      <div>
        <label htmlFor="own-shares-number" className="text-sm font-semibold text-ink">
          Or type a number (0 to {TOTAL_SHARES.toLocaleString("en-GB")})
        </label>
        <input
          id="own-shares-number"
          type="number"
          inputMode="numeric"
          min={0}
          max={TOTAL_SHARES}
          step={1}
          value={view.shares}
          onChange={(event) =>
            setShares(event.target.value === "" ? 0 : clampShares(event.target.value))
          }
          className="mt-2 min-h-12 w-full rounded-none border border-[var(--border-subtle)] bg-[var(--input-bg)] px-4 text-base text-[var(--text-main)]"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text-main)]">Quick picks</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((n) => (
            <LabButton key={n} onClick={() => setShares(n)} aria-label={`${n} shares`}>
              {n}
            </LabButton>
          ))}
        </div>
      </div>
      <ChoiceGroup
        legend="This year the company…"
        name="own-dividend"
        value={scenario}
        onChange={setScenario}
        options={[
          { value: "none", label: "pays no dividend" },
          { value: "pool", label: "pays a fictional pool" },
        ]}
      />
      <LabButton
        onClick={() => {
          setShares(DEFAULT_SHARES);
          setScenario("none");
        }}
        className="w-full"
      >
        Reset
      </LabButton>
    </>
  );

  const visual = (
    <div>
      <svg
        viewBox={`0 0 ${MOSAIC_COLS * 10} ${MOSAIC_ROWS * 10}`}
        role="img"
        aria-label={`Mosaic of ${TOTAL_SHARES} cells, one per share of a fictional company. ${view.shares} are highlighted: ${view.percentText}.`}
        className="h-auto w-full"
      >
        <path d={restD} fill="none" stroke="var(--border-subtle)" strokeWidth="0.8" />
        <path d={ownedD} fill="var(--text-main)" />
      </svg>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Each square is one of the fictional company&rsquo;s {TOTAL_SHARES.toLocaleString("en-GB")}{" "}
        shares. Filled squares are the shares you hold; outlined squares belong to other people.
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">Your slice of the company</dt>
          <dd className="mt-1 font-display text-4xl font-bold text-[var(--text-main)]">{view.percentText}</dd>
          <dd className="text-sm text-[var(--text-secondary)]">
            {view.shares.toLocaleString("en-GB")} of {TOTAL_SHARES.toLocaleString("en-GB")} shares
          </dd>
        </div>
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">
            Your share of this year&rsquo;s payout
          </dt>
          <dd className="mt-1 font-display text-4xl font-bold text-[var(--text-main)]">
            {view.dividendGhs.toLocaleString("en-GB")}{" "}
            <span className="text-lg font-semibold text-[var(--text-secondary)]">cedis</span>
          </dd>
          <dd className="text-sm text-[var(--text-secondary)]">
            Fictional. A dividend is the company&rsquo;s decision, not a promise.
          </dd>
        </div>
      </dl>
    </div>
  );

  return <LabShell lab={lab} controls={controls} visual={visual} live={view.summary} />;
}
