"use client";

import { useState } from "react";
import { ChoiceGroup, LabButton } from "@/components/labs/controls";
import { LabShell } from "@/components/labs/LabShell";
import { getLab } from "@/content/labs";
import {
  LEVERAGE_DEFINITION,
  LEVERAGE_LEVELS,
  leverageBands,
  type LeverageLevel,
} from "@/lib/labs/leverage";
import { palette } from "@/lib/tokens";

const lab = getLab("leverage-sensitivity");

/** Decorative bar; the numbers beside it in the table carry the meaning. */
function Bar({ pct, kind }: { pct: number; kind: "against" | "for" }) {
  const color = kind === "against" ? palette.sports : palette.forex;
  return (
    <svg
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className="mt-1 h-3 w-full min-w-[4rem]"
    >
      <rect
        x="0.5"
        y="0.5"
        width="99"
        height="11"
        fill="none"
        stroke="var(--color-edge)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <rect
        x="0"
        y="0"
        width={Math.max(0, Math.min(100, pct))}
        height="12"
        fill={color}
        fillOpacity={kind === "against" ? 0.85 : 0.6}
        style={{ transition: "width var(--duration-panel) var(--ease-observatory)" }}
      />
    </svg>
  );
}

export function LeverageLab() {
  const [level, setLevel] = useState<LeverageLevel>("none");
  const bands = leverageBands(level);

  const controls = (
    <>
      <ChoiceGroup
        legend="Abstract leverage level"
        name="leverage-level"
        value={level}
        onChange={setLevel}
        options={(Object.keys(LEVERAGE_LEVELS) as LeverageLevel[]).map((value) => ({
          value,
          label: LEVERAGE_LEVELS[value].label,
        }))}
      />
      <p className="text-sm text-muted">
        This is not a recommendation. It only shows how the same fixed price moves would be felt at
        each level.
      </p>
      <LabButton onClick={() => setLevel("none")} className="w-full">
        Reset
      </LabButton>
    </>
  );

  const visual = (
    <div>
      <p className="text-lg font-semibold text-ink">{bands.headline}</p>
      <p className="mt-2 text-base text-muted">{LEVERAGE_DEFINITION}</p>
      <div className="mt-4">
        <table className="w-full table-fixed border-separate border-spacing-0 text-left text-base">
          <caption className="sr-only">
            Effect of fixed fictional price moves on a person&rsquo;s own money at{" "}
            {bands.label.toLowerCase()} leverage
          </caption>
          <thead>
            <tr className="text-sm text-muted">
              <th scope="col" className="border-b border-line py-2 pr-3 font-semibold">
                Price moves by
              </th>
              <th scope="col" className="border-b border-line py-2 pr-3 font-semibold">
                If the move goes against you: your own money changes by
              </th>
              <th scope="col" className="border-b border-line py-2 font-semibold">
                If it goes your way: by
              </th>
            </tr>
          </thead>
          <tbody>
            {bands.rows.map((row) => (
              <tr key={row.movePct}>
                <th
                  scope="row"
                  className="border-b border-line py-3 pr-3 align-top font-semibold text-ink"
                >
                  {row.movePct}%
                </th>
                <td className="border-b border-line py-3 pr-3 align-top">
                  <span className="block font-semibold text-ink">
                    {row.allUsedUp ? "All of it (100%)" : `${row.againstPct}%`}
                  </span>
                  <Bar pct={row.againstPct} kind="against" />
                  {row.allUsedUp ? (
                    <span className="mt-1 block text-sm font-semibold text-sports">
                      All the money put in is used up in this toy model
                    </span>
                  ) : null}
                </td>
                <td className="border-b border-line py-3 align-top">
                  <span className="block font-semibold text-ink">{row.forPct}%</span>
                  <Bar pct={row.forPct} kind="for" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 text-sm text-[var(--text-secondary)]">{bands.caveat}</p>
    </div>
  );

  const largest = bands.rows[bands.rows.length - 1];
  const live = `${bands.headline}${
    largest?.allUsedUp
      ? ` At this level the largest fixed move (${largest.movePct}%) uses up all of the money put in, in this toy model.`
      : ""
  }`;

  return <LabShell lab={lab} controls={controls} visual={visual} live={live} />;
}
