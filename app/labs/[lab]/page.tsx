import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/design/Container";
import { PageHeader } from "@/components/design/PageHeader";
import { SourceRefs } from "@/components/design/SourceRefs";
import { labTone } from "@/components/labs/LabGlyph";
import { labComponents } from "@/components/labs/registry";
import { labById, labs } from "@/content/labs";
import { lessonById } from "@/content/topics";
import { pageMeta } from "@/lib/pageMeta";
import { topicTone } from "@/lib/tokens";

export const dynamicParams = false;

export function generateStaticParams() {
  return labs.map((lab) => ({ lab: lab.id }));
}

type Props = { params: Promise<{ lab: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lab: id } = await params;
  const lab = labById.get(id);
  if (!lab) return {};
  return pageMeta(`/labs/${lab.id}`, lab.title, `${lab.concept} ${lab.limits}`);
}

export default async function LabPage({ params }: Props) {
  const { lab: id } = await params;
  const lab = labById.get(id);
  const Lab = labComponents[id];
  if (!lab || !Lab) notFound();

  const index = labs.findIndex((l) => l.id === lab.id);
  const prev = index > 0 ? labs[index - 1] : undefined;
  const next = index < labs.length - 1 ? labs[index + 1] : undefined;

  return (
    <>
      <PageHeader kicker="Concept lab" title={lab.title} accentClass={labTone(lab).text}>
        <p>{lab.concept}</p>
        <p className="mt-2 text-base">{lab.summary}</p>
      </PageHeader>

      <Container className="py-10">
        <Lab />

        <section aria-labelledby="lab-sources-title" className="mt-12">
          <h2 id="lab-sources-title" className="text-2xl font-bold">
            Sources and status
          </h2>
          <p className="mt-2 max-w-[72ch] text-base text-muted">
            Every value and story in this lab is invented. Where the lab mentions real-world risks
            or definitions, they come from the sources below; how the model itself works is general
            explanation that still needs editorial verification before any public release. Sources
            are from the United States, Australia or England and are not statements about Ghana.
          </p>
          {lab.sourceIds.length > 0 ? (
            <SourceRefs ids={lab.sourceIds} className="mt-3" />
          ) : (
            <p className="mt-3 text-sm text-muted">
              No external source is cited for this lab: it is a general teaching model.
            </p>
          )}
        </section>

        <section aria-labelledby="related-title" className="mt-12">
          <h2 id="related-title" className="text-2xl font-bold">
            Where this fits
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {lab.topics.map((t) => {
              const lesson = lessonById.get(t);
              if (!lesson) return null;
              return (
                <li key={t}>
                  <Link
                    href={`/explore/${t}`}
                    className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium text-ink hover:bg-raised ${topicTone[t].border}`}
                  >
                    Lesson: {lesson.title}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/labs"
                className="inline-flex min-h-11 items-center rounded-full border border-edge px-4 text-sm font-medium text-ink hover:bg-raised"
              >
                All labs
              </Link>
            </li>
          </ul>
        </section>

        <nav
          aria-label="More labs"
          className="mt-8 flex flex-wrap items-stretch justify-between gap-4"
        >
          {prev ? (
            <Link
              href={`/labs/${prev.id}`}
              className="surface block min-w-[12rem] flex-1 p-4 hover:border-muted"
            >
              <span className="text-sm text-muted">← Previous lab</span>
              <span className="mt-1 block font-semibold text-ink">{prev.title}</span>
            </Link>
          ) : (
            <span className="hidden flex-1 sm:block" />
          )}
          {next ? (
            <Link
              href={`/labs/${next.id}`}
              className="surface block min-w-[12rem] flex-1 p-4 text-right hover:border-muted"
            >
              <span className="text-sm text-muted">Next lab →</span>
              <span className="mt-1 block font-semibold text-ink">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </Container>
    </>
  );
}
