import { clampInt, trimmed } from "./clamp";

/**
 * Equity Ownership Lens model. A fictional 1,000-share company. There are no prices and no purchase
 * flow: the only input is how many hypothetical shares to highlight.
 */
export const TOTAL_SHARES = 1000;
export const DEFAULT_SHARES = 25;
/** Fictional pool the company might decide to pay out this year, in cedis. */
export const DIVIDEND_POOL_GHS = 5000;

export type DividendScenario = "none" | "pool";

export const MOSAIC_COLS = 40;
export const MOSAIC_ROWS = 25;

export function clampShares(value: unknown): number {
  return clampInt(value, 0, TOTAL_SHARES, DEFAULT_SHARES);
}

export function parseDividendScenario(value: unknown): DividendScenario {
  return value === "pool" ? "pool" : "none";
}

export type OwnershipView = {
  shares: number;
  total: number;
  fraction: number;
  percentText: string;
  dividendScenario: DividendScenario;
  dividendGhs: number;
  reading: string;
  dividendText: string;
  summary: string;
};

export function ownership(sharesInput: unknown, scenarioInput: unknown): OwnershipView {
  const shares = clampShares(sharesInput);
  const dividendScenario = parseDividendScenario(scenarioInput);
  const fraction = shares / TOTAL_SHARES;
  // One share is exactly 0.1%, so one decimal place is always enough.
  const percentText = `${trimmed(fraction * 100, 1)}%`;
  const dividendGhs = dividendScenario === "pool" ? Math.round(fraction * DIVIDEND_POOL_GHS) : 0;

  const reading =
    shares === 0
      ? "With 0 of the 1,000 shares you own none of the fictional company."
      : `${shares.toLocaleString("en-GB")} of ${TOTAL_SHARES.toLocaleString("en-GB")} shares is ${percentText} of the fictional company — a fraction of the whole, not a fixed amount of money.`;

  const dividendText =
    dividendScenario === "none"
      ? "This year the company decides to pay no dividend, so your share of the payout is 0 cedis. Owning shares does not guarantee a dividend or a gain, and a share's price (not shown here) can fall."
      : `This year the company decides to pay a fictional pool of ${DIVIDEND_POOL_GHS.toLocaleString(
          "en-GB",
        )} cedis. Your ${percentText} would be ${dividendGhs.toLocaleString(
          "en-GB",
        )} cedis. Dividends are usually decided from profits and can be changed or skipped — a decision, not a promise.`;

  return {
    shares,
    total: TOTAL_SHARES,
    fraction,
    percentText,
    dividendScenario,
    dividendGhs,
    reading,
    dividendText,
    summary: `${reading} ${dividendText}`,
  };
}

/**
 * SVG path data for the company mosaic: one path for the highlighted cells and one for the rest, so
 * 1,000 cells cost two DOM nodes. Cells fill left to right, top to bottom.
 */
export function mosaicPaths(owned: number, cell = 10, gap = 2): { ownedD: string; restD: string } {
  const count = clampInt(owned, 0, TOTAL_SHARES, 0);
  const size = cell - gap;
  let ownedD = "";
  let restD = "";
  for (let i = 0; i < TOTAL_SHARES; i += 1) {
    const x = (i % MOSAIC_COLS) * cell;
    const y = Math.floor(i / MOSAIC_COLS) * cell;
    const square = `M${x} ${y}h${size}v${size}h${-size}z`;
    if (i < count) ownedD += square;
    else restD += square;
  }
  return { ownedD, restD };
}
