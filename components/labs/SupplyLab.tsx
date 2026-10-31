"use client";

import { useState } from "react";
import { ChoiceGroup, LabButton } from "@/components/labs/controls";
import { LabShell } from "@/components/labs/LabShell";
import { getLab } from "@/content/labs";
import {
  SUPPLY_LABELS,
  demandPrice,
  supplyPrice,
  supplyStory,
  type SupplyScenario,
} from "@/lib/labs/supply";
import { palette } from "@/lib/tokens";

const lab = getLab("supply-shock");

// Chart geometry on the abstract 0–100 scales (no numbers are shown to the learner).
const X0 = 64;
const X1 = 424;
const Y0 = 284; // bottom (price 0)
const Y1 = 24; // top (price 100)
const px = (q: number) => X0 + ((X1 - X0) * q) / 100;
const py = (p: number) => Y0 - ((Y0 - Y1) * p) / 100;

const SCENARIOS = Object.keys(SUPPLY_LABELS) as SupplyScenario[];

export function SupplyLab() {
  const [scenario, setScenario] = useState<SupplyScenario>("normal");
  const story = supplyStory(scenario);
  const shifted = story.shift > 0;

  const dx = px(story.now.q) - px(story.baseline.q);
  const dy = py(story.now.p) - py(story.baseline.p);
  const move = "transform var(--duration-scene) var(--ease-observatory)";

  const controls = (
    <>
      <ChoiceGroup
        legend="Fictional event in the growing season"
        name="supply-scenario"
        value={scenario}
        onChange={setScenario}
        options={SCENARIOS.map((value) => ({ value, label: SUPPLY_LABELS[value] }))}
      />
      <LabButton onClick={() => setScenario("normal")} className="w-full">
        Reset
      </LabButton>
    </>
  );

  const visual = (
    <div>
      <svg
        viewBox="0 0 450 330"
        role="img"
        aria-label={`Stylised supply and demand chart. ${story.reading}`}
        className="h-auto w-full"
      >
        <defs>
          <clipPath id="supply-clip">
            <rect x={X0} y={Y1 - 4} width={X1 - X0 + 4} height={Y0 - Y1 + 4} />
          </clipPath>
          <marker
            id="supply-axis"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 10 5 0 10z" fill="var(--color-muted)" />
          </marker>
        </defs>

        <line
          x1={X0}
          y1={Y0}
          x2={X1 + 18}
          y2={Y0}
          stroke="var(--color-muted)"
          strokeWidth="2"
          markerEnd="url(#supply-axis)"
        />
        <line
          x1={X0}
          y1={Y0}
          x2={X0}
          y2={Y1 - 12}
          stroke="var(--color-muted)"
          strokeWidth="2"
          markerEnd="url(#supply-axis)"
        />
        <text x={(X0 + X1) / 2} y="318" textAnchor="middle" fontSize="16" fill="var(--color-muted)">
          Quantity available (stylised)
        </text>
        <text
          transform={`translate(18 ${(Y0 + Y1) / 2}) rotate(-90)`}
          textAnchor="middle"
          fontSize="16"
          fill="var(--color-muted)"
        >
          Price (stylised)
        </text>

        <g clipPath="url(#supply-clip)">
          {/* Demand: slopes downward. */}
          <line
            x1={px(0)}
            y1={py(demandPrice(0))}
            x2={px(100)}
            y2={py(demandPrice(100))}
            stroke={palette.stocks}
            strokeWidth="3.5"
          />
          {/* The normal-season supply line stays as a dashed ghost once supply has shifted. */}
          {shifted ? (
            <line
              x1={px(0)}
              y1={py(supplyPrice(0, 0))}
              x2={px(100)}
              y2={py(supplyPrice(100, 0))}
              stroke={palette.commodities}
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.7"
            />
          ) : null}
          <g
            style={{
              transform: `translateX(${-story.shift * ((X1 - X0) / 100)}px)`,
              transition: move,
            }}
          >
            <line
              x1={px(0)}
              y1={py(supplyPrice(0, 0))}
              x2={px(100)}
              y2={py(supplyPrice(100, 0))}
              stroke={palette.commodities}
              strokeWidth="3.5"
            />
          </g>
        </g>

        <text
          x={px(100) - 6}
          y={py(demandPrice(100)) + 22}
          textAnchor="end"
          fontSize="17"
          fontWeight="700"
          fill={palette.stocks}
        >
          Demand
        </text>
        <text
          x={px(100) - 6}
          y={py(supplyPrice(100, 0)) - 8}
          textAnchor="end"
          fontSize="17"
          fontWeight="700"
          fill={palette.commodities}
        >
          Supply{shifted ? " (moved left)" : ""}
        </text>

        {/* Meeting points: hollow = normal season, filled = now. */}
        <circle
          cx={px(story.baseline.q)}
          cy={py(story.baseline.p)}
          r="8"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.5"
          strokeDasharray="3 3"
        />
        <g style={{ transform: `translate(${dx}px, ${dy}px)`, transition: move }}>
          <circle
            cx={px(story.baseline.q)}
            cy={py(story.baseline.p)}
            r="8"
            fill="var(--color-ink)"
          />
        </g>
      </svg>

      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
        <li>
          <span aria-hidden="true">━ </span>Demand (solid line, labelled on the chart)
        </li>
        <li>
          <span aria-hidden="true">━ </span>Supply (solid line, labelled on the chart)
        </li>
        <li>
          <span aria-hidden="true">╌ </span>Normal-season supply (dashed)
        </li>
        <li>
          <span aria-hidden="true">● </span>Where they meet now (○ normal season)
        </li>
      </ul>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">Price pressure</dt>
          <dd className="mt-1 text-xl font-bold text-[var(--text-main)]">
            {story.priceDirection === "higher" ? "▲ Upward pressure in this model" : "● No change"}
          </dd>
        </div>
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">Quantity available</dt>
          <dd className="mt-1 text-xl font-bold text-[var(--text-main)]">
            {story.quantityDirection === "lower" ? "▼ Lower in this model" : "● No change"}
          </dd>
        </div>
      </dl>
      <p className="mt-4 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 text-sm text-[var(--text-secondary)]">{story.caveat}</p>
    </div>
  );

  return <LabShell lab={lab} controls={controls} visual={visual} live={story.reading} />;
}
