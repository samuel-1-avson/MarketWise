"use client";

import { useId, useMemo, useState } from "react";
import { IllustrativeBadge } from "@/components/design/IllustrativeBadge";

interface PairConfig {
  pair: string;
  base: string;
  quote: string;
  midRate: number;
  pipFactor: number;
  decimals: number;
}

const DEFAULT_PAIR: PairConfig = {
  pair: "USD/GHS",
  base: "USD",
  quote: "GHS",
  midRate: 10.0,
  pipFactor: 0.01,
  decimals: 2,
};

const PAIRS: PairConfig[] = [
  DEFAULT_PAIR,
  { pair: "EUR/USD", base: "EUR", quote: "USD", midRate: 1.08, pipFactor: 0.0001, decimals: 4 },
  { pair: "GBP/USD", base: "GBP", quote: "USD", midRate: 1.28, pipFactor: 0.0001, decimals: 4 },
];

export function ForexSpreadMechanics() {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [spreadPips, setSpreadPips] = useState(25); // e.g. 25 pips
  const [tradeAmount, setTradeAmount] = useState(1000); // e.g. $1,000 notional
  const [holdingDays, setHoldingDays] = useState(7); // holding period
  const [simDirection, setSimDirection] = useState<"buy" | "sell">("buy");

  const spreadId = useId();
  const amountId = useId();
  const daysId = useId();

  const cfg: PairConfig = PAIRS[selectedPairIndex] ?? DEFAULT_PAIR;

  const calculations = useMemo(() => {
    const halfSpread = (spreadPips * cfg.pipFactor) / 2;
    const bid = cfg.midRate - halfSpread;
    const ask = cfg.midRate + halfSpread;
    const spreadCostQuote = tradeAmount * (ask - bid);
    const breakEvenMovePct = ((ask - bid) / cfg.midRate) * 100;

    // Overnight financing fee estimate (approx 0.02% per day illustrative)
    const financingFeeQuote = tradeAmount * cfg.midRate * 0.0002 * holdingDays;
    const totalFrictionQuote = spreadCostQuote + financingFeeQuote;

    return {
      bid: bid.toFixed(cfg.decimals),
      ask: ask.toFixed(cfg.decimals),
      spreadVal: (ask - bid).toFixed(cfg.decimals),
      spreadCostQuote: spreadCostQuote.toFixed(2),
      breakEvenMovePct: breakEvenMovePct.toFixed(2),
      financingFeeQuote: financingFeeQuote.toFixed(2),
      totalFrictionQuote: totalFrictionQuote.toFixed(2),
    };
  }, [cfg, spreadPips, tradeAmount, holdingDays]);

  return (
    <div className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-none bg-[var(--btn-primary)]" aria-hidden="true" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              Interactive Friction Laboratory
            </span>
          </div>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-3xl">
            The Bid–Ask Spread &amp; Dealer Counterparty Costs
          </h3>
        </div>
        <IllustrativeBadge />
      </div>

      <p className="mt-3 max-w-[76ch] text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        When an importer exchanges currency through a bank, physical funds are transferred to pay a real supplier. But in retail margin forex, participants enter off-exchange contracts with a dealer. The dealer quotes a lower bid and higher ask, meaning every position begins at an immediate mathematical loss.
      </p>

      {/* Currency Pair Selector */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Fictional Currency Pair:
        </span>
        <div className="inline-flex rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-1">
          {PAIRS.map((p, idx) => (
            <button
              key={p.pair}
              type="button"
              onClick={() => setSelectedPairIndex(idx)}
              className={`rounded-none px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                selectedPairIndex === idx
                  ? "bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
              }`}
            >
              {p.pair}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="mt-6 grid gap-6 border-y border-[var(--border-subtle)] py-6 lg:grid-cols-3">
        {/* Spread Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor={spreadId}
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]"
            >
              Dealer Spread: {spreadPips} pips
            </label>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              {calculations.spreadVal} {cfg.quote}
            </span>
          </div>
          <input
            id={spreadId}
            type="range"
            min="2"
            max="100"
            step="1"
            value={spreadPips}
            onChange={(e) => setSpreadPips(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-none bg-[var(--input-bg)] accent-[var(--btn-primary)]"
            aria-label="Adjust dealer spread in pips"
          />
          <div className="flex gap-2">
            {[
              { label: "Institutional (5 pips)", v: 5 },
              { label: "Retail Standard (25 pips)", v: 25 },
              { label: "Volatile / Wide (60 pips)", v: 60 },
            ].map((preset) => (
              <button
                key={preset.v}
                type="button"
                onClick={() => setSpreadPips(preset.v)}
                className={`rounded-none border border-[var(--border-subtle)] px-2.5 py-1 text-xs font-mono transition-colors ${
                  spreadPips === preset.v
                    ? "bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                    : "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Position Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor={amountId}
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]"
            >
              Position Notional: {tradeAmount.toLocaleString()} {cfg.base}
            </label>
          </div>
          <input
            id={amountId}
            type="range"
            min="500"
            max="10000"
            step="500"
            value={tradeAmount}
            onChange={(e) => setTradeAmount(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-none bg-[var(--input-bg)] accent-[var(--btn-primary)]"
            aria-label="Adjust trade size"
          />
          <p className="text-xs text-[var(--text-secondary)]">
            Total value of the contract controlled with dealer leverage.
          </p>
        </div>

        {/* Holding Days */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor={daysId}
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]"
            >
              Overnight Holding: {holdingDays} {holdingDays === 1 ? "day" : "days"}
            </label>
          </div>
          <input
            id={daysId}
            type="range"
            min="0"
            max="30"
            step="1"
            value={holdingDays}
            onChange={(e) => setHoldingDays(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-none bg-[var(--input-bg)] accent-[var(--btn-primary)]"
            aria-label="Adjust days held overnight"
          />
          <p className="text-xs text-[var(--text-secondary)]">
            Dealers charge daily swap/financing fees to maintain leveraged positions.
          </p>
        </div>
      </div>

      {/* Dealer Quote Board */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Dealer Bid Price (You Sell At)
            </span>
            <span className="font-mono text-xs text-[var(--text-secondary)]">Lower Price</span>
          </div>
          <p className="mt-2 font-mono text-4xl font-extrabold text-[var(--text-main)]">
            {calculations.bid}
          </p>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            The dealer pays you {calculations.bid} {cfg.quote} for every 1 {cfg.base}.
          </p>
        </div>

        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Dealer Ask Price (You Buy At)
            </span>
            <span className="font-mono text-xs text-[var(--text-secondary)]">Higher Price</span>
          </div>
          <p className="mt-2 font-mono text-4xl font-extrabold text-[var(--text-main)]">
            {calculations.ask}
          </p>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            The dealer charges you {calculations.ask} {cfg.quote} to buy 1 {cfg.base}.
          </p>
        </div>
      </div>

      {/* Live Financial Friction Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <span className="font-mono text-[0.7rem] uppercase text-[var(--text-secondary)]">
            Immediate Opening Deficit
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-[var(--text-error)]">
            -{calculations.spreadCostQuote} {cfg.quote}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Loss incurred immediately upon execution due to the spread.
          </p>
        </div>

        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <span className="font-mono text-[0.7rem] uppercase text-[var(--text-secondary)]">
            Required Break-Even Price Move
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-[var(--text-main)]">
            +{calculations.breakEvenMovePct}%
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            The market must move this much in your favour just to reach zero profit.
          </p>
        </div>

        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <span className="font-mono text-[0.7rem] uppercase text-[var(--text-secondary)]">
            Total Friction with Financing
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-[var(--text-error)]">
            -{calculations.totalFrictionQuote} {cfg.quote}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Spread loss plus {holdingDays} days of daily overnight financing fees.
          </p>
        </div>
      </div>

      {/* Trade Simulation & Counterparty Reality */}
      <div className="mt-8 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-6">
        <h4 className="font-display text-lg font-bold text-[var(--text-main)]">
          Where Does the Money Go? The Dealer Counterparty Reality
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
          In an open stock exchange, buyer and seller trade directly. In retail margin forex, your dealer is the direct counterparty:
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSimDirection("buy")}
            className={`rounded-none border px-4 py-2 font-mono text-xs font-semibold transition-all ${
              simDirection === "buy"
                ? "border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)]"
            }`}
          >
            Scenario: You Open a Long (Buy) Contract
          </button>
          <button
            type="button"
            onClick={() => setSimDirection("sell")}
            className={`rounded-none border px-4 py-2 font-mono text-xs font-semibold transition-all ${
              simDirection === "sell"
                ? "border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)]"
            }`}
          >
            Scenario: You Open a Short (Sell) Contract
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
            <span className="font-bold text-[var(--text-main)]">Commercial Exchange Delivery:</span>
            <p className="mt-1 text-[var(--text-secondary)]">
              An importer exchanges cedis for dollars to pay an overseas supplier. The dollar is actually delivered, and the supplier holds real currency.
            </p>
          </div>
          <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
            <span className="font-bold text-[var(--text-main)]">Retail Margin Speculation:</span>
            <p className="mt-1 text-[var(--text-secondary)]">
              No dollars are delivered to you. You hold a contract with the dealer. The dealer earns the {calculations.spreadCostQuote} {cfg.quote} spread markup regardless of market direction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
