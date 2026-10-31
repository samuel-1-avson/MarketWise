import { clampInt } from "./clamp";

/**
 * Ledger Journey model. A toy sequence with invented names and items. There are no wallets, keys,
 * addresses, amounts or real transfers: only the idea of a request being checked against rules before
 * it is recorded in a record that every participant keeps in step.
 */
export type LedgerScenario = "valid" | "invalid";
export type NodeState = "idle" | "received" | "accepted" | "rejected";

export const LEDGER_NODE_COUNT = 5;
export const LEDGER_STEP_COUNT = 4;

const START_ENTRIES = [
  "Entry 1: token A is controlled by Ama",
  "Entry 2: token B is controlled by Kofi",
] as const;

export type LedgerStep = {
  scenario: LedgerScenario;
  index: number;
  count: number;
  title: string;
  happening: string;
  /** The ledger as every participant sees it at this step. */
  entries: readonly string[];
  /** The entry added at this step, if any (highlighted in the interface). */
  newEntry: string | null;
  nodes: readonly NodeState[];
  outcome: "pending" | "recorded" | "rejected";
  watchOut: string;
  request: string;
  summary: string;
};

export const LEDGER_STEP_TITLES = ["Request", "Broadcast", "Validation", "Ledger update"] as const;

export function parseLedgerScenario(value: unknown): LedgerScenario {
  return value === "invalid" ? "invalid" : "valid";
}

export function ledgerStep(scenarioInput: unknown, stepInput: unknown): LedgerStep {
  const scenario = parseLedgerScenario(scenarioInput);
  const index = clampInt(stepInput, 0, LEDGER_STEP_COUNT - 1, 0);
  const valid = scenario === "valid";

  const request = valid
    ? "Ama asks to move token A to Kofi."
    : "Efua asks to move token A to Kofi, although she does not control token A.";

  const nodesAt = (state: NodeState): NodeState[] =>
    Array.from({ length: LEDGER_NODE_COUNT }, () => state);

  const happenings: readonly string[] = [
    valid
      ? "Ama, who controls token A, prepares a request to move it to Kofi and authorises it as the controller. Nothing has changed on the ledger yet."
      : "Efua prepares a request to move token A to Kofi. She does not control token A, so her request cannot carry the authorisation the rules require. Nothing has changed on the ledger yet.",
    "The request is sent out to the computers that keep the ledger. Each one now holds a copy of the request, still unchecked.",
    valid
      ? "Each computer checks the request against the rules: is it authorised by the controller, and does token A still belong to Ama? Every check passes, so the request is accepted."
      : "Each computer checks the request against the rules: is it authorised by the controller of token A? It is not, so every computer rejects it.",
    valid
      ? "Because the computers agree the request is valid, it is added as a new entry and every copy of the ledger is updated to match. Token A is now controlled by Kofi."
      : "Because the request was rejected, nothing is added. Every copy of the ledger is unchanged, and token A is still controlled by Ama.",
  ];

  const watchOuts: readonly string[] = [
    "Whoever can authorise a request controls the item. That is why losing, sharing or having that authorisation stolen matters so much.",
    "Broadcasting is how the network learns of the request. It says nothing yet about whether the request is allowed.",
    "At the protocol level, validation checks the rules, not anyone's intentions. A request that follows the rules is accepted even if it was a mistake or part of a scam.",
    "On many public blockchains a recorded entry is hard to reverse, and there is often no central help desk. Other designs differ.",
  ];

  const nodes: NodeState[] =
    index === 0
      ? nodesAt("idle")
      : index === 1
        ? nodesAt("received")
        : nodesAt(valid ? "accepted" : "rejected");
  // At the final step an accepted request is recorded; a rejected one is discarded.
  const outcome: LedgerStep["outcome"] =
    index < 2 ? "pending" : valid ? (index === 3 ? "recorded" : "pending") : "rejected";

  const recorded = valid && index === 3;
  const newEntry = recorded ? "Entry 3: token A is now controlled by Kofi" : null;
  const entries = recorded ? [...START_ENTRIES, newEntry as string] : [...START_ENTRIES];

  const title = LEDGER_STEP_TITLES[index] ?? LEDGER_STEP_TITLES[0];
  const happening = happenings[index] ?? "";

  return {
    scenario,
    index,
    count: LEDGER_STEP_COUNT,
    title,
    happening,
    entries,
    newEntry,
    nodes,
    outcome,
    watchOut: watchOuts[index] ?? "",
    request,
    summary: `Step ${index + 1} of ${LEDGER_STEP_COUNT}, ${title}. ${happening}`,
  };
}
