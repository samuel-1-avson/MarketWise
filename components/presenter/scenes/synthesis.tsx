import { useState } from "react";
import { TOPIC_IDS, type TopicId } from "@/lib/schemas";
import {
  Arrow,
  Chip,
  EDGE,
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
  chipWidth,
} from "./kit";

/* 19 — hype claims struck through, and the five questions that beat them */
export function RedactedClaims() {
  const claims = ["“Never lose again”", "“Secret system — act now”", "“Guaranteed returns”"];
  const questions = [
    "What is the object?",
    "Who benefits?",
    "Where is the evidence?",
    "What is guaranteed?",
    "What if it is wrong?",
  ];
  return (
    <SceneSvg visual="redacted-claims">
      {claims.map((c, i) => {
        const y = 40 + i * 120;
        return (
          <Rise key={c} i={i}>
            <rect
              x={140}
              y={y}
              width={1420}
              height={96}
              rx={0}
              fill={RAISED}
              stroke={EDGE}
              strokeWidth={1.5}
            />
            <T x={190} y={y + 66} size={50} weight={600} fill={MUTED}>
              {c}
            </T>
            <line
              x1={170}
              y1={y + 48}
              x2={1000}
              y2={y + 48}
              stroke="var(--text-error, #FFB4A8)"
              strokeWidth={5}
              strokeDasharray="24 12"
              className="svg-flow-dash"
            />
            <T
              x={1540}
              y={y + 66}
              size={56}
              weight={700}
              anchor="end"
              fill="var(--text-error, #FFB4A8)"
              className="svg-pulse-glow"
            >
              ✗
            </T>
          </Rise>
        );
      })}
      <Rise i={4}>
        <T x={SW / 2} y={418} size={32} weight={700} anchor="middle" fill={INK}>
          Ask these of any claim, in any system
        </T>
        {[questions.slice(0, 3), questions.slice(3)].map((row, rowIndex) => {
          const size = 28;
          const gap = 18;
          const widths = row.map((text) => chipWidth(text, size));
          const total = widths.reduce((sum, width) => sum + width, 0) + gap * (row.length - 1);
          let x = (SW - total) / 2;
          const y = 448 + rowIndex * 68;
          return row.map((text, i) => {
            const node = (
              <Chip key={text} x={x} y={y} text={text} color={EDGE} size={size} />
            );
            x += (widths[i] ?? 0) + gap;
            return node;
          });
        })}
      </Rise>
    </SceneSvg>
  );
}

/* 20 — four costs that ignore which way the price moves */
export function FrictionCards() {
  const cards = [
    { t: ["Spreads and", "commissions"], d: ["Built into every", "exchange or trade"] },
    { t: ["Financing and", "margin costs"], d: ["Costs of holding", "a leveraged position"] },
    { t: ["Storage and", "transport"], d: ["Real goods have to be", "held and moved"] },
    { t: ["Custody and", "network costs"], d: ["Holding and moving", "digital assets"] },
  ];
  const w = 385;
  const gap = 53;
  const x0 = (SW - (4 * w + 3 * gap)) / 2;
  return (
    <SceneSvg visual="friction-cards">
      {cards.map((c, i) => {
        const x = x0 + i * (w + gap);
        return (
          <Rise key={c.t.join(" ")} i={i}>
            <Plate x={x} y={40} w={w} h={380} radius={0} color={EDGE}>
              <rect
                x={x + w / 2 - 44}
                y={74}
                width={88}
                height={88}
                rx={0}
                fill="none"
                stroke={EDGE}
                strokeWidth={2}
                className="svg-node-breathe"
              />
              <path
                d={`M${x + w / 2} 92 v52 M${x + w / 2 - 18} 106 h36 M${x + w / 2 - 18} 130 h36`}
                stroke={INK}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
              />
              <Lines
                x={x + w / 2}
                y={222}
                lines={c.t}
                size={36}
                weight={700}
                gap={1.2}
                anchor="middle"
                fill={INK}
              />
              <Lines x={x + w / 2} y={330} lines={c.d} size={30} anchor="middle" fill={MUTED} />
            </Plate>
          </Rise>
        );
      })}
      <Rise i={5}>
        <Plate x={x0} y={450} w={4 * w + 3 * gap} h={110} radius={0} color={EDGE} dashed>
          <T x={SW / 2} y={520} size={44} weight={700} anchor="middle" fill={INK}>
            Costs apply either way. A gain is not guaranteed.
          </T>
        </Plate>
      </Rise>
    </SceneSvg>
  );
}

