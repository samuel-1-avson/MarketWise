"use client";

import { useId, useMemo, useState } from "react";
import { IllustrativeBadge } from "@/components/design/IllustrativeBadge";

export function CommoditiesConvergenceMechanics() {
  const [tab, setTab] = useState<"convergence" | "hedging">("convergence");

  // Convergence state
  const [daysToExpiry, setDaysToExpiry] = useState(90); // 0 to 180 days
  const [marketStructure, setMarketStructure] = useState<"contango" | "backwardation">("contango");
  const [spotPrice, setSpotPrice] = useState(80); // $80 base spot price
  const monthlyStorageRate = 1.5; // $1.50 per unit/month

  // Hedging state
  const [harvestSpotPrice, setHarvestSpotPrice] = useState(5.0); // spot at harvest ($3 to $8)
  const lockedFuturesPrice = 5.5; // locked in forward price
  const costOfProduction = 4.2; // farmer's cost
  const cropQuantity = 1000; // bushels

  const daysSliderId = useId();
  const spotSliderId = useId();
  const harvestSliderId = useId();

  // Convergence calculations
  const convergence = useMemo(() => {
    const months = daysToExpiry / 30;
    const carryCost = months * monthlyStorageRate;
    const futuresPrice =
      marketStructure === "contango"
        ? spotPrice + carryCost
        : spotPrice - carryCost * 0.8;
    const basis = futuresPrice - spotPrice;

    return {
      futuresPrice: futuresPrice.toFixed(2),
      spotPrice: spotPrice.toFixed(2),
      basis: basis.toFixed(2),
      carryCost: carryCost.toFixed(2),
      isExpired: daysToExpiry === 0,
    };
  }, [daysToExpiry, marketStructure, spotPrice, monthlyStorageRate]);

  // Farmer hedging calculations
  const hedging = useMemo(() => {
    const physicalRevenue = cropQuantity * harvestSpotPrice;
    // Short futures position: gain when spot falls below locked price, loss when above
    const futuresPayoff = cropQuantity * (lockedFuturesPrice - harvestSpotPrice);
    const netTotalRevenue = physicalRevenue + futuresPayoff;
    const totalCost = cropQuantity * costOfProduction;
    const netProfit = netTotalRevenue - totalCost;
    const unhedgedProfit = physicalRevenue - totalCost;

    return {
      physicalRevenue: physicalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      futuresPayoff: futuresPayoff.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      futuresPayoffRaw: futuresPayoff,
      netTotalRevenue: netTotalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      netProfit: netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      unhedgedProfit: unhedgedProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      unhedgedProfitRaw: unhedgedProfit,
    };
  }, [cropQuantity, harvestSpotPrice, lockedFuturesPrice, costOfProduction]);

  return (
    <div className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Mechanics Laboratory · Commodities
          </span>
          <h3 className="mt-1 font-display text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            Spot-Futures Convergence & Commercial Hedging
          </h3>
        </div>
        <IllustrativeBadge />
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
        Unlike financial securities, physical commodities involve heavy real-world storage, insurance, and transport costs. Futures contracts are legally binding delivery or cash commitments that <strong className="text-[var(--text-main)]">must converge to the physical spot price at expiration</strong>.
      </p>

      {/* Mode Tabs */}
      <div className="mt-6 flex border-b border-[var(--border-subtle)] overflow-x-auto" role="tablist" aria-label="Commodities exploration modes">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "convergence"}
          onClick={() => setTab("convergence")}
          className={`px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors rounded-none border-b-2 -mb-px whitespace-nowrap shrink-0 ${
            tab === "convergence"
              ? "border-[var(--btn-primary)] text-[var(--text-main)] bg-[var(--bg-surface-elevated)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]"
          }`}
        >
          1. Expiration Convergence
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "hedging"}
          onClick={() => setTab("hedging")}
          className={`px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors rounded-none border-b-2 -mb-px whitespace-nowrap shrink-0 ${
            tab === "hedging"
              ? "border-[var(--btn-primary)] text-[var(--text-main)] bg-[var(--bg-surface-elevated)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]"
          }`}
        >
          2. Commercial Hedging (Risk Transfer)
        </button>
      </div>

      {tab === "convergence" ? (
        <div className="mt-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Interactive Timeline Controls */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5 space-y-5">
              <h4 className="font-display text-base font-bold text-[var(--text-main)]">
                Contract Timeline Controls
              </h4>

              {/* Market Structure Toggle */}
              <div>
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  Market Condition Structure
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMarketStructure("contango")}
                    className={`py-2 text-xs font-bold uppercase rounded-none border transition-colors ${
                      marketStructure === "contango"
                        ? "border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    Contango (Futures &gt; Spot)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarketStructure("backwardation")}
                    className={`py-2 text-xs font-bold uppercase rounded-none border transition-colors ${
                      marketStructure === "backwardation"
                        ? "border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    Backwardation (Spot &gt; Futures)
                  </button>
                </div>
              </div>

              {/* Days to Expiration Slider */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor={daysSliderId} className="font-medium text-[var(--text-secondary)]">
                    Days Remaining to Contract Expiration:
                  </label>
                  <span className="font-mono font-bold text-[var(--text-main)]">
                    {daysToExpiry} days {daysToExpiry === 0 ? "(EXPIRATION DAY)" : ""}
                  </span>
                </div>
                <input
                  id={daysSliderId}
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={daysToExpiry}
                  onChange={(e) => setDaysToExpiry(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--btn-primary)]"
                />
                <div className="mt-1 flex justify-between text-[0.7rem] font-mono text-[var(--text-secondary)]">
                  <span>Day 0 (Basis = 0)</span>
                  <span>90 Days (Halfway)</span>
                  <span>180 Days (Full Carry)</span>
                </div>
              </div>

              {/* Spot Price Slider */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor={spotSliderId} className="font-medium text-[var(--text-secondary)]">
                    Physical Spot Benchmark Price:
                  </label>
                  <span className="font-mono font-bold text-[var(--text-main)]">
                    ${spotPrice.toFixed(2)}
                  </span>
                </div>
                <input
                  id={spotSliderId}
                  type="range"
                  min="40"
                  max="140"
                  step="5"
                  value={spotPrice}
                  onChange={(e) => setSpotPrice(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--btn-primary)]"
                />
              </div>
            </div>

            {/* Convergence Visualizer */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[var(--text-secondary)]">
                  Live Pricing Relationship
                </span>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
                    <p className="text-xs text-[var(--text-secondary)]">Physical Spot Price</p>
                    <p className="mt-1 font-display text-2xl font-bold text-[var(--text-main)]">
                      ${convergence.spotPrice}
                    </p>
                    <p className="text-[0.7rem] text-[var(--text-secondary)]">Immediate delivery</p>
                  </div>

                  <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
                    <p className="text-xs text-[var(--text-secondary)]">Futures Contract Price</p>
                    <p className="mt-1 font-display text-2xl font-bold text-[var(--text-main)]">
                      ${convergence.futuresPrice}
                    </p>
                    <p className="text-[0.7rem] text-[var(--text-secondary)]">
                      {daysToExpiry}d forward delivery
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Price Basis (Futures − Spot):</span>
                    <span className="font-bold text-[var(--text-main)]">
                      {Number(convergence.basis) >= 0 ? `+$${convergence.basis}` : `-$${Math.abs(Number(convergence.basis)).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Estimated Carry Friction:</span>
                    <span className="text-[var(--text-secondary)]">${convergence.carryCost}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 text-xs space-y-2">
                  <p className="font-bold text-[var(--text-main)]">
                    {convergence.isExpired
                      ? "✓ Contract Expired: Exact Convergence Achieved"
                      : "Convergence Law in Action:"}
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {convergence.isExpired
                      ? "At Day 0, arbitrage forces the futures price and the spot price to be identical. Any remaining open contract is either settled with physical warehouse receipts or cleared for cash against the spot benchmark."
                      : `With ${daysToExpiry} days remaining, the futures price reflects storage, financing, and delivery expectations. Drag the slider to 0 to watch basis collapse to zero.`}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-[0.75rem] text-[var(--text-secondary)]">
                Commodity markets exist primarily to balance physical supply chains, not as speculative lottery tickets.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Hedging Walkthrough Tab */
        <div className="mt-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Hedging Scenario Controls */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5 space-y-5">
              <h4 className="font-display text-base font-bold text-[var(--text-main)]">
                Farmer Hedging Sandbox
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                A farmer plants 1,000 bushels of grain. Production cost is $4.20/bu ($4,200 total). At planting time, they sell a futures contract locking in $5.50/bu.
              </p>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor={harvestSliderId} className="font-medium text-[var(--text-secondary)]">
                    Market Spot Price at Harvest Time:
                  </label>
                  <span className="font-mono font-bold text-[var(--text-main)]">
                    ${harvestSpotPrice.toFixed(2)} / bushel
                  </span>
                </div>
                <input
                  id={harvestSliderId}
                  type="range"
                  min="2.50"
                  max="8.50"
                  step="0.25"
                  value={harvestSpotPrice}
                  onChange={(e) => setHarvestSpotPrice(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--btn-primary)]"
                />
                <div className="mt-1 flex justify-between text-[0.7rem] font-mono text-[var(--text-secondary)]">
                  <span>$2.50 (Crash / Surplus)</span>
                  <span>$5.50 (Locked Rate)</span>
                  <span>$8.50 (Drought Spike)</span>
                </div>
              </div>

              <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs space-y-2">
                <p className="font-bold text-[var(--text-main)]">Contract Terms Locked:</p>
                <div className="grid grid-cols-2 gap-2 text-[0.75rem]">
                  <div>Locked Forward: <span className="font-mono font-semibold">${lockedFuturesPrice.toFixed(2)}/bu</span></div>
                  <div>Production Cost: <span className="font-mono font-semibold">${costOfProduction.toFixed(2)}/bu</span></div>
                </div>
              </div>
            </div>

            {/* Dual Ledger Contrast */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5">
              <span className="text-xs font-mono uppercase text-[var(--text-secondary)]">
                Dual Ledger Settlement
              </span>

              <div className="space-y-3 text-xs">
                {/* Physical leg */}
                <div className="flex items-center justify-between rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3">
                  <div>
                    <p className="font-semibold text-[var(--text-main)]">Physical Grain Sold to Local Mill</p>
                    <p className="text-[0.7rem] text-[var(--text-secondary)]">
                      1,000 bu × ${harvestSpotPrice.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-[var(--text-main)]">
                    ${hedging.physicalRevenue}
                  </span>
                </div>

                {/* Futures leg */}
                <div className="flex items-center justify-between rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3">
                  <div>
                    <p className="font-semibold text-[var(--text-main)]">Futures Contract Settlement</p>
                    <p className="text-[0.7rem] text-[var(--text-secondary)]">
                      1,000 bu × (${lockedFuturesPrice.toFixed(2)} − ${harvestSpotPrice.toFixed(2)})
                    </p>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      hedging.futuresPayoffRaw >= 0 ? "text-[var(--text-main)]" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {hedging.futuresPayoffRaw >= 0 ? `+$${hedging.futuresPayoff}` : `-$${Math.abs(hedging.futuresPayoffRaw).toFixed(2)}`}
                  </span>
                </div>

                {/* Total Hedged Outcome */}
                <div className="rounded-none border-2 border-[var(--btn-primary)] bg-[var(--bg-surface-elevated)] p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-display font-bold text-sm text-[var(--text-main)]">
                      Net Guaranteed Revenue:
                    </span>
                    <span className="font-mono font-extrabold text-lg text-[var(--text-main)]">
                      ${hedging.netTotalRevenue}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-[0.75rem] text-[var(--text-secondary)]">
                    <span>Farmer&apos;s Net Profit (after $4,200 costs):</span>
                    <span className="font-mono font-bold text-[var(--text-main)]">
                      +${hedging.netProfit}
                    </span>
                  </div>
                </div>

                {/* Unhedged comparison */}
                <div className="rounded-none border border-dashed border-[var(--border-subtle)] p-3 text-[0.75rem] text-[var(--text-secondary)] flex justify-between">
                  <span>If Unhedged (gambling on weather/market):</span>
                  <span
                    className={`font-mono font-semibold ${
                      hedging.unhedgedProfitRaw < 0 ? "text-[var(--error-text, #FFB4A8)]" : "text-[var(--text-main)]"
                    }`}
                  >
                    {hedging.unhedgedProfitRaw < 0 ? `Bankruptcy Loss -$${Math.abs(hedging.unhedgedProfitRaw).toFixed(2)}` : `+$${hedging.unhedgedProfit}`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Notice: regardless of how high or low spot prices swing, the hedged farmer earns <strong className="text-[var(--text-main)]">exactly $1,300 in profit</strong>. The futures market gave up windfall upside in exchange for guaranteeing survival against disastrous price drops.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
