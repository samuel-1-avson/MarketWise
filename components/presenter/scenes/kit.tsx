import type { CSSProperties, ReactNode } from "react";
import { TopicGlyph } from "@/components/design/TopicGlyph";
import { sceneDescription } from "@/content/sceneText";
import { ILLUSTRATIVE_LABEL } from "@/lib/constants";
import type { TopicId } from "@/lib/schemas";
/** Scene drawing surface: 1700 × 600 user units, shown inside a 1920 × 1080 slide. */
export const SW = 1700;
export const SH = 600;

export const INK = "var(--color-ink)";
export const MUTED = "var(--color-muted)";
export const MIDNIGHT = "var(--color-midnight)";
export const RAISED = "var(--color-raised)";
export const EDGE = "var(--color-edge)";

export const topicColor = (topic?: TopicId): string => {
  void topic;
  return "var(--border-subtle, #3F3F39)";
};
export const TOPIC_NAMES: Record<TopicId, string> = {
  forex: "Forex",
  stocks: "Stocks",
  commodities: "Commodities",
  crypto: "Crypto",
  "sports-betting": "Sports betting",
};

/**
 * The drawing surface. The accessible name is the scene description from content, which is also the
 * visible text version and the handout copy.
 */
export function SceneSvg({ visual, children }: { visual: string; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${SW} ${SH}`}
      role="img"
      aria-label={sceneDescription(visual)}
      className="h-full w-full overflow-visible"
      fontFamily="var(--font-sans)"
    >
      <defs>
        <linearGradient id="scene-plate-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--bg-surface-elevated, #262624)" />
          <stop offset="100%" stopColor="var(--bg-surface, #1D1D1B)" />
        </linearGradient>
        <linearGradient id="scene-plate-tint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <filter id="scene-soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
        </filter>
        <filter id="scene-glow-core" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {children}
    </svg>
  );
}

/** Staggered entrance: each group rises in turn. Reduced motion collapses it to no animation. */
export function Rise({ i = 0, children }: { i?: number; children: ReactNode }) {
  return (
    <g className="scene-rise" style={{ "--i": i } as CSSProperties}>
      {children}
    </g>
  );
}

type TextProps = {
  x: number;
  y: number;
  size?: number;
  weight?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  children: ReactNode;
  display?: boolean;
  className?: string;
};

export function T({
  x,
  y,
  size = 32,
  weight = 500,
  fill = INK,
  anchor = "start",
  display = false,
  className,
  children,
}: TextProps) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      textAnchor={anchor}
      fontFamily={display ? "var(--font-display)" : undefined}
      className={className}
    >
      {children}
    </text>
  );
}

/** Several lines of text stacked downward. */
export function Lines({
  x,
  y,
  lines,
  size = 30,
  gap = 1.3,
  fill = MUTED,
  anchor = "start",
  weight = 500,
}: {
  x: number;
  y: number;
  lines: readonly string[];
  size?: number;
  gap?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  weight?: number;
}) {
  return (
    <>
      {lines.map((line, i) => (
        <T
          key={`${line}-${i}`}
          x={x}
          y={y + i * size * gap}
          size={size}
          fill={fill}
          anchor={anchor}
          weight={weight}
        >
          {line}
        </T>
      ))}
    </>
  );
}

export function Plate({
  x,
  y,
  w,
  h,
  color,
  fill = "var(--bg-surface, #1D1D1B)",
  dashed = false,
  strokeWidth = 1.5,
  radius = 0,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  fill?: string;
  dashed?: boolean;
  strokeWidth?: number;
  radius?: number;
  children?: ReactNode;
}) {
  const borderColor = color || "var(--border-subtle, #3F3F39)";
  void radius;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={0}
        fill={fill}
        stroke={borderColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? "8 6" : undefined}
      />
      {children}
    </g>
  );
}

/** A straight arrow with a drawn head, with self-animating flowing dashes when dashed. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = MUTED,
  width = 4,
  head = 20,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  head?: number;
  dashed?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const bx = x2 - Math.cos(angle) * head * 0.9;
  const by = y2 - Math.sin(angle) * head * 0.9;
  const spread = Math.PI / 7;
  const p1 = `${x2 - Math.cos(angle - spread) * head},${y2 - Math.sin(angle - spread) * head}`;
  const p2 = `${x2 - Math.cos(angle + spread) * head},${y2 - Math.sin(angle + spread) * head}`;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "14 10" : undefined}
        className={dashed ? "svg-flow-dash" : undefined}
      />
      <polygon points={`${x2},${y2} ${p1} ${p2}`} fill={color} />
    </g>
  );
}

/** Width of a Chip, matching the rectangle it draws. */
export function chipWidth(text: string, size = 28): number {
  return Math.round(text.length * size * 0.56 + 44);
}

/** Squared label whose width follows its text. */
export function Chip({
  x,
  y,
  text,
  color = "var(--border-subtle, #3F3F39)",
  size = 28,
  fill = "var(--bg-surface-elevated, #262624)",
  textFill = INK,
  anchor = "start",
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  fill?: string;
  textFill?: string;
  anchor?: "start" | "middle";
}) {
  const w = chipWidth(text, size);
  const h = Math.round(size * 1.75);
  const left = anchor === "middle" ? x - w / 2 : x;
  return (
    <g>
      <rect
        x={left}
        y={y}
        width={w}
        height={h}
        rx={0}
        fill={fill}
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={left + w / 2}
        y={y + h / 2 + size * 0.34}
        fontSize={size}
        fontWeight={600}
        fill={textFill}
        textAnchor="middle"
      >
        {text}
      </text>
    </g>
  );
}

/** A topic's outline glyph, coloured with its identity colour. */
export function Glyph({
  topic,
  x,
  y,
  size = 64,
}: {
  topic: TopicId;
  x: number;
  y: number;
  size?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`} style={{ color: "var(--text-secondary, #BDBBB2)" }}>
      <TopicGlyph topic={topic} size={size} />
    </g>
  );
}

/** Required beside every scene that shows invented numbers. */
export function FictionTag({ x = SW - 24, y = SH - 56 }: { x?: number; y?: number }) {
  const size = 28;
  const w = Math.round(ILLUSTRATIVE_LABEL.length * size * 0.56 + 64);
  return (
    <g>
      <rect
        x={x - w}
        y={y}
        width={w}
        height={48}
        rx={0}
        fill="var(--bg-surface-elevated, #262624)"
        stroke="var(--border-subtle, #3F3F39)"
        strokeWidth={1.5}
      />
      <text
        x={x - w / 2}
        y={y + 33}
        fontSize={size}
        fontWeight={600}
        fill="var(--text-secondary, #BDBBB2)"
        textAnchor="middle"
      >
        {`⚠ ${ILLUSTRATIVE_LABEL}`}
      </text>
    </g>
  );
}
