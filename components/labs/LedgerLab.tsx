"use client";

import { useState } from "react";
import { ChoiceGroup, LabButton } from "@/components/labs/controls";
import { LabShell } from "@/components/labs/LabShell";
import { getLab } from "@/content/labs";
import {
  LEDGER_NODE_COUNT,
  LEDGER_STEP_COUNT,
  LEDGER_STEP_TITLES,
  ledgerStep,
  type LedgerScenario,
  type NodeState,
} from "@/lib/labs/ledger";
import { palette } from "@/lib/tokens";

const lab = getLab("ledger-journey");

const NODE_LABEL: Record<NodeState, string> = {
  idle: "waiting",
  received: "hold the request",
  accepted: "accepted it",
  rejected: "rejected it",
};

function NodeGlyph({ state, cx, cy }: { state: NodeState; cx: number; cy: number }) {
  if (state === "accepted") {
    return (
      <path
        d={`M${cx - 9} ${cy} l6 7 l12 -14`}
        fill="none"
        stroke={palette.forex}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  if (state === "rejected") {
    return (
      <path
        d={`M${cx - 9} ${cy - 9} l18 18 M${cx + 9} ${cy - 9} l-18 18`}
        fill="none"
        stroke={palette.sports}
        strokeWidth="4"
        strokeLinecap="round"
      />
    );
  }
  if (state === "received") return <circle cx={cx} cy={cy} r="7" fill={palette.crypto} />;
  return null;
}

export function LedgerLab() {
  const [scenario, setScenario] = useState<LedgerScenario>("valid");
  const [step, setStep] = useState(0);
  const view = ledgerStep(scenario, step);

  const atEnd = view.index === LEDGER_STEP_COUNT - 1;
  const stateColor = (s: NodeState) =>
    s === "accepted"
      ? palette.forex
      : s === "rejected"
        ? palette.sports
        : s === "received"
          ? palette.crypto
          : palette.muted;
  const nodeStatus = view.nodes[0] ?? "idle";

  const controls = (
    <>
      <ChoiceGroup
        legend="What request is made?"
        name="ledger-scenario"
        value={scenario}
        onChange={(value) => {
          setScenario(value);
          setStep(0);
        }}
        options={[
          { value: "valid", label: "A valid request" },
          { value: "invalid", label: "A request that breaks a rule" },
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={() => setStep(view.index - 1)} disabled={view.index === 0}>
          ← Back
        </LabButton>
        {atEnd ? (
          <LabButton variant="primary" onClick={() => setStep(0)}>
            ↺ Replay
          </LabButton>
        ) : (
          <LabButton variant="primary" onClick={() => setStep(view.index + 1)}>
            Next step →
          </LabButton>
        )}
      </div>
      <LabButton
        onClick={() => {
          setScenario("valid");
          setStep(0);
        }}
        className="w-full"
      >
        Reset
      </LabButton>
      <ol className="space-y-1 text-sm" aria-label="Steps">
        {LEDGER_STEP_TITLES.map((title, i) => (
          <li
            key={title}
            aria-current={i === view.index ? "step" : undefined}
            className={`rounded-none border px-3 py-2 ${i === view.index ? "border-[var(--btn-primary)] bg-[var(--bg-surface-elevated)] font-semibold text-[var(--text-main)]" : "border-transparent text-[var(--text-secondary)]"}`}
          >
            <span aria-hidden="true">{i < view.index ? "✓ " : i === view.index ? "▸ " : "○ "}</span>
            {i + 1}. {title}
          </li>
        ))}
      </ol>
    </>
  );

  const visual = (
    <div>
      <p className="text-sm font-semibold text-muted">The request</p>
      <p className="mt-1 text-lg font-semibold text-ink">{view.request}</p>

      <svg
        viewBox="0 0 440 130"
        role="img"
        aria-label={`Five computers keeping the ledger. ${
          view.index === 0
            ? "None has seen the request yet."
            : `All five ${NODE_LABEL[nodeStatus]}.`
        }`}
        className="mt-4 h-auto w-full"
      >
        {view.nodes.map((state, i) => {
          const cx = 48 + i * 86;
          return (
            <g key={i}>
              <circle
                cx={cx}
                cy="52"
                r="28"
                fill="var(--color-midnight)"
                stroke={stateColor(state)}
                strokeWidth="3"
                strokeDasharray={state === "idle" ? "5 4" : undefined}
              />
              <NodeGlyph state={state} cx={cx} cy={52} />
              <text x={cx} y="104" textAnchor="middle" fontSize="16" fill="var(--color-muted)">
                Node {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-1 text-sm text-muted">
        Each circle is one computer (a &ldquo;node&rdquo;) keeping its own copy of the ledger.{" "}
        {view.index === 0
          ? "No node has seen the request yet."
          : `All ${LEDGER_NODE_COUNT} nodes ${NODE_LABEL[nodeStatus]}.`}
      </p>
      <p className="mt-1 text-sm text-muted">
        This is a simplification. Real networks group requests into blocks and use a consensus
        method to agree on them; this toy skips that and simply shows every node checking the same
        rules. A &ldquo;token&rdquo; here is just a labelled item; real tokens can represent very
        different things.
      </p>

      <div className="mt-5 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4">
        <h2 className="text-xl font-bold text-[var(--text-main)]">
          Step {view.index + 1} of {view.count}: {view.title}
        </h2>
        <p className="mt-2 text-base text-[var(--text-main)]">{view.happening}</p>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-main)]">Worth noticing: </span>
          {view.watchOut}
        </p>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
          The shared ledger, as every computer sees it
        </h3>
        <ol className="mt-2 space-y-2" aria-label="Ledger entries">
          {view.entries.map((entry) => (
            <li
              key={entry}
              className={`rounded-none border px-4 py-2 text-base ${entry === view.newEntry ? "border-[var(--btn-primary)] bg-[var(--bg-surface-elevated)] text-[var(--text-main)] font-semibold" : "border-[var(--border-subtle)] text-[var(--text-secondary)]"}`}
            >
              {entry}
              {entry === view.newEntry ? (
                <strong className="ml-2 text-[var(--btn-primary)]">✓ New entry</strong>
              ) : null}
            </li>
          ))}
        </ol>
        {view.outcome === "rejected" && view.index >= 2 ? (
          <p className="mt-2 text-sm font-semibold text-sports">
            ✗ Request rejected — the ledger has not changed.
          </p>
        ) : null}
      </div>
    </div>
  );

  return <LabShell lab={lab} controls={controls} visual={visual} live={view.summary} />;
}
