import { describe, expect, it } from "vitest";
import { sourceById, sources } from "@/content/sources";
import { validateContent } from "@/lib/content-validation";

describe("source registry", () => {
  it("passes schema and cross-reference validation", () => {
    expect(
      validateContent({
        sources,
        lessons: [],
        glossary: [],
        quizzes: [],
        myths: [],
        slides: [],
        labs: [],
      }),
    ).toEqual([]);
  });

  it("records the seven spec §14 references plus the gambling-harm review, with unique ids", () => {
    expect(sources).toHaveLength(8);
    expect(new Set(sources.map((s) => s.id)).size).toBe(8);
    expect(sourceById.get("phe-gambling-harms-review")?.status).toBe("verified");
    expect(sourceById.get("moneysmart-forex")?.pageDate).toContain("10 September 2026");
  });

  it("serves every source over https and never marks one verified without a date", () => {
    for (const source of sources) {
      expect(new URL(source.url).protocol, source.id).toBe("https:");
      expect(source.status === "verified", source.id).toBe(source.reviewedOn !== null);
    }
  });

  it("flags the jurisdiction of every source so it is not read as Ghanaian law", () => {
    for (const source of sources) {
      expect(source.caveat, source.id).toBeTruthy();
    }
  });

  it("contains no gambling-service links (public-sector evidence reviews only)", () => {
    for (const source of sources) {
      expect(new URL(source.url).hostname, source.id).not.toMatch(
        /bet|casino|sportsbook|odds|wager/i,
      );
    }
  });
});
