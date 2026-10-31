import { useState } from "react";
import { generateTiles, tileStats } from "@/lib/labs/uncertainty";
import { leverageBands } from "@/lib/labs/leverage";
import { TOPIC_IDS, type TopicId } from "@/lib/schemas";
import {
  Arrow,
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
  SH,
  SW,
  T,
  TOPIC_NAMES,
} from "./kit";

/* 01 — a "?" at the centre with the five systems in orbit */
export function OrbitQuestion() {
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);
  const cx = SW / 2;
  const cy = SH / 2;

  const TOPIC_ROLES: Record<TopicId, string> = {
    forex: "Exchanging currencies for real trade",
    stocks: "Ownership shares in real businesses",
    commodities: "Physical goods powering industry",
    crypto: "Shared entries on a consensus ledger",
    "sports-betting": "Fixed wagering contracts on events",
  };

  return (
    <SceneSvg visual="orbit-question">
      {/* Crisp minimal architectural orbit boundary */}
      <rect
        x={cx - 620}
        y={cy - 225}
        width={1240}
        height={450}
        fill="none"
        stroke="var(--border-subtle, #3F3F39)"
        strokeWidth={1.5}
        strokeDasharray="4 6"
      />
      <rect
        x={cx - 400}
        y={cy - 145}
        width={800}
        height={290}
        fill="none"
        stroke="var(--border-subtle, #3F3F39)"
        strokeWidth={1}
        strokeDasharray="4 6"
        opacity={0.6}
      />
      <Rise>
        <rect
          x={cx - 85}
          y={cy - 85}
          width={170}
          height={170}
          fill="var(--bg-surface, #1D1D1B)"
          stroke={activeTopic ? "var(--btn-primary, #F0EEE5)" : "var(--border-subtle, #3F3F39)"}
          strokeWidth={activeTopic ? 3 : 2}
        />
        <T x={cx} y={cy + 42} size={120} weight={700} anchor="middle" fill={INK} display>
          {activeTopic ? "!" : "?"}
        </T>
      </Rise>
      {TOPIC_IDS.map((topic, k) => {
        const angle = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
        const x = cx + 600 * Math.cos(angle);
        const y = cy + 215 * Math.sin(angle);
        const isSelected = activeTopic === topic;
        return (
          <Rise key={topic} i={k + 1}>
            <g
              role="button"
              tabIndex={0}
              aria-label={`Select ${TOPIC_NAMES[topic]}`}
              onClick={() => setActiveTopic((prev) => (prev === topic ? null : topic))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveTopic((prev) => (prev === topic ? null : topic));
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <Plate
                x={x - 170}
                y={y - 60}
                w={340}
                h={120}
                radius={0}
                color={isSelected ? "var(--btn-primary, #F0EEE5)" : "var(--border-subtle, #3F3F39)"}
                strokeWidth={isSelected ? 3 : 1.5}
              >
                <Glyph topic={topic} x={x - 152} y={y - 24} size={48} />
                <T x={x - 84} y={y + 12} size={32} weight={700} fill={INK}>
                  {TOPIC_NAMES[topic]}
                </T>
              </Plate>
            </g>
          </Rise>
        );
      })}
      {activeTopic ? (
        <Rise i={7}>
          <Plate
            x={cx - 360}
            y={cy + 130}
            w={720}
            h={70}
            radius={0}
            color="var(--btn-primary, #F0EEE5)"
          >
            <T
              x={cx}
              y={cy + 175}
              size={30}
              weight={600}
              anchor="middle"
              fill={INK}
            >
              {TOPIC_ROLES[activeTopic]}
            </T>
          </Plate>
        </Rise>
      ) : null}
    </SceneSvg>
  );
}

/* 02 — five disciplines, each with what changes hands */
const DISCIPLINES: Record<TopicId, readonly string[]> = {
  forex: ["a currency, or a", "contract on a rate"],
  stocks: ["a slice of", "a company"],
  commodities: ["real goods, or", "contracts about them"],
  crypto: ["entries on a", "shared ledger"],
  "sports-betting": ["an agreement —", "no ownership"],
};

