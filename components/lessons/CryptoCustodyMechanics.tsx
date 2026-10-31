"use client";

import { useState } from "react";
import { IllustrativeBadge } from "@/components/design/IllustrativeBadge";

export function CryptoCustodyMechanics() {
  const [tab, setTab] = useState<"custody" | "consensus">("custody");

  // Custody simulator state
  const [custodyType, setCustodyType] = useState<"self" | "exchange">("self");
  const [simulatedShock, setSimulatedShock] = useState<"normal" | "insolvency" | "keyloss">("normal");

  // Consensus sandbox state
  const [txType, setTxType] = useState<"valid" | "doublespend" | "badsig">("valid");
  const [hasBroadcast, setHasBroadcast] = useState(false);

  const handleBroadcast = () => {
    setHasBroadcast(true);
  };

  return (
    <div className="surface rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Mechanics Laboratory · Crypto
          </span>
          <h3 className="mt-1 font-display text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            Custody Architecture & Consensus Rules
          </h3>
        </div>
        <IllustrativeBadge />
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
        Crypto systems do not represent ownership of a business or guaranteed cash flows. They are{" "}
        <strong className="text-[var(--text-main)]">entries on distributed digital ledgers</strong> governed by mathematical consensus rules, creating unique custody and counterparty realities.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex border-b border-[var(--border-subtle)]" role="tablist" aria-label="Crypto exploration modes">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "custody"}
          onClick={() => {
            setTab("custody");
            setSimulatedShock("normal");
          }}
          className={`px-5 py-2.5 text-sm font-semibold transition-colors rounded-none border-b-2 -mb-px ${
            tab === "custody"
              ? "border-[var(--btn-primary)] text-[var(--text-main)] bg-[var(--bg-surface-elevated)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]"
          }`}
        >
          1. Self-Custody vs. Centralized Exchange IOU
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "consensus"}
          onClick={() => {
            setTab("consensus");
            setHasBroadcast(false);
          }}
          className={`px-5 py-2.5 text-sm font-semibold transition-colors rounded-none border-b-2 -mb-px ${
            tab === "consensus"
              ? "border-[var(--btn-primary)] text-[var(--text-main)] bg-[var(--bg-surface-elevated)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]"
          }`}
        >
          2. Consensus Validation Sandbox
        </button>
      </div>

      {tab === "custody" ? (
        <div className="mt-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Architecture Selector */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5 space-y-5">
              <h4 className="font-display text-base font-bold text-[var(--text-main)]">
                Storage Method Comparison
              </h4>

              {/* Custody Type Toggle */}
              <div>
                <span className="text-xs font-medium text-[var(--text-secondary)]">Select Custody Model</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustodyType("self");
                      setSimulatedShock("normal");
                    }}
                    className={`py-2 text-xs font-bold uppercase rounded-none border transition-colors ${
                      custodyType === "self"
                        ? "border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    Self-Custody (Private Key)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustodyType("exchange");
                      setSimulatedShock("normal");
                    }}
                    className={`py-2 text-xs font-bold uppercase rounded-none border transition-colors ${
                      custodyType === "exchange"
                        ? "border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    Custodial Exchange (IOU)
                  </button>
                </div>
              </div>

              {/* Shock Test Buttons */}
              <div>
                <span className="text-xs font-medium text-[var(--text-secondary)]">Simulate Stress Event</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSimulatedShock("normal")}
                    className={`py-2 text-xs font-semibold rounded-none border ${
                      simulatedShock === "normal"
                        ? "border-[var(--btn-primary)] bg-[var(--bg-surface)] text-[var(--text-main)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]"
                    }`}
                  >
                    Normal Operation
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulatedShock("insolvency")}
                    className={`py-2 text-xs font-semibold rounded-none border ${
                      simulatedShock === "insolvency"
                        ? "border-[var(--btn-primary)] bg-[var(--bg-surface)] text-[var(--text-main)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]"
                    }`}
                  >
                    Exchange Bank Run
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulatedShock("keyloss")}
                    className={`py-2 text-xs font-semibold rounded-none border ${
                      simulatedShock === "keyloss"
                        ? "border-[var(--btn-primary)] bg-[var(--bg-surface)] text-[var(--text-main)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]"
                    }`}
                  >
                    Private Key Loss
                  </button>
                </div>
              </div>

              {/* Architecture Attributes */}
              <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs space-y-2">
                <p className="font-bold text-[var(--text-main)]">Legal & Technical Relationship:</p>
                <div className="space-y-1 text-[0.75rem] text-[var(--text-secondary)]">
                  {custodyType === "self" ? (
                    <>
                      <p>• What you hold: <strong>Cryptographic private key</strong> signing transactions directly to the network.</p>
                      <p>• Counterparty: None. You interact with decentralized software rules.</p>
                      <p>• Recovery: If key is lost or stolen, assets are permanently gone. No password reset exists.</p>
                    </>
                  ) : (
                    <>
                      <p>• What you hold: <strong>Unsecured creditor claim (IOU)</strong> against a centralized entity.</p>
                      <p>• Counterparty: The exchange operator (often offshore with limited deposit insurance).</p>
                      <p>• Reality: You do not own ledger tokens; you own a promise by a private company to pay you.</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Shock Simulation Response */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[var(--text-secondary)]">
                  Scenario Outcome
                </span>

                <div className="mt-4 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5">
                  <h5 className="font-display text-lg font-bold text-[var(--text-main)]">
                    {simulatedShock === "normal"
                      ? custodyType === "self"
                        ? "Direct On-Chain Ownership"
                        : "Apparent Balance in User Interface"
                      : simulatedShock === "insolvency"
                        ? custodyType === "self"
                          ? "✓ Unaffected by Exchange Collapse"
                          : "⚠ Withdrawals Frozen · Capital Loss"
                        : custodyType === "self"
                          ? "⚠ Irreversible Asset Loss"
                          : "✓ Password Reset Available"}
                  </h5>

                  <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {simulatedShock === "normal"
                      ? custodyType === "self"
                        ? "Your tokens exist as unspent transaction outputs or account state on the peer-to-peer network. No middleman can freeze your funds or stop you from broadcasting a transaction."
                        : "The app displays a dollar or coin balance on your screen, but the exchange pools customer deposits in its own wallets. The exchange may rehypothecate or lend out these funds."
                      : simulatedShock === "insolvency"
                        ? custodyType === "self"
                          ? "Because your funds were never deposited with the exchange, bankruptcy proceedings do not touch your assets. Your cryptographic keys remain completely intact on the network."
                          : "When customers rush to withdraw during a liquidity crunch, the exchange freezes withdrawals. As an unsecured creditor in bankruptcy, you stand behind senior lenders and face months or years of legal recovery."
                        : custodyType === "self"
                          ? "Because decentralized protocols have no human managers, there is no customer support desk to restore lost seed phrases. Once the cryptographic key is forgotten, the ledger entries remain unmovable forever."
                          : "Because the exchange holds the keys, you can verify your identity through email and government ID to regain account access."}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-[0.75rem] text-[var(--text-secondary)]">
                The trade-off is absolute: autonomy and censorship-resistance come with complete personal responsibility; convenience introduces counterparty insolvency risk.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Consensus Validation Sandbox */
        <div className="mt-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Transaction Builder */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-5 space-y-5">
              <h4 className="font-display text-base font-bold text-[var(--text-main)]">
                Create a Candidate Transaction
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Choose a transaction type to broadcast to the network. Watch 4 independent validator nodes inspect the transaction against consensus rules.
              </p>

              <div>
                <span className="text-xs font-medium text-[var(--text-secondary)]">Transaction Validity</span>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-3 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="txtype"
                      checked={txType === "valid"}
                      onChange={() => {
                        setTxType("valid");
                        setHasBroadcast(false);
                      }}
                      className="accent-[var(--btn-primary)]"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-[var(--text-main)]">Valid Transaction</p>
                      <p className="text-[var(--text-secondary)]">Has sufficient unspent balance + valid ECDSA signature</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="txtype"
                      checked={txType === "doublespend"}
                      onChange={() => {
                        setTxType("doublespend");
                        setHasBroadcast(false);
                      }}
                      className="accent-[var(--btn-primary)]"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-[var(--text-main)]">Double-Spend Attempt</p>
                      <p className="text-[var(--text-secondary)]">Attempts to re-spend an input already confirmed in an earlier block</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="txtype"
                      checked={txType === "badsig"}
                      onChange={() => {
                        setTxType("badsig");
                        setHasBroadcast(false);
                      }}
                      className="accent-[var(--btn-primary)]"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-[var(--text-main)]">Forged Cryptographic Signature</p>
                      <p className="text-[var(--text-secondary)]">Attempts to transfer funds from an address without the corresponding private key</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBroadcast}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-none border border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-hover)] transition-colors"
              >
                Broadcast to Network Nodes ↵
              </button>
            </div>

            {/* Network Nodes Response */}
            <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[var(--text-secondary)]">
                  Independent Consensus Nodes
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  Status: {hasBroadcast ? "Evaluated" : "Idle Waiting"}
                </span>
              </div>

              {/* 4 Nodes Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((nodeId) => (
                  <div
                    key={nodeId}
                    className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[var(--text-main)]">Node #{nodeId}</span>
                      <span
                        className={`text-[0.65rem] font-mono px-1.5 py-0.5 rounded-none border ${
                          !hasBroadcast
                            ? "border-[var(--border-subtle)] text-[var(--text-secondary)]"
                            : txType === "valid"
                              ? "border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-primary-text)]"
                              : "border-[var(--border-subtle)] text-[var(--error-text, #FFB4A8)]"
                        }`}
                      >
                        {!hasBroadcast
                          ? "LISTENING"
                          : txType === "valid"
                            ? "ACCEPTED"
                            : "REJECTED"}
                      </span>
                    </div>
                    <p className="mt-2 text-[0.7rem] text-[var(--text-secondary)]">
                      {!hasBroadcast
                        ? "Awaiting gossip broadcast"
                        : txType === "valid"
                          ? "Signatures verified against public key. Added to mempool."
                          : txType === "doublespend"
                            ? "Input already spent in UTXO set. Dropped instantly."
                            : "Signature math verification failed. Dropped."}
                    </p>
                  </div>
                ))}
              </div>

              {/* Consensus Verdict */}
              {hasBroadcast ? (
                <div className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 text-xs space-y-2">
                  <p className="font-bold text-[var(--text-main)]">
                    {txType === "valid"
                      ? "✓ Unanimous Consensus Confirmation"
                      : "✕ Invalid Transaction Filtered at the P2P Layer"}
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {txType === "valid"
                      ? "All 4 independent nodes independently verified the cryptographic proofs and reached consensus to bundle the transaction into the next block without consulting any bank or central server."
                      : "Because node software enforces strict mathematical rules, invalid attempts are filtered out by peers before ever reaching a block. Fraudulent transactions cannot be forced onto nodes without rewriting historical proof-of-work/stake."}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
