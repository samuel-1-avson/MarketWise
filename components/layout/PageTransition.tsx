"use client";

import { usePathname } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";
import { motion } from "motion/react";
import { isImmersivePath } from "@/lib/presenter/navigation";

/**
 * Crossfades and animates page content on navigation. The header and footer sit outside this boundary,
 * so they stay put. The overlay ignores pointer events (see globals.css), and reduced motion removes the fade.
 * Slide changes stay on one key: the deck keeps its own state, and remounting it would jump back to
 * the first slide.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const key = isImmersivePath(pathname) ? "/present" : pathname;
  return (
    <ViewTransition
      key={key}
      name="page-content"
      enter="page-enter"
      exit="page-exit"
      default="none"
    >
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {children}
      </motion.div>
    </ViewTransition>
  );
}
