import { clampInt } from "./clamp";

/**
 * Uncertainty Tiles model. Abstract tiles drawn from a fixed pseudo-random sequence — the same seed
 * always gives the same tiles, so the lab is deterministic. It has no connection to any sport, stake,
 * payout or prediction; it only shows that streaks of the same tile are normal.
 */
export type Tile = "circle" | "square";
export type TileMix = "even" | "uneven";

export const TILE_COUNT = 60;
export const BLOCK_SIZE = 10;

/** Fixed seeds, one per "set" of tiles. Each was deliberately chosen because it contains a visible streak (a test verifies this), and the lab tells the learner so. */
export const RUN_SEEDS = [7, 19, 42, 77, 101] as const;

/** Share of circles in the bag the tiles are drawn from (with replacement). */
export const MIX_CIRCLE_SHARE: Readonly<Record<TileMix, number>> = { even: 0.5, uneven: 0.8 };

export const MIX_LABELS: Readonly<Record<TileMix, string>> = {
  even: "Even mix: 5 circles and 5 squares in the bag (a description of the bag, not a prediction or odds)",
  uneven:
    "Uneven mix: 8 circles and 2 squares in the bag (a description of the bag, not a prediction or odds)",
};

export function parseTileMix(value: unknown): TileMix {
  return value === "uneven" ? "uneven" : "even";
}

/** Small, well-known seeded generator (mulberry32). Returns numbers in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function runSeed(runIndex: unknown): number {
  const i = clampInt(runIndex, 0, RUN_SEEDS.length - 1, 0);
  return RUN_SEEDS[i] ?? RUN_SEEDS[0];
}

export function generateTiles(seed: number, mixInput: unknown, count = TILE_COUNT): Tile[] {
  const mix = parseTileMix(mixInput);
  const next = mulberry32(seed);
  const n = clampInt(count, 0, 1000, TILE_COUNT);
  return Array.from({ length: n }, () => (next() < MIX_CIRCLE_SHARE[mix] ? "circle" : "square"));
}

export type TileStats = {
  revealed: number;
  total: number;
  circles: number;
  squares: number;
  longest: { tile: Tile | null; length: number };
  /** Circles in each block of ten revealed tiles (the last block may be partial). */
  blocks: readonly { circles: number; size: number }[];
  sequence: string;
  summary: string;
};

export function tileStats(tiles: readonly Tile[], revealedInput: unknown): TileStats {
  const revealed = clampInt(revealedInput, 0, tiles.length, 0);
  const shown = tiles.slice(0, revealed);
  const circles = shown.filter((t) => t === "circle").length;
  const squares = revealed - circles;

  let longest: TileStats["longest"] = { tile: null, length: 0 };
  let run = 0;
  let previous: Tile | null = null;
  for (const tile of shown) {
    run = tile === previous ? run + 1 : 1;
    previous = tile;
    if (run > longest.length) longest = { tile, length: run };
  }

  const blocks: { circles: number; size: number }[] = [];
  for (let start = 0; start < revealed; start += BLOCK_SIZE) {
    const block = shown.slice(start, start + BLOCK_SIZE);
    blocks.push({ circles: block.filter((t) => t === "circle").length, size: block.length });
  }

  const sequence = shown.map((t) => (t === "circle" ? "C" : "S")).join(" ");
  const streakText =
    longest.tile === null
      ? "No tiles revealed yet."
      : `Longest streak so far: ${longest.length} ${longest.tile}${longest.length === 1 ? "" : "s"} in a row.`;
  const summary =
    revealed === 0
      ? `No tiles revealed yet. There are ${tiles.length} tiles in this run.`
      : `Revealed ${revealed} of ${tiles.length} tiles: ${circles} circle${circles === 1 ? "" : "s"} and ${squares} square${
          squares === 1 ? "" : "s"
        }. ${streakText}`;

  return { revealed, total: tiles.length, circles, squares, longest, blocks, sequence, summary };
}
