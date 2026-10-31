import type { MetadataRoute } from "next";
import { sources } from "@/content/sources";
import { indexablePaths } from "@/lib/indexablePaths";
import { absoluteUrl } from "@/lib/site";

/** Latest date a cited source was actually reviewed. Not a per-page edit stamp. */
function reviewedOn(): Date {
  const dates = sources.map((source) => source.reviewedOn).sort();
  const latest = dates[dates.length - 1] ?? "2026-10-30";
  return new Date(`${latest}T00:00:00Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = reviewedOn();
  return indexablePaths().map((path) => ({
    url: absoluteUrl(path),
    lastModified,
  }));
}
