import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { notesStore } from "@/lib/presenter/notesStore";
import { mockMatchMedia } from "./helpers";

/** jsdom has no ResizeObserver; the presenter stage uses one to fit the slide. */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  mockMatchMedia(false);
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.sessionStorage.clear();
  notesStore.reset();
  delete document.documentElement.dataset.motion;
  window.history.replaceState(null, "", "/");
  vi.unstubAllGlobals();
});