export function FiveDisciplines() {
  const colW = 310;
  const gap = 37;
  const x0 = (SW - (5 * colW + 4 * gap)) / 2;
  return (
    <SceneSvg visual="five-disciplines">
      {TOPIC_IDS.map((topic, k) => {
        const x = x0 + k * (colW + gap);
        return (
          <Rise key={topic} i={k}>
            <Plate x={x} y={50} w={colW} h={420} radius={0} color="var(--border-subtle, #3F3F39)">
              <Glyph topic={topic} x={x + colW / 2 - 36} y={86} size={72} />
              <T
                x={x + colW / 2}
                y={232}
                size={38}
                weight={700}
                anchor="middle"
                fill={INK}
              >
                {TOPIC_NAMES[topic]}
              </T>
              <line
                x1={x + 30}
                y1={262}
                x2={x + colW - 30}
                y2={262}
                stroke="var(--border-subtle, #3F3F39)"
                strokeWidth={1}
              />
              <T x={x + colW / 2} y={310} size={28} anchor="middle" fill={MUTED}>
                What changes hands
              </T>
              <Lines
                x={x + colW / 2}
                y={360}
                lines={DISCIPLINES[topic]}
                size={29}
                anchor="middle"
                fill={INK}
              />
            </Plate>
          </Rise>
        );
      })}
      <Rise i={6}>
        <T x={SW / 2} y={540} size={32} anchor="middle" fill={MUTED}>
          Plus the same three questions for each: who takes part · how price or outcome arises ·
          where the risk sits
        </T>
      </Rise>
    </SceneSvg>
  );
}

