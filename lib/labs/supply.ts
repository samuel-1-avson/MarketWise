/**
 * Commodity Supply Story model: a stylised linear supply-and-demand diagram on an abstract 0–100
 * scale. Nothing here is calibrated to any real market; it exists only to show the direction in which
 * price pressure moves when supply tightens. The scales are not shown to the learner as numbers.
 */
export type SupplyScenario = "normal" | "drought" | "transport" | "both";

/** How far (in abstract quantity units) the supply line shifts left in each fictional scenario. */
export const SUPPLY_SHIFTS: Readonly<Record<SupplyScenario, number>> = {
  normal: 0,
  drought: 20,
  transport: 10,
  both: 30,
};

export const SUPPLY_LABELS: Readonly<Record<SupplyScenario, string>> = {
  normal: "Normal season",
  drought: "Fictional drought hits the harvest",
  transport: "Fictional transport delay",
  both: "Both at once",
};

/** Demand: P = 100 − 0.8·Q. Supply: P = 20 + 0.6·(Q + shift). */
const DEMAND_INTERCEPT = 100;
const DEMAND_SLOPE = 0.8;
const SUPPLY_INTERCEPT = 20;
const SUPPLY_SLOPE = 0.6;

export function parseSupplyScenario(value: unknown): SupplyScenario {
  return value === "drought" || value === "transport" || value === "both" ? value : "normal";
}

export function demandPrice(q: number): number {
  return DEMAND_INTERCEPT - DEMAND_SLOPE * q;
}

export function supplyPrice(q: number, shift: number): number {
  return SUPPLY_INTERCEPT + SUPPLY_SLOPE * (q + shift);
}

export function equilibrium(shift: number): { q: number; p: number } {
  const q = Math.max(
    0,
    (DEMAND_INTERCEPT - SUPPLY_INTERCEPT - SUPPLY_SLOPE * shift) / (DEMAND_SLOPE + SUPPLY_SLOPE),
  );
  return { q, p: demandPrice(q) };
}

export type SupplyStory = {
  scenario: SupplyScenario;
  label: string;
  shift: number;
  baseline: { q: number; p: number };
  now: { q: number; p: number };
  priceDirection: "unchanged" | "higher";
  quantityDirection: "unchanged" | "lower";
  reading: string;
  caveat: string;
  summary: string;
};

export const SUPPLY_CAVEAT =
  "A teaching model, not a forecast. The chart stands for the price where buyers meet the reduced supply; prices at the farm gate or at the point of origin can move differently. Real prices also respond to inventories, demand, transport costs and expectations, and no one can reliably predict them.";

export function supplyStory(scenarioInput: unknown): SupplyStory {
  const scenario = parseSupplyScenario(scenarioInput);
  const shift = SUPPLY_SHIFTS[scenario];
  const baseline = equilibrium(0);
  const now = equilibrium(shift);
  const priceDirection = now.p > baseline.p + 1e-9 ? "higher" : "unchanged";
  const quantityDirection = now.q < baseline.q - 1e-9 ? "lower" : "unchanged";

  const reading =
    scenario === "normal"
      ? "In a normal season supply and demand meet at the dotted point. Nothing has changed, so there is no extra pressure on price in either direction."
      : `${SUPPLY_LABELS[scenario]}: less of the good reaches the market, so the supply line moves left. Against unchanged demand, the meeting point moves to a higher price and a lower quantity — price pressure points upward, and less is available.`;

  return {
    scenario,
    label: SUPPLY_LABELS[scenario],
    shift,
    baseline,
    now,
    priceDirection,
    quantityDirection,
    reading,
    caveat: SUPPLY_CAVEAT,
    summary: `${reading} ${SUPPLY_CAVEAT}`,
  };
}
