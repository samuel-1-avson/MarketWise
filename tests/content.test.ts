import { describe, expect, it } from "vitest";
import { contentBundle } from "@/content";
import { comparison } from "@/content/comparison";
import { sourceById } from "@/content/sources";
import { validateContent } from "@/lib/content-validation";
import { LESSON_SECTION_KINDS, TOPIC_IDS, type TopicId } from "@/lib/schemas";

const { lessons, quizzes, myths, glossary, labs, sources } = contentBundle;

describe("content bundle", () => {
  it("passes schema and cross-reference validation", () => {
    expect(validateContent(contentBundle)).toEqual([]);
  });

  it("has exactly one lesson for each of the five topics, each with 11 ordered sections", () => {
    expect(lessons.map((l) => l.id).sort()).toEqual([...TOPIC_IDS].sort());
    for (const lesson of lessons) {
      expect(
        lesson.sections.map((s) => s.kind),
        lesson.id,
      ).toEqual([...LESSON_SECTION_KINDS]);
    }
  });

  it("gives every lesson a five-question check drawn from its own topic", () => {
    for (const lesson of lessons) {
      expect(lesson.quizIds).toHaveLength(5);
      for (const id of lesson.quizIds) {
        expect(quizzes.find((q) => q.id === id)?.topic, `${lesson.id}/${id}`).toBe(lesson.id);
      }
    }
  });

  it("has six labs, and every lesson and every lab are linked to each other", () => {
    expect(labs).toHaveLength(6);
    for (const lesson of lessons) {
      const forTopic = labs.filter((lab) => lab.topics.includes(lesson.id));
      expect(forTopic.length, lesson.id).toBeGreaterThan(0);
      if (lesson.labId)
        expect(
          forTopic.map((l) => l.id),
          lesson.id,
        ).toContain(lesson.labId);
    }
    for (const lab of labs) {
      expect(
        lessons.some((l) => lab.topics.includes(l.id)),
        lab.id,
      ).toBe(true);
    }
  });

  it("has no unfinished copy or placeholder text", () => {
    const text = JSON.stringify(contentBundle);
    expect(text).not.toMatch(/lorem ipsum|TODO|TBD|placeholder|coming soon|\bXXX\b/i);
  });
});

describe("sources", () => {
  it("only cites verified sources", () => {
    const cited = new Set<string>();
    for (const l of lessons) {
      l.sections.forEach((s) => s.sourceIds.forEach((id) => cited.add(id)));
      l.misconceptions.forEach((m) => m.sourceIds.forEach((id) => cited.add(id)));
      l.readingSourceIds.forEach((id) => cited.add(id));
    }
    for (const q of quizzes) q.sourceIds.forEach((id) => cited.add(id));
    for (const lab of labs) lab.sourceIds.forEach((id) => cited.add(id));
    for (const m of myths) m.sourceIds.forEach((id) => cited.add(id));
    for (const g of glossary) g.sourceIds.forEach((id) => cited.add(id));
    for (const id of cited) expect(sourceById.get(id)?.status, id).toBe("verified");
  });

  it("uses every registered source somewhere", () => {
    const text = JSON.stringify({ lessons, quizzes, myths, glossary });
    for (const s of sources) expect(text, s.id).toContain(`"${s.id}"`);
  });
});

describe("quizzes", () => {
  it("has five per topic plus cross-system questions, all with explanations", () => {
    for (const topic of TOPIC_IDS) {
      expect(
        quizzes.filter((q) => q.topic === topic),
        topic,
      ).toHaveLength(5);
    }
    expect(quizzes.filter((q) => q.topic === "cross-system").length).toBeGreaterThanOrEqual(5);
    for (const q of quizzes) expect(q.explanation.length, q.id).toBeGreaterThan(60);
  });

  it("does not always put the correct answer in the same position", () => {
    const positions = new Set(quizzes.map((q) => q.correctOptionId));
    expect(positions.size).toBeGreaterThanOrEqual(3);
  });
});

describe("comparison", () => {
  it("answers every dimension for all five systems", () => {
    expect(comparison.length).toBeGreaterThanOrEqual(6);
    for (const dim of comparison) {
      for (const topic of TOPIC_IDS)
        expect(dim.cells[topic as TopicId], `${dim.id}/${topic}`).toBeTruthy();
    }
  });

  it("never ranks systems or promises returns", () => {
    const text = JSON.stringify(comparison);
    expect(text).not.toMatch(
      /best returns|highest returns|safest|guaranteed (profit|return)|easy money/i,
    );
  });
});

describe("safety guardrails", () => {
  const sportsText = JSON.stringify({
    lesson: lessons.find((l) => l.id === "sports-betting"),
    quizzes: quizzes.filter((q) => q.topic === "sports-betting"),
    myths: myths.filter((m) => m.topic === "sports-betting"),
    labs: labs.filter((l) => l.topics.includes("sports-betting")),
    comparison: comparison.map((d) => d.cells["sports-betting"]),
  });

  const sentences = sportsText.split(/(?<=[.!?])\s+/);

  it("contains no gambling-industry terms, operator names or promotions in sports-betting content", () => {
    expect(sportsText).not.toMatch(
      /sportsbook|bookmaker|bookie|parlay|accumulator|free bet|welcome bonus|sign-?up bonus|promo(tion)? code/i,
    );
  });

  it("mentions placing or choosing wagers only to say the site will not help with it", () => {
    for (const sentence of sentences.filter((s) =>
      /how to (place|bet|wager)|place (a|your) (bet|wager)|choose outcomes|pick(s)? (a |the )?(winner|team)/i.test(
        s,
      ),
    )) {
      expect(sentence, sentence).toMatch(/\b(not|no|never|without|nor)\b/i);
    }
  });

  it("contains no links in any lesson, quiz, myth or glossary copy", () => {
    const text = JSON.stringify({ lessons, quizzes, myths, glossary, comparison, labs });
    expect(text).not.toMatch(/https?:\/\/|www\./i);
  });

  it("mentions odds or payouts only to say the site does not provide them", () => {
    for (const sentence of sentences.filter((s) => /\bodds\b|\bpayouts?\b/i.test(s))) {
      expect(sentence, sentence).toMatch(/\b(not|no|never|without|nor)\b/i);
    }
  });

  it("never states guarantees as fact in lessons or myths outside of negation or correction", () => {
    const all = JSON.stringify({ lessons, myths });
    expect(all).not.toMatch(
      /start trading today|join now|make money fast|risk-free (way|investment)/i,
    );
  });

  it("labels fictional-number sections so the page can show the illustrative badge", () => {
    for (const lesson of lessons) {
      const numeric = lesson.sections.filter((s) =>
        /\b\d{1,3}(,\d{3})+\b|\b\d+\.\d{2}\b/.test(s.paragraphs.join(" ")),
      );
      for (const s of numeric) {
        expect(s.usesIllustrativeNumbers, `${lesson.id}/${s.kind}`).toBe(true);
      }
    }
  });
});