/* 03 — buyers, sellers, a price and information flowing back */
export function MarketActors() {
  const [tradeStep, setTradeStep] = useState(0);
  const [selected, setSelected] = useState<"buyers" | "price" | "sellers" | null>(null);

  const stepLabels = [
    "⚡ Click to simulate market trade",
    "Step 1: Bids ($100) & Asks ($90) arrive →",
    "Step 2: Cleared at agreed price ($95) →",
    "Step 3: Exchange fulfilled & feedback ripples back ↺",
  ];

  return (
    <SceneSvg visual="market-actors">
      {/* Interactive Simulation Controller - Squared Minimal */}
      <g
        role="button"
        tabIndex={0}
        aria-label="Simulate trade match"
        onClick={() => setTradeStep((s) => (s + 1) % 4)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setTradeStep((s) => (s + 1) % 4);
        }}
        style={{ cursor: "pointer" }}
      >
        <rect
          x={SW / 2 - 320}
          y={14}
          width={640}
          height={50}
          rx={0}
          fill="var(--bg-surface-elevated, #262624)"
          stroke="var(--border-subtle, #3F3F39)"
          strokeWidth={1.5}
        />
        <T x={SW / 2} y={48} size={28} weight={600} anchor="middle" fill={INK}>
          {stepLabels[tradeStep] ?? stepLabels[0]}
        </T>
      </g>

      <Rise i={0}>
        <g
          role="button"
          tabIndex={0}
          aria-label="Inspect Buyers"
          onClick={() => setSelected((prev) => (prev === "buyers" ? null : "buyers"))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelected((prev) => (prev === "buyers" ? null : "buyers"));
            }
          }}
          style={{ cursor: "pointer" }}
        >
          <Plate
            x={60}
            y={85}
            w={440}
            h={250}
            radius={0}
            color={selected === "buyers" || tradeStep >= 1 ? "var(--btn-primary, #F0EEE5)" : "var(--border-subtle, #3F3F39)"}
            strokeWidth={selected === "buyers" || tradeStep >= 1 ? 2.5 : 1.5}
          >
            <T x={280} y={160} size={48} weight={700} anchor="middle" fill={INK}>
              Buyers
            </T>
            <Lines
              x={280}
              y={215}
              lines={
                selected === "buyers" || tradeStep >= 1
                  ? ["Bidding up to $100", "Seeking value"]
                  : ["Each would pay up to", "some amount for it"]
              }
              size={30}
              anchor="middle"
            />
          </Plate>
        </g>
      </Rise>

      <Rise i={1}>
        <g
          role="button"
          tabIndex={0}
          aria-label="Inspect Sellers"
          onClick={() => setSelected((prev) => (prev === "sellers" ? null : "sellers"))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelected((prev) => (prev === "sellers" ? null : "sellers"));
            }
          }}
          style={{ cursor: "pointer" }}
        >
          <Plate
            x={1200}
            y={85}
            w={440}
            h={250}
            radius={0}
            color={selected === "sellers" || tradeStep >= 1 ? "var(--btn-primary, #F0EEE5)" : "var(--border-subtle, #3F3F39)"}
            strokeWidth={selected === "sellers" || tradeStep >= 1 ? 2.5 : 1.5}
          >
            <T x={1420} y={160} size={48} weight={700} anchor="middle" fill={INK}>
              Sellers
            </T>
            <Lines
              x={1420}
              y={215}
              lines={
                selected === "sellers" || tradeStep >= 1
                  ? ["Asking from $90", "Seeking profit"]
                  : ["Each would accept", "at least some amount"]
              }
              size={30}
              anchor="middle"
            />
          </Plate>
        </g>
      </Rise>

      <Rise i={2}>
        <g
          role="button"
          tabIndex={0}
          aria-label="Inspect Price"
          onClick={() => setSelected((prev) => (prev === "price" ? null : "price"))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelected((prev) => (prev === "price" ? null : "price"));
            }
          }}
          style={{ cursor: "pointer" }}
        >
          <Plate
            x={590}
            y={95}
            w={520}
            h={230}
            radius={0}
            color={selected === "price" || tradeStep >= 2 ? "var(--btn-primary, #F0EEE5)" : "var(--border-subtle, #3F3F39)"}
            fill={RAISED}
            strokeWidth={selected === "price" || tradeStep >= 2 ? 2.5 : 1.5}
          >
            <T x={850} y={185} size={64} weight={700} anchor="middle" fill={INK} display>
              {tradeStep >= 2 ? "$95.00" : "Price"}
            </T>
            <T x={850} y={255} size={30} anchor="middle" fill={MUTED}>
              {tradeStep >= 2 ? "Market cleared · Consensus met" : "where they meet"}
            </T>
          </Plate>
        </g>
      </Rise>

      <Rise i={3}>
        <Arrow
          x1={510}
          y1={175}
          x2={580}
          y2={175}
          color="var(--border-subtle, #3F3F39)"
          width={tradeStep >= 1 ? 5 : 3.5}
        />
        <Arrow
          x1={1190}
          y1={175}
          x2={1120}
          y2={175}
          color="var(--border-subtle, #3F3F39)"
          width={tradeStep >= 1 ? 5 : 3.5}
        />
        <T x={545} y={150} size={28} anchor="middle" fill={MUTED}>
          bids
        </T>
        <T x={1155} y={150} size={28} anchor="middle" fill={MUTED}>
          asks
        </T>
      </Rise>

      {/* Transaction Channel - Clear separation, zero collision */}
      <Rise i={4}>
        <T x={850} y={370} size={32} weight={600} anchor="middle">
          Transaction: goods or claims change hands
        </T>
        <Arrow x1={440} y1={398} x2={1260} y2={398} color={INK} width={tradeStep >= 3 ? 5 : 3.5} />

        {/* Information Feedback Loop - Positioned below without intersecting transaction line */}
        <line
          x1={850}
          y1={325}
          x2={850}
          y2={440}
          stroke="var(--border-subtle, #3F3F39)"
          strokeWidth={2}
          strokeDasharray="6 6"
        />
        <Arrow x1={850} y1={460} x2={440} y2={460} color="var(--border-subtle, #3F3F39)" dashed />
        <Arrow x1={850} y1={460} x2={1260} y2={460} color="var(--border-subtle, #3F3F39)" dashed />
        <T x={850} y={525} size={32} weight={600} anchor="middle" fill={MUTED}>
          The price carries information back: how scarce is it?
        </T>
      </Rise>
    </SceneSvg>
  );
}

