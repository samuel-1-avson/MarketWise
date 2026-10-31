import Link from "next/link";
import { Container } from "@/components/design/Container";
import { IllustrativeBadge } from "@/components/design/IllustrativeBadge";
import { PageHeader } from "@/components/design/PageHeader";
import { LabGlyph } from "@/components/labs/LabGlyph";
import { labs } from "@/content/labs";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta(
  "/labs",
  "Concept labs",
  "Six small interactive models that make one idea at a time visible: reading a currency quote, leverage, fractional ownership, supply shocks, a shared ledger and uncertainty. All values are fixed and fictional.",
);

export default function LabsPage() {
  return (
    <>
      <PageHeader kicker="Simulation Lab" title="Six small models, one idea each">
        <p>
          Each lab isolates a single mechanical idea with interactive parameters, an automated
          plain-language explanation of what is showing, and an explicit statement of model
          boundaries. All values are invented and deterministic.
        </p>
      </PageHeader>

      <Container className="py-14 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <IllustrativeBadge />
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Deterministic educational simulations
          </span>
        </div>

        <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {labs.map((lab, i) => (
            <li key={lab.id}>
              <Link
                href={`/labs/${lab.id}`}
                className="surface group relative flex h-full flex-col justify-between rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7 transition-all duration-300 hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)]"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-2.5 transition-transform duration-300 group-hover:scale-105">
                      <LabGlyph lab={lab} size={34} />
                    </span>
                    <span className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-1 font-mono text-xs font-semibold text-[var(--text-secondary)]">
                      Lab 0{i + 1}
                    </span>
                  </div>

                  <h2 className="mt-6 font-display text-2xl font-bold text-[var(--text-main)] transition-colors">
                    {lab.title}
                  </h2>
                  <p className="mt-2 font-display text-sm font-semibold text-[var(--text-main)]">
                    {lab.concept}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-secondary)] transition-colors">
                    {lab.summary}
                  </p>

                  <div className="mt-6 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text-main)]">Not included: </span>
                    {lab.limits}
                  </div>
                </div>

                <div className="mt-7 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="inline-flex items-center font-semibold text-sm underline underline-offset-4 group-hover:no-underline text-[var(--text-main)]">
                    Open the lab
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
      </Container>
    </>
  );
}
