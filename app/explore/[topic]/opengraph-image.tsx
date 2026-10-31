import { ImageResponse } from "next/og";
import { isTopicId, lessonById } from "@/content/topics";
import { SITE_NAME } from "@/lib/constants";
import { ogCard } from "@/lib/ogCard";
import { TOPIC_IDS } from "@/lib/schemas";
import { palette, topicTone } from "@/lib/tokens";

export const alt = "MARKETWISE lesson";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return TOPIC_IDS.map((topic) => ({ topic }));
}

export default async function TopicOpenGraphImage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const lesson = isTopicId(topic) ? lessonById.get(topic) : undefined;
  const accent = lesson ? topicTone[lesson.id].color : palette.forex;
  return new ImageResponse(
    ogCard({
      kicker: SITE_NAME,
      title: lesson?.title ?? "Lesson",
      detail: lesson?.summary ?? "A lesson in the market literacy studio.",
      accent,
    }),
    { ...size },
  );
}
