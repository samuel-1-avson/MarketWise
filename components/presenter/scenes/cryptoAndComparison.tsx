import { useState } from "react";
import type { TopicId } from "@/lib/schemas";
import {
  Arrow,
  Chip,
  EDGE,
  FictionTag,
  Glyph,
  INK,
  Lines,
  MUTED,
  Plate,
  RAISED,
  Rise,
  SceneSvg,
  SW,
  T,
  TOPIC_NAMES,
} from "./kit";

/* 14 — computers each keeping a copy of the same ledger */
export function LedgerNetwork() {
  const cx = 430;
  const cy = 300;
  const nodes = Array.from({ length: 7 }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
    return { x: cx + 250 * Math.cos(a), y: cy + 215 * Math.sin(a) };
  });
  const entries = ["Entry 1", "Entry 2", "Entry 3"];
  return (
    <SceneSvg visual="ledger-network">
      {nodes.map((n, i) => (
        <line
          key={`l${i}`}
          x1={cx}
          y1={cy}
          x2={n.x}
          y2={n.y}
          stroke={EDGE}
          strokeWidth={1.5}
          strokeDasharray="8 8"
          className="svg-flow-dash"
          opacity={0.65}
        />
      ))}
      <Rise i={0}>
        <Plate x={cx - 110} y={cy - 70} w={220} h={140} radius={0} color={EDGE} fill={RAISED}>
          <T x={cx} y={cy - 6} size={38} weight={700} anchor="middle" fill={INK}>
            Shared
          </T>
          <T x={cx} y={cy + 38} size={38} weight={700} anchor="middle" fill={INK}>
            ledger
          </T>
        </Plate>
      </Rise>
      {nodes.map((n, i) => (
        <Rise key={i} i={1 + (i % 3)}>
          <rect
            x={n.x - 36}
            y={n.y - 36}
            width={72}
            height={72}
            rx={0}
            fill={RAISED}
            stroke={EDGE}
            strokeWidth={2}
            className="svg-node-breathe"
            style={{ animationDelay: `${i * 300}ms` }}
          />
          <T x={n.x} y={n.y + 12} size={32} weight={700} anchor="middle" fill={INK}>
            {i + 1}
          </T>
        </Rise>
      ))}
      <Rise i={3}>
        {entries.map((e, i) => (
          <g key={e}>
            <Plate
              x={920 + i * 252}
              y={110}
              w={232}
              h={150}
              radius={0}
              color={i === 2 ? "var(--btn-primary, #F0EEE5)" : EDGE}
            >
              <T x={1036 + i * 252} y={180} size={34} weight={700} anchor="middle" fill={INK}>
                {e}
              </T>
              <T
                x={1036 + i * 252}
                y={226}
                size={28}
                anchor="middle"
                fill={i === 2 ? INK : MUTED}
              >
                {i === 2 ? "✓ newly added" : "recorded"}
              </T>
            </Plate>
            {i < 2 ? (
              <Arrow
                x1={1156 + i * 252}
                y1={185}
                x2={1168 + i * 252}
                y2={185}
                color={INK}
                head={14}
              />
            ) : null}
          </g>
        ))}
      </Rise>
      <Rise i={4}>
        <Lines
          x={920}
          y={340}
          lines={[
            "Each circle keeps its own copy.",
            "A request is checked against the rules",
            "before it is added — then every copy agrees.",
          ]}
          size={34}
          fill={INK}
          gap={1.4}
        />
        <Chip
          x={920}
          y={500}
          text="Blockchain is one design, not the only one"
          color={EDGE}
          fill="var(--bg-surface-elevated, #262624)"
          size={30}
        />
      </Rise>
    </SceneSvg>
  );
}

/* 15 — three risk cards: price is only one */
export function CryptoRisks() {
  const cards = [
    { t: "Volatility", pts: ["Prices can swing sharply", "Holdings can lose value"] },
    { t: "Custody", pts: ["Self-custody: you hold the keys", "A provider: you rely on it"] },
    {
      t: "Protocols and platforms",
      pts: ["Software can have errors", "Protections may be missing"],
    },
  ];
  const w = 520;
  const gap = 50;
  const x0 = (SW - (3 * w + 2 * gap)) / 2;
  return (
    <SceneSvg visual="crypto-risks">
      {cards.map((c, i) => {
        const x = x0 + i * (w + gap);
        return (
          <Rise key={c.t} i={i}>
            <Plate x={x} y={50} w={w} h={340} radius={0} color={EDGE}>
              <T x={x + w / 2} y={130} size={44} weight={700} anchor="middle" fill={INK}>
                {c.t}
              </T>
              <line x1={x + 40} y1={165} x2={x + w - 40} y2={165} stroke={EDGE} strokeWidth={1.5} />
              <Lines
                x={x + 44}
                y={225}
                lines={c.pts.map((p) => `• ${p}`)}
                size={30}
                fill={INK}
                gap={1.6}
              />
            </Plate>
          </Rise>
        );
      })}
      <Rise i={4}>
        <Plate x={x0} y={430} w={3 * w + 2 * gap} h={120} radius={0} color={EDGE} dashed>
          <T x={SW / 2} y={505} size={46} weight={700} anchor="middle" fill={INK}>
            Price is only one type of risk
          </T>
        </Plate>
      </Rise>
    </SceneSvg>
  );
}

