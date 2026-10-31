"use client";

import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PageTransition } from "@/components/layout/PageTransition";
import { ReturnToDeck } from "@/components/layout/ReturnToDeck";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { isImmersivePath, shouldFocusMain } from "@/lib/presenter/navigation";

export { isImmersivePath, shouldFocusMain };

/**
 * Wraps pages in the site header and footer, except for the live deck, which is full-screen. The
 * `#main` landmark exists in both modes so the skip link always works.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const firstPath = useRef(true);
  const previousPath = useRef(pathname);

  // After a client navigation, move focus to the main landmark unless the link targeted a fragment
  // or the change is only the next slide in the live deck.
  useEffect(() => {
    const previous = previousPath.current;
    previousPath.current = pathname;
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    if (!shouldFocusMain(previous, pathname, window.location.hash.length > 0)) return;
    document.getElementById("main")?.focus();
  }, [pathname]);

  const page = <PageTransition>{children}</PageTransition>;

  if (isImmersivePath(pathname)) {
    return (
      <main id="main" tabIndex={-1} className="outline-none">
        {page}
      </main>
    );
  }

  return (
    <>
      <SiteHeader />
      <Suspense fallback={null}>
        <ReturnToDeck />
      </Suspense>
      <main id="main" tabIndex={-1} className="outline-none">
        {page}
      </main>
      <SiteFooter />
    </>
  );
}
