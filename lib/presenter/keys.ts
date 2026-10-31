/**
 * Decides what a key press means for the deck. Pure and DOM-free so the rules can be unit-tested:
 * the deck must never steal keys from typing, sliders, radio groups, scrollable notes or the
 * activation of a focused button or link. Single-letter shortcuts can be switched off (WCAG 2.1.4).
 */
export type DeckAction =
  | "next"
  | "previous"
  | "first"
  | "last"
  | "fullscreen"
  | "notes"
  | "timer"
  | "chapters"
  | "help"
  | "escape";

export type KeyTarget = {
  tag: string;
  role: string | null;
  /** True for text inputs, textareas, selects and contenteditable regions. */
  editable: boolean;
  inputType?: string | null;
  /** True when focus is inside a scrollable panel (the speaker notes) that needs the paging keys. */
  inScrollRegion?: boolean;
};

export type KeyInput = {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  target: KeyTarget;
  /** Single-letter shortcuts (F, N, T, C, ?). On by default; the presenter can turn them off. */
  letterShortcuts?: boolean;
};

const OWN_ARROW_ROLES = new Set([
  "slider",
  "radio",
  "radiogroup",
  "spinbutton",
  "textbox",
  "combobox",
  "listbox",
  "menuitem",
  "tab",
]);
const ACTIVATABLE_TAGS = new Set(["BUTTON", "A", "SUMMARY"]);
const ACTIVATABLE_ROLES = new Set(["button", "link", "menuitem", "tab", "checkbox", "switch"]);
const PAGING_KEYS = new Set(["PageUp", "PageDown", "Home", "End", " ", "Spacebar"]);

/** Keys that may auto-repeat while held. Everything else acts once per press. */
export const REPEATABLE_KEYS: ReadonlySet<string> = new Set([
  "ArrowRight",
  "ArrowLeft",
  "PageDown",
  "PageUp",
]);

export function deckKeyAction(input: KeyInput): DeckAction | null {
  const { key, ctrlKey, metaKey, altKey, target, letterShortcuts = true } = input;
  if (ctrlKey || metaKey || altKey) return null;

  const tag = target.tag.toUpperCase();
  if (target.editable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return null;
  if (target.role && OWN_ARROW_ROLES.has(target.role)) return null;
  // Inside the scrollable notes, paging keys belong to scrolling, not to changing slide.
  if (target.inScrollRegion && PAGING_KEYS.has(key)) return null;

  const activatable =
    ACTIVATABLE_TAGS.has(tag) || (target.role !== null && ACTIVATABLE_ROLES.has(target.role));

  switch (key) {
    case "ArrowRight":
    case "PageDown":
      return "next";
    case "ArrowLeft":
    case "PageUp":
      return "previous";
    case " ":
    case "Spacebar":
      // Space activates a focused button or link; only advance when nothing activatable has focus.
      return activatable ? null : "next";
    case "Home":
      return "first";
    case "End":
      return "last";
    case "Escape":
      return "escape";
    case "f":
    case "F":
      return letterShortcuts ? "fullscreen" : null;
    case "n":
    case "N":
      return letterShortcuts ? "notes" : null;
    case "t":
    case "T":
      return letterShortcuts ? "timer" : null;
    case "c":
    case "C":
      return letterShortcuts ? "chapters" : null;
    case "?":
      return letterShortcuts ? "help" : null;
    default:
      return null;
  }
}

/** Builds a KeyTarget from a DOM element (kept here so the hook stays thin). */
export function keyTargetFrom(el: EventTarget | null): KeyTarget {
  if (!(el instanceof HTMLElement)) return { tag: "BODY", role: null, editable: false };
  return {
    tag: el.tagName,
    role: el.getAttribute("role"),
    editable: el.isContentEditable,
    inputType: el instanceof HTMLInputElement ? el.type : null,
    inScrollRegion: el.closest("[data-scroll-region]") !== null,
  };
}
