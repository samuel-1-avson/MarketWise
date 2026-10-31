import { Container } from "@/components/design/Container";
import { PageHeader } from "@/components/design/PageHeader";
import { MythList } from "@/components/myths/MythList";
import { myths } from "@/content/myths";
import { sources } from "@/content/sources";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta(
  "/myths",
  "Myths vs facts",
  "Common claims about forex, stocks, commodities, crypto and sports betting — each tested against what the sources actually say.",
);

export default function MythsPage() {
  const sourceMap = Object.fromEntries(sources.map((s) => [s.id, { title: s.title, url: s.url }]));
  return (
    <>
      <PageHeader kicker="Myths vs facts" title="Claims worth checking before you believe them">
        <p>
          Tap a claim to see the correction, the reasoning and where it comes from. Nothing here
          tells you what to do with money; it shows why some popular claims do not hold up.
        </p>
      </PageHeader>
      <Container className="py-12">
        <MythList myths={myths} sources={sourceMap} />
      </Container>
    </>
  );
}
