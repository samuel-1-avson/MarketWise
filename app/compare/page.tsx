import Link from "next/link";
import { CompareExplorer } from "@/components/compare/CompareExplorer";
import { Container } from "@/components/design/Container";
import { PageHeader } from "@/components/design/PageHeader";
import { comparison } from "@/content/comparison";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta(
  "/compare",
  "Compare the five systems",
  "Forex, stocks, commodities, crypto and sports betting side by side on eight questions: what is involved, what you hold, what it is for, who takes part, where prices come from, and the main caveat.",
);

export default function ComparePage() {
  return (
    <>
      <PageHeader kicker="Compare" title="The same questions, asked of all five systems">
        <p>
          Comparison is about telling mechanisms apart, not ranking them. No column is safer, better
          or more profitable than another, and a market having a genuine economic purpose does not
          make speculating in it safe.
        </p>
      </PageHeader>
      <Container className="py-12">
        <CompareExplorer dimensions={comparison} />
        <p className="mt-10 max-w-[68ch] text-base text-muted">
          Short answers leave detail out on purpose. Each system&rsquo;s full explanation, with
          sources, is in its lesson — start from the{" "}
          <Link href="/explore" className="text-forex underline underline-offset-4">
            lesson list
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
