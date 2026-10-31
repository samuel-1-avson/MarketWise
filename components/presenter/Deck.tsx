"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion } from "motion/react";
import { MotionToggle } from "@/components/a11y/MotionToggle";
import { ThemeToggle } from "@/components/a11y/ThemeToggle";
import { NotesPanel } from "@/components/presenter/NotesPanel";
import { SlideFace } from "@/components/presenter/SlideFace";
import { Stage } from "@/components/presenter/Stage";
import { sceneDescription } from "@/content/sceneText";
import { SITE_NAME } from "@/lib/constants";
import { slides } from "@/content/slides";
import { swipeDirection, type SwipePoint } from "@/lib/presenter/swipe";
import { useDeckSession } from "@/hooks/useDeckSession";
import {
  REPEATABLE_KEYS,
  deckKeyAction,
  keyTargetFrom,
  type DeckAction,
} from "@/lib/presenter/keys";
import {
  HANDOUT_PATH,
  chapterOf,
  chapterStarts,
  clampSlideIndex,
  detourHref,
  slideDetour,
  slideHref,
  slideIndexById,
} from "@/lib/presenter/navigation";
import { notesStore } from "@/lib/presenter/notesStore";
import { elapsedMs, formatClock, pauseTimer, resetTimer, startTimer } from "@/lib/presenter/timer";
import { SLIDE_COUNT } from "@/lib/schemas";

const noopSubscribe = () => () => {};
const fullscreenSupported = () =>
  typeof document !== "undefined" && document.fullscreenEnabled === true;

const SHORTCUTS: ReadonlyArray<[string, string]> = [
  ["→  Space  Page Down", "Next slide"],
  ["←  Page Up", "Previous slide"],
  ["Home / End", "First / last slide"],
  ["F", "Fullscreen on or off"],
  ["N", "Show or hide speaker notes"],
  ["T", "Show or hide the timer"],
  ["C", "Chapter navigator"],
  ["?", "This help"],
  ["Esc", "Close the open panel"],
  ["Swipe", "Next or previous slide on a touch screen"],
];

const barButton =
  "inline-flex min-h-10 items-center gap-2 rounded-none border border-[var(--border-subtle,#3F3F39)] bg-[var(--bg-surface,#1D1D1B)] px-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-main,#F4F2EA)] transition-all duration-[var(--duration-fast)] hover:border-[var(--btn-hover,#D8D5C9)] hover:bg-[var(--bg-surface-elevated,#262624)] disabled:cursor-not-allowed disabled:text-[var(--text-secondary,#BDBBB2)]/50 aria-pressed:border-[var(--btn-primary,#F0EEE5)] aria-pressed:bg-[var(--bg-surface-elevated,#262624)] aria-pressed:text-[var(--btn-primary,#F0EEE5)]";

/** The letter hint on a button: visual only, because the shortcut is exposed with aria-keyshortcuts. */
const Hint = ({ children }: { children: string }) => (
  <span aria-hidden="true" className="text-muted">
    {children}
  </span>
);

