import { describe, expect, it } from "vitest";
import { clampInt, fixed, trimmed } from "@/lib/labs/clamp";
import { FX_DEFAULT_STEP, FX_STEPS, fxQuote, parseFxDirection } from "@/lib/labs/fx";
import {
  FIXED_MOVES,
  LEVERAGE_LEVELS,
  leverageBands,
  parseLeverageLevel,
} from "@/lib/labs/leverage";
import {
  LEDGER_NODE_COUNT,
  LEDGER_STEP_COUNT,
  ledgerStep,
  parseLedgerScenario,
} from "@/lib/labs/ledger";
import {
  DIVIDEND_POOL_GHS,
  MOSAIC_COLS,
  MOSAIC_ROWS,
  TOTAL_SHARES,
  clampShares,
  mosaicPaths,
  ownership,
} from "@/lib/labs/ownership";
import {
  SUPPLY_SHIFTS,
  demandPrice,
  equilibrium,
  parseSupplyScenario,
  supplyPrice,
  supplyStory,
  type SupplyScenario,
} from "@/lib/labs/supply";
import {
  MIX_CIRCLE_SHARE,
  RUN_SEEDS,
  TILE_COUNT,
  generateTiles,
  mulberry32,
  runSeed,
  tileStats,
} from "@/lib/labs/uncertainty";

/** Awkward values a control, a URL or a bug could produce. */
const BAD_INPUTS: unknown[] = [
  Number.NaN,
  Infinity,
  -Infinity,
  "",
  "   ",
  "abc",
  null,
  undefined,
  {},
  [],
  -5,
  99999,
  "12abc",
  3.7,
];

/** Deep-checks that no value in a result is NaN or Infinity and no string says so. */
function expectFinite(value: unknown, path = "result"): void {
  if (typeof value === "number") expect(Number.isFinite(value), path).toBe(true);
  else if (typeof value === "string")
    expect(value, path).not.toMatch(/NaN|Infinity|undefined|\[object/);
  else if (Array.isArray(value)) value.forEach((v, i) => expectFinite(v, `${path}[${i}]`));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) expectFinite(v, `${path}.${k}`);
}

