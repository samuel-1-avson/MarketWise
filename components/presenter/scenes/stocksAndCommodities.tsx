import { MOSAIC_COLS, MOSAIC_ROWS, mosaicPaths } from "@/lib/labs/ownership";
import { demandPrice, equilibrium, supplyPrice } from "@/lib/labs/supply";
import {
  Arrow,
  Chip,
  EDGE,
  FictionTag,
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
} from "./kit";

/* 09 — a company split into 1,000 shares, 25 highlighted */
export function CompanyShares() {
  const { ownedD, restD } = mosaicPaths(25);
  const scale = 1.62;
  return (
    <SceneSvg visual="company-shares">
      <Rise i={0}>
        <Plate x={50} y={110} w={420} h={360} radius={0} color={EDGE}>
          <path
            d="M120 300 h280 v-90 l-140 -70 l-140 70 z"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <rect
            x={225}
            y={240}
            width={70}
            height={60}
            rx={0}
            fill="none"
            stroke={INK}
            strokeWidth={4}
          />
          <T x={260} y={372} size={42} weight={700} anchor="middle" fill={INK}>
            Sunrise Bakery Ltd
          </T>
          <T x={260} y={420} size={28} anchor="middle" fill={MUTED}>
            fictional company
          </T>
        </Plate>
      </Rise>
      <Rise i={1}>
        <Arrow x1={490} y1={290} x2={640} y2={290} color={INK} width={4} />
        <T x={565} y={262} size={28} anchor="middle" fill={MUTED}>
          split into
        </T>
        <T x={565} y={338} size={28} anchor="middle" fill={MUTED}>
          1,000 shares
        </T>
      </Rise>
      <Rise i={2}>
        <g transform={`translate(660 90) scale(${scale})`}>
          <path d={restD} fill="none" stroke="var(--border-subtle, #3F3F39)" strokeWidth={1} />
          <path d={ownedD} fill="var(--btn-primary, #F0EEE5)" />
        </g>
        <T x={660} y={SH - 40} size={30} fill={MUTED}>
          {`${MOSAIC_COLS * MOSAIC_ROWS} squares = ${MOSAIC_COLS * MOSAIC_ROWS} shares`}
        </T>
      </Rise>
      <Rise i={3}>
        <T x={1380} y={250} size={110} weight={700} anchor="middle" fill={INK} display>
          2.5%
        </T>
        <T x={1380} y={310} size={36} weight={600} anchor="middle" fill={INK}>
          25 of 1,000 shares
        </T>
        <Lines
          x={1380}
          y={380}
          lines={["a fraction of the whole —", "not a promised payout"]}
          size={30}
          anchor="middle"
        />
      </Rise>
      <FictionTag />
    </SceneSvg>
  );
}

/* 10 — a mosaic of forces; the price is where opinions meet */
export function PriceDriversMosaic() {
  const cards = [
    { t: "Earnings", s: "vs what was expected" },
    { t: "Company news", s: "products, people, problems" },
    { t: "Interest rates", s: "and the wider economy" },
    { t: "Competition", s: "and the industry" },
    { t: "Market mood", s: "fear and optimism" },
    { t: "Events outside", s: "the company's control" },
  ];
  const w = 520;
  const h = 195;
  const x0 = 60;
  return (
    <SceneSvg visual="price-drivers-mosaic">
      {cards.map((c, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = x0 + col * (w + 40);
        const y = 40 + row * (h + 30);
        return (
          <Rise key={c.t} i={i}>
            <Plate x={x} y={y} w={w} h={h} radius={0} color={EDGE}>
              <T x={x + 36} y={y + 84} size={44} weight={700} fill={INK}>
                {c.t}
              </T>
              <T x={x + 36} y={y + 138} size={30} fill={MUTED}>
                {c.s}
              </T>
            </Plate>
          </Rise>
        );
      })}
      <Rise i={7}>
        <Plate
          x={450}
          y={480}
          w={800}
          h={92}
          radius={0}
          color="var(--btn-primary, #F0EEE5)"
          fill={RAISED}
        >
          <T x={850} y={540} size={40} weight={700} anchor="middle" fill={INK}>
            Price = where many opinions meet today
          </T>
        </Plate>
      </Rise>
    </SceneSvg>
  );
}

