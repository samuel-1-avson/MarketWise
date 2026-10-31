import { Container } from "@/components/design/Container";
import { PageHeader } from "@/components/design/PageHeader";
import { sources } from "@/content/sources";
import { lessons } from "@/content/topics";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta(
  "/resources",
  "Sources and limitations",
  "Every source used on this site with its publisher, the date it was reviewed, what it supports and its jurisdiction caveats — plus how content is reviewed and what it cannot tell you.",
);

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function ResourcesPage() {
  const usedBy = (id: string) =>
    lessons
      .filter((l) => l.readingSourceIds.includes(id))
      .map((l) => l.title.split(":")[0] ?? l.title);

  return (
    <>
      <PageHeader kicker="Verified Evidence" title="Sources, methods and limits">
        <p>
          Claims on this site point to authoritative public-sector sources below. Each entry shows
          when it was reviewed, what it supports, and its jurisdictional scope.
        </p>
      </PageHeader>

      <Container className="py-12 sm:py-16">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <h2 className="font-display text-2xl font-bold text-[var(--text-main)] sm:text-3xl">Source Index</h2>
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            {sources.length} authoritative references
          </span>
        </div>

        <ul className="mt-8 grid gap-6">
          {sources.map((source) => (
            <li
              key={source.id}
              id={source.id}
              className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-7 transition-all hover:border-[var(--btn-primary)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="max-w-3xl font-display text-xl font-bold text-[var(--text-main)] sm:text-2xl">
                  {source.title}
                </h3>
                <p className="inline-flex items-center gap-1.5 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-1 font-mono text-xs font-semibold text-[var(--text-main)]">
                  <span aria-hidden="true">{source.status === "verified" ? "✓" : "!"}</span>
                  {source.status === "verified" && source.reviewedOn
                    ? `Verified ${formatDate(source.reviewedOn)}`
                    : "Needs editorial verification"}
                </p>
              </div>

              <p className="mt-1.5 font-mono text-sm font-medium text-[var(--text-secondary)]">{source.publisher}</p>

              <dl className="mt-5 grid gap-3 text-sm border-t border-[var(--border-subtle)] pt-4">
                <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3">
                  <dt className="font-semibold text-[var(--text-main)]">Used to support</dt>
                  <dd className="mt-0.5 text-[var(--text-secondary)] leading-relaxed">{source.supports}</dd>
                </div>
                {source.pageDate ? (
                  <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3">
                    <dt className="font-semibold text-[var(--text-main)]">Date on the page</dt>
                    <dd className="mt-0.5 text-[var(--text-secondary)]">{source.pageDate}</dd>
                  </div>
                ) : null}
                {source.caveat ? (
                  <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3">
                    <dt className="font-semibold text-[var(--text-main)]">Caveat</dt>
                    <dd className="mt-0.5 text-[var(--text-secondary)]">{source.caveat}</dd>
                  </div>
                ) : null}
                <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3">
                  <dt className="font-semibold text-[var(--text-main)]">Cited in</dt>
                  <dd className="mt-0.5 text-[var(--text-secondary)]">
                    {usedBy(source.id).join(", ") || "Quizzes, myths and glossary"}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center gap-1.5 font-semibold text-[var(--text-main)] underline underline-offset-4 hover:text-[var(--btn-primary)] transition-colors"
                >
                  <span>Open this source page</span>
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">: {source.title} (opens in a new tab)</span>
                </a>
                <span className="max-w-md truncate font-mono text-[0.7rem] text-[var(--text-secondary)]">
                  {source.url}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <section
            aria-labelledby="method-title"
            className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
          >
            <h2 id="method-title" className="font-display text-2xl font-bold text-[var(--text-main)]">
              How content is reviewed
            </h2>
            <ul className="prose-mw mt-4 list-disc space-y-2.5 pl-6 text-sm text-[var(--text-secondary)] leading-relaxed">
              <li>
                A source is marked verified only after its page was opened and read; the date shown
                is that day.
              </li>
              <li>
                Each lesson states which of its claims come from cited sources and which are general
                explanation still needing a source.
              </li>
              <li>
                Numbers in examples are invented. Any visual with sample values carries the label
                &ldquo;Illustrative only — not live data&rdquo;.
              </li>
              <li>
                Quiz and myth explanations cite their sources or say they are general reasoning.
              </li>
              <li>Sources are re-checked before each release; links can move or change.</li>
            </ul>
          </section>

          <section
            aria-labelledby="limits-title"
            className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
          >
            <h2 id="limits-title" className="font-display text-2xl font-bold text-[var(--text-main)]">
              What this site cannot tell you
            </h2>
            <ul className="prose-mw mt-4 list-disc space-y-2.5 pl-6 text-sm text-[var(--text-secondary)] leading-relaxed">
              <li>
                Nothing here is financial, legal or tax advice, or a recommendation about any
                decision.
              </li>
              <li>
                The sources are from the United States, Australia and England. They illustrate
                general mechanisms and risks, not the rules in Ghana or anywhere else.
              </li>
              <li>
                No live prices, exchange rates or odds are used, and no regulatory permissions or
                rules are claimed.
              </li>
              <li>
                There is no Ghana-specific source yet. Where lessons use Ghanaian settings, they are
                fictional stories.
              </li>
              <li>
                A World Health Organization gambling fact sheet was considered but could not be read
                in the review environment, so it is not cited.
              </li>
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}
