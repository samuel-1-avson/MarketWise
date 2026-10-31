import Link from "next/link";
import { BrandMark } from "@/components/design/BrandMark";
import { Container } from "@/components/design/Container";
import { SITE_DISCLAIMER, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { footerGroups } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="mt-28 print:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] relative overflow-hidden">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.7fr_1fr_1fr] relative z-10">
        <div className="space-y-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 font-display text-lg font-bold text-[var(--text-main)] transition-colors"
          >
            <BrandMark size={28} />
            <span className="flex items-center gap-2">
              {SITE_NAME}
              <span className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-2 py-0.5 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Studio
              </span>
            </span>
          </Link>
          <p className="text-sm font-medium text-[var(--text-main)]">{SITE_TAGLINE}</p>
          <p className="max-w-prose text-xs leading-relaxed text-[var(--text-secondary)]">{SITE_DISCLAIMER}</p>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.heading} aria-label={`Footer: ${group.heading}`}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              {group.heading}
            </h2>
            <ul className="mt-4 space-y-1.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex min-h-9 items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-main)]"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-150 group-hover:translate-x-1 text-[var(--text-secondary)]"
                    >
                      ›
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] py-5">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
          <p>
            No accounts, no tracking, no live market data. Preferences you choose are stored only in
            your own browser.
          </p>
          <span className="inline-flex items-center gap-2 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 font-mono text-[0.7rem] text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-none bg-[var(--btn-primary)] animate-pulse" aria-hidden="true" />
            Educational Studio v0.1
          </span>
        </Container>
      </div>
    </footer>
  );
}
