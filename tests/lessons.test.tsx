import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopicIllustration } from "@/components/diagrams/TopicIllustration";
import { LessonView } from "@/components/lessons/LessonView";
import { diagrams } from "@/content/diagrams";
import { lessons } from "@/content/topics";
import { ILLUSTRATIVE_LABEL } from "@/lib/constants";
import { LESSON_SECTION_KINDS, TOPIC_IDS } from "@/lib/schemas";

describe("diagrams", () => {
  it("has one mechanism per topic, with exactly one arrow label between each pair of steps", () => {
    expect(Object.keys(diagrams).sort()).toEqual([...TOPIC_IDS].sort());
    for (const id of TOPIC_IDS) {
      const d = diagrams[id];
      expect(d.nodes.length, id).toBeGreaterThanOrEqual(4);
      expect(d.links, id).toHaveLength(d.nodes.length - 1);
      for (const node of d.nodes) {
        expect(node.label.length, `${id}/${node.label}`).toBeLessThanOrEqual(24);
        for (const line of node.lines) expect(line.length, `${id}/${line}`).toBeLessThanOrEqual(38);
      }
    }
  });

  it("exposes a title, description and numbered text version for assistive technology", () => {
    render(<TopicIllustration topic="forex" diagram={diagrams.forex} />);
    const svg = screen.getByRole("img");
    expect(svg).toHaveAccessibleName(diagrams.forex.title);
    expect(svg).toHaveAccessibleDescription(diagrams.forex.summary);
    expect(screen.getByText("Text version of this diagram")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(diagrams.forex.nodes.length);
  });

  it("draws a different picture for each topic, with labels at least 28 units", () => {
    const pictures: string[] = [];
    for (const id of TOPIC_IDS) {
      const { container, unmount } = render(
        <TopicIllustration topic={id} diagram={diagrams[id]} />,
      );
      expect(
        container.querySelector("[data-illustration]")?.getAttribute("data-illustration"),
      ).toBe(id);
      const svg = container.querySelector("svg[role='img']");
      const text = svg?.textContent ?? "";
      expect(text.length, id).toBeGreaterThan(10);
      pictures.push(text);
      for (const el of svg?.querySelectorAll("text") ?? []) {
        expect(Number(el.getAttribute("font-size")), `${id} label`).toBeGreaterThanOrEqual(28);
      }
      if (id === "sports-betting") {
        expect(text).not.toMatch(/odds|payout|stake|bookmaker|sportsbook|wager slip/i);
        expect(text).toMatch(/Nothing is owned/);
      }
      unmount();
    }
    expect(new Set(pictures).size).toBe(TOPIC_IDS.length);
  });

  it("shows the illustrative label exactly when the diagram quotes fictional numbers", () => {
    for (const id of TOPIC_IDS) {
      const { unmount } = render(<TopicIllustration topic={id} diagram={diagrams[id]} />);
      const hasLabel = screen.queryByText(ILLUSTRATIVE_LABEL) !== null;
      expect(hasLabel, id).toBe(diagrams[id].usesIllustrativeNumbers);
      unmount();
    }
  });
});

describe("LessonView", () => {
  it.each(lessons.map((l) => [l.id, l] as const))(
    "renders all eleven sections for %s",
    (_id, lesson) => {
      render(<LessonView lesson={lesson} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(lesson.title);

      for (const kind of LESSON_SECTION_KINDS) {
        const region = document.getElementById(kind);
        expect(region, kind).not.toBeNull();
        expect(
          within(region as HTMLElement).getByRole("heading", { level: 2 }),
        ).toBeInTheDocument();
      }
      expect(document.querySelectorAll("main section, section[id]").length).toBeGreaterThanOrEqual(
        LESSON_SECTION_KINDS.length,
      );

      // The knowledge check is present with five questions, and the review note is visible.
      const check = document.getElementById("check") as HTMLElement;
      expect(check.querySelectorAll("fieldset")).toHaveLength(5);
      expect(screen.getByText(lesson.reviewNote)).toBeInTheDocument();
    },
  );

  it("shows the illustrative badge wherever a section quotes fictional numbers", () => {
    const forex = lessons.find((l) => l.id === "forex");
    if (!forex) throw new Error("forex lesson missing");
    render(<LessonView lesson={forex} />);
    const flagged = forex.sections.filter((s) => s.usesIllustrativeNumbers);
    expect(flagged.length).toBeGreaterThan(0);
    for (const s of flagged) {
      expect(
        within(document.getElementById(s.kind) as HTMLElement).getAllByText(ILLUSTRATIVE_LABEL)
          .length,
      ).toBeGreaterThan(0);
    }
  });

  it("links every glossary term and source it cites", () => {
    const stocks = lessons.find((l) => l.id === "stocks");
    if (!stocks) throw new Error("stocks lesson missing");
    render(<LessonView lesson={stocks} />);
    const hrefs = [...document.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    for (const id of stocks.glossaryTermIds) expect(hrefs).toContain(`/glossary#${id}`);
    expect(hrefs).toContain("/resources#investor-gov-stocks");
  });
});