/* 16 — an event, an agreement, branching outcomes, settlement, and nothing owned */
export function OutcomeBranch() {
  const [tab, setTab] = useState<"flow" | "formula">("flow");
  const [selectedOutcome, setSelectedOutcome] = useState<number>(1);
  const [margin, setMargin] = useState<number>(8);

  const fairP = [0.5, 0.3, 0.2];
  const mult = 1 + margin / 100;
  const quotedOdds = fairP.map((p) => (1 / (p * mult)).toFixed(2));
  const totalImplied = (100 * mult).toFixed(1);
  const payout100 = (100 / mult).toFixed(2);
  const margin100 = (100 - 100 / mult).toFixed(2);

  return (
    <SceneSvg visual="outcome-branch">
      {/* Interactive Mode Selector at top */}
      <g role="tablist" aria-label="Sports betting presentation modes">
        <g
          role="tab"
          aria-selected={tab === "flow"}
          tabIndex={0}
          onClick={() => setTab("flow")}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setTab("flow")}
          style={{ cursor: "pointer" }}
        >
          <rect
            x={SW / 2 - 390}
            y={12}
            width={380}
            height={52}
            rx={0}
            fill={tab === "flow" ? "var(--btn-primary, #F0EEE5)" : "var(--bg-surface-elevated, #262624)"}
            stroke={tab === "flow" ? "var(--btn-primary, #F0EEE5)" : "var(--border-subtle, #3F3F39)"}
            strokeWidth={1.5}
          />
          <T
            x={SW / 2 - 200}
            y={46}
            size={28}
            weight={700}
            anchor="middle"
            fill={tab === "flow" ? "var(--btn-primary-text, #20211E)" : "var(--text-main, #F4F2EA)"}
          >
            1. Settlement Flow
          </T>
        </g>
        <g
          role="tab"
          aria-selected={tab === "formula"}
          tabIndex={0}
          onClick={() => setTab("formula")}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setTab("formula")}
          style={{ cursor: "pointer" }}
        >
          <rect
            x={SW / 2 + 10}
            y={12}
            width={380}
            height={52}
            rx={0}
            fill={tab === "formula" ? "var(--btn-primary, #F0EEE5)" : "var(--bg-surface-elevated, #262624)"}
            stroke={tab === "formula" ? "var(--btn-primary, #F0EEE5)" : "var(--border-subtle, #3F3F39)"}
            strokeWidth={1.5}
          />
          <T
            x={SW / 2 + 200}
            y={46}
            size={28}
            weight={700}
            anchor="middle"
            fill={tab === "formula" ? "var(--btn-primary-text, #20211E)" : "var(--text-main, #F4F2EA)"}
          >
            2. Operator Margin Formula
          </T>
        </g>
      </g>

      {tab === "flow" ? (
        <>
          <Rise i={0}>
            <Plate x={40} y={160} w={360} h={260} radius={0} color={EDGE}>
              <T x={220} y={235} size={38} weight={700} anchor="middle" fill={INK}>
                An event
              </T>
              <Lines
                x={220}
                y={288}
                lines={["with defined", "possible outcomes"]}
                size={28}
                anchor="middle"
              />
              <T x={220} y={382} size={28} weight={600} anchor="middle" fill={MUTED}>
                independent occurrence
              </T>
            </Plate>
          </Rise>

          <Rise i={1}>
            <Plate x={470} y={160} w={360} h={260} radius={0} color={EDGE}>
              <T x={650} y={235} size={38} weight={700} anchor="middle" fill={INK}>
                An agreement
              </T>
              <Lines
                x={650}
                y={288}
                lines={["terms set by an operator", "before the event"]}
                size={28}
                anchor="middle"
              />
              <T x={650} y={382} size={28} weight={600} anchor="middle" fill={MUTED}>
                fixed commercial rules
              </T>
            </Plate>
            <Arrow x1={405} y1={290} x2={465} y2={290} color={INK} head={16} />
          </Rise>

          {[0, 1, 2].map((i) => {
            const isSelected = selectedOutcome === i;
            return (
              <Rise key={i} i={2 + i}>
                <Arrow
                  x1={835}
                  y1={290}
                  x2={930}
                  y2={125 + i * 140}
                  color={isSelected ? "var(--btn-primary, #F0EEE5)" : MUTED}
                  head={16}
                />
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={`Select possible outcome ${i + 1}`}
                  onClick={() => setSelectedOutcome(i)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedOutcome(i)}
                  style={{ cursor: "pointer" }}
                >
                  <Plate
                    x={940}
                    y={80 + i * 140}
                    w={290}
                    h={90}
                    radius={0}
                    color={isSelected ? "var(--btn-primary, #F0EEE5)" : EDGE}
                    dashed={!isSelected}
                  >
                    <T
                      x={1085}
                      y={136 + i * 140}
                      size={28}
                      weight={isSelected ? 700 : 500}
                      anchor="middle"
                      fill={INK}
                    >
                      {`Possible outcome ${i + 1}`}
                    </T>
                  </Plate>
                </g>
                <Arrow
                  x1={1235}
                  y1={125 + i * 140}
                  x2={1295}
                  y2={290}
                  color={isSelected ? "var(--btn-primary, #F0EEE5)" : MUTED}
                  head={16}
                />
              </Rise>
            );
          })}

          <Rise i={5}>
            <Plate x={1300} y={160} w={360} h={260} radius={0} color={EDGE}>
              <T x={1480} y={225} size={38} weight={700} anchor="middle" fill={INK}>
                Settlement
              </T>
              <Lines
                x={1480}
                y={272}
                lines={["by the operator's", "written rules"]}
                size={28}
                anchor="middle"
              />
              <line
                x1={1330}
                y1={338}
                x2={1630}
                y2={338}
                stroke="var(--border-subtle, #3F3F39)"
                strokeDasharray="4 4"
              />
              <rect
                x={1330}
                y={355}
                width={300}
                height={50}
                rx={0}
                fill="var(--bg-surface-elevated, #262624)"
                stroke="var(--border-subtle, #3F3F39)"
                strokeWidth={1}
              />
              <T
                x={1480}
                y={390}
                size={28}
                weight={700}
                anchor="middle"
                fill="var(--text-main, #F4F2EA)"
              >
                ends: nothing owned
              </T>
            </Plate>
          </Rise>

          <Rise i={6}>
            <T x={SW / 2} y={548} size={28} anchor="middle" fill={MUTED}>
              Click any outcome: every branch settles under operator rules with nothing remaining owned
            </T>
          </Rise>
        </>
      ) : (
        <>
          <Rise i={0}>
            {/* Column 1: True Probabilities */}
            <Plate x={40} y={88} w={490} h={415} radius={0} color={EDGE}>
              <T x={285} y={145} size={34} weight={700} anchor="middle" fill={INK}>
                1. True Probabilities
              </T>
              <T x={285} y={185} size={28} anchor="middle" fill={MUTED}>
                Sum of all outcomes = 100%
              </T>
              <line x1={65} y1={205} x2={505} y2={205} stroke="var(--border-subtle, #3F3F39)" />
              <T x={75} y={248} size={28} weight={600} fill={INK}>
                Outcome 1: 50% (Fair 2.00)
              </T>
              <T x={75} y={298} size={28} weight={600} fill={INK}>
                Outcome 2: 30% (Fair 3.33)
              </T>
              <T x={75} y={348} size={28} weight={600} fill={INK}>
                Outcome 3: 20% (Fair 5.00)
              </T>
              <line x1={65} y1={375} x2={505} y2={375} stroke="var(--border-subtle, #3F3F39)" />
              <T x={285} y={418} size={28} weight={700} anchor="middle" fill={MUTED}>
                Fair game: 100% returned to room
              </T>
              <T x={285} y={458} size={28} anchor="middle" fill={MUTED}>
                No operator cut exists in fair odds
              </T>
            </Plate>
          </Rise>

          <Rise i={1}>
            {/* Column 2: Operator Overround Formula */}
            <Plate x={560} y={88} w={560} h={415} radius={0} color={EDGE}>
              <T x={840} y={145} size={34} weight={700} anchor="middle" fill={INK}>
                2. Operator Margin Formula
              </T>
              <T x={840} y={185} size={28} anchor="middle" fill={MUTED}>
                Implied % = (1 / Quoted Odds) × 100
              </T>
              <line x1={585} y1={205} x2={1095} y2={205} stroke="var(--border-subtle, #3F3F39)" />
              <T x={840} y={245} size={28} weight={600} anchor="middle" fill={INK}>
                Select operator margin to test:
              </T>
              {[
                { m: 0, label: "0% Fair" },
                { m: 5, label: "5% Low" },
                { m: 8, label: "8% Std" },
                { m: 12, label: "12% High" },
              ].map((btn, idx) => {
                const isAct = margin === btn.m;
                const bx = 590 + idx * 128;
                return (
                  <g
                    key={btn.m}
                    role="button"
                    tabIndex={0}
                    aria-label={`Set margin to ${btn.label}`}
                    onClick={() => setMargin(btn.m)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setMargin(btn.m)}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={bx}
                      y={265}
                      width={116}
                      height={44}
                      rx={0}
                      fill={isAct ? "var(--btn-primary, #F0EEE5)" : "var(--bg-surface-elevated, #262624)"}
                      stroke={isAct ? "var(--btn-primary, #F0EEE5)" : "var(--border-subtle, #3F3F39)"}
                    />
                    <T
                      x={bx + 58}
                      y={296}
                      size={28}
                      weight={700}
                      anchor="middle"
                      fill={isAct ? "var(--btn-primary-text, #20211E)" : "var(--text-main, #F4F2EA)"}
                    >
                      {btn.label}
                    </T>
                  </g>
                );
              })}
              <line x1={585} y1={330} x2={1095} y2={330} stroke="var(--border-subtle, #3F3F39)" />
              <T x={840} y={370} size={30} weight={700} anchor="middle" fill={INK}>
                {`Total Implied Sum: ${totalImplied}%`}
              </T>
              <T x={840} y={415} size={28} anchor="middle" fill={MUTED}>
                {`Overround spread = +${margin}% above 100%`}
              </T>
              <T x={840} y={458} size={28} anchor="middle" fill={MUTED}>
                Quoted odds: {quotedOdds[0]} / {quotedOdds[1]} / {quotedOdds[2]}
              </T>
            </Plate>
          </Rise>

          <Rise i={2}>
            {/* Column 3: Commercial Settlement */}
            <Plate x={1150} y={88} w={510} h={415} radius={0} color={EDGE}>
              <T x={1405} y={145} size={34} weight={700} anchor="middle" fill={INK}>
                3. Settlement Result
              </T>
              <T x={1405} y={185} size={28} anchor="middle" fill={MUTED}>
                For every $100 staked across market:
              </T>
              <line x1={1175} y1={205} x2={1635} y2={205} stroke="var(--border-subtle, #3F3F39)" />
              <T x={1185} y={255} size={30} weight={700} fill={INK}>
                {`Winner Payout: $${payout100}`}
              </T>
              <T x={1185} y={305} size={30} weight={700} fill="var(--text-error, #FFB4A8)">
                {`Operator Keeps: $${margin100} (${margin}%)`}
              </T>
              <line x1={1175} y1={340} x2={1635} y2={340} stroke="var(--border-subtle, #3F3F39)" />
              <T x={1405} y={382} size={28} weight={700} anchor="middle" fill={MUTED}>
                Operator profits on every balanced book
              </T>
              <T x={1405} y={420} size={28} anchor="middle" fill={MUTED}>
                Participants face negative expectancy
              </T>
              <T x={1405} y={458} size={28} weight={700} anchor="middle" fill={INK}>
                Settles completely: no continuing asset
              </T>
            </Plate>
          </Rise>

          <Rise i={3}>
            <T x={60} y={548} size={28} fill={MUTED}>
              Mathematical demonstration: operator terms ensure payouts are less than total stakes
            </T>
            <FictionTag x={SW - 24} y={548} />
          </Rise>
        </>
      )}
    </SceneSvg>
  );
}

