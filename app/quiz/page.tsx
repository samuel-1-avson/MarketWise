import { Container } from "@/components/design/Container";
import { PageHeader } from "@/components/design/PageHeader";
import { QuizBrowser } from "@/components/quiz/QuizBrowser";
import { quizzes } from "@/content/quizzes";
import { sources } from "@/content/sources";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta(
  "/quiz",
  "Knowledge check",
  "A short quiz on how forex, stocks, commodities, crypto and sports betting differ. Every answer comes with a factual explanation. No prizes, no scores sent anywhere.",
);

export default function QuizPage() {
  const sourceTitles = Object.fromEntries(sources.map((s) => [s.id, s.title]));
  return (
    <>
      <PageHeader kicker="Knowledge check" title="What stuck? Test your understanding">
        <p>
          {quizzes.length} questions across all five systems. Choose an answer, check it, and read
          the explanation — whether you were right or wrong. There are no prizes, rankings or
          timers, and nothing is stored unless you choose to save progress in your own browser.
        </p>
      </PageHeader>
      <Container className="py-12">
        <QuizBrowser questions={quizzes} sourceTitles={sourceTitles} />
      </Container>
    </>
  );
}