/* 04 — sixty seeded tiles with the longest streak outlined */
export function UncertaintyField() {
  const [seed, setSeed] = useState(7);

  const reroll = () => {
    setSeed((prev) => ((prev * 17 + 23) % 997) + 1);
  };

  const tiles = generateTiles(seed, "even", 60);
  const stats = tileStats(tiles, 60);

  // Find where the longest streak starts so it can be outlined.
  let best = { start: 0, length: 0 };
  let run = 0;
  tiles.forEach((tile, i) => {
    run = i > 0 && tile === tiles[i - 1] ? run + 1 : 1;
    if (run > best.length) best = { start: i - run + 1, length: run };
  });

  const cell = 84;
  const x0 = 70;
  const y0 = 40;
  const row = Math.floor(best.start / 10);
  const startCol = best.start % 10;
  const fitsRow = startCol + best.length <= 10;

  return (
    <SceneSvg visual="uncertainty-field">
      {/* Interactive Tile Grid (Click to re-roll) */}
      <g
        role="button"
        tabIndex={0}
        aria-label="Click tiles to test random streak generator"
        onClick={reroll}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") reroll();
        }}
        style={{ cursor: "pointer" }}
      >
        {tiles.map((tile, i) => {
          const x = x0 + (i % 10) * cell + cell / 2;
          const y = y0 + Math.floor(i / 10) * cell + cell / 2;
          return (
            <Rise key={`${seed}-${i}`} i={Math.floor(i / 10)}>
              {tile === "circle" ? (
                <rect
                  x={x - 27}
                  y={y - 27}
                  width={54}
                  height={54}
                  rx={0}
                  fill="var(--btn-primary, #F0EEE5)"
                  stroke="var(--border-subtle, #3F3F39)"
                  strokeWidth={1.5}
                />
              ) : (
                <rect
                  x={x - 27}
                  y={y - 27}
                  width={54}
                  height={54}
                  rx={0}
                  fill="var(--bg-surface-elevated, #262624)"
                  stroke="var(--border-subtle, #3F3F39)"
                  strokeWidth={1.5}
                />
              )}
            </Rise>
          );
        })}
      </g>

      {fitsRow ? (
        <rect
          x={x0 + startCol * cell + 6}
          y={y0 + row * cell + 6}
          width={best.length * cell - 12}
          height={cell - 12}
          rx={0}
          fill="none"
          stroke="var(--btn-primary, #F0EEE5)"
          strokeWidth={3}
          strokeDasharray="8 6"
        />
      ) : null}

      <Rise i={4}>
        <Plate x={980} y={50} w={660} h={460} radius={0} color="var(--border-subtle, #3F3F39)">
          <T x={1310} y={135} size={34} anchor="middle" fill={MUTED}>
            In these 60 random tiles
          </T>
          <T x={1310} y={265} size={150} weight={700} anchor="middle" display>
            {stats.longest.length}
          </T>
          <T x={1310} y={325} size={36} weight={600} anchor="middle">
            {`${stats.longest.tile}s in a row`}
          </T>
          <Lines
            x={1310}
            y={385}
            lines={["Streaks happen by chance.", "These tiles are random."]}
            size={31}
            anchor="middle"
          />

          {/* Interactive Re-roll Action Button - Squared Minimal */}
          <g
            role="button"
            tabIndex={0}
            aria-label="Re-roll 60 random trials"
            onClick={reroll}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") reroll();
            }}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={1080}
              y={440}
              width={460}
              height={52}
              rx={0}
              fill="var(--bg-surface-elevated, #262624)"
              stroke="var(--border-subtle, #3F3F39)"
              strokeWidth={1.5}
            />
            <T x={1310} y={476} size={28} weight={600} anchor="middle" fill={INK}>
              🎲 Click to re-roll 60 trials
            </T>
          </g>
        </Plate>
      </Rise>
      <FictionTag />
    </SceneSvg>
  );
}

/* 05 — two currency plates and the invented quote */
export function CurrencyPlates() {
  return (
    <SceneSvg visual="currency-plates">
      <Rise i={0}>
        <Plate x={80} y={90} w={520} h={340} radius={0} color="var(--border-subtle, #3F3F39)">
          <T x={340} y={240} size={150} weight={700} anchor="middle" display>
            USD
          </T>
          <T x={340} y={315} size={38} anchor="middle" fill={MUTED}>
            1 unit · the base
          </T>
          <T x={340} y={375} size={34} anchor="middle" fill={MUTED}>
            US dollar
          </T>
        </Plate>
      </Rise>
      <Rise i={1}>
        <Arrow
          x1={620}
          y1={260}
          x2={1080}
          y2={260}
          color="var(--border-subtle, #3F3F39)"
          width={5}
          head={26}
          dashed
        />
        <T x={850} y={225} size={36} anchor="middle" fill={MUTED}>
          is worth
        </T>
        <T x={850} y={352} size={110} weight={700} anchor="middle" fill={INK} display>
          10.00
        </T>
        <T x={850} y={410} size={34} anchor="middle" fill={MUTED}>
          USD/GHS
        </T>
      </Rise>
      <Rise i={2}>
        <Plate x={1100} y={90} w={520} h={340} radius={0} color="var(--border-subtle, #3F3F39)" dashed>
          <T x={1360} y={240} size={150} weight={700} anchor="middle" display>
            GHS
          </T>
          <T x={1360} y={315} size={38} anchor="middle" fill={MUTED}>
            10.00 units · the quote
          </T>
          <T x={1360} y={375} size={34} anchor="middle" fill={MUTED}>
            Ghana cedis
          </T>
        </Plate>
      </Rise>
      <Rise i={3}>
        <T x={850} y={500} size={32} anchor="middle" fill={MUTED}>
          Read it the other way: 1 GHS is worth 0.1000 USD. Same fact.
        </T>
      </Rise>
      <FictionTag />
    </SceneSvg>
  );
}