/* 17 — four different objects and what you hold afterwards */
export function FourObjects() {
  const cards = [
    {
      topic: "stocks" as TopicId,
      t: "A share",
      d: ["A continuing ownership", "interest in a company"],
    },
    {
      topic: "forex" as TopicId,
      t: "A currency exchange",
      d: ["Money is delivered.", "Retail margin forex is", "generally a contract", "with a dealer"],
    },
    {
      topic: "commodities" as TopicId,
      t: "A futures contract",
      d: ["An agreement about a", "later date and price"],
    },
    {
      topic: "sports-betting" as TopicId,
      t: "A wager",
      d: ["An agreement that ends", "at settlement"],
    },
  ];
  const w = 385;
  const gap = 53;
  const x0 = (SW - (4 * w + 3 * gap)) / 2;
  return (
    <SceneSvg visual="four-objects">
      {cards.map((c, i) => {
        const x = x0 + i * (w + gap);
        return (
          <Rise key={c.t} i={i}>
            <Plate x={x} y={40} w={w} h={450} radius={0} color={EDGE}>
              <Glyph topic={c.topic} x={x + w / 2 - 34} y={72} size={68} />
              <T
                x={x + w / 2}
                y={196}
                size={33}
                weight={700}
                anchor="middle"
                fill={INK}
              >
                {c.t}
              </T>
              <line x1={x + 36} y1={220} x2={x + w - 36} y2={220} stroke={EDGE} strokeWidth={1.5} />
              <Lines
                x={x + w / 2}
                y={258}
                lines={["What you hold", "afterwards"]}
                size={28}
                anchor="middle"
                fill={MUTED}
                gap={1.2}
              />
              <Lines
                x={x + w / 2}
                y={340}
                lines={c.d}
                size={28}
                anchor="middle"
                fill={INK}
                gap={1.25}
              />
            </Plate>
          </Rise>
        );
      })}
      <Rise i={5}>
        <T x={SW / 2} y={540} size={32} anchor="middle" fill={MUTED}>
          Different objects, different obligations — compared here, not ranked
        </T>
        <T x={SW / 2} y={580} size={28} anchor="middle" fill={MUTED}>
          Forex description as given by Australia&apos;s ASIC and the US CFTC — not a statement
          about Ghana
        </T>
      </Rise>
    </SceneSvg>
  );
}

