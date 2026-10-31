import {
  LESSON_SECTION_KINDS,
  type GlossaryTerm,
  type Lab,
  type Lesson,
  type Myth,
  type QuizQuestion,
  type Slide,
  type Source,
} from "@/lib/schemas";

/** Small, valid, entirely fictional records used to exercise the schemas and validators. */

export const source = (overrides: Partial<Source> = {}): Source => ({
  id: "example-source",
  title: "An example educational page",
  url: "https://example.org/learn",
  publisher: "Example Institute",
  supports: "Illustrative fixture only",
  reviewedOn: null,
  status: "needs-verification",
  ...overrides,
});

export const glossaryTerm = (overrides: Partial<GlossaryTerm> = {}): GlossaryTerm => ({
  id: "term-one",
  term: "Term one",
  definition: "A plain-language definition used in tests.",
  topics: [],
  related: [],
  sourceIds: [],
  ...overrides,
});

export const quiz = (overrides: Partial<QuizQuestion> = {}): QuizQuestion => ({
  id: "quiz-one",
  topic: "forex",
  prompt: "Which statement is accurate?",
  options: [
    { id: "a", text: "First" },
    { id: "b", text: "Second" },
    { id: "c", text: "Third" },
  ],
  correctOptionId: "b",
  explanation: "Because the second statement is the accurate one.",
  sourceIds: [],
  ...overrides,
});

export const myth = (overrides: Partial<Myth> = {}): Myth => ({
  id: "myth-one",
  topic: "cross-system",
  claim: "A claim people repeat.",
  verdict: "False",
  correction: "What is actually true.",
  explanation: "Why the claim does not hold.",
  sourceIds: [],
  ...overrides,
});

export const lab = (overrides: Partial<Lab> = {}): Lab => ({
  id: "lab-one",
  title: "Lab one",
  topics: ["forex"],
  concept: "A concept.",
  summary: "What the lab shows.",
  limits: "What it deliberately does not do.",
  usesNumbers: true,
  sourceIds: [],
  ...overrides,
});

export const lesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  id: "forex",
  title: "Forex fixture",
  kicker: "Currency exchange",
  summary: "A fixture lesson.",
  snapshot: {
    changesHands: "A fixture object.",
    purpose: "A fixture purpose.",
    mainRisk: "A fixture risk.",
  },
  lastReviewed: "2026-10-30",
  reviewNote: "Fixture review note.",
  sections: LESSON_SECTION_KINDS.map((kind) => ({
    kind,
    heading: `Heading for ${kind}`,
    paragraphs: ["A paragraph of lesson text."],
    usesIllustrativeNumbers: false,
    sourceIds: [],
  })),
  actors: [
    { name: "Importer", role: "Needs foreign currency to pay a supplier." },
    { name: "Bank", role: "Quotes a rate and carries out the exchange." },
    { name: "Exporter", role: "Receives foreign currency for goods sold." },
  ],
  misconceptions: [1, 2, 3].map((n) => ({
    claim: `Claim ${n}`,
    correction: `Correction ${n}`,
    sourceIds: [],
  })),
  glossaryTermIds: ["term-one", "term-two", "term-three", "term-four", "term-five"],
  quizIds: ["q-1", "q-2", "q-3", "q-4", "q-5"],
  readingSourceIds: ["example-source"],
  ...overrides,
});

const notesBody =
  "This is deliberately long enough filler for a fixture so that the notes clear the minimum word count required of every slide. " +
  "It explains a single teaching point in plain language, offers a short analogy, corrects a common misconception, and hands over to the next slide. ".repeat(
    2,
  );

export const slide = (n: number, overrides: Partial<Slide> = {}): Slide => ({
  id: `slide-${n}`,
  number: n,
  chapter: "hook",
  title: `Slide title ${n}`,
  keyMessage: "One short on-slide message.",
  visual: `visual-${n}`,
  speakerCue: "Say this first.",
  interactiveCue: "Ask the room.",
  notes: {
    teachingPoint: notesBody,
    explanation: ["Step one of the explanation.", "Step two of the explanation."],
    analogy: "A beginner analogy.",
    misconception: "A misconception and its correction.",
    transition: "A hand-off to the next slide.",
  },
  sourceIds: [],
  ...overrides,
});

export const deck = (count = 24): Slide[] => Array.from({ length: count }, (_, i) => slide(i + 1));
