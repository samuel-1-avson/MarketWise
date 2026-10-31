"use client";

import { useId, useMemo, useState } from "react";
import { IllustrativeBadge } from "@/components/design/IllustrativeBadge";

type Mode = "two-way" | "three-way";

interface OutcomeData {
  id: string;
  name: string;
  trueProbability: number; // 0 to 1
}

export function SportsBettingMechanics() {
  const [mode, setMode] = useState<Mode>("two-way");
  const [prob1, setProb1] = useState<number>(55); // Outcome 1 percentage for two-way
  const [threeWayProbs, setThreeWayProbs] = useState<[number, number, number]>([45, 25, 30]);
  const [operatorMargin, setOperatorMargin] = useState<number>(8); // 0 to 15%
  const [simOutcome, setSimOutcome] = useState<number>(0);
  const simStake = 100;

  const marginId = useId();
  const probId = useId();

  // Active outcome list based on mode
  const outcomes: OutcomeData[] = useMemo(() => {
    if (mode === "two-way") {
      const p1 = prob1 / 100;
      const p2 = (100 - prob1) / 100;
      return [
        { id: "o1", name: "Outcome 1 (e.g. Team A)", trueProbability: p1 },
        { id: "o2", name: "Outcome 2 (e.g. Team B)", trueProbability: p2 },
      ];
    } else {
      return [
        { id: "o1", name: "Outcome 1 (e.g. Home Win)", trueProbability: threeWayProbs[0] / 100 },
        { id: "o2", name: "Outcome 2 (e.g. Draw / Tie)", trueProbability: threeWayProbs[1] / 100 },
        { id: "o3", name: "Outcome 3 (e.g. Away Win)", trueProbability: threeWayProbs[2] / 100 },
      ];
    }
  }, [mode, prob1, threeWayProbs]);

  // Mathematical calculations
  const marginMultiplier = 1 + operatorMargin / 100;

  const calculations = useMemo(() => {
    return outcomes.map((item) => {
      // Fair odds with 0% margin
      const fairOdds = item.trueProbability > 0 ? 1 / item.trueProbability : 0;
      // Implied probability with operator margin
      const impliedProbability = item.trueProbability * marginMultiplier;
      // Quoted decimal odds with operator margin built in
      const quotedOdds = impliedProbability > 0 ? 1 / impliedProbability : 0;

      return {
        ...item,
        fairOdds: fairOdds.toFixed(2),
        impliedProbabilityPct: (impliedProbability * 100).toFixed(1),
        quotedOdds: quotedOdds.toFixed(2),
        payoutPer10: (10 * quotedOdds).toFixed(2),
        fairPayoutPer10: (10 * fairOdds).toFixed(2),
      };
    });
  }, [outcomes, marginMultiplier]);

  const totalImplied = useMemo(() => {
    return calculations
      .reduce((sum, item) => sum + Number(item.impliedProbabilityPct), 0)
      .toFixed(1);
  }, [calculations]);

  // Settlement simulation values
  const winnerPayoutTotal = (simStake / marginMultiplier).toFixed(2);
  const operatorKeptProfit = (simStake - simStake / marginMultiplier).toFixed(2);

  return (
    <div className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-8">
      {/* Header and Badge */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-none bg-[var(--btn-primary)]" aria-hidden="true" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              Interactive Mathematical Laboratory
            </span>
          </div>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-3xl">
            How Operators Calculate Odds &amp; Settle Agreements
          </h3>
        </div>
        <IllustrativeBadge />
      </div>

      <p className="mt-3 max-w-[76ch] text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        Unlike stock or currency markets where prices emerge from buyers and sellers trading real assets, sports betting is a private agreement set by a commercial operator. The operator uses a mathematical formula to inject an overround margin into the quoted prices, guaranteeing negative mathematical expectancy for participants.
      </p>

      {/* Mode Selector */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Event Structure:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 w-full sm:w-auto rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-1 gap-1">
          <button
            type="button"
            onClick={() => {
              setMode("two-way");
              setSimOutcome(0);
            }}
            className={`rounded-none px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-center transition-colors ${
              mode === "two-way"
                ? "bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
            }`}
          >
            2-Outcome Agreement
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("three-way");
              setSimOutcome(0);
            }}
            className={`rounded-none px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-center transition-colors ${
              mode === "three-way"
                ? "bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
            }`}
          >
            3-Outcome Agreement
          </button>
        </div>
      </div>

      {/* Interactive Sliders & Presets */}
      <div className="mt-6 grid gap-6 border-y border-[var(--border-subtle)] py-6 lg:grid-cols-2">
        {/* Probability Setting */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor={probId}
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]"
            >
              Event Probability Distribution (True 100%)
            </label>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              Sum = 100.0%
            </span>
          </div>

          {mode === "two-way" ? (
            <div>
              <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                <span>Outcome 1: {prob1}%</span>
                <span>Outcome 2: {100 - prob1}%</span>
              </div>
              <input
                id={probId}
                type="range"
                min="20"
                max="80"
                step="5"
                value={prob1}
                onChange={(e) => setProb1(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-none bg-[var(--input-bg)] accent-[var(--btn-primary)]"
                aria-label="Adjust Outcome 1 true probability"
              />
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { label: "50 / 50 (Even)", v: 50 },
                  { label: "60 / 40 (Slight)", v: 60 },
                  { label: "75 / 25 (Heavy)", v: 75 },
                ].map((preset) => (
                  <button
                    key={preset.v}
                    type="button"
                    onClick={() => setProb1(preset.v)}
                    className={`rounded-none border border-[var(--border-subtle)] px-2.5 py-1 text-xs font-mono text-center transition-colors ${
                      prob1 === preset.v
                        ? "bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                        : "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { label: "Balanced (33/34/33)", p: [33, 34, 33] as [number, number, number] },
                  { label: "Home Edge (45/25/30)", p: [45, 25, 30] as [number, number, number] },
                  { label: "Strong Fav (60/20/20)", p: [60, 20, 20] as [number, number, number] },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setThreeWayProbs(preset.p)}
                    className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-2.5 py-1 text-xs font-mono text-center text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs font-mono text-[var(--text-secondary)] pt-1">
                <span>Outcome 1: {threeWayProbs[0]}%</span>
                <span>Draw: {threeWayProbs[1]}%</span>
                <span>Outcome 2: {threeWayProbs[2]}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Operator Margin / Overround Setting */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor={marginId}
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]"
            >
              Operator Overround Margin: {operatorMargin}%
            </label>
            <span
              className={`font-mono text-xs font-bold ${
                operatorMargin > 0 ? "text-[var(--text-error)]" : "text-[var(--text-secondary)]"
              }`}
            >
              {operatorMargin === 0 ? "Fair Zero-Edge Model" : `+${operatorMargin}% Built-in Edge`}
            </span>
          </div>

          <input
            id={marginId}
            type="range"
            min="0"
            max="15"
            step="1"
            value={operatorMargin}
            onChange={(e) => setOperatorMargin(Number(e.target.value))}
            className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-none bg-[var(--input-bg)] accent-[var(--btn-primary)]"
            aria-label="Adjust operator margin percentage"
          />

          <div className="flex flex-wrap gap-2">
            {[
              { label: "0% Fair (No Edge)", m: 0 },
              { label: "5% Low Margin", m: 5 },
              { label: "8% Industry Standard", m: 8 },
              { label: "12% High Margin", m: 12 },
            ].map((preset) => (
              <button
                key={preset.m}
                type="button"
                onClick={() => setOperatorMargin(preset.m)}
                className={`rounded-none border border-[var(--border-subtle)] px-2.5 py-1 text-xs font-mono transition-colors ${
                  operatorMargin === preset.m
                    ? "bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                    : "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* The 3 Core Formulas Visualized */}
      <div className="mt-8">
        <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          The Operator Pricing Formulas Step-by-Step
        </h4>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
            <span className="font-mono text-[0.7rem] uppercase text-[var(--text-secondary)]">
              Formula 1: Implied Probability
            </span>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--text-main)]">
              Implied % = (1 / Odds) × 100
            </p>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              Converts quoted decimal odds into the percentage probability required to break even.
            </p>
          </div>

          <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
            <span className="font-mono text-[0.7rem] uppercase text-[var(--text-secondary)]">
              Formula 2: The Overround
            </span>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--text-error)]">
              Total % = ∑ Implied % = 100% + Margin
            </p>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              In a fair market, total = 100%. Betting sites inflate probabilities to {totalImplied}%, creating the house edge.
            </p>
          </div>

          <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
            <span className="font-mono text-[0.7rem] uppercase text-[var(--text-secondary)]">
              Formula 3: Quoted Odds Pricing
            </span>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--text-main)]">
              Quoted Odds = 1 / (P × (1 + Margin))
            </p>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              The operator mathematically shrinks payouts below fair value, locking in revenue across a balanced book.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Comparison Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]">
              <th className="p-3">Possible Outcome</th>
              <th className="p-3">True Likelihood</th>
              <th className="p-3">Fair Odds (0% Margin)</th>
              <th className="p-3 text-[var(--text-main)]">Operator Quoted Odds</th>
              <th className="p-3">Implied Probability</th>
              <th className="p-3">Payout on $10</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-main)]">
            {calculations.map((calc, idx) => (
              <tr
                key={calc.id}
                className={simOutcome === idx ? "bg-[var(--bg-surface-elevated)]" : "hover:bg-[var(--bg-surface-elevated)]/50"}
              >
                <td className="p-3 font-bold">{calc.name}</td>
                <td className="p-3">{(calc.trueProbability * 100).toFixed(1)}%</td>
                <td className="p-3 text-[var(--text-secondary)]">{calc.fairOdds}</td>
                <td className="p-3 font-bold text-[var(--text-main)]">{calc.quotedOdds}</td>
                <td className="p-3 font-semibold text-[var(--text-error)]">
                  {calc.impliedProbabilityPct}%
                </td>
                <td className="p-3">
                  ${calc.payoutPer10}{" "}
                  <span className="text-[var(--text-secondary)]">
                    (vs fair ${calc.fairPayoutPer10})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] font-bold">
              <td className="p-3">Total Market</td>
              <td className="p-3">100.0%</td>
              <td className="p-3 text-[var(--text-secondary)]">—</td>
              <td className="p-3">—</td>
              <td className="p-3 text-[var(--text-error)]">{totalImplied}%</td>
              <td className="p-3 text-[var(--text-secondary)]">
                Overround: +{operatorMargin}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Interactive Settlement Simulator */}
      <div className="mt-8 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Settlement Verification Simulator
            </span>
            <h4 className="font-display text-lg font-bold text-[var(--text-main)]">
              Simulate Agreement Settlement Across a Balanced $100 Pool
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[var(--text-secondary)]">Pool:</span>
            <span className="font-mono text-sm font-bold text-[var(--text-main)]">$100.00</span>
          </div>
        </div>

        <p className="mt-2 text-xs text-[var(--text-secondary)]">
          Select which outcome occurs in the event to trace how the agreement settles and where the money flows:
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {calculations.map((calc, idx) => (
            <button
              key={calc.id}
              type="button"
              onClick={() => setSimOutcome(idx)}
              className={`rounded-none border px-3.5 py-2 font-mono text-xs font-semibold transition-all ${
                simOutcome === idx
                  ? "border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)] shadow-sm"
                  : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-[var(--btn-primary)]"
              }`}
            >
              Event Result: {calc.name} Occurs
            </button>
          ))}
        </div>

        {/* Settlement Report Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <span className="font-mono text-[0.7rem] uppercase text-[var(--text-secondary)]">
              Total Stakes Injected
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--text-main)]">
              ${simStake}.00
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Collected from participants across all outcomes.
            </p>
          </div>

          <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <span className="font-mono text-[0.7rem] uppercase text-[var(--text-secondary)]">
              Paid to Winning Outcome
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--text-main)]">
              ${winnerPayoutTotal}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Disbursed under operator rules to winning agreements.
            </p>
          </div>

          <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <span className="font-mono text-[0.7rem] uppercase text-[var(--text-error)]">
              Operator Profit Retained
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--text-error)]">
              ${operatorKeptProfit} ({operatorMargin}%)
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Guaranteed gross operator revenue regardless of winner.
            </p>
          </div>
        </div>

        {/* Final Educational Takeaway Box */}
        <div className="mt-4 flex items-start gap-3 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-[var(--btn-primary)] text-[0.65rem] font-bold text-[var(--btn-primary-text)]">
            !
          </span>
          <div className="text-xs leading-relaxed text-[var(--text-secondary)]">
            <span className="font-bold text-[var(--text-main)]">Status at settlement:</span>{" "}
            The agreement terminates immediately. No participant owns an ongoing share of a business, currency, or commodity. The operator&apos;s formula guarantees that over many events, participants as a whole receive less than 100% of the money committed.
          </div>
        </div>
      </div>
    </div>
  );
}
