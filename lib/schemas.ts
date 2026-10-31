import { z } from "zod";

/**
 * Content schemas. Copy, sources, quizzes and slide definitions live in `content/` as typed data
 * validated against these shapes; components only render them. See PRODUCT_AND_BUILD_SPEC.md §10.
 */

export const TOPIC_IDS = ["forex", "stocks", "commodities", "crypto", "sports-betting"] as const;
export const TopicIdSchema = z.enum(TOPIC_IDS);
export type TopicId = z.infer<typeof TopicIdSchema>;

const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab-case slug");
const IsoDateSchema = z.iso.date();
const NonEmpty = z.string().trim().min(1);

/* ------------------------------------------------------------------ sources */

export const SourceSchema = z
  .object({
    id: SlugSchema,
    title: NonEmpty,
    url: z.url(),
    publisher: NonEmpty,
    /** What this source is used to support (kept short so claims map to sources clearly). */
    supports: NonEmpty,
    /** Any "last updated / published" date the page itself displays, exactly as shown. */
    pageDate: z.string().optional(),
    /** Date an editor confirmed the page loads and supports the cited claims; null until then. */
    reviewedOn: IsoDateSchema.nullable(),
    status: z.enum(["verified", "needs-verification"]),
    /** Jurisdiction or date caveats an editor should keep in view. */
    caveat: z.string().optional(),
  })
  .refine((s) => (s.status === "verified") === (s.reviewedOn !== null), {
    message: "reviewedOn must be set exactly when status is 'verified'",
    path: ["reviewedOn"],
  });
export type Source = z.infer<typeof SourceSchema>;

/* ------------------------------------------------------------------ lessons */

/** The eleven sections every module carries, in this order (spec §9). */
export const LESSON_SECTION_KINDS = [
  "headline",
  "object",
  "purpose",
  "participants",
  "mechanism",
  "influences",
  "narrative",
  "misconceptions",
  "risks",
  "check",
  "summary",
] as const;
export const LessonSectionKindSchema = z.enum(LESSON_SECTION_KINDS);
export type LessonSectionKind = z.infer<typeof LessonSectionKindSchema>;

export const LessonSectionSchema = z.object({
  kind: LessonSectionKindSchema,
  heading: NonEmpty,
  paragraphs: z.array(NonEmpty).min(1),
  points: z.array(NonEmpty).optional(),
  callout: z.object({ label: NonEmpty, text: NonEmpty }).optional(),
  /** True when the section quotes fictional numbers; the page must show the illustrative label. */
  usesIllustrativeNumbers: z.boolean().default(false),
  sourceIds: z.array(SlugSchema).default([]),
});
export type LessonSection = z.infer<typeof LessonSectionSchema>;

export const MisconceptionSchema = z.object({
  claim: NonEmpty,
  correction: NonEmpty,
  sourceIds: z.array(SlugSchema).default([]),
});
export type Misconception = z.infer<typeof MisconceptionSchema>;

export const ActorSchema = z.object({
  name: NonEmpty,
  role: NonEmpty,
});

export const LessonSchema = z
  .object({
    id: TopicIdSchema,
    title: NonEmpty,
    /** Short label above the title, e.g. "Currency exchange". */
    kicker: NonEmpty,
    summary: NonEmpty,
    /** Three at-a-glance lines shown on cards and at the top of the lesson. */
    snapshot: z.object({ changesHands: NonEmpty, purpose: NonEmpty, mainRisk: NonEmpty }),
    lastReviewed: IsoDateSchema,
    /**
     * Honest editorial status: which parts are drawn from the cited sources and which are general
     * explanation that still needs a source before publication.
     */
    reviewNote: NonEmpty,
    sections: z.array(LessonSectionSchema).length(LESSON_SECTION_KINDS.length),
    actors: z.array(ActorSchema).min(3),
    misconceptions: z.array(MisconceptionSchema).min(3),
    glossaryTermIds: z.array(SlugSchema).min(5),
    quizIds: z.array(SlugSchema).length(5),
    readingSourceIds: z.array(SlugSchema).min(1),
    labId: SlugSchema.optional(),
  })
  .superRefine((lesson, ctx) => {
    lesson.sections.forEach((section, index) => {
      if (section.kind !== LESSON_SECTION_KINDS[index]) {
        ctx.addIssue({
          code: "custom",
          message: `section ${index + 1} must be "${LESSON_SECTION_KINDS[index]}", received "${section.kind}"`,
          path: ["sections", index, "kind"],
        });
      }
    });
  });
export type Lesson = z.infer<typeof LessonSchema>;

/* ------------------------------------------------------------- quiz & myths */

export const QuizOptionSchema = z.object({
  id: z.enum(["a", "b", "c", "d"]),
  text: NonEmpty,
});

export const QuizQuestionSchema = z
  .object({
    id: SlugSchema,
    topic: z.union([TopicIdSchema, z.literal("cross-system")]),
    prompt: NonEmpty,
    options: z.array(QuizOptionSchema).min(3).max(4),
    correctOptionId: z.enum(["a", "b", "c", "d"]),
    /** Factual correction shown after answering — right or wrong. */
    explanation: NonEmpty,
    sourceIds: z.array(SlugSchema).default([]),
  })
  .superRefine((q, ctx) => {
    const ids = q.options.map((o) => o.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: "custom", message: "option ids must be unique", path: ["options"] });
    }
    if (!ids.includes(q.correctOptionId)) {
      ctx.addIssue({
        code: "custom",
        message: "correctOptionId must match one of the options",
        path: ["correctOptionId"],
      });
    }
  });
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const MythSchema = z.object({
  id: SlugSchema,
  topic: z.union([TopicIdSchema, z.literal("cross-system")]),
  claim: NonEmpty,
  verdict: z.enum(["False", "Misleading", "Incomplete"]),
  correction: NonEmpty,
  explanation: NonEmpty,
  sourceIds: z.array(SlugSchema).default([]),
});
export type Myth = z.infer<typeof MythSchema>;

