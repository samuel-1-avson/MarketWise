import { Container } from "@/components/design/Container";
import { PageHeader } from "@/components/design/PageHeader";
import { ClearDataButton } from "@/components/layout/ClearDataButton";
import { SITE_DISCLAIMER } from "@/lib/constants";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta(
  "/about",
  "About",
  "Why MARKETWISE exists, what it will and will not do, and how it handles examples, sources and your data.",
);

export default function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="Educational Framing"
        title="A learning studio, not a trading desk or a betting site."
      >
        <p>
          MARKETWISE helps people tell five very different things apart: foreign exchange, stocks,
          commodities, crypto and sports betting. Each one gets a plain-language explanation of what
          changes hands, why the system exists, who takes part, how prices or outcomes come about
          and where the risks sit.
        </p>
      </PageHeader>

      <Container className="py-12 sm:py-16 space-y-10">
        <div className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-6">
          <p className="font-medium text-[var(--text-main)] leading-relaxed">{SITE_DISCLAIMER}</p>
        </div>

        <section
          aria-labelledby="not-title"
          className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
        >
          <h2 id="not-title" className="font-display text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            What this site will never do
          </h2>
          <ul className="prose-mw mt-4 list-disc space-y-2.5 pl-6 text-[var(--text-secondary)] leading-relaxed">
            <li>
              Place, simulate or walk you through trades, or connect to a broker, exchange or
              wallet.
            </li>
            <li>
              Give signals, tips, picks, personal recommendations or predictions about any price or
              result.
            </li>
            <li>
              Show live market data. Every number you see is fictional and is labelled as such.
            </li>
            <li>
              Offer betting odds, payout calculators, wager simulations, or links to gambling
              services. Sports betting appears only so it can be told apart from financial markets
              and its risks can be discussed honestly.
            </li>
            <li>
              Ask you to sign up, take deposits, run advertising, or use referral and affiliate
              links.
            </li>
          </ul>
        </section>

        <section
          aria-labelledby="examples-title"
          className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
        >
          <h2 id="examples-title" className="font-display text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            How examples and sources work
          </h2>
          <div className="prose-mw mt-4 space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p>
              Worked examples use invented numbers so that the idea is clear without implying
              anything about today&rsquo;s markets. Wherever a visual shows sample values, it
              carries the label{" "}
              <strong className="text-[var(--text-main)]">&ldquo;Illustrative only — not live data&rdquo;</strong>.
              Familiar settings such as Ghanaian importers paying in dollars, or cocoa and gold, are
              used to make ideas concrete; they are not statements about current prices, regulations
              or what is permitted in any country.
            </p>
            <p>
              Factual claims are tied to named sources with a review status. Where a source has not
              yet been checked by an editor, it is marked as needing verification rather than
              presented as confirmed.
            </p>
            <p>
              Rules differ between countries and change over time. Nothing here is legal, tax or
              investment advice for your situation; if you need that, speak to a qualified, locally
              licensed professional.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="privacy-title"
          className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
        >
          <h2 id="privacy-title" className="font-display text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            Your data
          </h2>
          <div className="prose-mw mt-4 text-[var(--text-secondary)] leading-relaxed">
            <p>
              There are no accounts, no analytics and no tracking. The only things stored are
              choices you make yourself — the reduce-motion setting and, if you tick the box on the
              quiz page, which questions you answered correctly — and they live in your own browser,
              never on a server. You can remove them at any time.
            </p>
          </div>
          <div className="mt-6">
            <ClearDataButton />
          </div>
        </section>
      </Container>
    </>
  );
}
