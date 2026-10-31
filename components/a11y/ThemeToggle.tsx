"use client";

import { useCallback, useSyncExternalStore } from "react";

const THEME_KEY = "marketwise:theme";
const THEME_EVENT = "marketwise:theme-change";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

function getSnapshot(): "dark" | "light" {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    if (typeof document !== "undefined" && document.documentElement.dataset.theme) {
      return document.documentElement.dataset.theme as "dark" | "light";
    }
  } catch {
    // Storage access restricted
  }
  return "dark";
}

function getServerSnapshot(): "dark" | "light" {
  return "dark";
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
      document.documentElement.dataset.theme = next;
      window.dispatchEvent(new Event(THEME_EVENT));
    } catch {
      // Storage unavailable
    }
  }, [theme]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={
        className ??
        "inline-flex min-h-11 items-center gap-2 rounded-none border border-border-subtle bg-surface px-3 py-1 text-sm font-medium transition-all hover:bg-surface-elevated"
      }
    >
      <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
      <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
