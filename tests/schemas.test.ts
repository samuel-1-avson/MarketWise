import { describe, expect, it } from "vitest";
import { validateContent, type ContentBundle } from "@/lib/content-validation";
import {
  LESSON_SECTION_KINDS,
  LessonSchema,
  QuizQuestionSchema,
  SLIDE_COUNT,
  SlideSchema,
  SourceSchema,
  countWords,
  slideNotesWordCount,
} from "@/lib/schemas";
import { deck, glossaryTerm, lab, lesson, myth, quiz, slide, source } from "./fixtures";

describe("SourceSchema", () => {
  it("accepts an unverified source with no review date", () => {
    expect(SourceSchema.safeParse(source()).success).toBe(true);
  });

  it("accepts a verified source with a review date", () => {
    expect(
      SourceSchema.safeParse(source({ status: "verified", reviewedOn: "2026-10-30" })).success,
    ).toBe(true);
  });

  it("rejects 'verified' without a date and a date without 'verified'", () => {
    expect(SourceSchema.safeParse(source({ status: "verified", reviewedOn: null })).success).toBe(
      false,
    );
    expect(
      SourceSchema.safeParse(source({ status: "needs-verification", reviewedOn: "2026-10-30" }))
        .success,
    ).toBe(false);
  });

  it("rejects malformed URLs", () => {
    expect(SourceSchema.safeParse(source({ url: "not a url" })).success).toBe(false);
  });
});

describe("LessonSchema", () => {
  it("requires the eleven sections in order", () => {
    expect(LESSON_SECTION_KINDS).toHaveLength(11);
    expect(LessonSchema.safeParse(lesson()).success).toBe(true);

    const swapped = lesson();
    const [first, second] = swapped.sections;
    if (!first || !second) throw new Error("fixture must have sections");
    swapped.sections[0] = second;
    swapped.sections[1] = first;
    expect(LessonSchema.safeParse(swapped).success).toBe(false);

    expect(
      LessonSchema.safeParse(lesson({ sections: lesson().sections.slice(0, 10) })).success,
    ).toBe(false);
  });

  it("requires five check questions and at least three misconceptions", () => {
    expect(LessonSchema.safeParse(lesson({ quizIds: ["q-1", "q-2"] })).success).toBe(false);
    expect(
      LessonSchema.safeParse(lesson({ misconceptions: lesson().misconceptions.slice(0, 2) }))
        .success,
    ).toBe(false);
  });
});

describe("QuizQuestionSchema", () => {
  it("accepts a well-formed three-option question", () => {
    expect(QuizQuestionSchema.safeParse(quiz()).success).toBe(true);
  });

  it("rejects a correct answer that is not an option and duplicate option ids", () => {
    expect(QuizQuestionSchema.safeParse(quiz({ correctOptionId: "d" })).success).toBe(false);
    const dupes = quiz({
      options: [
        { id: "a", text: "x" },
        { id: "a", text: "y" },
        { id: "b", text: "z" },
      ],
    });
    expect(QuizQuestionSchema.safeParse(dupes).success).toBe(false);
  });

  it("requires an explanation for feedback", () => {
    expect(QuizQuestionSchema.safeParse(quiz({ explanation: "  " })).success).toBe(false);
  });
});

describe("SlideSchema", () => {
  it("accepts a valid slide and counts note words", () => {
    const s = slide(1);
    expect(SlideSchema.safeParse(s).success).toBe(true);
    expect(slideNotesWordCount(s.notes)).toBeGreaterThanOrEqual(80);
  });

  it("keeps on-slide text short", () => {
    const wordy = slide(1, { keyMessage: Array.from({ length: 40 }, () => "word").join(" ") });
    expect(SlideSchema.safeParse(wordy).success).toBe(false);
  });

  it("counts words ignoring extra whitespace", () => {
    expect(countWords("  one   two\nthree ")).toBe(3);
    expect(countWords("")).toBe(0);
  });
});

describe("validateContent", () => {
  const base = (): ContentBundle => ({
    sources: [source()],
    lessons: [],
    glossary: [glossaryTerm()],
    quizzes: [quiz()],
    myths: [myth()],
    slides: [],
    labs: [lab()],
  });

  it("passes a consistent bundle", () => {
    expect(validateContent(base())).toEqual([]);
  });

  it("flags unknown source references and duplicate ids", () => {
    const bundle = base();
    bundle.quizzes = [quiz({ sourceIds: ["missing-source"] }), quiz()];
    bundle.glossary = [glossaryTerm({ related: ["nope"] })];
    const problems = validateContent(bundle);
    expect(problems.join("\n")).toContain('unknown source id "missing-source"');
    expect(problems.join("\n")).toContain('unknown related term "nope"');
    expect(problems.join("\n")).toContain('duplicate quiz question id "quiz-one"');
  });

  it("flags lessons that reference missing glossary terms, quizzes or labs", () => {
    const bundle = base();
    bundle.lessons = [lesson({ labId: "ghost-lab" })];
    const text = validateContent(bundle).join("\n");
    expect(text).toContain('unknown glossary term "term-two"');
    expect(text).toContain('unknown quiz question "q-1"');
    expect(text).toContain('unknown lab "ghost-lab"');
  });

  it("requires exactly 24 slides with unique ids, titles and visuals", () => {
    const ok = base();
    ok.slides = deck(SLIDE_COUNT);
    expect(validateContent(ok)).toEqual([]);

    const short = base();
    short.slides = deck(23);
    expect(validateContent(short).join("\n")).toContain("exactly 24 are required");

    const repeated = base();
    const repeatedSlides = deck(SLIDE_COUNT);
    repeatedSlides[1] = slide(2, { id: "slide-1", title: "Slide title 1", visual: "visual-1" });
    repeated.slides = repeatedSlides;
    const text = validateContent(repeated).join("\n");
    expect(text).toContain('duplicate slide id "slide-1"');
    expect(text).toContain('duplicate slide title "Slide title 1"');
    expect(text).toContain('duplicate slide visual "visual-1"');
  });

  it("flags slides whose notes are too thin", () => {
    const bundle = base();
    const slides = deck(SLIDE_COUNT);
    slides[3] = slide(4, {
      notes: {
        teachingPoint: "Too short.",
        explanation: ["One.", "Two."],
        analogy: "Short.",
        misconception: "Short.",
        transition: "Short.",
      },
    });
    bundle.slides = slides;
    expect(validateContent(bundle).join("\n")).toMatch(/slide slide-4: notes have \d+ words/);
  });
});
