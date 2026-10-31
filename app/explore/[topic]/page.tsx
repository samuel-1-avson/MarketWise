import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/lessons/LessonView";
import { JsonLd } from "@/components/seo/JsonLd";
import { isTopicId, lessonById } from "@/content/topics";
import { pageMeta } from "@/lib/pageMeta";
import { TOPIC_IDS } from "@/lib/schemas";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOPIC_IDS.map((topic) => ({ topic }));
}

type Props = { params: Promise<{ topic: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const lesson = isTopicId(topic) ? lessonById.get(topic) : undefined;
  if (!lesson) return {};
  return pageMeta(`/explore/${lesson.id}`, lesson.title, lesson.summary);
}

export default async function LessonPage({ params }: Props) {
  const { topic } = await params;
  const lesson = isTopicId(topic) ? lessonById.get(topic) : undefined;
  if (!lesson) notFound();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: lesson.title,
          description: lesson.summary,
          url: absoluteUrl(`/explore/${lesson.id}`),
          isAccessibleForFree: true,
          learningResourceType: "lesson",
          inLanguage: "en",
        }}
      />
      <LessonView lesson={lesson} />
    </>
  );
}