/* 18 — where people use each system, from needing it to purely speculating */
export function SpeculationSpectrum() {
  const rows: { topic: TopicId; from: number; to: number; note: string }[] = [
    { topic: "forex", from: 0.0, to: 0.95, note: "paying invoices … leveraged speculation" },
    { topic: "stocks", from: 0.2, to: 0.9, note: "owning a business … short-term trading" },
    { topic: "commodities", from: 0.0, to: 0.9, note: "producers and users … speculators" },
    { topic: "crypto", from: 0.35, to: 1.0, note: "using a network … mainly traded as an asset" },
    { topic: "sports-betting", from: 0.85, to: 1.0, note: "no ownership or asset use" },
  ];
  const x0 = 470;
  const track = 1130;
  return (
    <SceneSvg visual="speculation-spectrum">
      <Rise i={0}>
        <T x={x0} y={36} size={32} weight={700} fill={INK}>
          ◀ Mainly purpose-driven
        </T>
        <T x={x0 + track} y={36} size={32} weight={700} anchor="end" fill={INK}>
          Mainly speculative ▶
        </T>
      </Rise>
      {rows.map((r, i) => {
        const y = 80 + i * 90;
        const bx = x0 + r.from * track;
        const bw = Math.max(40, (r.to - r.from) * track);
        return (
          <Rise key={r.topic} i={i + 1}>
            <Glyph topic={r.topic} x={40} y={y + 4} size={54} />
            <T x={110} y={y + 44} size={34} weight={700} fill={INK}>
              {TOPIC_NAMES[r.topic]}
            </T>
            <rect
              x={x0}
              y={y + 12}
              width={track}
              height={44}
              rx={0}
              fill="none"
              stroke={EDGE}
              strokeWidth={1.5}
            />
            <rect
              x={bx}
              y={y + 12}
              width={bw}
              height={44}
              rx={0}
              fill="var(--bg-surface-elevated, #262624)"
              stroke="var(--btn-primary, #F0EEE5)"
              strokeWidth={2}
            />
            {r.to > 0.97 && r.from > 0.8 ? (
              // A short bar at the far right: put its note to the left, clear of the edge.
              <T x={bx - 24} y={y + 44} size={28} weight={600} anchor="end" fill={MUTED}>
                {r.note}
              </T>
            ) : (
              <T x={bx + 22} y={y + 44} size={28} weight={600} fill={MUTED}>
                {r.note}
              </T>
            )}
          </Rise>
        );
      })}
      <Rise i={7}>
        <T x={SW / 2} y={558} size={28} weight={700} anchor="middle" fill={MUTED}>
          Our own simplified framing — not a source finding. Bar positions are illustrative, not
          data.
        </T>
        <T x={SW / 2} y={592} size={28} anchor="middle" fill={MUTED}>
          Purpose differs; harmful behaviour can look alike. A real purpose never means risk-free.
        </T>
      </Rise>
    </SceneSvg>
  );
}