/* 06 — importer, bank, supplier, and the cost of the same invoice at two quotes */
export function ImporterBankExporter() {
  return (
    <SceneSvg visual="importer-bank-exporter">
      <Rise i={0}>
        <Plate x={40} y={60} w={440} h={250} radius={0} color={EDGE}>
          <T x={260} y={130} size={42} weight={700} anchor="middle" fill={INK}>
            Importer
          </T>
          <Lines
            x={260}
            y={185}
            lines={["Fictional, in Accra", "Owes 10,000 USD", "Holds Ghana cedis"]}
            size={30}
            anchor="middle"
          />
        </Plate>
      </Rise>
      <Rise i={1}>
        <Plate x={630} y={60} w={440} h={250} radius={0} color={EDGE}>
          <T x={850} y={130} size={42} weight={700} anchor="middle" fill={INK}>
            Bank or dealer
          </T>
          <Lines
            x={850}
            y={185}
            lines={["Quotes USD/GHS 10.00", "Spread built in", "Exchanges the money"]}
            size={30}
            anchor="middle"
          />
        </Plate>
      </Rise>
      <Rise i={2}>
        <Plate x={1220} y={60} w={440} h={250} radius={0} color={EDGE}>
          <T x={1440} y={130} size={42} weight={700} anchor="middle" fill={INK}>
            Supplier
          </T>
          <Lines
            x={1440}
            y={185}
            lines={["Paid in US dollars", "Ships the goods", "Wants the invoice paid"]}
            size={30}
            anchor="middle"
          />
        </Plate>
      </Rise>
      <Rise i={3}>
        <Arrow x1={490} y1={150} x2={620} y2={150} color={EDGE} dashed />
        <T x={555} y={130} size={28} anchor="middle" fill={MUTED}>
          cedis
        </T>
        <Arrow x1={1080} y1={150} x2={1210} y2={150} color={EDGE} dashed />
        <T x={1145} y={130} size={28} anchor="middle" fill={MUTED}>
          dollars
        </T>
      </Rise>
      <Rise i={4}>
        <Plate x={140} y={360} w={640} h={150} radius={0} color={EDGE}>
          <T x={460} y={420} size={32} anchor="middle" fill={MUTED}>
            Quote 10.00 → the bill is
          </T>
          <T x={460} y={480} size={52} weight={700} anchor="middle" display fill={INK}>
            100,000 GHS
          </T>
        </Plate>
        <Plate x={920} y={360} w={640} h={150} radius={0} color="var(--btn-primary, #F0EEE5)">
          <T x={1240} y={420} size={32} anchor="middle" fill={MUTED}>
            Quote 10.50 → the same bill is
          </T>
          <T x={1240} y={480} size={52} weight={700} anchor="middle" fill={INK} display>
            105,000 GHS (+5,000)
          </T>
        </Plate>
        <Arrow x1={790} y1={435} x2={910} y2={435} color={INK} />
      </Rise>
      <T x={40} y={548} size={28} fill={MUTED}>
        Spread ignored for simplicity
      </T>
      <FictionTag y={SH - 56} />
    </SceneSvg>
  );
}

