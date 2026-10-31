import { sceneComponents } from "@/components/presenter/scenes/registry";
import { chapterOf } from "@/lib/presenter/navigation";
import { SLIDE_COUNT, type Slide } from "@/lib/schemas";

/**
 * One slide at its design size of 1920 × 1080: chapter and number, the title, one signature scene and
 * a single key message. Margins keep text clear of the edges for stream overlays. It contains no
 * speaker notes, so it is always safe to broadcast.
 */
export function SlideFace({ slide }: { slide: Slide }) {
  const Scene = sceneComponents[slide.visual];
  const chapter = chapterOf(slide);
  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        width: 1920,
        height: 1080,
        background:
          "radial-gradient(1200px 600px at 50% 0%, rgba(255, 255, 255, 0.025), transparent 75%), var(--bg-page, #141413)",
        color: "var(--text-main, #F4F2EA)",
      }}
    >
      {/* Minimal clean framing lines and corner ticks */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        aria-hidden="true"
        focusable="false"
      >
        <line
          x1="96"
          y1="0"
          x2="96"
          y2="1080"
          stroke="var(--border-subtle, #3F3F39)"
          strokeDasharray="4 6"
        />
        <line
          x1="1824"
          y1="0"
          x2="1824"
          y2="1080"
          stroke="var(--border-subtle, #3F3F39)"
          strokeDasharray="4 6"
        />
        <line
          x1="0"
          y1="250"
          x2="1920"
          y2="250"
          stroke="var(--border-subtle, #3F3F39)"
          strokeDasharray="4 6"
        />
        <line
          x1="0"
          y1="930"
          x2="1920"
          y2="930"
          stroke="var(--border-subtle, #3F3F39)"
          strokeDasharray="4 6"
        />
        <rect x="94" y="248" width="4" height="4" fill="var(--border-subtle, #3F3F39)" />
        <rect x="1822" y="248" width="4" height="4" fill="var(--border-subtle, #3F3F39)" />
        <rect x="94" y="928" width="4" height="4" fill="var(--border-subtle, #3F3F39)" />
        <rect x="1822" y="928" width="4" height="4" fill="var(--border-subtle, #3F3F39)" />
      </svg>

      {/* Top Header Region */}
      <div className="absolute" style={{ left: 96, right: 96, top: 46 }}>
        <div className="inline-flex items-center gap-3 rounded-none border border-[var(--border-subtle,#3F3F39)] bg-[var(--bg-surface,#1D1D1B)] px-4 py-1.5 shadow-none">
          <span className="h-2 w-2 bg-[var(--btn-primary,#F0EEE5)]" aria-hidden="true" />
          <p
            className="font-mono font-medium uppercase text-[var(--text-secondary,#BDBBB2)]"
            style={{ fontSize: 22, letterSpacing: "0.15em", margin: 0 }}
          >
            {chapter?.label} · {slide.number} / {SLIDE_COUNT}
          </p>
        </div>

        <h1
          className="font-display font-bold tracking-tight text-[var(--text-main,#F4F2EA)]"
          style={{ fontSize: 72, lineHeight: 1.08, marginTop: 12 }}
        >
          {slide.title}
        </h1>
        {slide.tagline ? (
          <p
            className="font-sans text-[var(--text-secondary,#BDBBB2)]"
            style={{ fontSize: 30, marginTop: 4, fontWeight: 400 }}
          >
            {slide.tagline}
          </p>
        ) : null}
      </div>

      {/* Central Graphic Presentation Canvas */}
      <div
        className="absolute rounded-none"
        style={{
          left: 110,
          top: 275,
          width: 1700,
          height: 600,
        }}
      >
        {Scene ? <Scene /> : null}
      </div>

      {/* Bottom Key Takeaway Callout Card */}
      <div
        className="absolute flex items-center gap-6 rounded-none border border-[var(--border-subtle,#3F3F39)] bg-[var(--bg-surface,#1D1D1B)] px-8 py-5 shadow-none"
        style={{ left: 96, right: 96, bottom: 44 }}
      >
        <div className="flex shrink-0 items-center gap-2.5 rounded-none border border-[var(--border-subtle,#3F3F39)] bg-[var(--bg-surface-elevated,#262624)] px-3.5 py-1.5">
          <span className="h-2 w-2 bg-[var(--btn-primary,#F0EEE5)]" aria-hidden="true" />
          <span
            className="font-mono font-semibold uppercase tracking-wider text-[var(--text-main,#F4F2EA)]"
            style={{ fontSize: 20 }}
          >
            Takeaway
          </span>
        </div>
        <p
          className="text-[var(--text-main,#F4F2EA)] font-medium leading-snug"
          style={{ fontSize: 36 }}
        >
          {slide.keyMessage}
        </p>
      </div>
    </div>
  );
}
