import { useId, type CSSProperties, type ReactNode } from "react";
import { IllustrativeBadge } from "@/components/design/IllustrativeBadge";
import type { FlowDiagram as DiagramData } from "@/content/diagrams";
import type { TopicId } from "@/lib/schemas";
import { topicTone } from "@/lib/tokens";

const INK = "var(--text-main, #F4F2EA)";
const MUTED = "var(--text-secondary, #BDBBB2)";
const MIDNIGHT = "var(--bg-surface-elevated, #262624)";

/**
 * One bespoke picture per topic. The ordered mechanism stays in the text version; the picture is not
 * a repeated vertical flow. Groups fade in once (scene-rise) and then stay still.
 */
export function TopicIllustration({ topic, diagram }: { topic: TopicId; diagram: DiagramData }) {
  const uid = `ti${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const accent = topicTone[topic].color;

  return (
    <figure className="surface p-4 sm:p-6" data-illustration={topic}>
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span id={titleId} className="font-display text-lg font-bold text-ink">
          {diagram.title}
        </span>
        {diagram.usesIllustrativeNumbers ? <IllustrativeBadge /> : null}
      </figcaption>
      <p id={descId} className="mb-4 max-w-[68ch] text-base text-muted">
        {diagram.summary}
      </p>

      <svg
        viewBox="0 0 560 340"
        role="img"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="mx-auto h-auto w-full max-w-xl"
        fontFamily="var(--font-sans)"
      >
        {topic === "forex" ? <ForexPicture accent={accent} /> : null}
        {topic === "stocks" ? <StocksPicture accent={accent} /> : null}
        {topic === "commodities" ? <CommoditiesPicture accent={accent} /> : null}
        {topic === "crypto" ? <CryptoPicture accent={accent} /> : null}
        {topic === "sports-betting" ? <SportsPicture accent={accent} /> : null}
      </svg>

      <details className="group mt-4 text-base text-muted">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-ink [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden="true"
            className="transition-transform duration-[var(--duration-fast)] group-open:rotate-90"
          >
            ▸
          </span>
          Text version of this diagram
        </summary>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          {diagram.nodes.map((node, i) => (
            <li key={node.label}>
              <strong className="text-ink">{node.label}</strong> — {node.lines.join(" ")}
              {diagram.links[i] ? (
                <em className="block text-muted">then: {diagram.links[i]}</em>
              ) : null}
            </li>
          ))}
        </ol>
      </details>
    </figure>
  );
}

function Rise({ i, children }: { i: number; children: ReactNode }) {
  return (
    <g className="scene-rise" style={{ "--i": i } as CSSProperties}>
      {children}
    </g>
  );
}

function ForexPicture({ accent }: { accent: string }) {
  return (
    <>
      <Rise i={0}>
        <rect
          x="16"
          y="28"
          width="230"
          height="190"
          rx="0"
          fill={MIDNIGHT}
          stroke={accent}
          strokeWidth="2"
        />
        <text x="131" y="108" textAnchor="middle" fontSize="32" fontWeight="700" fill={accent}>
          US dollar
        </text>
        <text x="131" y="156" textAnchor="middle" fontSize="28" fill={MUTED}>
          USD/GHS: one
        </text>
      </Rise>
      <Rise i={1}>
        <rect
          x="314"
          y="28"
          width="230"
          height="190"
          rx="0"
          fill={MIDNIGHT}
          stroke={accent}
          strokeWidth="2"
        />
        <text x="429" y="108" textAnchor="middle" fontSize="32" fontWeight="700" fill={accent}>
          Ghana cedis
        </text>
        <text x="429" y="156" textAnchor="middle" fontSize="28" fill={MUTED}>
          USD/GHS: 10.00
        </text>
      </Rise>
      <Rise i={2}>
        <line x1="252" y1="124" x2="308" y2="124" stroke={INK} strokeWidth="2.5" />
        <polygon points="308,124 294,116 294,132" fill={INK} />
      </Rise>
      <Rise i={3}>
        <text x="280" y="268" textAnchor="middle" fontSize="28" fontWeight="700" fill={INK}>
          Invented USD/GHS: 1 = 10.00
        </text>
        <text x="280" y="312" textAnchor="middle" fontSize="28" fill={MUTED}>
          This pair only, not either currency
        </text>
      </Rise>
    </>
  );
}

function StocksPicture({ accent }: { accent: string }) {
  const cells = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const n = row * 8 + col;
      cells.push(
        <rect
          key={n}
          x={300 + col * 28}
          y={48 + row * 28}
          width="22"
          height="22"
          rx="0"
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
        />,
      );
    }
  }
  return (
    <>
      <Rise i={0}>
        <rect
          x="24"
          y="36"
          width="220"
          height="220"
          rx="0"
          fill={MIDNIGHT}
          stroke={accent}
          strokeWidth="2"
        />
        <path
          d="M78 168 h112 v-36 l-56 -40 l-56 40 z"
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinejoin="miter"
        />
        <rect x="118" y="148" width="24" height="20" rx="0" fill="none" stroke={accent} strokeWidth="2" />
        <text x="134" y="214" textAnchor="middle" fontSize="28" fontWeight="700" fill={INK}>
          Company
        </text>
      </Rise>
      <Rise i={1}>
        <line x1="252" y1="140" x2="292" y2="140" stroke={INK} strokeWidth="2.5" />
        <polygon points="292,140 278,132 278,148" fill={INK} />
        {cells}
      </Rise>
      <Rise i={2}>
        <text x="280" y="250" textAnchor="middle" fontSize="28" fontWeight="700" fill={accent}>
          The grid stands for 1,000 shares
        </text>
        <text x="280" y="290" textAnchor="middle" fontSize="28" fill={INK}>
          10 shares is 1%, not these squares
        </text>
        <text x="280" y="328" textAnchor="middle" fontSize="28" fill={MUTED}>
          Ownership, not a promised payment
        </text>
      </Rise>
    </>
  );
}

function CommoditiesPicture({ accent }: { accent: string }) {
  const nodes = [
    { x: 36, label: "Farm" },
    { x: 206, label: "Processor" },
    { x: 376, label: "Factory" },
  ];
  return (
    <>
      {nodes.map((node, i) => (
        <Rise key={node.label} i={i}>
          <rect
            x={node.x}
            y="28"
            width="148"
            height="88"
            rx="0"
            fill={MIDNIGHT}
            stroke={accent}
            strokeWidth="2"
          />
          <text
            x={node.x + 74}
            y="82"
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
            fill={accent}
          >
            {node.label}
          </text>
          {i < nodes.length - 1 ? (
            <>
              <line
                x1={node.x + 152}
                y1="72"
                x2={node.x + 166}
                y2="72"
                stroke={INK}
                strokeWidth="2.5"
              />
              <polygon
                points={`${node.x + 170},72 ${node.x + 156},64 ${node.x + 156},80`}
                fill={INK}
              />
            </>
          ) : null}
        </Rise>
      ))}
      <Rise i={3}>
        <text x="280" y="156" textAnchor="middle" fontSize="28" fill={MUTED}>
          Goods move along this chain
        </text>
        <rect
          x="36"
          y="184"
          width="488"
          height="120"
          rx="0"
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeDasharray="10 8"
        />
        <text x="280" y="232" textAnchor="middle" fontSize="28" fontWeight="700" fill={accent}>
          Futures: a separate contract
        </text>
        <text x="280" y="272" textAnchor="middle" fontSize="28" fill={MUTED}>
          Closed out, or cash-settled
        </text>
      </Rise>
    </>
  );
}

function CryptoPicture({ accent }: { accent: string }) {
  const nodes = [
    { x: 280, y: 28 },
    { x: 470, y: 118 },
    { x: 410, y: 248 },
    { x: 150, y: 248 },
    { x: 90, y: 118 },
  ];
  return (
    <>
      <Rise i={0}>
        {nodes.map((node) => (
          <line
            key={`${node.x}-${node.y}`}
            x1="280"
            y1="133"
            x2={node.x}
            y2={node.y}
            stroke="var(--border-subtle, #3F3F39)"
            strokeWidth="1.5"
          />
        ))}
      </Rise>
      <Rise i={1}>
        <rect
          x="168"
          y="78"
          width="224"
          height="110"
          rx="0"
          fill={MIDNIGHT}
          stroke={accent}
          strokeWidth="2"
        />
        <text x="280" y="128" textAnchor="middle" fontSize="28" fontWeight="700" fill={accent}>
          Agreed record
        </text>
        <text x="280" y="166" textAnchor="middle" fontSize="28" fill={MUTED}>
          Each keeps a copy
        </text>
      </Rise>
      {nodes.map((node, i) => (
        <Rise key={`${node.x}-${node.y}-node`} i={i + 2}>
          <rect
            x={node.x - 22}
            y={node.y - 22}
            width="44"
            height="44"
            rx="0"
            fill={MIDNIGHT}
            stroke={accent}
            strokeWidth="2"
          />
          <text
            x={node.x}
            y={node.y + 9}
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
            fill={INK}
          >
            {i + 1}
          </text>
        </Rise>
      ))}
      <Rise i={7}>
        <text x="280" y="322" textAnchor="middle" fontSize="28" fill={MUTED}>
          A blockchain is one design
        </text>
      </Rise>
    </>
  );
}

function SportsPicture({ accent }: { accent: string }) {
  return (
    <>
      <Rise i={0}>
        <rect
          x="180"
          y="16"
          width="200"
          height="72"
          rx="0"
          fill={MIDNIGHT}
          stroke={accent}
          strokeWidth="2"
        />
        <text x="280" y="62" textAnchor="middle" fontSize="28" fontWeight="700" fill={accent}>
          An event
        </text>
      </Rise>
      <Rise i={1}>
        <line x1="230" y1="88" x2="120" y2="140" stroke={INK} strokeWidth="2.5" />
        <line x1="330" y1="88" x2="440" y2="140" stroke={INK} strokeWidth="2.5" />
        <rect
          x="28"
          y="140"
          width="184"
          height="72"
          rx="0"
          fill={MIDNIGHT}
          stroke={accent}
          strokeWidth="2"
        />
        <text x="120" y="184" textAnchor="middle" fontSize="28" fontWeight="700" fill={INK}>
          Outcome A
        </text>
        <rect
          x="348"
          y="140"
          width="184"
          height="72"
          rx="0"
          fill={MIDNIGHT}
          stroke={accent}
          strokeWidth="2"
        />
        <text x="440" y="184" textAnchor="middle" fontSize="28" fontWeight="700" fill={INK}>
          Outcome B
        </text>
      </Rise>
      <Rise i={2}>
        <rect
          x="36"
          y="232"
          width="488"
          height="88"
          rx="0"
          fill="none"
          stroke={accent}
          strokeWidth="2"
        />
        <text x="280" y="268" textAnchor="middle" fontSize="28" fontWeight="700" fill={INK}>
          Agreed before the event
        </text>
        <text x="280" y="302" textAnchor="middle" fontSize="28" fill={MUTED}>
          Then it ends. Nothing is owned.
        </text>
      </Rise>
    </>
  );
}