/* 11 — a physical chain from producer to manufacturer */
export function SupplyChain() {
  const nodes = [
    { t: "Farm or mine", s: ["grows or digs", "the raw good"] },
    { t: "Processor", s: ["cleans, refines,", "prepares it"] },
    { t: "Shipping, storage", s: ["moves it and", "holds it"] },
    { t: "Manufacturer", s: ["turns it into", "finished products"] },
  ];
  const w = 360;
  const gap = 85;
  const x0 = (SW - (4 * w + 3 * gap)) / 2;
  return (
    <SceneSvg visual="supply-chain">
      {nodes.map((n, i) => {
        const x = x0 + i * (w + gap);
        return (
          <Rise key={n.t} i={i}>
            <Plate x={x} y={60} w={w} h={250} radius={0} color={EDGE}>
              <T x={x + w / 2} y={140} size={34} weight={700} anchor="middle" fill={INK}>
                {n.t}
              </T>
              <Lines x={x + w / 2} y={200} lines={n.s} size={31} anchor="middle" />
            </Plate>
            {i < nodes.length - 1 ? (
              <Arrow
                x1={x + w + 8}
                y1={185}
                x2={x + w + gap - 8}
                y2={185}
                color={EDGE}
                width={4}
                dashed
              />
            ) : null}
          </Rise>
        );
      })}
      <Rise i={5}>
        {["Cocoa", "Gold", "Oil"].map((good, k) => (
          <Chip
            key={good}
            x={x0 + k * 260}
            y={365}
            text={good}
            color={EDGE}
            fill="var(--bg-surface-elevated, #262624)"
            size={34}
          />
        ))}
        <T x={x0 + 800} y={408} size={32} fill={MUTED}>
          examples of goods · spot price = delivery now
        </T>
      </Rise>
      <Rise i={6}>
        <Plate x={x0} y={460} w={4 * w + 3 * gap} h={100} radius={0} color={EDGE} dashed>
          <T x={SW / 2} y={522} size={36} weight={700} anchor="middle" fill={INK}>
            A problem at any link changes what reaches the next one
          </T>
        </Plate>
      </Rise>
    </SceneSvg>
  );
}

/* 12 — two timelines: goods now, or an agreement now about later */
export function SpotVsFutures() {
  return (
    <SceneSvg visual="spot-vs-futures">
      <Rise i={0}>
        <T x={60} y={78} size={44} weight={700} fill={INK}>
          Spot
        </T>
        <T x={60} y={124} size={30} fill={MUTED}>
          delivery now or very soon
        </T>
        <line x1={460} y1={105} x2={1620} y2={105} stroke={EDGE} strokeWidth={4} />
        <rect
          x={492}
          y={77}
          width={56}
          height={56}
          rx={0}
          fill="var(--btn-primary, #F0EEE5)"
          stroke={EDGE}
          strokeWidth={1.5}
        />
        <T x={520} y={180} size={32} weight={600} anchor="middle" fill={INK}>
          Today
        </T>
        <T x={760} y={86} size={34} anchor="start" fill={INK}>
          goods ⇄ money change hands
        </T>
      </Rise>
      <Rise i={1}>
        <line
          x1={60}
          y1={265}
          x2={1640}
          y2={265}
          stroke={EDGE}
          strokeWidth={1.5}
          strokeDasharray="6 12"
        />
      </Rise>
      <Rise i={2}>
        <T x={60} y={348} size={44} weight={700} fill={INK}>
          Futures contract
        </T>
        <T x={60} y={394} size={30} fill={MUTED}>
          an agreement about later
        </T>
        <line x1={460} y1={375} x2={1620} y2={375} stroke={EDGE} strokeWidth={4} />
        <rect
          x={492}
          y={347}
          width={56}
          height={56}
          rx={0}
          fill="var(--bg-surface-elevated, #262624)"
          stroke={EDGE}
          strokeWidth={1.5}
        />
        <T x={520} y={450} size={32} weight={600} anchor="middle" fill={INK}>
          Today
        </T>
        <T x={520} y={492} size={28} anchor="middle" fill={MUTED}>
          price and date agreed
        </T>
        <rect
          x={1472}
          y={347}
          width={56}
          height={56}
          rx={0}
          fill="none"
          stroke="var(--btn-primary, #F0EEE5)"
          strokeWidth={3}
        />
        <T x={1500} y={450} size={32} weight={600} anchor="middle" fill={INK}>
          Later
        </T>
        <T x={1500} y={492} size={28} anchor="middle" fill={MUTED}>
          delivery or cash settlement
        </T>
        <Arrow x1={570} y1={375} x2={1440} y2={375} color={EDGE} width={4} />
        <T x={1005} y={345} size={30} anchor="middle" fill={MUTED}>
          many are closed out before delivery
        </T>
      </Rise>
    </SceneSvg>
  );
}

