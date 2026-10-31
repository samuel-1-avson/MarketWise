"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { useMotionPreference } from "@/hooks/useMotionPreference";

/**
 * Applies the reduced-motion preference to the document (for CSS) and to the Motion library
 * (for JS-driven animation) from a single source of truth.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  useEffect(() => {
    const sync = () => {
      document.documentElement.dataset.pageHidden = document.hidden ? "true" : "false";
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      delete document.documentElement.dataset.pageHidden;
    };
  }, []);

  return <MotionConfig reducedMotion={reduced ? "always" : "user"}>{children}</MotionConfig>;
}
