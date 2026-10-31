import { SourceRefs } from "@/components/design/SourceRefs";
import { chapterOf } from "@/lib/presenter/navigation";
import { slideNotesWordCount, type Slide } from "@/lib/schemas";

/** Speaker notes for one slide. Shown only when the presenter chooses to open them. */
export function NotesPanel({ slide, onClose }: { slide: Slide; onClose?: () => void }) {
  const { notes } = slide;
  const chapter = chapterOf(slide);
  return (
    <div className="space-y-5 text-base">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-forex">
            Speaker notes · slide {slide.number}
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-ink">{slide.title}</h2>
          <p className="mt-1 text-sm text-muted">
            {chapter?.label} — suggested chapter time {chapter?.minutes} min · about{" "}
            {slideNotesWordCount(notes)} words of notes
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 shrink-0 items-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]"
          >
            Hide notes (N)
          </button>
        ) : null}
      </div>

      <div>
        <p>
          <span className="font-semibold text-ink">Say first: </span>
          <span className="text-muted">{slide.speakerCue}</span>
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">Interactive cue: </span>
          <span className="text-muted">{slide.interactiveCue}</span>
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-forex">
          Key teaching point
        </h3>
        <p className="mt-1 text-ink">{notes.teachingPoint}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-forex">
          Explain it in steps
        </h3>
        <ol className="mt-1 list-decimal space-y-2 pl-5 text-ink">
          {notes.explanation.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-forex">
          Beginner analogy
        </h3>
        <p className="mt-1 text-ink">{notes.analogy}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-sports">
          Misconception to correct
        </h3>
        <p className="mt-1 text-ink">{notes.misconception}</p>
      </div>

      {notes.audienceQuestion ? (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-forex">
            Ask the room
          </h3>
          <p className="mt-1 text-ink">{notes.audienceQuestion}</p>
        </div>
      ) : null}

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-forex">Transition</h3>
        <p className="mt-1 text-ink">{notes.transition}</p>
      </div>

      <SourceRefs ids={slide.sourceIds} />
      {slide.sourceNote ? (
        <p className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-secondary)]">
          <span className="font-semibold text-ink">Source status: </span>
          {slide.sourceNote}
        </p>
      ) : null}
    </div>
  );
}
