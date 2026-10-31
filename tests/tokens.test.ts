import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, hexToRgb } from "@/lib/contrast";
import { TOPIC_IDS } from "@/lib/schemas";
import { palette, topicTone } from "@/lib/tokens";

const css = readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8");

/** Blend a foreground at the given alpha over an opaque background (for tinted chips). */
function blend(fg: string, bg: string, alpha: number): string {
  const f = hexToRgb(fg);
  const b = hexToRgb(bg);
  const mix = f.map((c, i) => Math.round(c * alpha + (b[i] ?? 0) * (1 - alpha)));
  return `#${mix.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

describe("design tokens", () => {
  it("keeps globals.css @theme values identical to lib/tokens.ts", () => {
    const expected: Record<string, string> = {
      "--color-midnight": palette.midnight,
      "--color-raised": palette.raised,
      "--color-ink": palette.ink,
      "--color-muted": palette.muted,
      "--color-edge": palette.edge,
      "--color-forex": palette.forex,
      "--color-stocks": palette.stocks,
      "--color-commodities": palette.commodities,
      "--color-crypto": palette.crypto,
      "--color-sports": palette.sports,
    };
    for (const [name, hex] of Object.entries(expected)) {
      expect(css, name).toMatch(new RegExp(`${name}:\\s*${hex};`, "i"));
    }
  });

  it("matches the palette in VISUAL_DESIGN_GUIDE.md", () => {
    expect(palette).toMatchObject({
      midnight: "#091225",
      raised: "#111e35",
      ink: "#f4f7fc",
      muted: "#afc0d2",
      forex: "#3ee0cb",
      stocks: "#77b6ff",
      commodities: "#f1bc60",
      crypto: "#b99bff",
      sports: "#e99ba5",
    });
  });
});

describe("colour contrast (WCAG 2.2 AA)", () => {
  const surfaces = { midnight: palette.midnight, raised: palette.raised };

  it.each(Object.entries(surfaces))("body and secondary text pass on %s", (_name, bg) => {
    expect(contrastRatio(palette.ink, bg)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(palette.muted, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(TOPIC_IDS)("topic colour for %s passes as text on both surfaces", (topic) => {
    const { color } = topicTone[topic];
    for (const bg of Object.values(surfaces)) {
      expect(contrastRatio(color, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(TOPIC_IDS)("topic colour for %s passes on its own tinted card", (topic) => {
    const { color } = topicTone[topic];
    expect(contrastRatio(color, blend(color, palette.midnight, 0.1))).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(palette.muted, blend(color, palette.midnight, 0.1)),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each(Object.entries(surfaces))(
    "control borders meet 3:1 non-text contrast on %s",
    (_name, bg) => {
      // WCAG 1.4.11: the boundary of an input or button must be perceivable.
      expect(contrastRatio(palette.edge, bg)).toBeGreaterThanOrEqual(3);
    },
  );

  it("keeps the primary button text readable and the focus ring visible", () => {
    expect(contrastRatio(palette.midnight, palette.forex)).toBeGreaterThanOrEqual(7);
    // Focus indicator needs ≥ 3:1 against adjacent surfaces (WCAG 1.4.11).
    for (const bg of Object.values(surfaces)) {
      expect(contrastRatio(palette.forex, bg)).toBeGreaterThanOrEqual(3);
    }
  });
});
