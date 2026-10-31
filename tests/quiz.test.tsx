import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { QuizSet } from "@/components/quiz/QuizSet";
import { PROGRESS_KEY, parseProgress, serializeProgress } from "@/lib/progress";
import { quiz } from "./fixtures";

const questions = [
  quiz({ id: "q-one", prompt: "First question?", correctOptionId: "b", sourceIds: ["src-a"] }),
  quiz({ id: "q-two", prompt: "Second question?", correctOptionId: "c", sourceIds: [] }),
];
const titles = { "src-a": "Source A title" };

const renderSet = (props: Partial<React.ComponentProps<typeof QuizSet>> = {}) =>
  render(<QuizSet questions={questions} sourceTitles={titles} idPrefix="t" {...props} />);

describe("QuizSet", () => {
  it("keeps Check answer disabled until an option is chosen", async () => {
    const user = userEvent.setup();
    renderSet();
    const [firstCheck] = screen.getAllByRole("button", { name: "Check answer" });
    expect(firstCheck).toBeDisabled();
    await user.click(screen.getAllByRole("radio")[0] as HTMLElement);
    expect(firstCheck).toBeEnabled();
  });

  it("confirms a correct answer and explains it, citing the source title", async () => {
    const user = userEvent.setup();
    renderSet();
    const first = screen.getAllByRole("listitem")[0] as HTMLElement;
    await user.click(within(first).getByRole("radio", { name: /Second/ }));
    await user.click(within(first).getByRole("button", { name: "Check answer" }));

    expect(within(first).getByRole("status")).toHaveTextContent("✓ Correct.");
    expect(within(first).getByRole("status")).toHaveTextContent(
      "Because the second statement is the accurate one.",
    );
    expect(within(first).getByRole("status")).toHaveTextContent("Source A title");
    expect(screen.getByText(/1 of 1 answered correctly so far/)).toBeInTheDocument();
  });

  it("corrects a wrong answer, marks it with text (not just colour) and locks the options", async () => {
    const user = userEvent.setup();
    renderSet();
    const first = screen.getAllByRole("listitem")[0] as HTMLElement;
    await user.click(within(first).getByRole("radio", { name: /First/ }));
    await user.click(within(first).getByRole("button", { name: "Check answer" }));

    expect(within(first).getByRole("status")).toHaveTextContent(
      "✗ Not quite. The best answer is B: Second",
    );
    expect(within(first).getByText("✗ Your answer")).toBeInTheDocument();
    expect(within(first).getByText("✓ Correct answer")).toBeInTheDocument();
    for (const radio of within(first).getAllByRole("radio")) expect(radio).toBeDisabled();
  });

  it("lets the learner try a question again and reset everything", async () => {
    const user = userEvent.setup();
    renderSet();
    const first = screen.getAllByRole("listitem")[0] as HTMLElement;
    await user.click(within(first).getByRole("radio", { name: /First/ }));
    await user.click(within(first).getByRole("button", { name: "Check answer" }));
    await user.click(within(first).getByRole("button", { name: "Try again" }));
    for (const radio of within(first).getAllByRole("radio")) {
      expect(radio).toBeEnabled();
      expect(radio).not.toBeChecked();
    }

    await user.click(within(first).getByRole("radio", { name: /Second/ }));
    await user.click(within(first).getByRole("button", { name: "Check answer" }));
    await user.click(screen.getByRole("button", { name: "Reset all answers" }));
    expect(screen.getByText(/2 questions\. Choose an answer/)).toBeInTheDocument();
  });

  it("says plainly when an explanation is general reasoning rather than sourced", async () => {
    const user = userEvent.setup();
    renderSet();
    const second = screen.getAllByRole("listitem")[1] as HTMLElement;
    await user.click(within(second).getByRole("radio", { name: /Third/ }));
    await user.click(within(second).getByRole("button", { name: "Check answer" }));
    expect(within(second).getByRole("status")).toHaveTextContent("General explanation");
  });

  it("saves nothing unless the learner opts in, then records only correct answers", async () => {
    const user = userEvent.setup();
    renderSet({ showProgressControl: true });

    const first = screen.getAllByRole("listitem")[0] as HTMLElement;
    await user.click(within(first).getByRole("radio", { name: /Second/ }));
    await user.click(within(first).getByRole("button", { name: "Check answer" }));
    expect(window.localStorage.getItem(PROGRESS_KEY)).toBeNull();

    await user.click(screen.getByRole("checkbox", { name: /Remember which questions/ }));
    expect(parseProgress(window.localStorage.getItem(PROGRESS_KEY))).toEqual({
      enabled: true,
      correct: [],
    });

    const second = screen.getAllByRole("listitem")[1] as HTMLElement;
    await user.click(within(second).getByRole("radio", { name: /First/ })); // wrong
    await user.click(within(second).getByRole("button", { name: "Check answer" }));
    expect(parseProgress(window.localStorage.getItem(PROGRESS_KEY)).correct).toEqual([]);

    await user.click(within(second).getByRole("button", { name: "Try again" }));
    await user.click(within(second).getByRole("radio", { name: /Third/ })); // correct
    await user.click(within(second).getByRole("button", { name: "Check answer" }));
    expect(parseProgress(window.localStorage.getItem(PROGRESS_KEY)).correct).toEqual(["q-two"]);

    await user.click(screen.getByRole("checkbox", { name: /Remember which questions/ }));
    expect(window.localStorage.getItem(PROGRESS_KEY)).toBeNull();
  });

  it("shows a saved question as answered before", () => {
    window.localStorage.setItem(PROGRESS_KEY, serializeProgress(["q-one"]));
    renderSet();
    expect(screen.getByText(/You answered this correctly before/)).toBeInTheDocument();
  });
});

describe("progress storage helpers", () => {
  it("treats missing or malformed data as saving off", () => {
    expect(parseProgress(null)).toEqual({ enabled: false, correct: [] });
    expect(parseProgress("not json")).toEqual({ enabled: false, correct: [] });
    expect(parseProgress('{"other":1}')).toEqual({ enabled: false, correct: [] });
    expect(parseProgress('{"correct":["a",3,"b"]}')).toEqual({
      enabled: true,
      correct: ["a", "b"],
    });
  });

  it("de-duplicates and sorts when serialising", () => {
    expect(serializeProgress(["b", "a", "b"])).toBe('{"correct":["a","b"]}');
  });
});