/* 13 — stylised supply and demand with the supply line shifted left */
export function SupplyCurve() {
  const X0 = 110;
  const X1 = 960;
  const Y0 = 520;
  const Y1 = 40;
  const px = (q: number) => X0 + ((X1 - X0) * q) / 100;
  const py = (p: number) => Y0 - ((Y0 - Y1) * p) / 100;
  const shift = 20;
  const base = equilibrium(0);
  const now = equilibrium(shift);
  const line = (f: (q: number) => number) => `M${px(0)} ${py(f(0))} L${px(100)} ${py(f(100))}`;
  return (
    <SceneSvg visual="supply-curve">
      <defs>
        <clipPath id="deck-supply-clip">
          <rect x={X0} y={Y1 - 6} width={X1 - X0 + 6} height={Y0 - Y1 + 6} />
        </clipPath>
      </defs>
      <line x1={X0} y1={Y0} x2={X1 + 30} y2={Y0} stroke={MUTED} strokeWidth={3} />
      <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 20} stroke={MUTED} strokeWidth={3} />
      <T x={(X0 + X1) / 2} y={578} size={30} anchor="middle" fill={MUTED}>
        Quantity available (stylised)
      </T>
      <text
        transform={`translate(52 ${(Y0 + Y1) / 2}) rotate(-90)`}
        fontSize={30}
        fill={MUTED}
        textAnchor="middle"
      >
        Price (stylised)
      </text>
      <Rise i={0}>
        <g clipPath="url(#deck-supply-clip)">
          <path
            d={line((q) => demandPrice(q))}
            stroke={INK}
            strokeWidth={5}
            fill="none"
          />
          <path
            d={line((q) => supplyPrice(q, 0))}
            stroke={EDGE}
            strokeWidth={3}
            strokeDasharray="14 12"
            fill="none"
            opacity={0.75}
          />
          <path
            d={line((q) => supplyPrice(q, 0))}
            transform={`translate(${-shift * ((X1 - X0) / 100)} 0)`}
            stroke="var(--btn-primary, #F0EEE5)"
            strokeWidth={5}
            fill="none"
          />
        </g>
        <T
          x={px(100) - 8}
          y={py(demandPrice(100)) + 44}
          size={34}
          weight={700}
          anchor="end"
          fill={INK}
        >
          Demand
        </T>
        <T
          x={px(100) - 8}
          y={py(supplyPrice(100, 0)) - 16}
          size={34}
          weight={700}
          anchor="end"
          fill={MUTED}
        >
          Supply (moved left)
        </T>
      </Rise>
      <Rise i={2}>
        <rect
          x={px(base.q) - 12}
          y={py(base.p) - 12}
          width={24}
          height={24}
          rx={0}
          fill="none"
          stroke={INK}
          strokeWidth={3}
          strokeDasharray="4 4"
        />
        <rect
          x={px(now.q) - 12}
          y={py(now.p) - 12}
          width={24}
          height={24}
          rx={0}
          fill={INK}
        />
        <Arrow
          x1={px(base.q) - 22}
          y1={py(base.p) - 6}
          x2={px(now.q) + 26}
          y2={py(now.p) + 2}
          color={INK}
          width={4}
          head={18}
        />
      </Rise>
      <Rise i={3}>
        <Plate x={1050} y={70} w={600} h={420} radius={0} color={EDGE}>
          <T x={1090} y={150} size={36} weight={700} fill={INK}>
            Fictional drought
          </T>
          <Lines
            x={1090}
            y={215}
            lines={[
              "▸ Supply line moves left",
              "▲ Price pressure upward",
              "▼ Quantity available lower",
            ]}
            size={34}
            fill={INK}
            gap={1.5}
          />
          <line x1={1090} y1={375} x2={1610} y2={375} stroke={EDGE} strokeWidth={1.5} />
          <Lines
            x={1090}
            y={424}
            lines={["A teaching model —", "not a forecast."]}
            size={30}
            gap={1.25}
          />
        </Plate>
      </Rise>
    </SceneSvg>
  );
}