/* 21 — five columns, five different main risks */
const RISKS: Record<TopicId, readonly string[]> = {
  forex: ["Leverage", "Costs add up", "Hard to predict"],
  stocks: ["Price can fall", "All money put in can be lost", "Paid last if it fails"],
  commodities: ["Supply shocks", "Futures obligations", "Can lose more than put in"],
  crypto: ["Volatility", "Custody mistakes", "Scams, weak protections"],
  "sports-betting": ["Financial loss", "Can harm health and relationships", "Can reach families"],
};

/** Centres a risk label in its 80-unit box, wrapping so a 28-unit line still fits the column. */
function RiskText({ x, y, text }: { x: number; y: number; text: string }) {
  const lines = wrapWords(text, 17);
  const two = lines.length > 1;
  return (
    <Lines
      x={x}
      y={y + (two ? 34 : 50)}
      lines={lines}
      size={28}
      gap={1.2}
      weight={600}
      fill={INK}
      anchor="middle"
    />
  );
}

export function RiskColumns() {
  const colW = 310;
  const gap = 37;
  const x0 = (SW - (5 * colW + 4 * gap)) / 2;
  return (
    <SceneSvg visual="risk-columns">
      {TOPIC_IDS.map((topic, k) => {
        const x = x0 + k * (colW + gap);
        return (
          <Rise key={topic} i={k}>
            <Plate x={x} y={40} w={colW} h={480} radius={0} color={EDGE}>
              <Glyph topic={topic} x={x + colW / 2 - 28} y={66} size={56} />
              <T
                x={x + colW / 2}
                y={170}
                size={36}
                weight={700}
                anchor="middle"
                fill={INK}
              >
                {TOPIC_NAMES[topic]}
              </T>
              {RISKS[topic].map((risk, j) => (
                <g key={risk}>
                  <rect
                    x={x + 22}
                    y={206 + j * 96}
                    width={colW - 44}
                    height={80}
                    rx={0}
                    fill={RAISED}
                    stroke={EDGE}
                    strokeWidth={1.5}
                  />
                  <RiskText x={x + colW / 2} y={206 + j * 96} text={risk} />
                </g>
              ))}
            </Plate>
          </Rise>
        );
      })}
      <Rise i={6}>
        <T x={SW / 2} y={572} size={32} weight={600} anchor="middle" fill={MUTED}>
          Different risks in each column — and a real purpose never removes them
        </T>
      </Rise>
    </SceneSvg>
  );
}

