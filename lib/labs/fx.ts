import { clampInt, fixed } from "./clamp";

/**
 * FX Quote Explainer model. The five quotes are invented and fixed; there is no input for an amount
 * or a rate, so this can never act as a converter or a trade calculator.
 */
export type FxDirection = "usd-base" | "ghs-base";

/** Invented USD/GHS quotes, in the order the learner steps through them. */
export const FX_STEPS = [9, 9.5, 10, 10.5, 11] as const;
export const FX_DEFAULT_STEP = 2;
export const FX_DEFAULT_DIRECTION: FxDirection = "usd-base";
/** Fictional dealer half-spread, in cedis per dollar. */
export const FX_HALF_SPREAD = 0.05;
/** A fixed, fictional invoice used to show what a quote means in practice. */
export const FX_INVOICE_USD = 10_000;

export type FxQuote = {
  stepIndex: number;
  stepCount: number;
  direction: FxDirection;
  base: "USD" | "GHS";
  quote: "USD" | "GHS";
  pair: string;
  rate: number;
  rateText: string;
  bidText: string;
  askText: string;
  reading: string;
  movement: string;
  invoiceGhs: number;
  invoiceText: string;
  /** Single sentence for the live text equivalent. */
  summary: string;
};

export function parseFxDirection(value: unknown): FxDirection {
  return value === "ghs-base" ? "ghs-base" : "usd-base";
}

/**
 * @param fromInput the quote the learner was looking at just before; the movement text compares
 * against it, in whichever direction they stepped. Omit it for the starting view.
 */
export function fxQuote(stepInput: unknown, directionInput: unknown, fromInput?: unknown): FxQuote {
  const stepCount = FX_STEPS.length;
  const stepIndex = clampInt(stepInput, 0, stepCount - 1, FX_DEFAULT_STEP);
  const direction = parseFxDirection(directionInput);
  const usdGhs = FX_STEPS[stepIndex] ?? FX_STEPS[FX_DEFAULT_STEP];
  const fromIndex =
    fromInput === undefined ? undefined : clampInt(fromInput, 0, stepCount - 1, stepIndex);
  const previousUsdGhs =
    fromIndex === undefined || fromIndex === stepIndex ? undefined : FX_STEPS[fromIndex];

  const usdBase = direction === "usd-base";
  const decimals = usdBase ? 2 : 4;
  const rate = usdBase ? usdGhs : 1 / usdGhs;
  const previousRate =
    previousUsdGhs === undefined ? undefined : usdBase ? previousUsdGhs : 1 / previousUsdGhs;

  // Dealer prices: bid = what the dealer pays for the base currency; ask = what it charges.
  const bid = usdBase ? usdGhs - FX_HALF_SPREAD : 1 / (usdGhs + FX_HALF_SPREAD);
  const ask = usdBase ? usdGhs + FX_HALF_SPREAD : 1 / (usdGhs - FX_HALF_SPREAD);

  const base = usdBase ? "USD" : "GHS";
  const quote = usdBase ? "GHS" : "USD";
  const rateText = fixed(rate, decimals);
  const baseName = usdBase ? "US dollar" : "Ghana cedi";
  const quoteName = usdBase ? "Ghana cedis" : "US dollars";

  const reading = `1 ${baseName} is worth ${rateText} ${quoteName} in this invented example.`;

  let movement: string;
  if (previousUsdGhs === undefined || previousRate === undefined) {
    movement = "Step to another quote in the list to see what a change in the number means.";
  } else {
    const cedisWeaker = usdGhs > previousUsdGhs;
    const numberWord = rate > previousRate ? "rose" : "fell";
    // The quotes are an invented list, not a timeline; stepping either way implies no trend.
    const effect = usdBase
      ? cedisWeaker
        ? "the dollar is worth more cedis"
        : "the dollar is worth fewer cedis"
      : cedisWeaker
        ? "one cedi buys fewer dollars"
        : "one cedi buys more dollars";
    movement = `The number ${numberWord} from ${fixed(previousRate, decimals)} to ${rateText}: ${effect}, so the cedi has ${
      cedisWeaker ? "weakened" : "strengthened"
    } against the dollar.`;
  }

  const invoiceGhs = Math.round(FX_INVOICE_USD * usdGhs);
  const invoiceText = `A fictional ${FX_INVOICE_USD.toLocaleString("en-GB")} US dollar invoice would cost about ${invoiceGhs.toLocaleString(
    "en-GB",
  )} cedis at this quote, before any spread or fees.`;

  return {
    stepIndex,
    stepCount,
    direction,
    base,
    quote,
    pair: `${base}/${quote}`,
    rate,
    rateText,
    bidText: fixed(bid, decimals),
    askText: fixed(ask, decimals),
    reading,
    movement,
    invoiceGhs,
    invoiceText,
    summary: `${base}/${quote} ${rateText}. ${reading} ${movement}`,
  };
}
