import type { Lab } from "@/lib/schemas";

/**
 * Metadata for the six concept labs (components in components/labs, models in lib/labs). Every lab is
 * a fixed-value toy model with no real transactions, wagers or live data. `sourceIds` list the verified
 * sources behind the real-world risks and definitions a lab mentions; the mechanics shown are general
 * explanation and still need editorial verification before any public release.
 */
export const labs: readonly Lab[] = [
  {
    id: "fx-quote",
    title: "FX Quote Explainer",
    topics: ["forex"],
    concept: "How to read a currency quote and what a rising or falling number means.",
    summary:
      "Switch the base and quote currency and step through a list of invented rates to see what each number means in plain language.",
    limits: "Fictional rates only. Not a live rate, a converter or a trade calculator.",
    usesNumbers: true,
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "leverage-sensitivity",
    title: "Leverage Sensitivity Bands",
    topics: ["forex", "commodities"],
    concept: "Why leverage magnifies the effect of small price moves on your own money.",
    summary:
      "Choose none, some or more abstract leverage and watch the fixed sensitivity bands widen. No level is a safe or recommended one.",
    limits:
      "Abstract bands only. No position sizes, orders, optimisation or guidance on what to choose.",
    usesNumbers: true,
    sourceIds: ["cftc-forex-advisory", "moneysmart-forex"],
  },
  {
    id: "ownership-lens",
    title: "Equity Ownership Lens",
    topics: ["stocks"],
    concept: "A share is a fractional ownership claim, not a guaranteed payout.",
    summary:
      "Adjust a number of hypothetical shares of a 1,000-share fictional company and see the ownership fraction.",
    limits: "Fictional company. No prices, no orders, no purchase flow.",
    usesNumbers: true,
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "supply-shock",
    title: "Commodity Supply Story",
    topics: ["commodities"],
    concept: "How a supply disruption can shift price incentives in a simple model.",
    summary:
      "Toggle a fictional drought or transport delay and see a stylised supply-and-demand diagram move.",
    limits: "Qualitative and synthetic. A teaching model, not a forecast of any real price.",
    usesNumbers: false,
    sourceIds: [],
  },
  {
    id: "ledger-journey",
    title: "Ledger Journey",
    topics: ["crypto"],
    concept: "How a record is proposed, validated and added to a shared ledger.",
    summary:
      "Step forward and back through a toy transaction: request, broadcast, validation and ledger update.",
    limits: "No wallets, keys, addresses, signing or real transfers.",
    usesNumbers: false,
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "uncertainty-tiles",
    title: "Uncertainty Tiles",
    topics: ["sports-betting"],
    accent: "neutral",
    concept:
      "Knowing the mix does not tell you the next tile, and streaks of the same shape are normal.",
    summary:
      "Reveal abstract tiles from fixed sets, replay and reset to see how much short stretches of random draws vary.",
    limits:
      "No sport, stake, payout, odds or wager is modelled or implied. It sits beside the sports-betting lesson only because that lesson discusses streaks and chance.",
    usesNumbers: true,
    sourceIds: [],
  },
];

export const labById: ReadonlyMap<string, Lab> = new Map(labs.map((l) => [l.id, l] as const));

/** Lab metadata by id; throws on an unknown id so a mistyped id fails loudly in development. */
export function getLab(id: string): Lab {
  const lab = labById.get(id);
  if (!lab) throw new Error(`Unknown lab "${id}"`);
  return lab;
}
