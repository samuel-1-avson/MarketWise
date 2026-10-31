import { describe, expect, it } from "vitest";
import { slides } from "@/content/slides";
import { DECK_SESSION_KEY, parseDeckSession } from "@/hooks/useDeckSession";
import {
  REPEATABLE_KEYS,
  deckKeyAction,
  type KeyInput,
  type KeyTarget,
} from "@/lib/presenter/keys";
import {
  HANDOUT_PATH,
  chapterStarts,
  clampSlideIndex,
  detourHref,
  parseReturnTo,
  slideDetour,
  slideHref,
  slideIndexById,
} from "@/lib/presenter/navigation";
import {
  INITIAL_TIMER,
  elapsedMs,
  formatClock,
  parseTimer,
  pauseTimer,
  resetTimer,
  startTimer,
} from "@/lib/presenter/timer";
import { DECK_CHAPTERS, SLIDE_COUNT } from "@/lib/schemas";

const body: KeyTarget = { tag: "BODY", role: null, editable: false };
const press = (
  key: string,
  target: KeyTarget = body,
  mods: Partial<KeyInput> = {},
): ReturnType<typeof deckKeyAction> =>
  deckKeyAction({ key, ctrlKey: false, metaKey: false, altKey: false, target, ...mods });

describe("deck key rules", () => {
  it("maps the documented keys to actions", () => {
    expect(press("ArrowRight")).toBe("next");
    expect(press(" ")).toBe("next");
    expect(press("PageDown")).toBe("next");
    expect(press("ArrowLeft")).toBe("previous");
    expect(press("PageUp")).toBe("previous");
    expect(press("Home")).toBe("first");
    expect(press("End")).toBe("last");
    expect(press("f")).toBe("fullscreen");
    expect(press("F")).toBe("fullscreen");
    expect(press("n")).toBe("notes");
    expect(press("t")).toBe("timer");
    expect(press("c")).toBe("chapters");
    expect(press("?")).toBe("help");
    expect(press("Escape")).toBe("escape");
    expect(press("x")).toBeNull();
    expect(press("Enter")).toBeNull();
  });

  it("never steals keys from typing, sliders or radio groups", () => {
    const targets: KeyTarget[] = [
      { tag: "INPUT", role: null, editable: false, inputType: "text" },
      { tag: "INPUT", role: null, editable: false, inputType: "range" },
      { tag: "INPUT", role: null, editable: false, inputType: "radio" },
      { tag: "TEXTAREA", role: null, editable: false },
      { tag: "SELECT", role: null, editable: false },
      { tag: "DIV", role: null, editable: true },
      { tag: "DIV", role: "slider", editable: false },
      { tag: "DIV", role: "radio", editable: false },
    ];
    for (const target of targets) {
      for (const key of ["ArrowRight", "ArrowLeft", " ", "n", "t", "f", "Home", "End", "?"]) {
        expect(press(key, target), `${target.tag}/${target.role}/${key}`).toBeNull();
      }
    }
  });

  it("lets Space activate a focused button, link or summary instead of advancing", () => {
    for (const tag of ["BUTTON", "A", "SUMMARY"]) {
      expect(press(" ", { tag, role: null, editable: false })).toBeNull();
    }
    expect(press(" ", { tag: "DIV", role: "button", editable: false })).toBeNull();
    // Arrow keys still move slides from a button, which has no arrow behaviour of its own.
    expect(press("ArrowRight", { tag: "BUTTON", role: null, editable: false })).toBe("next");
  });

  it("can switch the single-letter shortcuts off while keeping arrows, Space, Home, End and Esc (WCAG 2.1.4)", () => {
    const off = (key: string) =>
      deckKeyAction({
        key,
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        target: body,
        letterShortcuts: false,
      });
    for (const key of ["f", "F", "n", "N", "t", "T", "c", "C", "?"])
      expect(off(key), key).toBeNull();
    expect(off("ArrowRight")).toBe("next");
    expect(off("ArrowLeft")).toBe("previous");
    expect(off(" ")).toBe("next");
    expect(off("Home")).toBe("first");
    expect(off("End")).toBe("last");
    expect(off("Escape")).toBe("escape");
  });

  it("leaves the paging keys to the scrollable notes panel", () => {
    const inNotes: KeyTarget = { tag: "ASIDE", role: null, editable: false, inScrollRegion: true };
    for (const key of ["PageDown", "PageUp", "Home", "End", " "])
      expect(press(key, inNotes), key).toBeNull();
    // Arrow keys still change slide from inside the notes.
    expect(press("ArrowRight", inNotes)).toBe("next");
  });

  it("only lets the navigation keys auto-repeat", () => {
    for (const key of ["ArrowRight", "ArrowLeft", "PageDown", "PageUp"])
      expect(REPEATABLE_KEYS.has(key), key).toBe(true);
    for (const key of ["n", "t", "f", "c", "?", "Home", "End", "Escape"])
      expect(REPEATABLE_KEYS.has(key), key).toBe(false);
  });

  it("ignores shortcuts combined with Ctrl, Cmd or Alt (browser shortcuts)", () => {
    expect(press("f", body, { ctrlKey: true })).toBeNull();
    expect(press("n", body, { metaKey: true })).toBeNull();
    expect(press("ArrowRight", body, { altKey: true })).toBeNull();
  });
});