/* 07 — five forces push on one rate; there is no single dial */
export function RateDrivers() {
  const left = [
    { t: "Interest rates", s: "and central-bank policy", y: 40 },
    { t: "Inflation", s: "expectations", y: 190 },
    { t: "Trade flows", s: "exports and imports", y: 340 },
  ];
  const right = [
    { t: "Growth and confidence", s: "in a country's prospects", y: 110 },
    { t: "News and sentiment", s: "moods that shift fast", y: 280 },
  ];
  return (
    <SceneSvg visual="rate-drivers">
      <Rise i={3}>
        <Plate x={640} y={150} w={420} h={260} radius={0} color="var(--border-subtle, #3F3F39)">
          <T x={850} y={240} size={46} weight={700} anchor="middle" fill={INK}>
            One exchange rate
          </T>
          <Lines
            x={850}
            y={300}
            lines={["pushed from many", "directions at once"]}
            size={32}
            anchor="middle"
          />
        </Plate>
      </Rise>
      {left.map((c, i) => (
        <Rise key={c.t} i={i}>
          <Plate x={40} y={c.y} w={470} h={120} radius={0} color="var(--border-subtle, #3F3F39)">
            <T x={70} y={c.y + 54} size={36} weight={700} fill={INK}>
              {c.t}
            </T>
            <T x={70} y={c.y + 96} size={28} fill={MUTED}>
              {c.s}
            </T>
          </Plate>
          <Arrow x1={520} y1={c.y + 60} x2={630} y2={280} color="var(--border-subtle, #3F3F39)" />
        </Rise>
      ))}
      {right.map((c, i) => (
        <Rise key={c.t} i={i + 3}>
          <Plate x={1190} y={c.y} w={470} h={120} radius={0} color="var(--border-subtle, #3F3F39)">
            <T x={1220} y={c.y + 54} size={36} weight={700} fill={INK}>
              {c.t}
            </T>
            <T x={1220} y={c.y + 96} size={28} fill={MUTED}>
              {c.s}
            </T>
          </Plate>
          <Arrow x1={1180} y1={c.y + 60} x2={1070} y2={280} color="var(--border-subtle, #3F3F39)" />
        </Rise>
      ))}
      <Rise i={6}>
        <T x={850} y={520} size={36} weight={600} anchor="middle" fill={MUTED}>
          No single factor sets tomorrow&apos;s price — even experts find it hard to predict.
        </T>
      </Rise>
    </SceneSvg>
  );
}

/* 08 — the same fixed moves at no leverage and at the toy "more" level */
export function LeverageBars() {
  const none = leverageBands("none").rows;
  const more = leverageBands("more").rows;
  const track = 760;
  const x0 = 500;
  const rows = [1, 5] as const;
  const scaleX = (pct: number) => (Math.min(100, pct) / 100) * track;
  return (
    <SceneSvg visual="leverage-bars">
      {rows.map((move, r) => {
        const base = none.find((x) => x.movePct === move);
        const lev = more.find((x) => x.movePct === move);
        const y = 60 + r * 235;
        return (
          <Rise key={move} i={r}>
            <T x={40} y={y + 62} size={44} weight={700}>
              {`${move}% price move`}
            </T>
            <Lines
              x={40}
              y={y + 106}
              lines={["felt in your own money,", "if it goes against you"]}
              size={28}
              gap={1.2}
            />
            <rect
              x={x0}
              y={y + 14}
              width={track}
              height={50}
              rx={0}
              fill="none"
              stroke="var(--border-subtle, #3F3F39)"
              strokeWidth={1.5}
            />
            <rect
              x={x0}
              y={y + 14}
              width={Math.max(scaleX(base?.againstPct ?? 0), 6)}
              height={50}
              rx={0}
              fill="var(--btn-primary, #F0EEE5)"
            />
            <T x={x0 + track + 24} y={y + 52} size={34} weight={700} fill={INK}>
              {`${base?.againstPct ?? 0}%  no leverage`}
            </T>
            <rect
              x={x0}
              y={y + 98}
              width={track}
              height={50}
              rx={0}
              fill="none"
              stroke="var(--border-subtle, #3F3F39)"
              strokeWidth={1.5}
            />
            <rect
              x={x0}
              y={y + 98}
              width={Math.max(scaleX(lev?.againstPct ?? 0), 6)}
              height={50}
              rx={0}
              fill="var(--bg-surface-elevated, #262624)"
              stroke="var(--border-subtle, #3F3F39)"
              strokeWidth={1.5}
            />
            <T x={x0 + track + 24} y={y + 136} size={34} weight={700} fill={INK}>
              {lev?.allUsedUp ? "100%  all used up" : `${lev?.againstPct ?? 0}%  more leverage`}
            </T>
          </Rise>
        );
      })}
      <Rise i={3}>
        <T x={40} y={508} size={32} fill={MUTED}>
          Toy multipliers (1× and 20×) · the same move works in your favour too · no level is a safe
          one
        </T>
      </Rise>
      <FictionTag y={SH - 56} />
    </SceneSvg>
  );
}
