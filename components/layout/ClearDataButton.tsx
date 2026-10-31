"use client";

import { useState } from "react";
import { clearAllLocalData } from "@/lib/preferences";

export function ClearDataButton() {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const removed = clearAllLocalData();
          setMessage(
            removed > 0
              ? `Cleared ${removed} saved ${removed === 1 ? "setting" : "settings"} from this browser.`
              : "Nothing was saved in this browser.",
          );
        }}
        className="inline-flex min-h-11 items-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 text-sm font-semibold text-[var(--text-main)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--btn-primary)] hover:bg-[var(--bg-surface-elevated)]"
      >
        Clear saved preferences
      </button>
      <p role="status" className="mt-2 min-h-6 text-sm text-muted">
        {message}
      </p>
    </div>
  );
}