describe("timer model", () => {
  it("counts elapsed time across pauses", () => {
    let t = startTimer(INITIAL_TIMER, 1_000);
    expect(elapsedMs(t, 4_500)).toBe(3_500);
    t = pauseTimer(t, 4_500);
    expect(t).toEqual({ accumulatedMs: 3_500, startedAt: null });
    expect(elapsedMs(t, 99_000)).toBe(3_500); // paused: does not move
    t = startTimer(t, 10_000);
    expect(elapsedMs(t, 12_000)).toBe(5_500);
    expect(resetTimer()).toEqual(INITIAL_TIMER);
  });

  it("is idempotent and never negative", () => {
    const started = startTimer(INITIAL_TIMER, 500);
    expect(startTimer(started, 900)).toBe(started);
    expect(pauseTimer(INITIAL_TIMER, 900)).toBe(INITIAL_TIMER);
    expect(elapsedMs({ accumulatedMs: 0, startedAt: 5_000 }, 1_000)).toBe(0); // clock went backwards
  });

  it("formats clocks as mm:ss, adding hours past an hour", () => {
    expect(formatClock(0)).toBe("00:00");
    expect(formatClock(65_000)).toBe("01:05");
    expect(formatClock(59 * 60_000 + 59_000)).toBe("59:59");
    expect(formatClock(3_600_000)).toBe("1:00:00");
    expect(formatClock(-5)).toBe("00:00");
  });

  it("falls back safely on malformed stored data", () => {
    for (const bad of [
      null,
      undefined,
      "x",
      5,
      [],
      { accumulatedMs: -3, startedAt: "no" },
      { accumulatedMs: Number.NaN },
    ]) {
      expect(parseTimer(bad)).toEqual(INITIAL_TIMER);
    }
    expect(parseTimer({ accumulatedMs: 1200, startedAt: 77 })).toEqual({
      accumulatedMs: 1200,
      startedAt: 77,
    });
  });

  it("keeps deck session data valid whatever is stored", () => {
    expect(DECK_SESSION_KEY).toBe("marketwise:deck");
    const fresh = { timer: INITIAL_TIMER, timerOpen: false, letterShortcuts: true };
    expect(parseDeckSession(null)).toEqual(fresh);
    expect(parseDeckSession("not json")).toEqual(fresh);
    const stored = JSON.stringify({
      timer: { accumulatedMs: 5000, startedAt: null },
      timerOpen: "yes",
      letterShortcuts: false,
    });
    expect(parseDeckSession(stored)).toEqual({
      timer: { accumulatedMs: 5000, startedAt: null },
      timerOpen: false,
      letterShortcuts: false,
    });
    // Speaker-notes visibility is never read back from storage, so an old value cannot reopen them.
    expect(parseDeckSession(JSON.stringify({ notesOpen: true }))).toEqual(fresh);
  });
});

describe("deck navigation", () => {
  it("builds deep links for every slide and finds them again", () => {
    slides.forEach((s, i) => {
      expect(slideHref(s.id)).toBe(`/present/${s.id}`);
      expect(slideIndexById(s.id)).toBe(i);
    });
    expect(slideIndexById(undefined)).toBe(0);
    expect(slideIndexById("nope")).toBe(-1);
  });

  it("clamps indexes into 0–23 and survives bad numbers", () => {
    expect(clampSlideIndex(-3)).toBe(0);
    expect(clampSlideIndex(99)).toBe(SLIDE_COUNT - 1);
    expect(clampSlideIndex(Number.NaN)).toBe(0);
    expect(clampSlideIndex(4.4)).toBe(4);
  });

  it("lists the chapters with their first slide and counts that add up to 24", () => {
    const chapters = chapterStarts();
    expect(chapters.map((c) => c.id)).toEqual(DECK_CHAPTERS.map((c) => c.id));
    expect(chapters.reduce((sum, c) => sum + c.count, 0)).toBe(SLIDE_COUNT);
    expect(chapters[0]?.first).toBe(0);
    for (const c of chapters) {
      expect(slides[c.first]?.chapter, c.id).toBe(c.id);
      expect(c.minutes).toMatch(/^\d+–\d+$/);
    }
  });

  it("gives labs priority as a slide's detour and always carries a return path", () => {
    const fx = slides.find((s) => s.labId === "fx-quote");
    if (!fx) throw new Error("expected a slide for the FX lab");
    const detour = slideDetour(fx);
    expect(detour?.href).toBe(`/labs/fx-quote?returnTo=${encodeURIComponent(`/present/${fx.id}`)}`);

    const compare = slides.find((s) => !s.labId && s.relatedRoute === "/compare");
    if (!compare) throw new Error("expected a related-page slide");
    expect(slideDetour(compare)?.href).toContain("returnTo=");
    expect(detourHref("/quiz", compare)).toBe(
      `/quiz?returnTo=${encodeURIComponent(slideHref(compare.id))}`,
    );

    const none = slides.find((s) => !s.labId && !s.relatedRoute);
    expect(none ? slideDetour(none) : null).toBeNull();
  });
});

describe("returnTo validation (no open redirects)", () => {
  const first = slides[0];
  if (!first) throw new Error("no slides");

  it("accepts only a real slide in the deck", () => {
    const ok = parseReturnTo(`/present/${first.id}`);
    expect(ok?.href).toBe(`/present/${first.id}`);
    expect(ok?.slide.number).toBe(1);
  });

  it.each([
    null,
    undefined,
    "",
    "https://evil.example/present/01-forex-sports-betting-suit",
    "//evil.example",
    "javascript:alert(1)",
    "/present/does-not-exist",
    "/present/",
    "/present",
    HANDOUT_PATH,
    "/labs/fx-quote",
    "/present/../admin",
    "/present/01-forex-sports-betting-suit/extra",
    "/present/01-forex-sports-betting-suit?x=1",
    "/PRESENT/01-forex-sports-betting-suit",
  ])("rejects %s", (value) => {
    expect(parseReturnTo(value)).toBeNull();
  });
});