/* --------------------------------------------------------------- comparison */

export const ComparisonDimensionSchema = z
  .object({
    id: SlugSchema,
    label: NonEmpty,
    question: NonEmpty,
    /** One short plain-language answer per system (≈25 words at most). */
    cells: z.record(TopicIdSchema, NonEmpty),
  })
  .superRefine((dim, ctx) => {
    for (const topic of TOPIC_IDS) {
      const cell = dim.cells[topic];
      if (!cell) {
        ctx.addIssue({
          code: "custom",
          message: `missing cell for "${topic}"`,
          path: ["cells", topic],
        });
      } else if (cell.split(/\s+/).length > 30) {
        ctx.addIssue({
          code: "custom",
          message: `cell for "${topic}" is too long`,
          path: ["cells", topic],
        });
      }
    }
  });
export type ComparisonDimension = z.infer<typeof ComparisonDimensionSchema>;

/* ----------------------------------------------------------------- glossary */

export const GlossaryTermSchema = z.object({
  id: SlugSchema,
  term: NonEmpty,
  definition: NonEmpty,
  topics: z.array(TopicIdSchema).default([]),
  related: z.array(SlugSchema).default([]),
  sourceIds: z.array(SlugSchema).default([]),
});
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;
/** Shape authors write; optional lists default to empty when parsed. */
export type GlossaryTermInput = z.input<typeof GlossaryTermSchema>;

/* --------------------------------------------------------------------- labs */

export const LabSchema = z.object({
  id: SlugSchema,
  title: NonEmpty,
  topics: z.array(TopicIdSchema).min(1),
  concept: NonEmpty,
  summary: NonEmpty,
  /** What the model deliberately does not do. Always shown beside the lab. */
  limits: NonEmpty,
  usesNumbers: z.boolean(),
  /** Colour/glyph identity on cards; "neutral" for a lab that must not look tied to one system. */
  accent: z.union([TopicIdSchema, z.literal("neutral")]).optional(),
  /** Verified sources behind the real-world claims the lab mentions (risks, definitions). */
  sourceIds: z.array(SlugSchema).default([]),
});
export type Lab = z.infer<typeof LabSchema>;

/* ------------------------------------------------------------------- slides */

export const SLIDE_COUNT = 24;

/** Chapters with the suggested talk pacing from PRESENTATION_AND_STREAM_GUIDE.md (pacing, not data). */
export const DECK_CHAPTERS = [
  { id: "hook", label: "Hook and mental models", minutes: "5–8" },
  { id: "forex", label: "Forex", minutes: "7–10" },
  { id: "stocks", label: "Stocks", minutes: "4–6" },
  { id: "commodities", label: "Commodities", minutes: "5–8" },
  { id: "crypto", label: "Crypto", minutes: "4–7" },
  { id: "comparison", label: "Sports comparison", minutes: "5–8" },
  { id: "synthesis", label: "Myths and synthesis", minutes: "9–13" },
] as const;
export const ChapterIdSchema = z.enum(DECK_CHAPTERS.map((c) => c.id) as [string, ...string[]]);

export const SlideNotesSchema = z.object({
  teachingPoint: NonEmpty,
  explanation: z.array(NonEmpty).min(2).max(4),
  analogy: NonEmpty,
  misconception: NonEmpty,
  transition: NonEmpty,
  audienceQuestion: z.string().optional(),
});
export type SlideNotes = z.infer<typeof SlideNotesSchema>;

export const SlideSchema = z.object({
  id: SlugSchema,
  number: z.number().int().min(1).max(SLIDE_COUNT),
  chapter: ChapterIdSchema,
  title: NonEmpty,
  tagline: z.string().optional(),
  /** One on-slide sentence; long detail belongs in the notes (≈25 words at most). */
  keyMessage: NonEmpty.refine(
    (s) => s.split(/\s+/).length <= 28,
    "keep on-slide text near 25 words",
  ),
  /** Identifier of the signature scene component rendered for this slide. */
  visual: SlugSchema,
  speakerCue: NonEmpty,
  interactiveCue: NonEmpty,
  notes: SlideNotesSchema,
  labId: SlugSchema.optional(),
  relatedRoute: z.string().startsWith("/").optional(),
  sourceIds: z.array(SlugSchema).default([]),
  /**
   * Honest source status for the presenter: which statements the cited sources support and which are
   * general explanation still needing editorial verification. Shown with the notes, never on the slide.
   */
  sourceNote: z.string().optional(),
});
export type Slide = z.infer<typeof SlideSchema>;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function slideNotesText(notes: SlideNotes): string {
  return [
    notes.teachingPoint,
    ...notes.explanation,
    notes.analogy,
    notes.misconception,
    notes.transition,
    notes.audienceQuestion ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function slideNotesWordCount(notes: SlideNotes): number {
  return countWords(slideNotesText(notes));
}