describe("clampInt / formatting", () => {
  it("keeps every awkward input inside the range", () => {
    for (const bad of BAD_INPUTS) {
      const n = clampInt(bad, 0, 10, 4);
      expect(Number.isInteger(n), String(bad)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(10);
    }
    expect(clampInt("7", 0, 10, 0)).toBe(7);
    expect(clampInt(3.6, 0, 10, 0)).toBe(4);
    expect(clampInt(Number.NaN, 0, 10, 99)).toBe(10);
  });

  it("formats stably", () => {
    expect(fixed(10, 2)).toBe("10.00");
    expect(trimmed(2.5)).toBe("2.5");
    expect(trimmed(20)).toBe("20");
    expect(trimmed(0.5)).toBe("0.5");
  });
});

describe("FX quote model", () => {
  it("reads USD/GHS and GHS/USD from the same invented quote", () => {
    const usd = fxQuote(FX_DEFAULT_STEP, "usd-base");
    expect(usd.pair).toBe("USD/GHS");
    expect(usd.rateText).toBe("10.00");
    expect(usd.reading).toBe("1 US dollar is worth 10.00 Ghana cedis in this invented example.");

    const ghs = fxQuote(FX_DEFAULT_STEP, "ghs-base");
    expect(ghs.pair).toBe("GHS/USD");
    expect(ghs.rateText).toBe("0.1000");
    expect(ghs.rate * usd.rate).toBeCloseTo(1, 10);
  });

  it("keeps bid below ask in both directions (the gap is the spread)", () => {
    for (const direction of ["usd-base", "ghs-base"] as const) {
      for (let step = 0; step < FX_STEPS.length; step += 1) {
        const q = fxQuote(step, direction);
        expect(Number(q.bidText.replace(/,/g, "")), `${direction}/${step}`).toBeLessThan(
          Number(q.askText.replace(/,/g, "")),
        );
      }
    }
  });

  it("describes the same movement consistently from either side", () => {
    const up = fxQuote(3, "usd-base", 2);
    expect(up.movement).toBe(
      "The number rose from 10.00 to 10.50: the dollar is worth more cedis, so the cedi has weakened against the dollar.",
    );

    const flipped = fxQuote(3, "ghs-base", 2);
    expect(flipped.movement).toContain("The number fell from 0.1000 to 0.0952");
    expect(flipped.movement).toContain("one cedi buys fewer dollars");
    expect(flipped.movement).toContain("weakened");
  });

  it("compares with the quote the learner came from, in either direction of stepping", () => {
    const back = fxQuote(1, "usd-base", 3);
    expect(back.movement).toContain("fell from 10.50 to 9.50");
    expect(back.movement).toContain("the dollar is worth fewer cedis");
    expect(back.movement).toContain("strengthened");

    const backFlipped = fxQuote(1, "ghs-base", 3);
    expect(backFlipped.movement).toContain("rose");
    expect(backFlipped.movement).toContain("one cedi buys more dollars");
    expect(backFlipped.movement).toContain("strengthened");
  });

  it("makes no comparison when there is nothing to compare with", () => {
    for (const quote of [fxQuote(2, "usd-base"), fxQuote(2, "usd-base", 2)]) {
      expect(quote.movement).toBe(
        "Step to another quote in the list to see what a change in the number means.",
      );
    }
  });

  it("uses a fixed fictional invoice and never exposes an amount input", () => {
    expect(fxQuote(2, "usd-base").invoiceGhs).toBe(100_000);
    expect(fxQuote(4, "usd-base").invoiceText).toContain("110,000 cedis");
    expect(fxQuote(2, "usd-base").invoiceText).toContain("fictional");
  });

  it("never produces NaN or an out-of-range step for bad input", () => {
    for (const bad of BAD_INPUTS) {
      const q = fxQuote(bad, bad);
      expect(q.stepIndex).toBeGreaterThanOrEqual(0);
      expect(q.stepIndex).toBeLessThan(FX_STEPS.length);
      expectFinite(q);
    }
    expect(parseFxDirection("nonsense")).toBe("usd-base");
  });
});

describe("leverage sensitivity model", () => {
  it("scales effects by the abstract multiplier and caps at the whole deposit", () => {
    const none = leverageBands("none");
    expect(none.rows.map((r) => r.againstPct)).toEqual([0.5, 1, 2, 5]);

    const low = leverageBands("some");
    expect(low.rows.map((r) => r.againstPct)).toEqual([2.5, 5, 10, 25]);

    const high = leverageBands("more");
    expect(high.rows.map((r) => r.againstPct)).toEqual([10, 20, 40, 100]);
    expect(high.rows.map((r) => r.allUsedUp)).toEqual([false, false, false, true]);
    expect(high.rows[3]?.text).toContain("uses up all of the money put in");
  });

  it("amplifies both directions equally and never exceeds 100%", () => {
    for (const level of Object.keys(LEVERAGE_LEVELS) as (keyof typeof LEVERAGE_LEVELS)[]) {
      for (const row of leverageBands(level).rows) {
        expect(row.forPct).toBe(row.againstPct);
        expect(row.againstPct).toBeLessThanOrEqual(100);
      }
    }
    expect(FIXED_MOVES).toEqual([0.5, 1, 2, 5]);
  });

  it("always carries the caveat and defaults safely", () => {
    expect(leverageBands("more").caveat).toContain("Nothing here says what anyone should choose");
    expect(parseLeverageLevel("extreme")).toBe("none");
    expect(parseLeverageLevel("high")).toBe("none"); // old names are no longer valid
    for (const bad of BAD_INPUTS) expectFinite(leverageBands(bad));
  });
});

describe("ownership model", () => {
  it("turns hypothetical shares into a fraction of the fictional company", () => {
    const view = ownership(25, "none");
    expect(view.fraction).toBe(0.025);
    expect(view.percentText).toBe("2.5%");
    expect(view.reading).toContain("25 of 1,000 shares is 2.5%");
    expect(ownership(1000, "none").percentText).toBe("100%");
    expect(ownership(1, "none").percentText).toBe("0.1%");
    expect(ownership(0, "none").reading).toContain("own none");
  });

  it("shows that a dividend is the company's choice, not a guarantee", () => {
    expect(ownership(100, "none").dividendGhs).toBe(0);
    expect(ownership(100, "none").dividendText).toContain("does not guarantee a dividend");
    expect(ownership(100, "pool").dividendGhs).toBe(500);
    expect(ownership(TOTAL_SHARES, "pool").dividendGhs).toBe(DIVIDEND_POOL_GHS);
    expect(ownership(100, "pool").dividendText).toContain("not a promise");
  });

  it("clamps shares to 0–1,000 and survives bad input", () => {
    expect(clampShares(-3)).toBe(0);
    expect(clampShares(5000)).toBe(1000);
    expect(clampShares("250")).toBe(250);
    expect(clampShares(Number.NaN)).toBe(25);
    for (const bad of BAD_INPUTS) expectFinite(ownership(bad, bad));
  });

  it("splits the 1,000-cell mosaic into highlighted and remaining cells", () => {
    expect(MOSAIC_COLS * MOSAIC_ROWS).toBe(TOTAL_SHARES);
    const count = (d: string) => (d.match(/M/g) ?? []).length;
    for (const owned of [0, 1, 25, 999, 1000]) {
      const { ownedD, restD } = mosaicPaths(owned);
      expect(count(ownedD)).toBe(owned);
      expect(count(restD)).toBe(TOTAL_SHARES - owned);
    }
    expect(mosaicPaths(-10).ownedD).toBe("");
  });
});

describe("supply story model", () => {
  const scenarios: SupplyScenario[] = ["normal", "transport", "drought", "both"];

  it("starts at the same meeting point and moves price up and quantity down as supply tightens", () => {
    const base = supplyStory("normal");
    expect(base.priceDirection).toBe("unchanged");
    expect(base.quantityDirection).toBe("unchanged");

    let previous = base.now;
    for (const scenario of scenarios.slice(1)) {
      const story = supplyStory(scenario);
      expect(story.priceDirection, scenario).toBe("higher");
      expect(story.quantityDirection, scenario).toBe("lower");
      expect(story.now.p, scenario).toBeGreaterThan(previous.p);
      expect(story.now.q, scenario).toBeLessThan(previous.q);
      previous = story.now;
    }
  });

  it("places the meeting point on both curves", () => {
    for (const scenario of scenarios) {
      const { shift, now } = supplyStory(scenario);
      expect(supplyPrice(now.q, shift)).toBeCloseTo(now.p, 9);
      expect(demandPrice(now.q)).toBeCloseTo(now.p, 9);
      expect(now.q).toBeGreaterThanOrEqual(0);
      expect(now.p).toBeGreaterThanOrEqual(0);
      expect(now.p).toBeLessThanOrEqual(100);
    }
    expect(SUPPLY_SHIFTS.both).toBe(SUPPLY_SHIFTS.drought + SUPPLY_SHIFTS.transport);
  });

  it("always labels itself a teaching model, not a forecast", () => {
    for (const scenario of scenarios)
      expect(supplyStory(scenario).summary).toContain("not a forecast");
    expect(parseSupplyScenario("flood")).toBe("normal");
    expect(equilibrium(1e6).q).toBe(0);
    for (const bad of BAD_INPUTS) expectFinite(supplyStory(bad));
  });
});

describe("ledger journey model", () => {
  it("walks a valid request through four steps and records it", () => {
    const steps = Array.from({ length: LEDGER_STEP_COUNT }, (_, i) => ledgerStep("valid", i));
    expect(steps.map((s) => s.title)).toEqual([
      "Request",
      "Broadcast",
      "Validation",
      "Ledger update",
    ]);
    expect(steps[0]?.nodes.every((n) => n === "idle")).toBe(true);
    expect(steps[1]?.nodes.every((n) => n === "received")).toBe(true);
    expect(steps[2]?.nodes.every((n) => n === "accepted")).toBe(true);
    expect(steps[2]?.entries).toHaveLength(2);
    expect(steps[3]?.outcome).toBe("recorded");
    expect(steps[3]?.entries).toHaveLength(3);
    expect(steps[3]?.newEntry).toContain("token A is now controlled by Kofi");
  });

  it("rejects a request that breaks the rules and leaves the ledger unchanged", () => {
    const steps = Array.from({ length: LEDGER_STEP_COUNT }, (_, i) => ledgerStep("invalid", i));
    expect(steps[2]?.nodes.every((n) => n === "rejected")).toBe(true);
    expect(steps[3]?.outcome).toBe("rejected");
    expect(steps[3]?.entries).toHaveLength(2);
    expect(steps[3]?.newEntry).toBeNull();
    expect(steps[3]?.happening).toContain("token A is still controlled by Ama");
  });

  it("explains a real-world risk at every step", () => {
    for (let i = 0; i < LEDGER_STEP_COUNT; i += 1)
      expect(ledgerStep("valid", i).watchOut.length).toBeGreaterThan(40);
    expect(ledgerStep("valid", 2).watchOut).toContain("mistake or part of a scam");
  });

  it("has five nodes, clamps the step and has no wallet, key or address vocabulary", () => {
    expect(ledgerStep("valid", 0).nodes).toHaveLength(LEDGER_NODE_COUNT);
    expect(ledgerStep("valid", 99).index).toBe(LEDGER_STEP_COUNT - 1);
    expect(ledgerStep("valid", -4).index).toBe(0);
    expect(parseLedgerScenario("other")).toBe("valid");
    for (const bad of BAD_INPUTS) expectFinite(ledgerStep(bad, bad));
    const text = JSON.stringify(
      [0, 1, 2, 3].flatMap((i) => [ledgerStep("valid", i), ledgerStep("invalid", i)]),
    );
    expect(text).not.toMatch(
      /wallet|private key|seed phrase|address|0x[0-9a-f]{4}|sign(ing)? (a )?transaction|connect/i,
    );
  });
});

describe("uncertainty tiles model", () => {
  it("is deterministic: same seed and mix give the same tiles", () => {
    expect(generateTiles(7, "even")).toEqual(generateTiles(7, "even"));
    expect(generateTiles(7, "even")).not.toEqual(generateTiles(19, "even"));
    expect(generateTiles(7, "even")).not.toEqual(generateTiles(7, "uneven"));
    const a = mulberry32(5);
    const b = mulberry32(5);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("produces the right number of tiles with plausible mixes", () => {
    for (const seed of RUN_SEEDS) {
      const even = generateTiles(seed, "even", 600);
      const share = even.filter((t) => t === "circle").length / even.length;
      expect(Math.abs(share - MIX_CIRCLE_SHARE.even)).toBeLessThan(0.08);
      const uneven = generateTiles(seed, "uneven", 600);
      const unevenShare = uneven.filter((t) => t === "circle").length / uneven.length;
      expect(Math.abs(unevenShare - MIX_CIRCLE_SHARE.uneven)).toBeLessThan(0.08);
    }
    expect(generateTiles(7, "even")).toHaveLength(TILE_COUNT);
  });

  it("every fixed run shows a visible streak, so the lesson 'streaks are normal' is demonstrated", () => {
    for (const seed of RUN_SEEDS) {
      const stats = tileStats(generateTiles(seed, "even"), TILE_COUNT);
      expect(stats.longest.length, `seed ${seed}`).toBeGreaterThanOrEqual(4);
    }
  });

  it("counts revealed tiles, runs and blocks correctly", () => {
    const tiles = ["circle", "circle", "circle", "square", "circle", "square", "square"] as const;
    const stats = tileStats(tiles, 7);
    expect(stats.circles).toBe(4);
    expect(stats.squares).toBe(3);
    expect(stats.longest).toEqual({ tile: "circle", length: 3 });
    expect(stats.sequence).toBe("C C C S C S S");
    expect(stats.blocks).toEqual([{ circles: 4, size: 7 }]);
    expect(tileStats(tiles, 0).summary).toContain("No tiles revealed yet");
    expect(tileStats(tiles, 3).summary).toContain("3 circles and 0 squares");
  });

  it("clamps how many tiles are revealed and survives bad input", () => {
    const tiles = generateTiles(7, "even");
    expect(tileStats(tiles, 1000).revealed).toBe(TILE_COUNT);
    expect(tileStats(tiles, -1).revealed).toBe(0);
    expect(runSeed(99)).toBe(RUN_SEEDS[RUN_SEEDS.length - 1]);
    for (const bad of BAD_INPUTS) {
      expectFinite(tileStats(generateTiles(runSeed(bad), bad), bad));
    }
  });

  it("contains no wagering vocabulary", () => {
    const text = JSON.stringify(tileStats(generateTiles(7, "even"), 30));
    expect(text).not.toMatch(/\b(bet|wager|odds|payout|stake|win|lose|profit|prediction)\b/i);
  });
});
