import type { TopicId } from "@/lib/schemas";

/**
 * Market Observatory palette (VISUAL_DESIGN_GUIDE.md). `app/globals.css` declares the same
 * values in `@theme`; `tests/tokens.test.ts` checks the two stay in sync and that text pairs
 * meet WCAG AA contrast.
 */
export const palette = {
  midnight: "#091225",
  raised: "#111e35",
  ink: "#f4f7fc",
  muted: "#afc0d2",
  /** Control and input borders; kept distinct from the decorative `line` divider colour. */
  edge: "#5b7399",
  forex: "#3ee0cb",
  stocks: "#77b6ff",
  commodities: "#f1bc60",
  crypto: "#b99bff",
  sports: "#e99ba5",
} as const;

export type TopicTone = {
  /** Hex colour used for the topic's identity. Never the sole signal for meaning. */
  color: string;
  /** Tailwind text-colour utility (kept literal so Tailwind can detect it). */
  text: string;
  border: string;
  bg: string;
};

export const topicTone: Record<TopicId, TopicTone> = {
  forex: {
    color: palette.forex,
    text: "text-forex",
    border: "border-forex/60",
    bg: "bg-forex/10",
  },
  stocks: {
    color: palette.stocks,
    text: "text-stocks",
    border: "border-stocks/60",
    bg: "bg-stocks/10",
  },
  commodities: {
    color: palette.commodities,
    text: "text-commodities",
    border: "border-commodities/60",
    bg: "bg-commodities/10",
  },
  crypto: {
    color: palette.crypto,
    text: "text-crypto",
    border: "border-crypto/60",
    bg: "bg-crypto/10",
  },
  "sports-betting": {
    color: palette.sports,
    text: "text-sports",
    border: "border-sports/60",
    bg: "bg-sports/10",
  },
};
