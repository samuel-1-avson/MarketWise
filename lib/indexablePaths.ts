import { labs } from "@/content/labs";
import { TOPIC_IDS } from "@/lib/schemas";
import { primaryNav } from "@/lib/routes";

/**
 * Pages a search engine may list. Slide deep links are omitted: each slide sets `noindex`
 * because the deck is a presenter surface, while the handout is the readable public copy.
 */
export function indexablePaths(): string[] {
  return [
    "/",
    ...primaryNav.map((item) => item.href),
    ...TOPIC_IDS.map((id) => `/explore/${id}`),
    ...labs.map((lab) => `/labs/${lab.id}`),
    "/present",
    "/present/handout",
  ];
}
