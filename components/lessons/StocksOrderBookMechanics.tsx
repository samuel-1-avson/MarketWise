"use client";

import { useId, useMemo, useState } from "react";
import { IllustrativeBadge } from "@/components/design/IllustrativeBadge";

interface OrderLevel {
  price: number;
  shares: number;
  total: number;
}

const INITIAL_ASKS: OrderLevel[] = [
  { price: 103.0, shares: 900, total: 92700 },
  { price: 102.5, shares: 600, total: 61500 },
  { price: 102.0, shares: 400, total: 40800 },
  { price: 101.5, shares: 250, total: 25375 },
];

const INITIAL_BIDS: OrderLevel[] = [
  { price: 101.0, shares: 300, total: 30300 },
  { price: 100.5, shares: 500, total: 50250 },
  { price: 100.0, shares: 800, total: 80000 },
  { price: 99.5, shares: 1200, total: 119400 },
];

export function StocksOrderBookMechanics() {
  const [tab, setTab] = useState<"book" | "marketcap">("book");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderShares, setOrderShares] = useState(500);
  const [executedLog, setExecutedLog] = useState<string | null>(null);

  // Market Cap state
  const [shareCountMillions, setShareCountMillions] = useState(10);
  const [marginalPrice, setMarginalPrice] = useState(101.25);
  const [treasuryCashMillions, setTreasuryCashMillions] = useState(140);

  const sharesInputId = useId();
  const priceInputId = useId();
  const countInputId = useId();
  const cashInputId = useId();

  // Calculate order book execution slippage
  const execution = useMemo(() => {
    let remaining = orderShares;
    let totalCost = 0;
    const filledLevels: { price: number; shares: number }[] = [];

    if (orderType === "buy") {
      // Walks the asks from lowest to highest
      const sortedAsks = [...INITIAL_ASKS].sort((a, b) => a.price - b.price);
      for (const level of sortedAsks) {
        if (remaining <= 0) break;
        const take = Math.min(remaining, level.shares);
        filledLevels.push({ price: level.price, shares: take });
        totalCost += take * level.price;
        remaining -= take;
      }
    } else {
      // Walks the bids from highest to lowest
      const sortedBids = [...INITIAL_BIDS].sort((a, b) => b.price - a.price);
      for (const level of sortedBids) {
        if (remaining <= 0) break;
        const take = Math.min(remaining, level.shares);
        filledLevels.push({ price: level.price, shares: take });
        totalCost += take * level.price;
        remaining -= take;
      }
    }

    const filledCount = orderShares - remaining;
    const avgPrice = filledCount > 0 ? totalCost / filledCount : 0;
    const bestPrice =
      orderType === "buy" ? INITIAL_ASKS[INITIAL_ASKS.length - 1]?.price ?? 101.5 : INITIAL_BIDS[0]?.price ?? 101.0;
    const slippagePerShare = Math.abs(avgPrice - bestPrice);

    return {
      filledLevels,
      unfilled: remaining,
      totalCost,
      avgPrice,
      bestPrice,
      slippagePerShare,
    };
  }, [orderType, orderShares]);

  const handleSimulateFill = () => {
    setExecutedLog(
      `Filled ${orderShares - execution.unfilled} shares of ${orderType.toUpperCase()} at average price of $${execution.avgPrice.toFixed(
        2,
      )} (best quote was $${execution.bestPrice.toFixed(2)}).`,
    );
  };

  const marketCapBillions = useMemo(() => {
    return (shareCountMillions * marginalPrice) / 1000;
  }, [shareCountMillions, marginalPrice]);

  return (
    <div className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Mechanics Laboratory · Stocks
          </span>
          <h3 className="mt-1 font-display text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            Order Book & Equity Reality
          </h3>
        </div>
        <IllustrativeBadge />
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
        In stock markets, prices do not come from a single dealer. They form continuously through a{" "}
        <strong className="text-[var(--text-main)]">double auction limit order book (LOB)</strong>{" "}
        where buyers and sellers post competing bids and asks. Furthermore, a company&apos;s market cap is not money in its vault.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex border-b border-[var(--border-subtle)] overflow-x-auto" role="tablist" aria-label="Stocks exploration modes">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "book"}
          onClick={() => setTab("book")}
          className={`px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors rounded-none border-b-2 -mb-px whitespace-nowrap shrink-0 ${
            tab === "book"
              ? "border-[var(--btn-primary)] text-[var(--text-main)] bg-[var(--bg-surface-elevated)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]"
          }`}
        >
          1. Order Book &amp; Slippage
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "marketcap"}
          onClick={() => setTab("marketcap")}
          className={`px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors rounded-none border-b-2 -mb-px whitespace-nowrap shrink-0 ${
            tab === "marketcap"
              ? "border-[var(--btn-primary)] text-[var(--text-main)] bg-[var(--bg-surface-elevated)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]"
          }`}
        >
          2. Market Cap vs. Bank Reserves
        </button>
      </div>

      {tab === "book" ? (
        <div className="mt-8 space-y-8">
          {/* Visual Order Book Ladder */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Ladder Display */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]">
                  Live Order Ladder
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  Spread: $0.50 (0.49%)
                </span>
              </div>

              {/* Asks (Sellers) - Reddish tint or warm border */}
              <div className="mt-3 space-y-1.5">
                <div className="text-[0.7rem] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Asks (Sellers offering shares)
                </div>
                {INITIAL_ASKS.map((ask) => (
                  <div
                    key={ask.price}
                    className="flex items-center justify-between px-3 py-1.5 text-xs font-mono rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                  >
                    <span className="font-bold text-[var(--text-main)]">${ask.price.toFixed(2)}</span>
                    <span className="text-[var(--text-secondary)]">{ask.shares} sh</span>
                    <span className="text-[var(--text-secondary)]">${ask.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Spread Zone */}
              <div className="my-3 flex items-center justify-between border-y border-dashed border-[var(--border-subtle)] py-2 px-3 text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Midpoint: $101.25</span>
                <span className="font-semibold text-[var(--text-main)]">BID-ASK SPREAD: $0.50</span>
              </div>

              {/* Bids (Buyers) */}
              <div className="space-y-1.5">
                <div className="text-[0.7rem] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Bids (Buyers waiting with cash)
                </div>
                {INITIAL_BIDS.map((bid) => (
                  <div
                    key={bid.price}
                    className="flex items-center justify-between px-3 py-1.5 text-xs font-mono rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                  >
                    <span className="font-bold text-[var(--text-main)]">${bid.price.toFixed(2)}</span>
                    <span className="text-[var(--text-secondary)]">{bid.shares} sh</span>
                    <span className="text-[var(--text-secondary)]">${bid.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Order Execution Controls */}
            <div className="space-y-6">
              <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-5">
                <h4 className="font-display text-base font-bold text-[var(--text-main)]">
                  Test a Market Order
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  A market order executes immediately at the best available prices. If your order size exceeds the first level, it &ldquo;walks the book&rdquo; causing price slippage.
                </p>

                {/* Direction Switch */}
                <div>
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Order Action</span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType("buy")}
                      className={`py-2 text-xs font-bold uppercase rounded-none border transition-colors ${
                        orderType === "buy"
                          ? "border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                          : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      Market Buy (Consumes Asks)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType("sell")}
                      className={`py-2 text-xs font-bold uppercase rounded-none border transition-colors ${
                        orderType === "sell"
                          ? "border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                          : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      Market Sell (Consumes Bids)
                    </button>
                  </div>
                </div>

                {/* Shares Size Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor={sharesInputId} className="font-medium text-[var(--text-secondary)]">
                      Order Size:
                    </label>
                    <span className="font-mono font-bold text-[var(--text-main)]">
                      {orderShares} shares
                    </span>
                  </div>
                  <input
                    id={sharesInputId}
                    type="range"
                    min="50"
                    max="1500"
                    step="50"
                    value={orderShares}
                    onChange={(e) => setOrderShares(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--btn-primary)]"
                  />
                  <div className="mt-1 flex justify-between text-[0.7rem] font-mono text-[var(--text-secondary)]">
                    <span>50 sh (Small)</span>
                    <span>500 sh (Walks 2 levels)</span>
                    <span>1,500 sh (Heavy slippage)</span>
                  </div>
                </div>

                {/* Execution Preview Card */}
                <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Starting Best Price:</span>
                    <span className="font-mono font-semibold text-[var(--text-main)]">
                      ${execution.bestPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Simulated Average Fill Price:</span>
                    <span className="font-mono font-bold text-[var(--text-main)]">
                      ${execution.avgPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Price Slippage Penalty:</span>
                    <span className="font-mono font-semibold text-[var(--error-text, #FFB4A8)]">
                      +${execution.slippagePerShare.toFixed(2)} / share
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--border-subtle)] pt-2 font-medium">
                    <span className="text-[var(--text-main)]">Total Execution Capital:</span>
                    <span className="font-mono font-bold text-[var(--text-main)]">
                      ${execution.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateFill}
                  className="w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-none border border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-hover)] transition-colors"
                >
                  Simulate Order Fill ↵
                </button>

                {executedLog ? (
                  <p className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3 text-xs font-mono text-[var(--text-main)]">
                    {executedLog}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Market Cap vs Bank Reserves Tab */
        <div className="mt-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Controls */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5 space-y-5">
              <h4 className="font-display text-base font-bold text-[var(--text-main)]">
                Corporate Equity Calculator
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Adjust the marginal share price and outstanding shares to see how market capitalization compares to the company&apos;s actual cash reserves.
              </p>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor={priceInputId} className="font-medium text-[var(--text-secondary)]">
                    Marginal Share Price (Last Cleared Trade):
                  </label>
                  <span className="font-mono font-bold text-[var(--text-main)]">
                    ${marginalPrice.toFixed(2)}
                  </span>
                </div>
                <input
                  id={priceInputId}
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={marginalPrice}
                  onChange={(e) => setMarginalPrice(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--btn-primary)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor={countInputId} className="font-medium text-[var(--text-secondary)]">
                    Total Shares Issued & Outstanding:
                  </label>
                  <span className="font-mono font-bold text-[var(--text-main)]">
                    {shareCountMillions} Million shares
                  </span>
                </div>
                <input
                  id={countInputId}
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={shareCountMillions}
                  onChange={(e) => setShareCountMillions(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--btn-primary)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor={cashInputId} className="font-medium text-[var(--text-secondary)]">
                    Actual Cash in Company Bank Accounts:
                  </label>
                  <span className="font-mono font-bold text-[var(--text-main)]">
                    ${treasuryCashMillions} Million
                  </span>
                </div>
                <input
                  id={cashInputId}
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={treasuryCashMillions}
                  onChange={(e) => setTreasuryCashMillions(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--btn-primary)]"
                />
              </div>
            </div>

            {/* Contrast Card */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[var(--text-secondary)]">
                  Valuation Breakdown
                </span>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
                    <p className="text-xs text-[var(--text-secondary)]">Paper Market Cap</p>
                    <p className="mt-2 font-display text-3xl font-extrabold text-[var(--text-main)]">
                      ${marketCapBillions.toFixed(2)}B
                    </p>
                    <p className="mt-1 text-[0.7rem] text-[var(--text-secondary)]">
                      ({shareCountMillions}M sh × ${marginalPrice.toFixed(2)})
                    </p>
                  </div>

                  <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
                    <p className="text-xs text-[var(--text-secondary)]">Treasury Cash Reserves</p>
                    <p className="mt-2 font-display text-3xl font-extrabold text-[var(--text-main)]">
                      ${treasuryCashMillions}M
                    </p>
                    <p className="mt-1 text-[0.7rem] text-[var(--text-secondary)]">
                      Real liquid money owned by business
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 text-xs space-y-2">
                  <p className="font-bold text-[var(--text-main)]">
                    Critical Literacy Takeaway:
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Market capitalization is purely an <em>accounting extrapolation</em> based on the price of the single last share traded. It does not mean there is ${marketCapBillions.toFixed(2)}B of cash sitting somewhere. If all shareholders attempted to liquidate at once, prices would collapse through the bid ladder.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-[0.75rem] text-[var(--text-secondary)]">
                Ownership gives you a proportional legal claim on company assets and distributed profits, not a guaranteed repurchase price.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
