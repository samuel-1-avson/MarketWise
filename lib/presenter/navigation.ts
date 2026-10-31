import { slides } from "@/content/slides";
import { DECK_CHAPTERS, SLIDE_COUNT, type Slide } from "@/lib/schemas";

/** Slide hrefs and the lab/section round trip. Pure so the rules are testable. */

export const DECK_PATH = "/present";
export const HANDOUT_PATH = "/present/handout";

/** True for the live deck (`/present`, `/present/<slide>`), which owns the whole screen. */
export function isImmersivePath(pathname: string): boolean {
  return (
    (pathname === DECK_PATH || pathname.startsWith(`${DECK_PATH}/`)) && pathname !== HANDOUT_PATH
  );
}

/**
 * Move focus to the main landmark after a real page change. Slide-to-slide updates inside the live
 * deck also change the URL, and must not pull focus out of the notes, the text version, or the buttons.
 */
export function shouldFocusMain(previous: string, next: string, hasHash: boolean): boolean {
  if (hasHash) return false;
  if (isImmersivePath(previous) && isImmersivePath(next)) return false;
  return true;
}

export function slideHref(slideId: string): string {
  return `${DECK_PATH}/${slideId}`;
}

export function slideIndexById(id: string | undefined): number {
  if (!id) return 0;
  return slides.findIndex((s) => s.id === id);
}

export function clampSlideIndex(index: number): number {
  if (!Number.isFinite(index)) return 0;
  return Math.min(SLIDE_COUNT - 1, Math.max(0, Math.round(index)));
}

/** Link to a lab or lesson that carries a return path to the exact slide. */
export function detourHref(targetPath: string, slide: Slide): string {
  return `${targetPath}?returnTo=${encodeURIComponent(slideHref(slide.id))}`;
}

/** The interactive destination for a slide, if any (a lab first, then a related page). */
export function slideDetour(slide: Slide): { label: string; href: string } | null {
  if (slide.labId)
    return { label: "Open the interactive lab", href: detourHref(`/labs/${slide.labId}`, slide) };
  if (slide.relatedRoute)
    return { label: "Open the related page", href: detourHref(slide.relatedRoute, slide) };
  return null;
}

/**
 * Accepts a `returnTo` value only if it points at a real slide in the deck. Anything else — another
 * site, a different path, an unknown slide — is ignored, so the banner cannot be used as an open
 * redirect.
 */
export function parseReturnTo(
  value: string | null | undefined,
): { href: string; slide: Slide } | null {
  if (!value) return null;
  const match = /^\/present\/([a-z0-9-]+)$/.exec(value);
  const id = match?.[1];
  if (!id) return null;
  const slide = slides.find((s) => s.id === id);
  return slide ? { href: slideHref(slide.id), slide } : null;
}

export function chapterOf(slide: Slide) {
  return DECK_CHAPTERS.find((c) => c.id === slide.chapter) ?? DECK_CHAPTERS[0];
}

/** First slide index of each chapter, for the chapter navigator and the progress bar. */
export function chapterStarts(): {
  id: string;
  label: string;
  minutes: string;
  first: number;
  count: number;
}[] {
  return DECK_CHAPTERS.map((chapter) => {
    const indexes = slides.flatMap((s, i) => (s.chapter === chapter.id ? [i] : []));
    return {
      id: chapter.id,
      label: chapter.label,
      minutes: chapter.minutes,
      first: indexes[0] ?? 0,
      count: indexes.length,
    };
  });
}
