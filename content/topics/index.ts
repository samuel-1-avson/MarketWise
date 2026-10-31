import type { Lesson, TopicId } from "@/lib/schemas";
import { TOPIC_IDS } from "@/lib/schemas";
import { commodities } from "./commodities";
import { crypto } from "./crypto";
import { forex } from "./forex";
import { sportsBetting } from "./sports-betting";
import { stocks } from "./stocks";

/** Lessons in the order they appear across the site. */
export const lessons: readonly Lesson[] = [forex, stocks, commodities, crypto, sportsBetting];

export const lessonById: ReadonlyMap<TopicId, Lesson> = new Map(
  lessons.map((l) => [l.id, l] as const),
);

export function isTopicId(value: string): value is TopicId {
  return (TOPIC_IDS as readonly string[]).includes(value);
}
