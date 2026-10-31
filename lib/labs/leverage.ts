import { trimmed } from "./clamp";

/**
 * Leverage Sensitivity model. Abstract bands only: there is no input for money, position size or
 * price, and nothing here says which level is sensible. The multipliers are invented teaching values,
 * and the level names are deliberately neutral ("some", "more") so that no level reads as a safe or
 * recommended amount.
 */
export type LeverageLevel = "none" | "some" | "more";

export const LEVERAGE_LEVELS: Readonly<
  Record<LeverageLevel, { label: string; multiplier: number }>
> = {
  none: { label: "None", multiplier: 1 },
  some: { label: "Some", multiplier: 5 },
  more: { label: "More", multiplier: 20 },
};

/** Fixed, fictional price moves (in percent) shown as rows. */
export const FIXED_MOVES = [0.5, 1, 2, 5] as const;

export type LeverageRow = {
  movePct: number;
  /** Effect on the person's own money if the price moves against them, capped at all the money put in. */
  againstPct: number;
  /** The same move going their way. Not capped: a gain is not limited to the amount put in. */
  forPct: number;
  /** True when the against-move uses up all of the money put in (in this toy model). */
  allUsedUp: boolean;
  text: string;
};

export type LeverageBands = {
  level: LeverageLevel;
  label: string;
  multiplier: number;
  rows: readonly LeverageRow[];
  headline: string;
  caveat: string;
};

/** Plain definition shown beside the bands. */
export const LEVERAGE_DEFINITION =
  "Leverage means taking on exposure larger than the money you put in, so a price move is felt as a bigger change in your own money. The moves below are fixed examples: no one can forecast which way a price will go.";

export const LEVERAGE_CAVEAT =
  "This is a toy model. Real products differ: costs such as spreads, fees and financing are left out, a provider may demand more money or close a position, and with some products losses can exceed the money put in. Nothing here says what anyone should choose, and no level is a safe one.";

export function parseLeverageLevel(value: unknown): LeverageLevel {
  return value === "some" || value === "more" ? value : "none";
}

export function leverageBands(levelInput: unknown): LeverageBands {
  const level = parseLeverageLevel(levelInput);
  const { label, multiplier } = LEVERAGE_LEVELS[level];

  const rows = FIXED_MOVES.map((movePct): LeverageRow => {
    const raw = movePct * multiplier;
    const againstPct = Math.min(100, raw);
    const forPct = raw;
    const allUsedUp = raw >= 100;
    const against = allUsedUp
      ? "uses up all of the money put in (in this toy model)"
      : `changes your own money by about ${trimmed(againstPct)}% against you`;
    return {
      movePct,
      againstPct,
      forPct,
      allUsedUp,
      text: `A ${trimmed(movePct)}% price move ${against}, or by about ${trimmed(forPct)}% if it goes your way.`,
    };
  });

  const one = rows.find((r) => r.movePct === 1);
  const headline =
    level === "none"
      ? "With no leverage, a 1% move changes your own money by about 1%, up or down."
      : `With ${multiplier}× sensitivity in this toy model (${label.toLowerCase()} leverage), a 1% move changes your own money by about ${trimmed(
          one?.againstPct ?? multiplier,
        )}%, up or down — the same move is felt ${multiplier} times as strongly.`;

  return { level, label, multiplier, rows, headline, caveat: LEVERAGE_CAVEAT };
}
