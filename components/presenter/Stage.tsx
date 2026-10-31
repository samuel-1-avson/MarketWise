"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export const STAGE_W = 1920;
export const STAGE_H = 1080;

/**
 * Fits a fixed 1920 × 1080 slide into whatever space is available, preserving 16:9, so type sizes are
 * authored once for 1080p capture and scale down cleanly to 720p and smaller windows.
 */
export function Stage({ children }: { children: ReactNode }) {
  const holder = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = holder.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      // If the space cannot be measured (not laid out yet), show the slide at its design size
      // rather than leaving it hidden.
      setScale(width > 0 && height > 0 ? Math.min(width / STAGE_W, height / STAGE_H) : 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={holder} className="relative h-full w-full overflow-hidden" data-testid="stage-holder">
      <div
        data-testid="stage"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: STAGE_W,
          height: STAGE_H,
          transform: `translate(-50%, -50%) scale(${scale ?? 1})`,
          transformOrigin: "center",
          visibility: scale === null ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
}
