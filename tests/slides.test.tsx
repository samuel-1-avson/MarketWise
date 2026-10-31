import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Handout } from "@/components/presenter/Handout";
import { sceneComponents } from "@/components/presenter/scenes/registry";
import { SlideFace } from "@/components/presenter/SlideFace";
import { labs } from "@/content/labs";
import { sceneDescription } from "@/content/sceneText";
import { slides } from "@/content/slides";
import { sources } from "@/content/sources";
import { lessons } from "@/content/topics";
import { validateContent } from "@/lib/content-validation";
import { ILLUSTRATIVE_LABEL } from "@/lib/constants";
import { primaryNav } from "@/lib/routes";
import {
  DECK_CHAPTERS,
  SLIDE_COUNT,
  countWords,
  slideNotesText,
  slideNotesWordCount,
} from "@/lib/schemas";

const knownRoutes = new Set<string>([
  ...primaryNav.map((n) => n.href),
  ...lessons.map((l) => `/explore/${l.id}`),
  ...labs.map((l) => `/labs/${l.id}`),
]);

describe("the 24-slide deck content", () => {
  it("has exactly 24 slides, numbered 1–24 in order, with unique ids, titles and visuals", () => {
    expect(slides).toHaveLength(SLIDE_COUNT);
    expect(slides.map((s) => s.number)).toEqual(
      Array.from({ length: SLIDE_COUNT }, (_, i) => i + 1),
    );
    for (const field of ["id", "title", "visual", "keyMessage"] as const) {
      expect(new Set(slides.map((s) => s[field])).size, field).toBe(SLIDE_COUNT);
    }
  });

  it("follows the storyboard titles in specification section 8", () => {
    expect(slides.map((s) => s.title.replace(/[“”"]/g, ""))).toEqual([
      "Is Forex Sports Betting in a Suit?",
      "Tonight's Promise",
      "What Is a Market?",
      "One Word: Risk",
      "Forex in 60 Seconds",
      "Who Needs Forex?",
      "Why FX Rates Change",
      "FX Reality Check",
      "Stocks in 60 Seconds",
      "Who Moves Stock Prices?",
      "Commodities in Real Life",
      "Spot Is Not Futures",
      "When Supply Changes",
      "Crypto: More Than a Chart",
      "Crypto's Special Risks",
      "Sports Betting: What It Is",
      "Why It Is Different",
      "Where People Get Confused",
      "Myth: Research Guarantees Profit",
      "Hidden Frictions",
      "Different Risks, No Easy Money",
      "Test Your Understanding",
      "Five Takeaways",
      "Keep Learning",
    ]);
  });

  it("groups slides into the seven chapters of the run of show, in order", () => {
    const chapters = DECK_CHAPTERS.map((c) => c.id);
    const counts = chapters.map((id) => slides.filter((s) => s.chapter === id).length);
    expect(counts).toEqual([4, 4, 2, 3, 2, 3, 6]);
    expect(slides.map((s) => chapters.indexOf(s.chapter as (typeof chapters)[number]))).toEqual(
      [...slides.map((s) => chapters.indexOf(s.chapter as (typeof chapters)[number]))].sort(
        (a, b) => a - b,
      ),
    );
  });

  it("passes the shared content validator (shape, sources, labs, notes length)", () => {
    expect(
      validateContent({
        sources,
        lessons,
        glossary: [],
        quizzes: [],
        myths: [],
        slides,
        labs,
      }).filter((p) => /slide/i.test(p)),
    ).toEqual([]);
  });

  it("gives every slide substantial, structured speaker notes", () => {
    for (const s of slides) {
      const words = slideNotesWordCount(s.notes);
      expect(words, `${s.id} notes`).toBeGreaterThanOrEqual(110);
      expect(words, `${s.id} notes`).toBeLessThanOrEqual(260);
      expect(s.notes.explanation.length, s.id).toBeGreaterThanOrEqual(2);
      expect(slideNotesText(s.notes), s.id).toContain(s.notes.transition);
    }
  });

  it("keeps on-slide text short and cues present", () => {
    for (const s of slides) {
      expect(countWords(s.keyMessage), `${s.id} keyMessage`).toBeLessThanOrEqual(28);
      expect(s.speakerCue.length, s.id).toBeGreaterThan(8);
      expect(s.interactiveCue.length, s.id).toBeGreaterThan(8);
    }
  });

  it("only links to labs and pages that exist", () => {
    const labIds = new Set(labs.map((l) => l.id));
    for (const s of slides) {
      if (s.labId) expect(labIds.has(s.labId), `${s.id} lab`).toBe(true);
      if (s.relatedRoute)
        expect(knownRoutes.has(s.relatedRoute), `${s.id} route ${s.relatedRoute}`).toBe(true);
    }
    // Every lab is reachable from at least one slide.
    for (const lab of labs)
      expect(
        slides.some((s) => s.labId === lab.id),
        lab.id,
      ).toBe(true);
  });

  it("registers exactly one scene per slide and no orphans", () => {
    expect(Object.keys(sceneComponents).sort()).toEqual(slides.map((s) => s.visual).sort());
  });

  it("cites only sources that were actually verified", () => {
    for (const s of slides) {
      for (const id of s.sourceIds) {
        expect(sources.find((x) => x.id === id)?.status, `${s.id}/${id}`).toBe("verified");
      }
    }
  });
});

describe("deck safety", () => {
  const text = JSON.stringify(slides);

  it("contains no gambling-industry terms, promotions or instructions to trade or bet", () => {
    expect(text).not.toMatch(
      /sportsbook|bookmaker|bookie|parlay|accumulator|free bet|welcome bonus|promo(tion)? code/i,
    );
    expect(text).not.toMatch(
      /start trading|join now|make money fast|sign up now|buy now|sell now/i,
    );
  });

  it("mentions odds, payouts, stakes or placing wagers only to exclude them", () => {
    const sentences = text.split(/(?<=[.!?])\s+/);
    for (const s of sentences.filter((x) =>
      /\bodds\b|\bpayouts?\b|place (a|your) (bet|wager)|how to bet/i.test(x),
    )) {
      expect(s, s).toMatch(/\b(no|not|never|without|nor)\b/i);
    }
  });

  it("makes no guarantee claims outside of negation or correction", () => {
    expect(text).not.toMatch(
      /risk-free (way|investment)|guaranteed (profit|return|income)(?!.*(not|never|nobody|no one|myth|warning))/i,
    );
  });

  it("never states a live price or rate as fact, only to say there is none", () => {
    const sentences = text.split(/(?<=[.!?])\s+/);
    for (const s of sentences.filter((x) =>
      /today's (rate|price)|current(ly)? (rate|price)|live (rate|price)/i.test(x),
    )) {
      expect(s, s).toMatch(/\b(not|no|never|fictional|invented)\b/i);
    }
  });

  it("makes no regulatory or legal statement about Ghana or anywhere else", () => {
    expect(text).not.toMatch(
      /is (legal|illegal|licensed|regulated|banned|permitted) in |ghana('s)? (law|regulat|securities|central bank)/i,
    );
  });
});

describe("scenes", () => {
  it.each(slides.map((s) => [s.id, s] as const))(
    "%s renders an accessible picture with its fiction label where it shows invented numbers",
    (_id, slide) => {
      const { container, unmount } = render(<SlideFace slide={slide} />);
      const svg = container.querySelector("svg[role='img']");
      expect(svg, "scene svg").not.toBeNull();
      const description = sceneDescription(slide.visual);
      expect(description.length).toBeGreaterThan(60);
      expect(svg).toHaveAccessibleName(description);
      for (const el of container.querySelectorAll("[font-size]")) {
        expect(Number(el.getAttribute("font-size")), slide.id).toBeGreaterThanOrEqual(28);
      }
      expect(container.querySelector("h1")?.textContent).toBe(slide.title);
      expect(container.textContent).toContain(slide.keyMessage);

      const sceneText = svg?.textContent ?? "";
      expect(sceneText).not.toMatch(/\bNaN\b|\bundefined\b|\[object/);
      const showsNumbers = /\d{1,3}(,\d{3})+|\d+\.\d{2}|\d+%/.test(sceneText);
      if (showsNumbers)
        expect(sceneText, `${slide.id} shows numbers`).toContain(ILLUSTRATIVE_LABEL);
      unmount();
    },
  );

  it("never puts speaker notes on the slide face (safe to broadcast)", () => {
    for (const s of slides) {
      const { container, unmount } = render(<SlideFace slide={s} />);
      for (const private_ of [
        s.notes.teachingPoint,
        s.notes.analogy,
        s.notes.misconception,
        s.notes.transition,
        ...s.notes.explanation,
      ]) {
        expect(container.textContent, s.id).not.toContain(private_);
      }
      unmount();
    }
  });
});

describe("handout", () => {
  it("lists all 24 slides with their messages and sources, without notes by default", () => {
    const { container } = render(<Handout />);
    expect(container.querySelectorAll("article")).toHaveLength(SLIDE_COUNT);
    expect(container.textContent).toContain(slides[0]?.keyMessage);
    expect(container.textContent).toContain("What the picture shows");
    expect(container.textContent).toContain(sceneDescription(slides[0]?.visual ?? "").slice(0, 48));
    expect(container.textContent).not.toContain(slides[0]?.notes.teachingPoint);
    expect(container.querySelectorAll("a[href^='/resources#']").length).toBeGreaterThan(10);
  });

  it("gives every 'Open this slide' link a distinct accessible name", () => {
    const { container } = render(<Handout />);
    const names = [
      ...container.querySelectorAll(
        "a[href^='/present/0'], a[href^='/present/1'], a[href^='/present/2']",
      ),
    ].map((a) => a.textContent);
    expect(new Set(names).size).toBe(SLIDE_COUNT);
  });
});
