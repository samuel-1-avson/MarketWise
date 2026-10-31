import type { LessonSection, LessonSectionKind } from "@/lib/schemas";

type SectionExtras = Partial<Omit<LessonSection, "kind" | "heading" | "paragraphs">>;

/** Builds a lesson section with sensible defaults so topic files stay readable. */
export function section(
  kind: LessonSectionKind,
  heading: string,
  paragraphs: string[],
  extras: SectionExtras = {},
): LessonSection {
  return { kind, heading, paragraphs, usesIllustrativeNumbers: false, sourceIds: [], ...extras };
}

/** Date every lesson was last reviewed against its cited sources (set when the pages were read). */
export const REVIEWED = "2026-10-30";
