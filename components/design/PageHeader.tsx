import type { ReactNode } from "react";
import { Container } from "@/components/design/Container";

export function PageHeader({
  kicker,
  title,
  children,
  accentClass = "text-[var(--text-main)]",
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
  accentClass?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <Container className="py-12 sm:py-16">
        <div className="inline-flex items-center gap-2 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
          <span className="h-1.5 w-1.5 rounded-none bg-[var(--btn-primary)]" aria-hidden="true" />
          <span className={accentClass}>{kicker}</span>
        </div>
        <h1 className="mt-5 max-w-4xl font-display text-3xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-5xl lg:text-6xl leading-[1.1]">
          {title}
        </h1>
        {children ? (
          <div className="prose-mw mt-5 text-lg text-[var(--text-secondary)] leading-relaxed">
            {children}
          </div>
        ) : null}
      </Container>
    </header>
  );
}
