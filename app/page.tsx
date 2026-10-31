import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/design/Container";
import { LinkButton } from "@/components/design/LinkButton";
import { MarketConstellation } from "@/components/design/MarketConstellation";
import { TopicGlyph } from "@/components/design/TopicGlyph";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import type { TopicId } from "@/lib/schemas";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

const systems: ReadonlyArray<{
  id: TopicId;
  name: string;
  tagline: string;
  changesHands: string;
}> = [
  {
    id: "forex",
    name: "Forex",
    tagline: "Currency exchange",
    changesHands: "One currency exchanged for another at a quoted rate.",
  },
  {
    id: "stocks",
    name: "Stocks",
    tagline: "Company equity",
    changesHands: "A fractional ownership stake in a company.",
  },
  {
    id: "commodities",
    name: "Commodities",
    tagline: "Physical resources",
    changesHands: "Physical goods — or contracts tied to them.",
  },
  {
    id: "crypto",
    name: "Crypto",
    tagline: "Network consensus",
    changesHands: "Tokens and records kept on shared digital networks.",
  },
  {
    id: "sports-betting",
    name: "Sports betting",
    tagline: "Event wagering",
    changesHands:
      "A wager on an outcome, settled under an operator's rules. Not ownership of anything.",
  },
];

const studioFeatures = [
  {
    title: "Interactive Labs",
    desc: "6 hands-on models simulating FX quotes, leverage, supply shocks, blockchain ledgers, and uncertainty.",
    href: "/labs",
    kicker: "Simulations",
    action: "Launch labs",
  },
  {
    title: "Side-by-Side Matrix",
    desc: "Direct multi-dimensional comparison answering the same 8 fundamental questions across all 5 systems.",
    href: "/compare",
    kicker: "Analysis",
    action: "Open matrix",
  },
  {
    title: "18 Common Myths",
    desc: "Deconstruct popular internet misconceptions with primary source citations and regulatory facts.",
    href: "/myths",
    kicker: "Reality Check",
    action: "Debunk myths",
  },
  {
    title: "Live Presenter Deck",
    desc: "16:9 full-screen presentation mode built for classrooms, live streams, and teaching sessions.",
    href: "/present",
    kicker: "Presentation",
    action: "Enter deck",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          url: absoluteUrl("/"),
          inLanguage: "en",
        }}
      />

      {/* Hero Section */}
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-page)]"
      >
        <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:gap-10 lg:py-24 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2.5 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              <span
                className="h-2 w-2 rounded-none bg-[var(--btn-primary)] animate-pulse"
                aria-hidden="true"
              />
              <span>Interactive Market Literacy Studio</span>
            </div>

            <h1
              id="hero-title"
              className="mt-6 max-w-4xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.08] text-[var(--text-main)]"
            >
              Five worlds. <br className="hidden sm:inline" />
              Five mechanisms. <br />
              <span className="text-[var(--text-secondary)]">
                One clear view.
              </span>
            </h1>

            <p className="prose-mw mt-6 max-w-2xl text-lg text-[var(--text-secondary)] leading-relaxed">
              Forex, stocks, commodities, crypto and sports betting often get lumped together as
              ways to &ldquo;bet on prices&rdquo;. They are fundamentally different mechanisms.
              MARKETWISE explains what actually changes hands, who takes part, how prices or
              outcomes arise, and where the risks sit.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
              <LinkButton href="/explore" className="w-full sm:w-auto text-center">
                Explore the systems
              </LinkButton>
              <LinkButton href="/compare" variant="secondary" className="w-full sm:w-auto text-center">
                Compare side by side
              </LinkButton>
              <LinkButton href="/present" variant="secondary" className="w-full sm:w-auto text-center">
                Launch presentation ↗
              </LinkButton>
            </div>

            {/* Quick stats / highlights */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[var(--border-subtle)] pt-6 max-w-lg">
              <div>
                <p className="font-display text-2xl font-bold text-[var(--text-main)]">5</p>
                <p className="text-xs text-[var(--text-secondary)]">Complete lessons</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[var(--text-main)]">6</p>
                <p className="text-xs text-[var(--text-secondary)]">Interactive labs</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[var(--text-main)]">18</p>
                <p className="text-xs text-[var(--text-secondary)]">Myths debunked</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <MarketConstellation />
          </div>
        </Container>
      </section>

      {/* The Core Question Section */}
      <section aria-labelledby="question-title" className="py-20 sm:py-24 relative overflow-hidden">
        <Container>
          <div className="surface-elevated relative overflow-hidden rounded-none p-8 sm:p-12 border border-[var(--border-subtle)]">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center relative z-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                  Key Inquiry
                </span>
                <h2
                  id="question-title"
                  className="mt-4 font-display text-3xl font-extrabold sm:text-4xl text-[var(--text-main)] leading-snug"
                >
                  Is forex just sports betting in a suit?
                </h2>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-[var(--text-secondary)]">
                    Currency conversion ≠ Event odds
                  </span>
                  <span className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-[var(--text-secondary)]">
                    Commercial utility
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                <p className="p-4 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <strong className="text-[var(--text-main)] font-semibold">
                    No — they are fundamentally different activities with distinct mechanisms.
                  </strong>{" "}
                  A currency exchange rate, an equity share of a company, and a wager on a sports
                  match are different objects with distinct purposes, counterparties, and settlement
                  rules.
                </p>
                <p>
                  However, both can involve uncertainty, speculation, and behavioural biases. A
                  legitimate commercial market does not guarantee that retail speculation is
                  sensible or profitable.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Five Systems Section */}
      <section aria-labelledby="systems-title" className="py-12 border-t border-[var(--border-subtle)]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                Fundamental Taxonomy
              </span>
              <h2
                id="systems-title"
                className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-[var(--text-main)]"
              >
                Five systems, five different objects
              </h2>
              <p className="prose-mw mt-2 text-[var(--text-secondary)]">
                The first question to ask about any market is simple: what, exactly, changes hands?
              </p>
            </div>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-main)] hover:text-[var(--btn-hover)] transition-colors"
            >
              <span>See full comparison matrix</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {systems.map((system) => {
              return (
                <li key={system.id}>
                  <Link
                    href={`/explore/${system.id}`}
                    className="motion-lift group relative flex h-full flex-col justify-between rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all duration-300 hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)] transition-transform duration-300 group-hover:scale-110 group-hover:text-[var(--text-main)]">
                          <TopicGlyph topic={system.id} size={36} />
                        </span>
                        <span className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                          {system.tagline}
                        </span>
                      </div>

                      <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-[var(--text-main)]">
                        {system.name}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-secondary)] group-hover:text-[var(--text-main)] transition-colors">
                        <span className="sr-only">What changes hands: </span>
                        {system.changesHands}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold">
                      <span className="text-[var(--text-main)] underline underline-offset-4 group-hover:text-[var(--btn-primary)]">
                        Read the lesson<span className="sr-only"> on {system.name}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1 text-[var(--text-secondary)] group-hover:text-[var(--text-main)]"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Studio Interactive Modalities Section */}
      <section aria-labelledby="studio-title" className="py-20 border-t border-[var(--border-subtle)]">
        <Container>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Learning Modalities
            </span>
            <h2
              id="studio-title"
              className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-[var(--text-main)]"
            >
              Interactive Tools & Resources
            </h2>
            <p className="prose-mw mt-2 text-[var(--text-secondary)]">
              Built specifically for deep conceptual clarity through simulation, comparison, and
              active assessment.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {studioFeatures.map((feat) => (
              <div
                key={feat.title}
                className="surface group relative flex flex-col justify-between rounded-none p-6 transition-all duration-300 hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)]"
              >
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    {feat.kicker}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold text-[var(--text-main)] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{feat.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                  <Link
                    href={feat.href}
                    className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[var(--text-main)] hover:underline transition-colors"
                  >
                    <span>{feat.action}</span>
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
