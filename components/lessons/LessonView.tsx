import Link from "next/link";
import { Container } from "@/components/design/Container";
import { IllustrativeBadge } from "@/components/design/IllustrativeBadge";
import { PageHeader } from "@/components/design/PageHeader";
import { SourceRefs } from "@/components/design/SourceRefs";
import { TopicGlyph } from "@/components/design/TopicGlyph";
import { TopicIllustration } from "@/components/diagrams/TopicIllustration";
import { CommoditiesConvergenceMechanics } from "@/components/lessons/CommoditiesConvergenceMechanics";
import { CryptoCustodyMechanics } from "@/components/lessons/CryptoCustodyMechanics";
import { ForexSpreadMechanics } from "@/components/lessons/ForexSpreadMechanics";
import { SportsBettingMechanics } from "@/components/lessons/SportsBettingMechanics";
import { StocksOrderBookMechanics } from "@/components/lessons/StocksOrderBookMechanics";
import { QuizSet } from "@/components/quiz/QuizSet";
import { diagrams } from "@/content/diagrams";
import { glossaryById } from "@/content/glossary";
import { labs } from "@/content/labs";
import { quizzes } from "@/content/quizzes";
import { sourceById } from "@/content/sources";
import { lessons } from "@/content/topics";
import type { Lesson, LessonSection } from "@/lib/schemas";
import { topicTone } from "@/lib/tokens";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function SectionBody({ section }: { lesson: Lesson; section: LessonSection }) {
  return (
    <>
      {section.usesIllustrativeNumbers ? <IllustrativeBadge className="mt-3" /> : null}
      <div className="prose-mw mt-4 text-muted/95 leading-relaxed">
        {section.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {section.points ? (
        <ul className="prose-mw mt-4 list-disc space-y-2.5 pl-6 text-ink marker:text-forex">
          {section.points.map((point) => (
            <li key={point} className="leading-relaxed">
              {point}
            </li>
          ))}
        </ul>
      ) : null}
      {section.callout ? (
        <aside
          className="mt-6 max-w-[68ch] rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            {section.callout.label}
          </p>
          <p className="mt-1.5 text-base font-medium text-[var(--text-main)] leading-relaxed">
            {section.callout.text}
          </p>
        </aside>
      ) : null}
    </>
  );
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  const tone = topicTone[lesson.id];
  const lessonQuestions = lesson.quizIds
    .map((id) => quizzes.find((q) => q.id === id))
    .filter((q) => q !== undefined);
  const sourceTitles = Object.fromEntries([...sourceById.values()].map((s) => [s.id, s.title]));
  const verifiedCount = lesson.readingSourceIds.filter(
    (id) => sourceById.get(id)?.status === "verified",
  ).length;
  // Labs for this topic, the lesson's own lab first.
  const relatedLabs = labs
    .filter((l) => l.topics.includes(lesson.id))
    .toSorted((a, b) => Number(b.id === lesson.labId) - Number(a.id === lesson.labId));
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const prev = index > 0 ? lessons[index - 1] : undefined;
  const next = index < lessons.length - 1 ? lessons[index + 1] : undefined;

  return (
    <>
      <PageHeader kicker={lesson.kicker} title={lesson.title} accentClass={tone.text}>
        <p>{lesson.summary}</p>
      </PageHeader>

      <Container className="py-12 sm:py-16">
        {/* Core Snapshot Cards */}
        <dl className="grid gap-5 sm:grid-cols-3">
          {(
            [
              ["What changes hands", lesson.snapshot.changesHands],
              ["What it is for", lesson.snapshot.purpose],
              ["Main risk", lesson.snapshot.mainRisk],
            ] as const
          ).map(([label, text]) => (
            <div
              key={label}
              className="surface rounded-none border border-[var(--border-subtle)] p-6 transition-all duration-300 hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)]"
            >
              <dt
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]"
              >
                {label === "What changes hands" ? <TopicGlyph topic={lesson.id} size={22} /> : null}
                {label}
              </dt>
              <dd className="mt-2.5 text-base font-medium text-[var(--text-main)] leading-relaxed">{text}</dd>
            </div>
          ))}
        </dl>

        {/* Verification banner */}
        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span className="h-2 w-2 rounded-none bg-[var(--btn-primary)]" aria-hidden="true" />
          <span>
            Last reviewed {formatDate(lesson.lastReviewed)} · Checked against {verifiedCount}{" "}
            verified {verifiedCount === 1 ? "source" : "sources"} ·{" "}
          </span>
          <a
            href="#review-status"
            className="font-semibold text-[var(--text-main)] underline underline-offset-4 hover:text-[var(--btn-primary)]"
          >
            How this lesson was reviewed
          </a>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          {/* Table of Contents Sticky Sidebar */}
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface rounded-none p-5 border border-[var(--border-subtle)]">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Lesson Sections
              </h2>
              <ol className="mt-4 space-y-1 text-xs">
                {lesson.sections.map((s, i) => (
                  <li key={s.kind}>
                    <a
                      href={`#${s.kind}`}
                      className="group flex min-h-9 items-center gap-2 rounded-none px-2.5 py-1 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-main)]"
                    >
                      <span className="w-4 font-mono text-[0.7rem] text-[var(--text-secondary)] group-hover:text-[var(--text-main)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="line-clamp-1">{s.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="space-y-20">
            {lesson.sections.map((section, i) => (
              <section key={section.kind} id={section.kind} className="scroll-mt-28">
                <div className="inline-flex items-center gap-2 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-0.5 text-xs font-mono text-[var(--text-secondary)]">
                  <span className="text-[var(--text-main)] font-semibold">Section 0{i + 1}</span>
                  <span>/ 0{lesson.sections.length}</span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl tracking-tight">
                  {section.heading}
                </h2>
                <SectionBody lesson={lesson} section={section} />

                {section.kind === "participants" ? (
                  <dl className="mt-8 grid max-w-[68ch] gap-3">
                    {lesson.actors.map((actor) => (
                      <div
                        key={actor.name}
                        className="surface rounded-none p-4 border border-[var(--border-subtle)]"
                      >
                        <dt className="font-display text-base font-bold text-[var(--text-main)]">{actor.name}</dt>
                        <dd className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{actor.role}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {section.kind === "mechanism" ? (
                  <div className="mt-8 space-y-8">
                    <TopicIllustration topic={lesson.id} diagram={diagrams[lesson.id]} />
                    {lesson.id === "forex" ? <ForexSpreadMechanics /> : null}
                    {lesson.id === "stocks" ? <StocksOrderBookMechanics /> : null}
                    {lesson.id === "commodities" ? <CommoditiesConvergenceMechanics /> : null}
                    {lesson.id === "crypto" ? <CryptoCustodyMechanics /> : null}
                    {lesson.id === "sports-betting" ? <SportsBettingMechanics /> : null}
                    {relatedLabs.length > 0 ? (
                      <div
                        className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-6"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-none bg-[var(--btn-primary)] animate-pulse"
                            aria-hidden="true"
                          />
                          <h3 className="font-display text-lg font-bold text-[var(--text-main)]">
                            Interactive Simulation
                          </h3>
                        </div>
                        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                          Hands-on interactive models with fixed, invented values — explore the
                          mechanics live.
                        </p>
                        <ul className="mt-4 space-y-3">
                          {relatedLabs.map((lab) => (
                            <li
                              key={lab.id}
                              className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
                            >
                              <Link
                                href={`/labs/${lab.id}`}
                                className="group inline-flex items-center gap-1.5 font-display text-base font-bold text-[var(--text-main)] hover:underline transition-colors"
                              >
                                <span>{lab.title}</span>
                                <span
                                  aria-hidden="true"
                                  className="transition-transform group-hover:translate-x-1"
                                >
                                  →
                                </span>
                              </Link>
                              <p className="mt-1 text-sm text-[var(--text-secondary)]">{lab.concept}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {section.kind === "misconceptions" ? (
                  <ul className="mt-8 space-y-4 max-w-[68ch]">
                    {lesson.misconceptions.map((m) => (
                      <li
                        key={m.claim}
                        className="surface rounded-none p-6 border border-[var(--border-subtle)]"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-none bg-[var(--bg-surface-elevated)] text-xs font-bold text-[var(--text-error)]"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-error)]">
                            Common claim
                          </p>
                        </div>
                        <p className="mt-2 text-lg font-semibold text-[var(--text-main)]">
                          &ldquo;{m.claim}&rdquo;
                        </p>
                        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                          <div className="flex items-center gap-2">
                            <span
                              className="flex h-5 w-5 items-center justify-center rounded-none bg-[var(--bg-surface-elevated)] text-xs font-bold text-[var(--btn-primary)]"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            <p
                              className="text-xs font-semibold uppercase tracking-wider text-[var(--btn-primary)]"
                            >
                              What is actually true
                            </p>
                          </div>
                          <p className="mt-1.5 text-base text-[var(--text-secondary)] leading-relaxed">
                            {m.correction}
                          </p>
                        </div>
                        <SourceRefs ids={m.sourceIds} className="mt-4" />
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.kind === "check" ? (
                  <div className="mt-8 max-w-[68ch]">
                    <QuizSet
                      questions={lessonQuestions}
                      sourceTitles={sourceTitles}
                      idPrefix={`lesson-${lesson.id}`}
                    />
                  </div>
                ) : null}

                {section.kind === "summary" ? (
                  <div className="mt-10 space-y-8 max-w-[68ch]">
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink">
                        Terms from this lesson
                      </h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {lesson.glossaryTermIds.map((id) => {
                          const term = glossaryById.get(id);
                          if (!term) return null;
                          return (
                            <li key={id}>
                              <Link
                                href={`/glossary#${id}`}
                                className="inline-flex min-h-9 items-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 text-xs font-medium text-[var(--text-main)] transition-all hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--btn-primary)]"
                              >
                                {term.term}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[var(--text-main)]">
                        Further reading & verified references
                      </h3>
                      <ul className="mt-3 space-y-3">
                        {lesson.readingSourceIds.map((id) => {
                          const source = sourceById.get(id);
                          if (!source) return null;
                          return (
                            <li
                              key={id}
                              className="surface rounded-none p-4 border border-[var(--border-subtle)]"
                            >
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-[var(--text-main)] hover:underline transition-colors inline-flex items-center gap-1.5"
                              >
                                <span>{source.title}</span>
                                <span className="text-xs text-[var(--text-secondary)]" aria-hidden="true">
                                  ↗
                                </span>
                                <span className="sr-only"> (opens in a new tab)</span>
                              </a>
                              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                {source.publisher}
                                {source.pageDate ? ` · ${source.pageDate}` : ""}
                              </p>
                              {source.caveat ? (
                                <p className="mt-1 text-xs text-[var(--text-secondary)] italic">
                                  Note: {source.caveat}
                                </p>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ) : null}

                <SourceRefs ids={section.sourceIds} className="mt-6" />
              </section>
            ))}

            {/* Review Status Box */}
            <section
              id="review-status"
              aria-labelledby="review-title"
              className="surface rounded-none p-6 sm:p-8 border border-[var(--border-subtle)]"
            >
              <h2 id="review-title" className="font-display text-xl font-bold text-[var(--text-main)]">
                How this lesson was reviewed
              </h2>
              <p className="mt-3 max-w-[68ch] text-base text-[var(--text-secondary)] leading-relaxed">
                {lesson.reviewNote}
              </p>
              <p className="mt-4 text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
                Reviewed {formatDate(lesson.lastReviewed)}. Sources are examples of public
                consumer-education material and are not a statement of the law in any particular
                country. This lesson is for learning only and is not financial advice.
              </p>
            </section>

            {/* Bottom Lesson Navigation Cards */}
            <nav
              aria-label="More lessons"
              className="flex flex-wrap items-stretch justify-between gap-4 pt-6"
            >
              {prev ? (
                <Link
                  href={`/explore/${prev.id}`}
                  className="surface group block min-w-[14rem] flex-1 rounded-none p-5 border border-[var(--border-subtle)] transition-all duration-200 hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)]"
                >
                  <span className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-[var(--text-main)]">
                    <span aria-hidden="true">←</span> Previous lesson
                  </span>
                  <span className="mt-2 block font-display text-lg font-bold text-[var(--text-main)]">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden flex-1 sm:block" />
              )}
              {next ? (
                <Link
                  href={`/explore/${next.id}`}
                  className="surface group block min-w-[14rem] flex-1 rounded-none p-5 text-right border border-[var(--border-subtle)] transition-all duration-200 hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)]"
                >
                  <span className="flex items-center justify-end gap-1 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-[var(--text-main)]">
                    Next lesson <span aria-hidden="true">→</span>
                  </span>
                  <span className="mt-2 block font-display text-lg font-bold text-[var(--text-main)]">
                    {next.title}
                  </span>
                </Link>
              ) : null}
            </nav>
          </div>
        </div>
      </Container>
    </>
  );
}
