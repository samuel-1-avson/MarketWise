import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ReturnToDeck } from "@/components/layout/ReturnToDeck";
import { isImmersivePath } from "@/components/layout/SiteChrome";
import { Deck } from "@/components/presenter/Deck";
import { Handout } from "@/components/presenter/Handout";
import { sceneDescription } from "@/content/sceneText";
import { slides } from "@/content/slides";
import { DECK_SESSION_KEY } from "@/hooks/useDeckSession";
import { notesStore } from "@/lib/presenter/notesStore";
import { SLIDE_COUNT } from "@/lib/schemas";

let search = "";
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search),
  usePathname: () => window.location.pathname,
}));

const position = () => screen.getByTestId("deck-position").textContent ?? "";
const title = () => screen.getByRole("heading", { level: 1 }).textContent;

afterEach(() => {
  search = "";
});

describe("keyboard control", () => {
  it("moves through the slides with arrows, Space, Home and End and updates the address", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    expect(position()).toContain("Slide 1 of 24");
    expect(title()).toBe(slides[0]?.title);

    await user.keyboard("{ArrowRight}");
    expect(position()).toContain("Slide 2 of 24");
    expect(title()).toBe(slides[1]?.title);
    expect(window.location.pathname).toBe(`/present/${slides[1]?.id}`);

    await user.keyboard(" ");
    expect(position()).toContain("Slide 3 of 24");
    await user.keyboard("{ArrowLeft}");
    expect(position()).toContain("Slide 2 of 24");

    await user.keyboard("{End}");
    expect(position()).toContain(`Slide ${SLIDE_COUNT} of ${SLIDE_COUNT}`);
    await user.keyboard("{ArrowRight}"); // cannot go past the last slide
    expect(position()).toContain(`Slide ${SLIDE_COUNT} of ${SLIDE_COUNT}`);
    await user.keyboard("{Home}");
    expect(position()).toContain("Slide 1 of 24");
    await user.keyboard("{ArrowLeft}"); // cannot go before the first
    expect(position()).toContain("Slide 1 of 24");
  });

  it("announces each change for screen readers", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByTestId("deck-announcement")).toHaveTextContent(
      `Slide 2 of 24: ${slides[1]?.title}`,
    );
  });

  it("does not interfere with typing, and Space on a focused button activates it instead of advancing", async () => {
    const user = userEvent.setup();
    render(
      <>
        <label>
          Question
          <input data-testid="free-text" />
        </label>
        <Deck initialIndex={0} />
      </>,
    );
    await user.click(screen.getByTestId("free-text"));
    await user.keyboard("{ArrowRight} nf ");
    expect(position()).toContain("Slide 1 of 24");
    expect(screen.queryByTestId("notes-panel")).not.toBeInTheDocument();

    const notesButton = screen.getByRole("button", { name: /Speaker notes/ });
    notesButton.focus();
    await user.keyboard(" "); // activates the focused button
    expect(position()).toContain("Slide 1 of 24");
    expect(screen.getByTestId("notes-panel")).toBeInTheDocument();
  });

  it("ignores shortcuts combined with Ctrl or Cmd", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    await user.keyboard("{Control>}n{/Control}");
    expect(screen.queryByTestId("notes-panel")).not.toBeInTheDocument();
  });

  it("follows the browser's Back button", () => {
    render(<Deck initialIndex={0} />);
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(position()).toContain("Slide 2 of 24");
    act(() => {
      window.history.replaceState(null, "", `/present/${slides[4]?.id}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(position()).toContain("Slide 5 of 24");
  });

  it("starts from a deep-linked slide", () => {
    render(<Deck initialIndex={11} />);
    expect(position()).toContain("Slide 12 of 24");
    expect(title()).toBe(slides[11]?.title);
    expect(screen.getByRole("button", { name: "Next slide" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("keeps the document title in step with the slide, and marks the ends as unavailable without dropping focus", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    await user.keyboard("{ArrowRight}");
    expect(document.title).toBe(`Slide 2: ${slides[1]?.title} · MARKETWISE`);
    const prev = screen.getByRole("button", { name: "Previous slide" });
    await user.keyboard("{Home}");
    expect(prev).toHaveAttribute("aria-disabled", "true");
    expect(prev).not.toBeDisabled(); // stays focusable
    prev.focus();
    await user.click(prev);
    expect(position()).toContain("Slide 1 of 24");
    expect(prev).toHaveFocus();
  });

  it("links the deck's Handout button with a path back to the exact slide", () => {
    render(<Deck initialIndex={6} />);
    expect(screen.getAllByRole("link", { name: "Handout" })[0]).toHaveAttribute(
      "href",
      `/present/handout?returnTo=${encodeURIComponent(`/present/${slides[6]?.id}`)}`,
    );
  });
});

describe("speaker notes", () => {
  it("are hidden by default, with a clear status, and toggled deliberately with N", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    expect(screen.queryByTestId("notes-panel")).not.toBeInTheDocument();
    expect(screen.getByTestId("notes-status")).toHaveTextContent("Notes hidden");
    expect(document.body.textContent).not.toContain(slides[0]?.notes.teachingPoint);

    await user.keyboard("n");
    const panel = screen.getByTestId("notes-panel");
    expect(panel).toHaveTextContent(slides[0]?.notes.teachingPoint ?? "");
    expect(screen.getByTestId("notes-status")).toHaveTextContent("Notes visible on this screen");

    await user.keyboard("{ArrowRight}");
    expect(screen.getByTestId("notes-panel")).toHaveTextContent(
      slides[1]?.notes.teachingPoint ?? "",
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("notes-panel")).not.toBeInTheDocument();
    expect(screen.getByTestId("notes-status")).toHaveTextContent("Notes hidden");
  });

  it("keep their state across a client-side detour to a lab and back", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Deck initialIndex={0} />);
    await user.keyboard("n");
    unmount(); // the deck unmounts when the visitor navigates to a lab…
    render(<Deck initialIndex={4} />); // …and mounts again on return, in the same page session
    expect(screen.getByTestId("notes-panel")).toBeInTheDocument();
  });

  it("are never written to storage, so a reload or restored session starts with them hidden", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Deck initialIndex={0} />);
    await user.keyboard("n");
    expect(window.sessionStorage.getItem(DECK_SESSION_KEY) ?? "").not.toContain("notesOpen");
    expect(window.localStorage.length).toBe(0);
    unmount();

    notesStore.reset(); // what a full page reload does to in-memory state
    render(<Deck initialIndex={0} />);
    expect(screen.queryByTestId("notes-panel")).not.toBeInTheDocument();
    expect(screen.getByTestId("notes-status")).toHaveTextContent("Notes hidden");
  });

  it("do not flicker when N is held down: only the first key press counts", () => {
    render(<Deck initialIndex={0} />);
    fireEvent.keyDown(window, { key: "n" });
    expect(screen.getByTestId("notes-panel")).toBeInTheDocument();
    for (let i = 0; i < 5; i += 1) fireEvent.keyDown(window, { key: "n", repeat: true });
    expect(screen.getByTestId("notes-panel")).toBeInTheDocument();
  });

  it("let a held arrow key keep stepping through slides", () => {
    render(<Deck initialIndex={0} />);
    for (let i = 0; i < 3; i += 1) fireEvent.keyDown(window, { key: "ArrowRight", repeat: i > 0 });
    expect(position()).toContain("Slide 4 of 24");
  });

  it("return focus to the Speaker notes button when closed from inside the panel", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    await user.click(screen.getByRole("button", { name: /Speaker notes/ }));
    await user.click(screen.getByRole("button", { name: "Hide notes (N)" }));
    expect(screen.getByRole("button", { name: /Speaker notes/ })).toHaveFocus();
    expect(screen.queryByTestId("notes-panel")).not.toBeInTheDocument();
  });

  it("announce when they are shown or hidden", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    await user.keyboard("n");
    expect(screen.getByTestId("deck-announcement")).toHaveTextContent(
      "Speaker notes are now visible on this screen.",
    );
    await user.keyboard("n");
    expect(screen.getByTestId("deck-announcement")).toHaveTextContent("Speaker notes hidden.");
  });
});

describe("timer", () => {
  it("starts, pauses, resumes and resets, and shows a chip when it has run", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    expect(screen.queryByTestId("timer-panel")).not.toBeInTheDocument();
    expect(screen.queryByTestId("timer-chip")).not.toBeInTheDocument();

    await user.keyboard("t");
    expect(screen.getByTestId("timer-panel")).toBeInTheDocument();
    expect(screen.getByTestId("timer-clock")).toHaveTextContent("00:00");

    await user.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(screen.getByTestId("timer-chip")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Resume" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    expect(screen.queryByTestId("timer-chip")).not.toBeInTheDocument();
  });

  it("keeps counting across a detour: elapsed time is derived from stored timestamps", () => {
    const longAgo = Date.now() - 125_000;
    window.sessionStorage.setItem(
      DECK_SESSION_KEY,
      JSON.stringify({ timer: { accumulatedMs: 0, startedAt: longAgo }, timerOpen: true }),
    );
    render(<Deck initialIndex={4} />);
    expect(screen.getByTestId("timer-clock").textContent).toMatch(/^02:0\d$/);
  });
});

describe("panels", () => {
  it("opens the shortcut help with ? and the chapter navigator with C, and jumps to a slide", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);

    await user.keyboard("?");
    const help = document.querySelector("dialog[open]") as HTMLElement;
    expect(within(help).getByRole("heading", { name: "Keyboard shortcuts" })).toBeInTheDocument();
    expect(within(help).getByText("Fullscreen on or off")).toBeInTheDocument();
    await user.click(within(help).getByRole("button", { name: "Close" }));
    expect(document.querySelector("dialog[open]")).toBeNull();

    await user.keyboard("c");
    const chapters = document.querySelector("dialog[open]") as HTMLElement;
    expect(within(chapters).getByRole("heading", { name: "Chapters" })).toBeInTheDocument();
    expect(within(chapters).getAllByRole("button", { name: /^\d+\./ })).toHaveLength(SLIDE_COUNT);
    await user.click(within(chapters).getByRole("button", { name: /Crypto: More Than a Chart/ }));
    expect(position()).toContain("Slide 14 of 24");
    expect(document.querySelector("dialog[open]")).toBeNull();
  });

  it("lets the presenter switch the single-letter shortcuts off, keeping arrows and buttons", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    await user.keyboard("?");
    const help = document.querySelector("dialog[open]") as HTMLElement;
    const toggle = within(help).getByRole("checkbox", { name: /Single-letter shortcuts/ });
    expect(toggle).toBeChecked();
    await user.click(toggle);
    expect(
      JSON.parse(window.sessionStorage.getItem(DECK_SESSION_KEY) ?? "{}").letterShortcuts,
    ).toBe(false);
    await user.click(within(help).getByRole("button", { name: "Close" }));

    await user.keyboard("n");
    expect(screen.queryByTestId("notes-panel")).not.toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(position()).toContain("Slide 2 of 24");
    await user.click(screen.getByRole("button", { name: /Speaker notes/ })); // the button still works
    expect(screen.getByTestId("notes-panel")).toBeInTheDocument();
  });

  it("offers the reduced-motion switch inside the deck, where the site header is absent", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    await user.keyboard("?");
    const help = document.querySelector("dialog[open]") as HTMLElement;
    expect(within(help).getByRole("button", { name: "Reduce motion" })).toBeInTheDocument();
  });

  it("keeps the deck keys quiet while a dialog is open", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    await user.keyboard("?");
    await user.keyboard("{ArrowRight}");
    expect(position()).toContain("Slide 1 of 24");
  });

  it("requests fullscreen with F when the browser supports it, and is disabled when it does not", async () => {
    const request = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, value: true });
    HTMLElement.prototype.requestFullscreen = request;
    const user = userEvent.setup();
    const { unmount } = render(<Deck initialIndex={0} />);
    expect(screen.getByRole("button", { name: /Fullscreen/ })).toBeEnabled();
    await user.keyboard("f");
    expect(request).toHaveBeenCalledTimes(1);
    unmount();

    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, value: false });
    render(<Deck initialIndex={0} />);
    expect(screen.getByRole("button", { name: /Fullscreen/ })).toBeDisabled();
    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, value: undefined });
  });
});

describe("lab detours", () => {
  it("links slides with a lab to it, carrying the return path", () => {
    const labSlide = slides.findIndex((s) => s.labId === "fx-quote");
    render(<Deck initialIndex={labSlide} />);
    const link = screen.getByTestId("deck-detour");
    expect(link).toHaveAttribute(
      "href",
      `/labs/fx-quote?returnTo=${encodeURIComponent(`/present/${slides[labSlide]?.id}`)}`,
    );
    expect(link).toHaveTextContent("Open the interactive lab");
  });

  it("says plainly when a slide has no detour", () => {
    const none = slides.findIndex((s) => !s.labId && !s.relatedRoute);
    render(<Deck initialIndex={none} />);
    expect(screen.queryByTestId("deck-detour")).not.toBeInTheDocument();
    expect(screen.getByText("No interactive detour for this slide")).toBeInTheDocument();
  });
});

describe("text version and notes width", () => {
  it("keeps the picture description closed until requested, then shows the content copy", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    expect(screen.queryByTestId("scene-text")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Text version" }));
    expect(screen.getByTestId("scene-text")).toHaveTextContent(
      sceneDescription(slides[0]?.visual ?? ""),
    );
    const panel = screen.getByTestId("scene-text");
    expect(screen.getByRole("button", { name: "Text version" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(panel).toHaveAttribute("tabindex", "0");
    expect(panel).toHaveAttribute("data-scroll-region");
    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("scene-text")).not.toBeInTheDocument();
  });

  it("uses a narrow notes column so the stage keeps more of the window", async () => {
    const user = userEvent.setup();
    render(<Deck initialIndex={0} />);
    await user.click(screen.getByRole("button", { name: /Speaker notes/ }));
    expect(screen.getByTestId("notes-panel").className).toContain("lg:w-[22rem]");
  });
});

describe("return banner", () => {
  it("shows a link back to the exact slide for a valid returnTo", () => {
    search = `returnTo=${encodeURIComponent(`/present/${slides[4]?.id}`)}`;
    render(<ReturnToDeck />);
    const link = screen.getByTestId("return-to-deck");
    expect(link).toHaveAttribute("href", `/present/${slides[4]?.id}`);
    expect(link).toHaveTextContent(`Back to slide 5: ${slides[4]?.title}`);
  });

  it.each([
    "https://evil.example/present/x",
    "//evil.example",
    "/present/not-a-slide",
    "/labs/fx-quote",
    "",
  ])("shows nothing for the unsafe or unknown value %j", (value) => {
    search = `returnTo=${encodeURIComponent(value)}`;
    render(<ReturnToDeck />);
    expect(screen.queryByTestId("return-to-deck")).not.toBeInTheDocument();
  });

  it("shows nothing without a returnTo", () => {
    render(<ReturnToDeck />);
    expect(screen.queryByTestId("return-to-deck")).not.toBeInTheDocument();
  });
});

describe("site chrome", () => {
  it("is hidden only on the live deck, never on the handout or other pages", () => {
    expect(isImmersivePath("/present")).toBe(true);
    expect(isImmersivePath("/present/05-forex-in-60-seconds")).toBe(true);
    expect(isImmersivePath("/present/handout")).toBe(false);
    expect(isImmersivePath("/presentation")).toBe(false);
    expect(isImmersivePath("/labs/fx-quote")).toBe(false);
    expect(isImmersivePath("/")).toBe(false);
  });
});

describe("handout", () => {
  it("is audience-safe by default: no notes, no presenter cues, until the presenter ticks the box", async () => {
    const user = userEvent.setup();
    const { container } = render(<Handout />);
    expect(screen.getByRole("checkbox", { name: "Include speaker notes" })).not.toBeChecked();
    expect(container.textContent).toContain(slides[2]?.keyMessage);
    expect(container.textContent).not.toContain(slides[2]?.notes.analogy);
    expect(container.textContent).not.toContain(slides[2]?.speakerCue);
    expect(container.textContent).not.toContain(slides[2]?.interactiveCue);
    expect(container.textContent).toContain("Audience-safe copy");

    await user.click(screen.getByRole("checkbox", { name: "Include speaker notes" }));
    expect(container.textContent).toContain(slides[2]?.notes.analogy);
    expect(container.textContent).toContain(slides[2]?.speakerCue);
    expect(container.textContent).toContain(slides[2]?.interactiveCue);
    expect(container.textContent).toContain("Do not share it with the audience");
    expect(container.textContent).toContain("Source status:");

    await user.click(screen.getByRole("checkbox", { name: "Include speaker notes" }));
    expect(container.textContent).not.toContain(slides[2]?.notes.analogy);
  });
});