/* 22 — three audience questions with A, B, C */
export function AudienceQuestions() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({
    0: null,
    1: null,
    2: null,
  });

  const correctAnswers: Record<number, number> = {
    0: 0, // A share
    1: 1, // No - losses grow too
    2: 0, // Equally likely either way
  };

  const qs = [
    {
      q: "Which gives you a fractional ownership interest in a business?",
      o: ["A share", "A wager", "A currency quote"],
    },
    {
      q: "Does leverage create free money?",
      o: ["Yes — more for less", "No — losses grow too", "Only in forex"],
    },
    {
      q: "A fair coin lands heads five times. The next flip is…",
      o: ["Equally likely either way", "More likely tails", "Certain heads"],
    },
  ];

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: prev[questionIndex] === optionIndex ? null : optionIndex,
    }));
  };

  const w = 520;
  const gap = 50;
  const x0 = (SW - (3 * w + 2 * gap)) / 2;

  return (
    <SceneSvg visual="audience-questions">
      {qs.map((item, i) => {
        const x = x0 + i * (w + gap);
        const userChoice = selectedAnswers[i];
        const correctChoice = correctAnswers[i];

        return (
          <Rise key={item.q} i={i}>
            <Plate x={x} y={40} w={w} h={500} radius={0} color={EDGE}>
              <T x={x + 34} y={104} size={30} weight={700} fill={INK}>
                {`Question ${i + 1}`}
              </T>
              <Lines
                x={x + 34}
                y={160}
                lines={wrapWords(item.q, 28)}
                size={34}
                fill={INK}
                gap={1.3}
                weight={600}
              />
              {item.o.map((opt, j) => {
                const isSelected = userChoice === j;
                const isCorrect = correctChoice === j;
                const showFeedback = userChoice !== null && isSelected;

                const strokeColor = showFeedback
                  ? isCorrect
                    ? "var(--btn-primary, #F0EEE5)"
                    : "var(--text-error, #FFB4A8)"
                  : isSelected
                    ? "var(--btn-primary, #F0EEE5)"
                    : EDGE;

                const fillColor = showFeedback
                  ? isCorrect
                    ? "var(--bg-surface-elevated, #262624)"
                    : "rgba(255,180,168,0.1)"
                  : isSelected
                    ? "var(--bg-surface-elevated, #262624)"
                    : "none";

                return (
                  <g
                    key={opt}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select option ${"ABC"[j]}: ${opt}`}
                    onClick={() => handleSelect(i, j)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleSelect(i, j);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={x + 30}
                      y={330 + j * 66}
                      width={w - 60}
                      height={54}
                      rx={0}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    <T
                      x={x + 58}
                      y={368 + j * 66}
                      size={28}
                      weight={700}
                      fill={showFeedback ? (isCorrect ? INK : "var(--text-error, #FFB4A8)") : INK}
                    >
                      {"ABC"[j]}
                    </T>
                    <T x={x + 104} y={368 + j * 66} size={28} fill={INK}>
                      {opt}
                    </T>
                    {showFeedback ? (
                      <T
                        x={x + w - 60}
                        y={368 + j * 66}
                        size={28}
                        weight={700}
                        anchor="end"
                        fill={isCorrect ? INK : "var(--text-error, #FFB4A8)"}
                      >
                        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </T>
                    ) : null}
                  </g>
                );
              })}
            </Plate>
          </Rise>
        );
      })}
      <Rise i={4}>
        <T x={SW / 2} y={580} size={28} anchor="middle" fill={MUTED}>
          Understanding, not predictions — click an option to test your knowledge
        </T>
      </Rise>
    </SceneSvg>
  );
}

/** Breaks a sentence into lines of at most `max` characters (SVG text does not wrap). */
function wrapWords(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > max) {
      lines.push(line.trim());
      line = word;
    } else line = `${line} ${word}`;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

/* 23 — five ideas to take home */
export function FiveTakeaways() {
  const items = [
    { t: "Mechanism first", s: "What changes hands?" },
    { t: "Risks always", s: "Name them every time" },
    { t: "Costs count", s: "Spreads, fees, custody, margin" },
    { t: "Claims need evidence", s: "Ask the five questions" },
    { t: "Uncertainty never disappears", s: "However much you know" },
  ];
  return (
    <SceneSvg visual="five-takeaways">
      {items.map((it, i) => {
        const y = 14 + i * 114;
        return (
          <Rise key={it.t} i={i}>
            <Plate x={180} y={y} w={1340} h={96} radius={0} color={EDGE}>
              <rect
                x={212}
                y={y + 14}
                width={68}
                height={68}
                rx={0}
                fill="var(--bg-surface-elevated, #262624)"
                stroke="var(--btn-primary, #F0EEE5)"
                strokeWidth={1.5}
              />
              <T x={246} y={y + 60} size={40} weight={700} anchor="middle" fill={INK} display>
                {i + 1}
              </T>
              <T x={320} y={y + 62} size={44} weight={700} fill={INK}>
                {it.t}
              </T>
              <T x={1480} y={y + 60} size={30} anchor="end" fill={MUTED}>
                {it.s}
              </T>
            </Plate>
          </Rise>
        );
      })}
    </SceneSvg>
  );
}

/* 24 — where to keep learning, and the disclaimer */
export function KeepLearning() {
  const cards = [
    { t: "Explore", p: "/explore", d: ["Lessons with sources", "and knowledge checks"] },
    { t: "Practise", p: "/labs · /quiz", d: ["Interactive labs and a", "quiz, all fixed values"] },
    {
      t: "Check the sources",
      p: "/resources",
      d: ["Who said what, when,", "and where it applies"],
    },
  ];
  const w = 520;
  const gap = 50;
  const x0 = (SW - (3 * w + 2 * gap)) / 2;
  return (
    <SceneSvg visual="keep-learning">
      {cards.map((c, i) => {
        const x = x0 + i * (w + gap);
        return (
          <Rise key={c.t} i={i}>
            <Plate x={x} y={30} w={w} h={330} radius={0} color={EDGE}>
              <T x={x + w / 2} y={110} size={46} weight={700} anchor="middle" fill={INK}>
                {c.t}
              </T>
              <T x={x + w / 2} y={170} size={40} weight={600} anchor="middle" display fill={INK}>
                {c.p}
              </T>
              <Lines x={x + w / 2} y={240} lines={c.d} size={30} anchor="middle" fill={MUTED} />
              <Arrow
                x1={x + w / 2 - 40}
                y1={318}
                x2={x + w / 2 + 40}
                y2={318}
                color={EDGE}
                head={16}
              />
            </Plate>
          </Rise>
        );
      })}
      <Rise i={4}>
        <Plate x={x0} y={400} w={3 * w + 2 * gap} h={170} radius={0} color={EDGE} dashed>
          <T x={SW / 2} y={455} size={30} weight={700} anchor="middle" fill={INK}>
            For learning only
          </T>
          <Lines
            x={SW / 2}
            y={500}
            lines={[
              "Fictional numbers · no financial advice · no trading signals",
              "no wagering instructions · no live data · no accounts or tracking",
            ]}
            size={30}
            anchor="middle"
            fill={MUTED}
          />
        </Plate>
      </Rise>
    </SceneSvg>
  );
}
