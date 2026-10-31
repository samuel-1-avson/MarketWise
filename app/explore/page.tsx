import Link from "next/link";
import { Container } from "@/components/design/Container";
import { LinkButton } from "@/components/design/LinkButton";
import { PageHeader } from "@/components/design/PageHeader";
import { TopicGlyph } from "@/components/design/TopicGlyph";
import { lessons } from "@/content/topics";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta(
  "/explore",
  "Explore the five systems",
  "Five self-paced lessons on forex, stocks, commodities, crypto and sports betting: what changes hands, who takes part, how prices or outcomes arise, and where the risks sit.",
);

export default function ExplorePage() {
  return (
    <>
      <PageHeader kicker="Explore Studio" title="Five systems. Start with any of them.">
        <p>
          Each lesson follows the same structured eleven steps — what it is, what changes hands, why
          it exists, who takes part, how prices or outcomes come about, what influences them, a
          worked story, common misconceptions, risks, a five-question check and a summary with
          sources — so you can compare them one for one.
        </p>
      </PageHeader>

      <Container className="py-14 sm:py-16">
        {/* Navigation Quick Jump Pills */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--text-secondary)] mr-2">
            Jump to:
          </span>
          {lessons.map((lesson) => (
            <a
              key={lesson.id}
              href={`#${lesson.id}`}
              className="inline-flex items-center gap-1.5 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 font-mono text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--btn-primary)] hover:text-[var(--text-main)]"
            >
              <span>{lesson.title}</span>
            </a>
          ))}
        </div>

        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson, i) => (
            <li key={lesson.id} id={lesson.id} className="scroll-mt-28">
              <Link
                href={`/explore/${lesson.id}`}
                className="surface group relative flex h-full flex-col justify-between rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7 transition-all duration-300 hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-2.5 transition-transform duration-300 group-hover:scale-105">
                      <TopicGlyph topic={lesson.id} size={36} />
                    </span>
                    <span className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-1 font-mono text-xs font-semibold text-[var(--text-secondary)]">
                      Lesson 0{i + 1}
                    </span>
                  </div>

                  <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                    {lesson.kicker}
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl font-bold text-[var(--text-main)] transition-colors">
                    {lesson.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] transition-colors">
                    {lesson.summary}
                  </p>

                  <dl className="mt-6 space-y-2.5 text-xs">
                    <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3">
                      <dt className="font-semibold text-[var(--text-main)]">What changes hands: </dt>
                      <dd className="mt-0.5 text-[var(--text-secondary)] leading-relaxed">
                        {lesson.snapshot.changesHands}
                      </dd>
                    </div>
                    <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3">
                      <dt className="font-semibold text-[var(--text-main)]">Main structural risk: </dt>
                      <dd className="mt-0.5 text-[var(--text-secondary)] leading-relaxed">
                        {lesson.snapshot.mainRisk}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-7 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="inline-flex items-center font-semibold text-sm underline underline-offset-4 group-hover:no-underline text-[var(--text-main)]">
                    Read the lesson
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-sm transition-transform duration-200 group-hover:translate-x-1 text-[var(--text-main)]"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Matrix Callout */}
        <div className="surface mt-14 flex flex-wrap items-center justify-between gap-6 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-8">
          <div className="max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              Comparative Analysis
            </span>
            <h3 className="mt-1 font-display text-2xl font-bold text-[var(--text-main)]">
              Prefer to see them side by side?
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              The comparison matrix asks the same eight fundamental questions of every system.
            </p>
          </div>
          <LinkButton href="/compare">Compare the five systems</LinkButton>
        </div>
      </Container>
    </>
  );
}
