import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/components/a11y/AppProviders";
import { MotionToggle } from "@/components/a11y/MotionToggle";
import { SkipLink } from "@/components/a11y/SkipLink";
import { IllustrativeBadge } from "@/components/design/IllustrativeBadge";
import { ClearDataButton } from "@/components/layout/ClearDataButton";
import { shouldFocusMain } from "@/components/layout/SiteChrome";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ILLUSTRATIVE_LABEL } from "@/lib/constants";
import { MOTION_STORAGE_KEY, clearAllLocalData, readStoredMotion } from "@/lib/preferences";
import { mockMatchMedia } from "./helpers";

vi.mock("next/navigation", () => ({ usePathname: () => "/about" }));

describe("IllustrativeBadge", () => {
  it("shows the exact required label as a note", () => {
    expect(ILLUSTRATIVE_LABEL).toBe("Illustrative only — not live data");
    render(<IllustrativeBadge />);
    expect(screen.getByRole("note")).toHaveTextContent(ILLUSTRATIVE_LABEL);
  });
});

describe("route focus", () => {
  it("moves focus on a page change, and not between slides or onto a fragment", () => {
    expect(shouldFocusMain("/explore", "/labs", false)).toBe(true);
    expect(shouldFocusMain("/explore/forex", "/present", false)).toBe(true);
    expect(shouldFocusMain("/present", "/explore", false)).toBe(true);
    expect(shouldFocusMain("/present", "/present/02-tonights-promise", false)).toBe(false);
    expect(shouldFocusMain("/present/02-tonights-promise", "/present", false)).toBe(false);
    expect(shouldFocusMain("/explore", "/glossary", true)).toBe(false);
    expect(shouldFocusMain("/present", "/present/handout", false)).toBe(true);
  });
});

describe("SkipLink", () => {
  it("targets the main landmark", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: /skip to main content/i })).toHaveAttribute(
      "href",
      "#main",
    );
  });
});

describe("MotionToggle and AppProviders", () => {
  it("toggles, persists the choice and updates the document", async () => {
    const user = userEvent.setup();
    render(
      <AppProviders>
        <MotionToggle />
      </AppProviders>,
    );

    const button = screen.getByRole("button", { name: "Reduce motion" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement.dataset.motion).toBe("full");

    await user.click(button);
    expect(screen.getByRole("button", { name: "Reduce motion" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(readStoredMotion()).toBe("reduced");
    expect(document.documentElement.dataset.motion).toBe("reduced");

    await user.click(screen.getByRole("button", { name: "Reduce motion" }));
    expect(readStoredMotion()).toBe("full");
    expect(document.documentElement.dataset.motion).toBe("full");
  });

  it("starts reduced when the operating system asks for it", () => {
    mockMatchMedia(true);
    render(
      <AppProviders>
        <MotionToggle />
      </AppProviders>,
    );
    expect(screen.getByRole("button", { name: "Reduce motion" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(document.documentElement.dataset.motion).toBe("reduced");
  });

  it("lets a saved explicit choice override the operating system", () => {
    mockMatchMedia(true);
    window.localStorage.setItem(MOTION_STORAGE_KEY, "full");
    render(
      <AppProviders>
        <MotionToggle />
      </AppProviders>,
    );
    expect(screen.getByRole("button", { name: "Reduce motion" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

describe("SiteHeader", () => {
  it("marks the current page and opens and closes the mobile menu with Escape", async () => {
    const user = userEvent.setup();
    render(
      <AppProviders>
        <SiteHeader />
      </AppProviders>,
    );

    const current = screen.getAllByRole("link", { name: "About" });
    expect(current.length).toBeGreaterThan(0);
    for (const link of current) expect(link).toHaveAttribute("aria-current", "page");

    const summary = screen.getByText("Menu").closest("summary");
    expect(summary).not.toBeNull();
    const details = summary?.closest("details") as HTMLDetailsElement;
    expect(details.open).toBe(false);

    await user.click(summary as HTMLElement);
    expect(details.open).toBe(true);

    await user.keyboard("{Escape}");
    expect(details.open).toBe(false);
  });
});

describe("local data controls", () => {
  it("clears only this site's keys and reports what it did", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(MOTION_STORAGE_KEY, "reduced");
    window.localStorage.setItem("unrelated-site:key", "keep");

    render(<ClearDataButton />);
    await user.click(screen.getByRole("button", { name: /clear saved preferences/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Cleared 1 saved setting");
    expect(window.localStorage.getItem(MOTION_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem("unrelated-site:key")).toBe("keep");
    expect(clearAllLocalData()).toBe(0);
  });

  it("says so when nothing was saved", async () => {
    const user = userEvent.setup();
    render(<ClearDataButton />);
    await user.click(screen.getByRole("button", { name: /clear saved preferences/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Nothing was saved");
  });
});
