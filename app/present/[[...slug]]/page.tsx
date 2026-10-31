import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/design/Container";
import { PageHeader } from "@/components/design/PageHeader";
import { Deck } from "@/components/presenter/Deck";
import { Handout } from "@/components/presenter/Handout";
import { slideById, slides } from "@/content/slides";
import { slideIndexById } from "@/lib/presenter/navigation";
import { pageMeta } from "@/lib/pageMeta";

export const dynamicParams = false;

/** `/present`, `/present/handout`, and one deep link per slide. */
export function generateStaticParams() {
  return [
    { slug: [] as string[] },
    { slug: ["handout"] },
    ...slides.map((s) => ({ slug: [s.id] })),
  ];
}

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const first = slug?.[0];
  if (first === "handout") {
    return pageMeta(
      "/present/handout",
      "Presenter handout",
      "Printable handout of all 24 slides, with an optional copy of the speaker notes and the sources.",
    );
  }
  const slide = first ? slideById.get(first) : slides[0];
  if (!slide) return {};
  const path = first ? `/present/${slide.id}` : "/present";
  return {
    ...pageMeta(path, `Slide ${slide.number}: ${slide.title}`, slide.keyMessage),
    robots: first ? { index: false, follow: true } : undefined,
  };
}

export default async function PresentPage({ params }: Props) {
  const { slug } = await params;
  const parts = slug ?? [];

  if (parts.length === 1 && parts[0] === "handout") {
    return (
      <>
        <PageHeader kicker="Presenter handout" title="All 24 slides on paper">
          <p>
            A readable, printable copy of the deck: each slide&rsquo;s message and cues, optional
            speaker notes, and sources. Use it as a backup if the live deck fails, or on a phone.
          </p>
        </PageHeader>
        <Container className="py-10">
          <Handout />
        </Container>
      </>
    );
  }

  if (parts.length > 1) notFound();
  const index = parts.length === 0 ? 0 : slideIndexById(parts[0]);
  if (index < 0) notFound();

  // Keyed by slide so a real navigation (for example, returning from a lab) mounts the deck afresh.
  return <Deck key={slides[index]?.id} initialIndex={index} />;
}
