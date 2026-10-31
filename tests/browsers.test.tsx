import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { CompareExplorer } from "@/components/compare/CompareExplorer";
import { GlossaryBrowser } from "@/components/glossary/GlossaryBrowser";
import { MythList } from "@/components/myths/MythList";
import { comparison } from "@/content/comparison";
import { glossary } from "@/content/glossary";
import { myths } from "@/content/myths";
import { sources } from "@/content/sources";
import { TOPIC_IDS } from "@/lib/schemas";

afterEach(() => window.history.replaceState(null, "", "/"));

const sourceMap = Object.fromEntries(sources.map((s) => [s.id, { title: s.title, url: s.url }]));

describe("MythList", () => {
  it("starts with every answer hidden and reveals one on demand", async () => {
    const user = userEvent.setup();
    render(<MythList myths={myths} sources={sourceMap} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(myths.length);
    const first = items[0] as HTMLElement;
    const details = first.querySelector("details") as HTMLDetailsElement;
    expect(details.open).toBe(false);
    await user.click(within(first).getByText(/Myth:/));
    expect(details.open).toBe(true);
    expect(within(first).getByText(/Verdict:/)).toBeInTheDocument();
  });

  it("filters by topic and reveals or hides all visible answers", async () => {
    const user = userEvent.setup();
    render(<MythList myths={myths} sources={sourceMap} />);
    await user.click(screen.getByRole("button", { name: "Crypto" }));
    const crypto = myths.filter((m) => m.topic === "crypto").length;
    expect(screen.getAllByRole("listitem")).toHaveLength(crypto);
    expect(screen.getByRole("status")).toHaveTextContent(
      `Showing ${crypto} of ${myths.length} myths`,
    );

    await user.click(screen.getByRole("button", { name: "Reveal all answers" }));
    for (const el of document.querySelectorAll("details"))
      expect((el as HTMLDetailsElement).open).toBe(true);
    await user.click(screen.getByRole("button", { name: "Hide all answers" }));
    for (const el of document.querySelectorAll("details"))
      expect((el as HTMLDetailsElement).open).toBe(false);
  });

  it("opens external sources safely in a new tab", () => {
    render(<MythList myths={myths} sources={sourceMap} />);
    const links = document.querySelectorAll("a[href^='https://']");
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });
});

describe("GlossaryBrowser", () => {
  const titles = Object.fromEntries(sources.map((s) => [s.id, { title: s.title }]));

  it("lists every term and filters by search text", async () => {
    const user = userEvent.setup();
    render(<GlossaryBrowser terms={glossary} sources={titles} />);
    expect(screen.getByRole("status")).toHaveTextContent(
      `Showing ${glossary.length} of ${glossary.length} terms`,
    );

    await user.type(screen.getByLabelText("Search terms and definitions"), "custody");
    const shown = screen.getAllByRole("term").map((el) => el.textContent);
    expect(shown).toEqual(expect.arrayContaining(["Custody", "Self-custody"]));
    expect(screen.getByRole("status")).toHaveTextContent(`of ${glossary.length} terms`);
  });

  it("filters by topic and explains an empty result", async () => {
    const user = userEvent.setup();
    render(<GlossaryBrowser terms={glossary} sources={titles} />);
    await user.selectOptions(screen.getByLabelText("Topic"), "crypto");
    const cryptoTerms = glossary.filter((t) => t.topics.includes("crypto")).length;
    expect(screen.getAllByRole("term")).toHaveLength(cryptoTerms);

    await user.type(screen.getByLabelText("Search terms and definitions"), "zzzzzz");
    expect(screen.getByText(/No terms match that search/)).toBeInTheDocument();
  });

  it("sorts alphabetically and anchors every term for deep links", () => {
    render(<GlossaryBrowser terms={glossary} sources={titles} />);
    const names = screen.getAllByRole("term").map((el) => el.textContent ?? "");
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "en")));
    for (const term of glossary) expect(document.getElementById(term.id), term.id).not.toBeNull();
  });
});

describe("CompareExplorer", () => {
  it("shows all questions as table rows and an accordion with the same text", () => {
    render(<CompareExplorer dimensions={comparison} />);
    const table = screen.getByRole("table", { hidden: true });
    expect(within(table).getAllByRole("row", { hidden: true })).toHaveLength(comparison.length + 1);
    expect(document.querySelectorAll("main details, details")).toHaveLength(comparison.length);
    for (const topic of TOPIC_IDS) {
      expect(
        within(table).getAllByText(comparison[0]?.cells[topic] ?? "", {
          exact: true,
          ignore: "none",
        }).length,
      ).toBeGreaterThan(0);
    }
  });

  it("narrows the view, mirrors it in the URL and keeps at least one question", async () => {
    const user = userEvent.setup();
    render(<CompareExplorer dimensions={comparison} />);
    await user.click(screen.getByRole("button", { name: /Core uncertainty/ }));
    expect(screen.getByRole("status")).toHaveTextContent(
      `${comparison.length - 1} of ${comparison.length}`,
    );
    expect(window.location.search).toContain("dims=");
    expect(window.location.search).not.toContain("core-uncertainty");

    // Narrow to a single question, then try to remove it.
    for (const dim of comparison.slice(1)) {
      const button = screen.getByRole("button", { name: new RegExp(dim.label) });
      if (button.getAttribute("aria-pressed") === "true" && dim.id !== comparison[0]?.id)
        await user.click(button);
    }
    const lastChip = screen.getByRole("button", { name: new RegExp(comparison[0]?.label ?? "") });
    expect(screen.getByRole("status")).toHaveTextContent(`1 of ${comparison.length}`);
    await user.click(lastChip);
    expect(screen.getByRole("status")).toHaveTextContent(`1 of ${comparison.length}`);

    await user.click(screen.getByRole("button", { name: "Show all questions" }));
    expect(window.location.search).toBe("");
  });

  it("restores a shared view from the address", () => {
    window.history.replaceState(null, "", "/compare?dims=caveat,frictions,not-a-real-id");
    render(<CompareExplorer dimensions={comparison} />);
    expect(screen.getByRole("status")).toHaveTextContent(`2 of ${comparison.length}`);
  });
});
