import { Container } from "@/components/design/Container";
import { PageHeader } from "@/components/design/PageHeader";
import { GlossaryBrowser } from "@/components/glossary/GlossaryBrowser";
import { glossary } from "@/content/glossary";
import { sources } from "@/content/sources";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta(
  "/glossary",
  "Glossary",
  "Plain-language definitions of the market, risk and mechanism terms used across the five lessons.",
);

export default function GlossaryPage() {
  const sourceTitles = Object.fromEntries(sources.map((s) => [s.id, { title: s.title }]));
  return (
    <>
      <PageHeader kicker="Glossary" title="The words, in plain language">
        <p>
          {glossary.length} terms used across the lessons. Where a definition rests on a source, it
          is linked to the resource list; the rest are neutral general definitions.
        </p>
      </PageHeader>
      <Container className="py-12">
        <GlossaryBrowser terms={glossary} sources={sourceTitles} />
      </Container>
    </>
  );
}
