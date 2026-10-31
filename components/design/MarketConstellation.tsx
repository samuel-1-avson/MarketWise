"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { TopicGlyph } from "@/components/design/TopicGlyph";
import type { TopicId } from "@/lib/schemas";

const BODIES: readonly {
  id: TopicId;
  name: string;
  tagline: string;
  angleOffset: number;
}[] = [
  { id: "forex", name: "Forex", tagline: "Currency Pairs", angleOffset: 0 },
  { id: "stocks", name: "Stocks", tagline: "Company Equity", angleOffset: 1 },
  { id: "commodities", name: "Commodities", tagline: "Physical Goods", angleOffset: 2 },
  { id: "crypto", name: "Crypto", tagline: "Distributed Ledgers", angleOffset: 3 },
  { id: "sports-betting", name: "Sports betting", tagline: "Event Wagers", angleOffset: 4 },
];

/**
 * Five topic bodies on an orbital perimeter around the central query.
 * Crisp minimal architectural layout with squared nodes.
 */
export function MarketConstellation() {
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);

  return (
    <figure
      aria-labelledby="constellation-caption"
      className="relative mx-auto w-full max-w-lg select-none"
      data-testid="constellation"
    >
      <figcaption id="constellation-caption" className="sr-only">
        Five systems arranged in an orbit around a question mark: forex, stocks, commodities, crypto
        and sports betting. Each name is a link to that lesson.
      </figcaption>

      <div className="relative aspect-square w-full">
        {/* Orbital SVG Canvas - Squared architectural lines */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-hidden="true"
          focusable="false"
        >
          {/* Outer coordinate reticle ring */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="0.4"
            strokeDasharray="1.5 2.5"
            opacity="0.4"
          />

          {/* Main primary orbit bounds - squared minimal architectural boundary */}
          <rect
            x="18"
            y="22"
            width="64"
            height="56"
            rx="0"
            fill="none"
            stroke={activeTopic ? "var(--btn-primary)" : "var(--border-subtle)"}
            strokeWidth={activeTopic ? "0.8" : "0.5"}
            strokeDasharray={activeTopic ? "none" : "1.5 2.2"}
            className="transition-all duration-300"
            opacity="0.75"
          />

          {/* Inner resonance box */}
          <rect
            x="34"
            y="37"
            width="32"
            height="26"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="0.4"
            strokeDasharray="1.2 2.4"
            opacity="0.4"
          />

          {/* Crosshair axis markers */}
          <line x1="50" y1="4" x2="50" y2="10" stroke="var(--border-subtle)" strokeWidth="0.4" />
          <line x1="50" y1="90" x2="50" y2="96" stroke="var(--border-subtle)" strokeWidth="0.4" />
          <line x1="4" y1="50" x2="10" y2="50" stroke="var(--border-subtle)" strokeWidth="0.4" />
          <line x1="90" y1="50" x2="96" y2="50" stroke="var(--border-subtle)" strokeWidth="0.4" />
        </svg>

        {/* Central Hub - Squared */}
        <div
          aria-hidden="true"
          className="constellation-in pointer-events-none absolute left-1/2 top-1/2 z-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] backdrop-blur-md sm:h-20 sm:w-20 transition-all duration-300"
          style={{ "--i": 0 } as CSSProperties}
        >
          <span className="font-display text-2xl font-black text-[var(--text-main)] sm:text-3xl leading-none">
            ?
          </span>
          <span className="text-[0.55rem] font-medium tracking-tight text-[var(--text-secondary)] sm:text-[0.62rem] uppercase mt-0.5">
            Compare
          </span>
        </div>

        {/* Five Orbiting Bodies - Squared */}
        {BODIES.map((body, index) => {
          const angle = -Math.PI / 2 + (index * 2 * Math.PI) / BODIES.length;
          const left = 50 + 32 * Math.cos(angle);
          const top = 50 + 28 * Math.sin(angle);
          const isHovered = activeTopic === body.id;

          return (
            <Link
              key={body.id}
              href={`/explore/${body.id}`}
              onMouseEnter={() => setActiveTopic(body.id)}
              onMouseLeave={() => setActiveTopic(null)}
              onFocus={() => setActiveTopic(body.id)}
              onBlur={() => setActiveTopic(null)}
              className={`constellation-in group absolute z-10 flex w-[5.8rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-none border px-2 py-2 text-center text-xs font-semibold leading-tight backdrop-blur-md transition-all duration-300 sm:w-32 sm:px-3 sm:py-2.5 sm:text-sm ${
                isHovered
                  ? "scale-105 border-[var(--btn-primary)] bg-[var(--bg-surface-elevated)] text-[var(--text-main)] shadow-none"
                  : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)]"
              }`}
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  "--i": index + 1,
                } as CSSProperties
              }
            >
              <span className="motion-lift flex flex-col items-center gap-1">
                <span className="text-[var(--text-secondary)] transition-transform duration-200 group-hover:scale-110 group-hover:text-[var(--text-main)]">
                  <TopicGlyph topic={body.id} size={28} />
                </span>
                <span className="font-bold tracking-tight text-[var(--text-main)]">
                  {body.name}
                  <span className="sr-only"> lesson</span>
                </span>
                <span className="hidden sm:block text-[0.65rem] font-normal text-[var(--text-secondary)]">
                  {body.tagline}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </figure>
  );
}
