"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import { MotionToggle } from "@/components/a11y/MotionToggle";
import { ThemeToggle } from "@/components/a11y/ThemeToggle";
import { BrandMark } from "@/components/design/BrandMark";
import { Container } from "@/components/design/Container";
import { SITE_NAME } from "@/lib/constants";
import { primaryNav, type NavItem } from "@/lib/routes";

function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ pathname, vertical }: { pathname: string; vertical?: boolean }) {
  return (
    <ul className={vertical ? "flex flex-col gap-1" : "flex items-center gap-1"}>
      {primaryNav.map((item: NavItem) => {
        const current = isCurrent(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={`relative inline-flex min-h-10 items-center gap-2 rounded-none px-3.5 text-[0.915rem] font-medium transition-all duration-[var(--duration-fast)] ease-out ${
                current
                  ? "border-b-2 border-[var(--btn-primary)] bg-[var(--bg-surface)] text-[var(--text-main)] shadow-none font-semibold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-main)] active:scale-95"
              }`}
            >
              {current ? (
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-none bg-[var(--btn-primary)]"
                />
              ) : null}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const summaryRef = useRef<HTMLElement>(null);

  // Close the mobile menu after navigating (adjusting state during render, not in an effect).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDetailsElement>) => {
    if (event.key === "Escape" && open) {
      setOpen(false);
      summaryRef.current?.focus();
    }
  };

  return (
    <header className="sticky top-0 z-50 print:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/95 backdrop-blur-md transition-all duration-300">
      <Container className="flex items-center justify-between gap-3 py-2.5">
        <Link
          href="/"
          className="group inline-flex min-h-11 items-center gap-2.5 rounded-none pr-2 font-display text-lg font-bold tracking-tight text-[var(--text-main)] transition-colors hover:text-[var(--btn-hover)]"
        >
          <BrandMark />
          <span className="flex items-center gap-2">
            {SITE_NAME}
            <span className="hidden sm:inline-block rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Studio
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-2 xl:flex">
          <NavLinks pathname={pathname} />
          <Link
            href="/present"
            className="ml-2 inline-flex min-h-9 items-center gap-1.5 rounded-none border border-[var(--btn-primary)] bg-[var(--btn-primary)] px-3.5 py-1 text-xs font-semibold text-[var(--btn-primary-text)] transition-all duration-200 hover:bg-[var(--btn-hover)] active:scale-95"
          >
            <span>Present</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <MotionToggle className="ml-1" />
          <ThemeToggle className="ml-1 inline-flex min-h-9 items-center gap-1.5 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold text-[var(--text-main)] transition-all hover:bg-[var(--bg-surface-elevated)]" />
        </nav>

        <details
          className="relative xl:hidden"
          open={open}
          onToggle={(event) => setOpen(event.currentTarget.open)}
          onKeyDown={onKeyDown}
        >
          <summary
            ref={summaryRef}
            className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-sm font-semibold text-[var(--text-main)] transition-all hover:bg-[var(--bg-surface-elevated)] [&::-webkit-details-marker]:hidden"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              {open ? "✕" : "☰"}
            </span>
            <span>Menu</span>
          </summary>
          <nav
            aria-label="Primary"
            className="surface absolute right-0 top-[calc(100%+0.5rem)] w-72 max-w-[calc(100vw-2rem)] rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 shadow-none"
          >
            <NavLinks pathname={pathname} vertical />
            <div className="mt-3 border-t border-[var(--border-subtle)] pt-3 flex flex-col gap-2">
              <Link
                href="/present"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-none border border-[var(--btn-primary)] bg-[var(--btn-primary)] px-4 text-sm font-semibold text-[var(--btn-primary-text)] transition-all hover:bg-[var(--btn-hover)]"
              >
                <span>Launch Presentation</span>
                <span aria-hidden="true">↗</span>
              </Link>
              <MotionToggle className="w-full justify-center" />
              <ThemeToggle className="w-full justify-center inline-flex min-h-10 items-center gap-2 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]" />
            </div>
          </nav>
        </details>
      </Container>
    </header>
  );
}