export function Deck({ initialIndex }: { initialIndex: number }) {
  const [index, setIndex] = useState(() => clampSlideIndex(initialIndex));
  const [dialog, setDialog] = useState<null | "chapters" | "help">(null);
  const [announcement, setAnnouncement] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [textOpen, setTextOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const swipeStart = useRef<SwipePoint | null>(null);

  const { session, update } = useDeckSession();
  const notesOpen = useSyncExternalStore(notesStore.subscribe, notesStore.get, () => false);
  const canFullscreen = useSyncExternalStore(noopSubscribe, fullscreenSupported, () => false);

  const rootRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<HTMLDialogElement>(null);
  const helpRef = useRef<HTMLDialogElement>(null);
  const notesToggleRef = useRef<HTMLButtonElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide = slides[index] ?? slides[0];
  const pathname = usePathname();

  // Keep the tab title on the current slide. It is re-applied when the router's pathname settles,
  // because Next resets the title to the page's static metadata after a history push.
  useEffect(() => {
    if (slide) document.title = `Slide ${slide.number}: ${slide.title} · ${SITE_NAME}`;
  }, [slide, pathname]);

  const detour = slide ? slideDetour(slide) : null;
  const chapters = chapterStarts();
  const running = session.timer.startedAt !== null;
  const elapsed = elapsedMs(session.timer, now);

  /* ----------------------------------------------------------------- navigation */
  const show = (target: number, push: boolean) => {
    const next = clampSlideIndex(target);
    const nextSlide = slides[next];
    if (!nextSlide) return;
    if (push) window.history.pushState(null, "", slideHref(nextSlide.id));
    setIndex(next);
    setAnnouncement(`Slide ${nextSlide.number} of ${SLIDE_COUNT}: ${nextSlide.title}`);
  };

  const go = (target: number) => {
    if (clampSlideIndex(target) === index) return;
    show(target, true);
  };

  // The browser's Back and Forward buttons move between slides too.
  const onPop = useEffectEvent(() => {
    const found = slideIndexById(window.location.pathname.split("/").filter(Boolean)[1]);
    if (found >= 0) show(found, false);
  });
  useEffect(() => {
    const handler = () => onPop();
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  /* --------------------------------------------------------------- panel helpers */
  const announce = (message: string) => setAnnouncement(message);

  const setNotes = (value: boolean) => {
    notesStore.set(value);
    announce(value ? "Speaker notes are now visible on this screen." : "Speaker notes hidden.");
  };

  const setTimerPanel = (value: boolean) => {
    update({ timerOpen: value });
    announce(value ? "Timer shown." : "Timer hidden.");
  };

  /* ------------------------------------------------------------------ fullscreen */
  // In fullscreen the bars float over the slide and fade after a few idle seconds. Anything that is
  // keyboard-focused brings them back, so a focused control is never invisible.
  const revealControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await rootRef.current?.requestFullscreen();
    } catch {
      // Not allowed here (for example, not triggered by a user gesture): leave the deck as it is.
    }
  }, []);

  useEffect(() => {
    const onChange = () => {
      const full = document.fullscreenElement !== null;
      setIsFullscreen(full);
      setAnnouncement(full ? "Fullscreen on." : "Fullscreen off.");
      revealControls();
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [revealControls]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  /* ----------------------------------------------------------------------- timer */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [running]);

  const toggleTimerRun = () => {
    const t = Date.now();
    setNow(t);
    update({ timer: running ? pauseTimer(session.timer, t) : startTimer(session.timer, t) });
  };

  /* ------------------------------------------------------------------- keyboard */
  const runAction = useEffectEvent((action: DeckAction) => {
    switch (action) {
      case "next":
        go(index + 1);
        break;
      case "previous":
        go(index - 1);
        break;
      case "first":
        go(0);
        break;
      case "last":
        go(SLIDE_COUNT - 1);
        break;
      case "fullscreen":
        void toggleFullscreen();
        break;
      case "notes":
        setNotes(!notesOpen);
        break;
      case "timer":
        setTimerPanel(!session.timerOpen);
        break;
      case "chapters":
        setDialog("chapters");
        break;
      case "help":
        setDialog("help");
        break;
      case "escape":
        if (session.timerOpen) setTimerPanel(false);
        else if (notesOpen) setNotes(false);
        else if (textOpen) setTextOpen(false);
        break;
    }
  });

  const letterShortcuts = session.letterShortcuts;
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented) return;
    // While a dialog is open the browser handles focus and Escape; the deck keys stay quiet.
    if (document.querySelector("dialog[open]")) return;
    const action = deckKeyAction({
      key: event.key,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      altKey: event.altKey,
      target: keyTargetFrom(event.target),
      letterShortcuts,
    });
    if (!action) return;
    event.preventDefault();
    // Holding a key down must not flicker panels: only the arrow and paging keys repeat.
    if (event.repeat && !REPEATABLE_KEYS.has(event.key)) return;
    if (action !== "next" && action !== "previous" && action !== "first" && action !== "last")
      revealControls();
    runAction(action);
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKey(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* --------------------------------------------------------------------- dialogs */
  useEffect(() => {
    const el =
      dialog === "chapters" ? chaptersRef.current : dialog === "help" ? helpRef.current : null;
    if (el && !el.open) {
      if (typeof el.showModal === "function") el.showModal();
      else el.setAttribute("open", "");
    }
  }, [dialog]);

  const closeDialog = () => {
    for (const el of [chaptersRef.current, helpRef.current]) {
      if (el?.open) {
        if (typeof el.close === "function") el.close();
        else el.removeAttribute("open");
      }
    }
    setDialog(null);
  };

  if (!slide) return null;
  const chapter = chapterOf(slide);
  const barsHidden = isFullscreen && !controlsVisible;
  // Faded bars come back as soon as anything inside them has keyboard focus.
  const barState = `transition-opacity duration-[var(--duration-panel)] ${
    barsHidden
      ? "pointer-events-none opacity-0 focus-within:pointer-events-auto focus-within:opacity-100"
      : "opacity-100"
  }`;
  // In fullscreen the bars float over the stage, so the slide can use the whole screen.
  const overlay = isFullscreen ? "absolute inset-x-0 z-20 bg-midnight/90 backdrop-blur" : "";

  return (
    <div
      ref={rootRef}
      className="relative flex h-dvh min-h-0 flex-col bg-midnight text-ink"
      onMouseMove={revealControls}
      onFocusCapture={revealControls}
    >
      <div role="status" aria-live="polite" className="sr-only" data-testid="deck-announcement">
        {announcement}
      </div>

      {/* ---------------------------------------------------------------- top bar */}
      <header
        className={`flex flex-col gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 sm:flex-row sm:items-center sm:justify-between ${barState} ${overlay} ${isFullscreen ? "top-0" : ""}`}
      >
        <div className="flex items-center justify-between gap-2 sm:justify-start">
          <div className="flex items-center gap-2">
            <Link href="/" className={barButton}>
              ← Exit
            </Link>
            <p className="px-2 text-sm text-[var(--text-secondary)]" data-testid="deck-position">
              <span className="font-semibold text-[var(--text-main)]">
                Slide {slide.number} of {SLIDE_COUNT}
              </span>
              <span className="hidden sm:inline"> · {chapter?.label}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              className={barButton}
              aria-keyshortcuts="C"
              onClick={() => setDialog("chapters")}
            >
              Chapters <Hint>C</Hint>
            </button>
            <ThemeToggle className={barButton} />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:overflow-visible sm:pb-0">
          <p
            data-testid="notes-status"
            className={`hidden shrink-0 rounded-none border px-3 py-1 text-xs font-semibold uppercase tracking-wider md:block ${
              notesOpen
                ? "border-[var(--btn-primary,#F0EEE5)] bg-[var(--bg-surface-elevated,#262624)] text-[var(--text-main,#F4F2EA)]"
                : "border-[var(--border-subtle,#3F3F39)] bg-[var(--bg-surface,#1D1D1B)] text-[var(--text-secondary,#BDBBB2)]"
            }`}
          >
            {notesOpen ? "Notes visible on this screen" : "Notes hidden"}
          </p>
          {session.timer.accumulatedMs > 0 || running ? (
            <p
              className="shrink-0 rounded-none border border-[var(--border-subtle,#3F3F39)] bg-[var(--bg-surface,#1D1D1B)] px-3 py-1 font-mono text-xs text-[var(--text-main,#F4F2EA)]"
              data-testid="timer-chip"
            >
              <span className="sr-only">Elapsed </span>
              {formatClock(elapsed)}
              {running ? "" : " (paused)"}
            </p>
          ) : null}
          <button
            type="button"
            className={`hidden sm:inline-flex shrink-0 ${barButton}`}
            aria-keyshortcuts="C"
            onClick={() => setDialog("chapters")}
          >
            Chapters <Hint>C</Hint>
          </button>
          <button
            ref={notesToggleRef}
            type="button"
            className={`shrink-0 ${barButton}`}
            aria-pressed={notesOpen}
            aria-controls={notesOpen ? "deck-notes" : undefined}
            aria-keyshortcuts="N"
            onClick={() => setNotes(!notesOpen)}
          >
            Speaker notes <Hint>N</Hint>
          </button>
          <button
            type="button"
            className={`shrink-0 ${barButton}`}
            aria-pressed={session.timerOpen}
            aria-keyshortcuts="T"
            onClick={() => setTimerPanel(!session.timerOpen)}
          >
            Timer <Hint>T</Hint>
          </button>
          <button
            type="button"
            className={`shrink-0 ${barButton}`}
            aria-pressed={isFullscreen}
            aria-keyshortcuts="F"
            disabled={!canFullscreen}
            onClick={() => void toggleFullscreen()}
          >
            {isFullscreen ? "Exit fullscreen" : "Fullscreen"} <Hint>F</Hint>
          </button>
          <button
            type="button"
            className={`shrink-0 ${barButton}`}
            aria-pressed={textOpen}
            aria-controls={textOpen ? "scene-text" : undefined}
            onClick={() => setTextOpen((open) => !open)}
          >
            Text version
          </button>
          <button
            type="button"
            className={`shrink-0 ${barButton}`}
            aria-keyshortcuts="?"
            onClick={() => setDialog("help")}
          >
            Shortcuts <Hint>?</Hint>
          </button>
          <div className="hidden sm:inline-flex shrink-0">
            <ThemeToggle className={barButton} />
          </div>
          <Link href={detourHref(HANDOUT_PATH, slide)} className={`shrink-0 ${barButton}`}>
            Handout
          </Link>
        </div>
      </header>

      <p className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-4 py-2 text-xs sm:text-sm text-[var(--text-secondary)] lg:hidden">
        This deck is built for a large screen. Swipe left or right to change slides. On a phone, the{" "}
        <Link href={HANDOUT_PATH} className="text-[var(--text-main)] font-semibold underline underline-offset-4">
          handout
        </Link>{" "}
        is easier to read.
      </p>

      {/* ---------------------------------------------------------------- stage + panels */}
      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        <div
          className="relative min-h-0 min-w-0 flex-1"
          role="region"
          aria-label={`Slide ${slide.number} of ${SLIDE_COUNT}`}
          data-testid="swipe-surface"
          onPointerDown={(event) => {
            if (event.pointerType === "mouse") return;
            // The first touch while the fullscreen bars are hidden only brings them back.
            if (isFullscreen && !controlsVisible) {
              revealControls();
              return;
            }
            const target = event.target;
            if (
              target instanceof Element &&
              target.closest("a, button, input, textarea, select, summary, label, [data-no-swipe]")
            ) {
              return;
            }
            swipeStart.current = { x: event.clientX, y: event.clientY };
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              // The pointer can already have been released.
            }
          }}
          onPointerUp={(event) => {
            const start = swipeStart.current;
            swipeStart.current = null;
            if (!start || event.pointerType === "mouse") return;
            const action = swipeDirection(start, { x: event.clientX, y: event.clientY });
            if (action === "next") go(index + 1);
            else if (action === "previous") go(index - 1);
          }}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
        >
          <Stage>
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 1920, height: 1080 }}
            >
              <SlideFace slide={slide} />
            </motion.div>
          </Stage>
          {textOpen ? (
            <div
              id="scene-text"
              data-testid="scene-text"
              data-no-swipe
              data-scroll-region
              tabIndex={0}
              role="region"
              aria-label="Text version of this scene"
              className={`absolute inset-x-3 z-10 max-h-48 overflow-y-auto rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-base text-[var(--text-main)] shadow-none ${
                isFullscreen && controlsVisible ? "bottom-24" : "bottom-3"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                What the picture shows
              </p>
              <p className="mt-2">{sceneDescription(slide.visual)}</p>
            </div>
          ) : null}

          {session.timerOpen ? (
            <div
              role="group"
              aria-label="Presentation timer"
              className="absolute right-3 top-3 z-10 w-64 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 shadow-none backdrop-blur"
              data-no-swipe
              data-testid="timer-panel"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Elapsed</p>
              <p
                className="font-mono text-4xl font-bold text-[var(--text-main)]"
                role="timer"
                aria-live="off"
                data-testid="timer-clock"
              >
                {formatClock(elapsed)}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Suggested for this chapter: {chapter?.minutes} min (pacing, not data)
              </p>
              <div className="mt-3 flex gap-2">
                <button type="button" className={barButton} onClick={toggleTimerRun}>
                  {running ? "Pause" : session.timer.accumulatedMs > 0 ? "Resume" : "Start"}
                </button>
                <button
                  type="button"
                  className={barButton}
                  onClick={() => update({ timer: resetTimer() })}
                >
                  Reset
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {notesOpen ? (
          <aside
            id="deck-notes"
            aria-label="Speaker notes"
            tabIndex={0}
            data-scroll-region
            className="max-h-[45%] w-full shrink-0 overflow-y-auto border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5 lg:max-h-none lg:w-[22rem] lg:border-l lg:border-t-0"
            data-testid="notes-panel"
          >
            <NotesPanel
              slide={slide}
              onClose={() => {
                setNotes(false);
                // The panel (and the focused button inside it) is about to disappear: keep focus nearby.
                notesToggleRef.current?.focus();
              }}
            />
          </aside>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------- bottom bar */}
      <footer
        className={`border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 ${barState} ${overlay} ${isFullscreen ? "bottom-0" : ""}`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={barButton}
            onClick={() => go(index - 1)}
            aria-disabled={index === 0}
            aria-label="Previous slide"
          >
            ← <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div
              role="progressbar"
              aria-label="Progress through the deck"
              aria-valuemin={1}
              aria-valuemax={SLIDE_COUNT}
              aria-valuenow={slide.number}
              aria-valuetext={`Slide ${slide.number} of ${SLIDE_COUNT}`}
              className="flex h-2 gap-1"
            >
              {chapters.map((c) => {
                const done = Math.min(c.count, Math.max(0, index + 1 - c.first));
                return (
                  <div
                    key={c.id}
                    className="h-full overflow-hidden rounded-none bg-[var(--border-subtle,#3F3F39)]"
                    style={{ flexGrow: c.count, flexBasis: 0 }}
                    title={c.label}
                  >
                    <div
                      className="h-full bg-[var(--btn-primary,#F0EEE5)] transition-[width] duration-[var(--duration-panel)]"
                      style={{ width: `${(done / c.count) * 100}%` }}
                    />
                  </div>
                );
              })}
            </div>
            {detour ? (
              <Link
                href={detour.href}
                className="mx-auto inline-flex min-h-11 items-center text-sm font-semibold text-[var(--text-main)] underline underline-offset-4 hover:text-[var(--btn-primary)]"
                data-testid="deck-detour"
              >
                {detour.label} →
              </Link>
            ) : (
              <span className="mx-auto min-h-11 text-sm leading-[2.75rem] text-[var(--text-secondary)]">
                No interactive detour for this slide
              </span>
            )}
          </div>

          <button
            type="button"
            className={barButton}
            onClick={() => go(index + 1)}
            aria-disabled={index === SLIDE_COUNT - 1}
            aria-label="Next slide"
          >
            <span className="hidden sm:inline">Next</span> →
          </button>
        </div>
      </footer>

      {/* ---------------------------------------------------------------- dialogs */}
      <dialog
        ref={chaptersRef}
        onClose={() => setDialog(null)}
        aria-labelledby="chapters-title"
        className="m-auto max-h-[85dvh] w-[min(46rem,92vw)] overflow-y-auto rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-[var(--text-main)] backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="chapters-title" className="font-display text-2xl font-bold">
            Chapters
          </h2>
          <button type="button" className={barButton} onClick={closeDialog}>
            Close
          </button>
        </div>
        <ol className="mt-4 space-y-5">
          {chapters.map((c) => (
            <li key={c.id}>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                {c.label} · suggested {c.minutes} min
              </p>
              <ul className="mt-2 space-y-1">
                {slides
                  .filter((s) => s.chapter === c.id)
                  .map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        aria-current={s.number === slide.number ? "true" : undefined}
                        onClick={() => {
                          go(s.number - 1);
                          closeDialog();
                        }}
                        className="flex min-h-11 w-full items-center gap-3 rounded-none px-3 text-left text-base text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] aria-[current=true]:border aria-[current=true]:border-[var(--btn-primary)] aria-[current=true]:bg-[var(--bg-surface-elevated)] aria-[current=true]:font-semibold"
                      >
                        <span className="w-8 text-[var(--text-secondary)]">{s.number}.</span>
                        {s.title}
                        {s.number === slide.number ? (
                          <span className="ml-auto text-sm text-[var(--btn-primary)]">current slide</span>
                        ) : null}
                      </button>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ol>
      </dialog>

      <dialog
        ref={helpRef}
        onClose={() => setDialog(null)}
        aria-labelledby="help-title"
        className="m-auto max-h-[85dvh] w-[min(34rem,92vw)] overflow-y-auto rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-[var(--text-main)] backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="help-title" className="font-display text-2xl font-bold">
            Keyboard shortcuts
          </h2>
          <button type="button" className={barButton} onClick={closeDialog}>
            Close
          </button>
        </div>
        <table className="mt-4 w-full text-left text-base">
          <caption className="sr-only">Presenter keyboard shortcuts</caption>
          <tbody>
            {SHORTCUTS.map(([keys, what]) => (
              <tr key={keys} className="border-t border-[var(--border-subtle)]">
                <th scope="row" className="py-2 pr-4 font-mono text-sm font-semibold text-[var(--text-main)]">
                  {keys}
                </th>
                <td className="py-2 text-[var(--text-secondary)]">{what}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <label className="mt-5 flex min-h-11 cursor-pointer items-start gap-3 text-base text-[var(--text-main)]">
          <input
            type="checkbox"
            checked={session.letterShortcuts}
            onChange={(event) => update({ letterShortcuts: event.target.checked })}
            className="mt-1"
          />
          <span>
            Single-letter shortcuts (F, N, T, C, ?)
            <span className="block text-sm text-muted">
              Turn these off if you use speech input or a screen reader that sends letters to the
              page. Arrow keys, Space, Home, End and Esc, and every on-screen button, keep working.
            </span>
          </span>
        </label>

        <div className="mt-4">
          <MotionToggle />
        </div>

        <p className="mt-4 text-sm text-muted">
          On a touch screen, swipe left on the slide for the next one and right for the previous
          one. A swipe that starts on a button is ignored. Text version shows what the picture
          shows, in words, and is safe to leave closed during a capture.
        </p>
        <p className="mt-4 text-sm text-muted">
          Keys are ignored while you type in a field, use a slider, or read in the notes panel
          (where the paging keys scroll). Space activates a focused button instead of advancing.
          Speaker notes stay hidden until you open them and are hidden again after a reload, and a
          clear status shows when they are visible. In fullscreen your browser may use Esc to leave
          fullscreen, so use the on-screen buttons to close panels there.
        </p>
      </dialog>
    </div>
  );
}
