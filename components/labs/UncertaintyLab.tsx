"use client";

import { useMemo, useState } from "react";
import { ChoiceGroup, LabButton } from "@/components/labs/controls";
import { LabShell } from "@/components/labs/LabShell";
import { getLab } from "@/content/labs";
import {
  BLOCK_SIZE,
  MIX_LABELS,
  RUN_SEEDS,
  TILE_COUNT,
  generateTiles,
  runSeed,
  tileStats,
  type TileMix,
} from "@/lib/labs/uncertainty";

const lab = getLab("uncertainty-tiles");

const COLS = 10;
const CELL = 40;

export function UncertaintyLab() {
  const [mix, setMix] = useState<TileMix>("even");
  const [run, setRun] = useState(0);
  const [revealed, setRevealed] = useState(0);

  const tiles = useMemo(() => generateTiles(runSeed(run), mix), [run, mix]);
  const stats = tileStats(tiles, revealed);

  const restart = (nextMix: TileMix, nextRun: number) => {
    setMix(nextMix);
    setRun(nextRun);
    setRevealed(0);
  };

  const controls = (
    <>
      <ChoiceGroup
        legend="What is in the bag?"
        name="tiles-mix"
        value={mix}
        onChange={(value) => restart(value, run)}
        options={[
          { value: "even", label: "Even mix" },
          { value: "uneven", label: "Uneven mix" },
        ]}
      />
      <p className="-mt-3 text-sm text-muted">
        {MIX_LABELS[mix]}. Each tile is drawn from the bag using a fixed pseudo-random sequence,
        then put back.
      </p>
      <ChoiceGroup
        legend="Fixed set of tiles (the same every time)"
        name="tiles-run"
        value={String(run)}
        onChange={(value) => restart(mix, Number(value))}
        options={RUN_SEEDS.map((_, i) => ({ value: String(i), label: `Set ${i + 1}` }))}
      />
      <p className="-mt-3 text-sm text-muted">
        These five sets were chosen because each contains a visible streak. That is to make the
        point clearly, not because streaks are rare.
      </p>
      <div className="flex flex-wrap gap-2">
        <LabButton
          variant="primary"
          onClick={() => setRevealed(stats.revealed + 1)}
          disabled={stats.revealed >= TILE_COUNT}
        >
          Reveal next
        </LabButton>
        <LabButton
          onClick={() => setRevealed(stats.revealed + 10)}
          disabled={stats.revealed >= TILE_COUNT}
        >
          Reveal 10 more
        </LabButton>
        <LabButton onClick={() => setRevealed(TILE_COUNT)} disabled={stats.revealed >= TILE_COUNT}>
          Reveal all
        </LabButton>
      </div>
      <LabButton onClick={() => restart("even", 0)} className="w-full">
        Reset
      </LabButton>
    </>
  );

  const visual = (
    <div>
      <svg
        viewBox={`0 0 ${COLS * CELL} ${(TILE_COUNT / COLS) * CELL}`}
        role="img"
        aria-label={stats.summary}
        className="h-auto w-full"
      >
        {tiles.map((tile, i) => {
          const x = (i % COLS) * CELL;
          const y = Math.floor(i / COLS) * CELL;
          const cx = x + CELL / 2;
          const cy = y + CELL / 2;
          if (i >= stats.revealed) {
            return (
              <g key={i}>
                <rect
                  x={x + 4}
                  y={y + 4}
                  width={CELL - 8}
                  height={CELL - 8}
                  rx="0"
                  fill="none"
                  stroke="var(--border-subtle, #3F3F39)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text x={cx} y={cy + 6} textAnchor="middle" fontSize="16" fill="var(--text-secondary, #BDBBB2)">
                  ?
                </text>
              </g>
            );
          }
          return tile === "circle" ? (
            <rect
              key={i}
              x={cx - 13}
              y={cy - 13}
              width="26"
              height="26"
              rx="0"
              fill="var(--btn-primary, #F0EEE5)"
              stroke="var(--border-subtle, #3F3F39)"
              strokeWidth="1"
            />
          ) : (
            <rect
              key={i}
              x={cx - 13}
              y={cy - 13}
              width="26"
              height="26"
              rx="0"
              fill="var(--bg-surface-elevated, #262624)"
              stroke="var(--border-subtle, #3F3F39)"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <p className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
        <span>
          <span aria-hidden="true" className="text-forex">
            ●
          </span>{" "}
          Circle
        </span>
        <span>
          <span aria-hidden="true" className="text-crypto">
            ■
          </span>{" "}
          Square
        </span>
        <span>
          <span aria-hidden="true">▢</span> Not revealed yet
        </span>
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">Revealed</dt>
          <dd className="mt-1 text-2xl font-bold text-[var(--text-main)]">
            {stats.revealed}{" "}
            <span className="text-base font-semibold text-[var(--text-secondary)]">of {stats.total}</span>
          </dd>
        </div>
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">Circles and squares</dt>
          <dd className="mt-1 text-2xl font-bold text-[var(--text-main)]">
            {stats.circles} <span aria-hidden="true">●</span> / {stats.squares}{" "}
            <span aria-hidden="true">■</span>
          </dd>
        </div>
        <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
          <dt className="text-sm font-semibold text-[var(--text-secondary)]">Longest streak so far</dt>
          <dd className="mt-1 text-2xl font-bold text-[var(--text-main)]">
            {stats.longest.tile === null
              ? "—"
              : `${stats.longest.length} ${stats.longest.tile}${stats.longest.length === 1 ? "" : "s"}`}
          </dd>
        </div>
      </dl>

      {stats.blocks.length > 0 ? (
        <div className="mt-4">
          <table className="w-full text-left text-base">
            <caption className="pb-2 text-left text-sm font-semibold text-muted">
              Circles in each block of {BLOCK_SIZE} tiles — notice how much blocks differ
            </caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Block</th>
                <th scope="col">Tiles revealed</th>
                <th scope="col">Circles</th>
                <th scope="col">Squares</th>
              </tr>
            </thead>
            <tbody>
              {stats.blocks.map((block, i) => (
                <tr key={i} className="border-t border-line">
                  <th scope="row" className="py-2 pr-3 font-semibold text-ink">
                    Block {i + 1}
                  </th>
                  <td className="py-2 pr-3 text-muted">{block.size} tiles</td>
                  <td className="py-2 pr-3 text-ink">{block.circles} circles</td>
                  <td className="py-2 text-ink">{block.size - block.circles} squares</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {stats.revealed > 0 ? (
        <details className="mt-4 text-base text-muted">
          <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-ink">
            Sequence as text (C = circle, S = square)
          </summary>
          <p className="mt-2 break-words font-mono text-sm" data-testid="tile-sequence">
            {stats.sequence}
          </p>
        </details>
      ) : null}

      <p className="mt-4 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 text-sm text-[var(--text-secondary)]">
        Knowing what is in the bag tells you how often each shape tends to come up over many draws,
        not which one comes next. Each tile goes back in the bag, so earlier tiles do not change
        what comes next, and a streak does not make the other shape &ldquo;due&rdquo;. In 60 tiles,
        streaks of four, five or six in a row are ordinary.
      </p>
    </div>
  );

  return <LabShell lab={lab} controls={controls} visual={visual} live={stats.summary} />;
}
