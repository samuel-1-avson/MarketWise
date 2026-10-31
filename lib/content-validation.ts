import {
  ComparisonDimensionSchema,
  GlossaryTermSchema,
  LabSchema,
  LessonSchema,
  MythSchema,
  QuizQuestionSchema,
  SLIDE_COUNT,
  SlideSchema,
  SourceSchema,
  slideNotesWordCount,
  type ComparisonDimension,
  type GlossaryTerm,
  type Lab,
  type Lesson,
  type Myth,
  type QuizQuestion,
  type Slide,
  type Source,
} from "@/lib/schemas";

export type ContentBundle = {
  sources: readonly Source[];
  lessons: readonly Lesson[];
  glossary: readonly GlossaryTerm[];
  quizzes: readonly QuizQuestion[];
  myths: readonly Myth[];
  slides: readonly Slide[];
  labs: readonly Lab[];
  comparison?: readonly ComparisonDimension[];
};

/** Minimum on-slide-notes length; PRESENTATION_AND_STREAM_GUIDE.md suggests ~80–130 words. */
export const MIN_NOTES_WORDS = 80;

function duplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const v of values) {
    if (seen.has(v)) dupes.add(v);
    seen.add(v);
  }
  return [...dupes];
}

/**
 * Validates shape and cross-references across the whole content set. Returns human-readable
 * problems; an empty array means the content is internally consistent.
 */
export function validateContent(bundle: ContentBundle): string[] {
  const problems: string[] = [];

  const parseAll = <T>(
    label: string,
    schema: {
      safeParse: (v: unknown) => {
        success: boolean;
        error?: { issues: { path: PropertyKey[]; message: string }[] };
      };
    },
    items: readonly T[],
  ) => {
    items.forEach((item, index) => {
      const result = schema.safeParse(item);
      if (!result.success) {
        for (const issue of result.error?.issues ?? []) {
          problems.push(`${label}[${index}] ${issue.path.map(String).join(".")}: ${issue.message}`);
        }
      }
    });
  };

  parseAll("source", SourceSchema, bundle.sources);
  parseAll("lesson", LessonSchema, bundle.lessons);
  parseAll("glossary", GlossaryTermSchema, bundle.glossary);
  parseAll("quiz", QuizQuestionSchema, bundle.quizzes);
  parseAll("myth", MythSchema, bundle.myths);
  parseAll("slide", SlideSchema, bundle.slides);
  parseAll("lab", LabSchema, bundle.labs);
  parseAll("comparison", ComparisonDimensionSchema, bundle.comparison ?? []);

  const sourceIds = new Set(bundle.sources.map((s) => s.id));
  const glossaryIds = new Set(bundle.glossary.map((g) => g.id));
  const quizIds = new Set(bundle.quizzes.map((q) => q.id));
  const labIds = new Set(bundle.labs.map((l) => l.id));

  const checkSources = (where: string, ids: readonly string[]) => {
    for (const id of ids) {
      if (!sourceIds.has(id)) problems.push(`${where}: unknown source id "${id}"`);
    }
  };

  for (const label of [
    ["source", bundle.sources.map((s) => s.id)],
    ["lesson", bundle.lessons.map((l) => l.id)],
    ["glossary term", bundle.glossary.map((g) => g.id)],
    ["quiz question", bundle.quizzes.map((q) => q.id)],
    ["myth", bundle.myths.map((m) => m.id)],
    ["lab", bundle.labs.map((l) => l.id)],
  ] as const) {
    for (const dupe of duplicates(label[1])) problems.push(`duplicate ${label[0]} id "${dupe}"`);
  }

  for (const lesson of bundle.lessons) {
    const where = `lesson ${lesson.id}`;
    lesson.sections.forEach((s) => checkSources(`${where} section ${s.kind}`, s.sourceIds));
    lesson.misconceptions.forEach((m, i) =>
      checkSources(`${where} misconception ${i + 1}`, m.sourceIds),
    );
    checkSources(`${where} reading list`, lesson.readingSourceIds);
    for (const id of lesson.glossaryTermIds) {
      if (!glossaryIds.has(id)) problems.push(`${where}: unknown glossary term "${id}"`);
    }
    for (const id of lesson.quizIds) {
      if (!quizIds.has(id)) problems.push(`${where}: unknown quiz question "${id}"`);
    }
    if (lesson.labId && !labIds.has(lesson.labId))
      problems.push(`${where}: unknown lab "${lesson.labId}"`);
  }

  for (const term of bundle.glossary) {
    checkSources(`glossary ${term.id}`, term.sourceIds);
    for (const id of term.related) {
      if (!glossaryIds.has(id)) problems.push(`glossary ${term.id}: unknown related term "${id}"`);
    }
  }
  for (const q of bundle.quizzes) checkSources(`quiz ${q.id}`, q.sourceIds);
  for (const l of bundle.labs) checkSources(`lab ${l.id}`, l.sourceIds);
  for (const m of bundle.myths) checkSources(`myth ${m.id}`, m.sourceIds);

  if (bundle.slides.length > 0) {
    if (bundle.slides.length !== SLIDE_COUNT) {
      problems.push(`deck has ${bundle.slides.length} slides; exactly ${SLIDE_COUNT} are required`);
    }
    bundle.slides.forEach((slide, index) => {
      const where = `slide ${slide.id}`;
      if (slide.number !== index + 1)
        problems.push(`${where}: number ${slide.number} out of order (expected ${index + 1})`);
      checkSources(where, slide.sourceIds);
      if (slide.labId && !labIds.has(slide.labId))
        problems.push(`${where}: unknown lab "${slide.labId}"`);
      const words = slideNotesWordCount(slide.notes);
      if (words < MIN_NOTES_WORDS)
        problems.push(`${where}: notes have ${words} words (minimum ${MIN_NOTES_WORDS})`);
    });
    for (const dupe of duplicates(bundle.slides.map((s) => s.id)))
      problems.push(`duplicate slide id "${dupe}"`);
    for (const dupe of duplicates(bundle.slides.map((s) => s.title)))
      problems.push(`duplicate slide title "${dupe}"`);
    for (const dupe of duplicates(bundle.slides.map((s) => s.visual)))
      problems.push(`duplicate slide visual "${dupe}"`);
  }

  return problems;
}
