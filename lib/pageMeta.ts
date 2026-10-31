import type { Metadata } from "next";

/** Title, description, canonical path and matching Open Graph fields for one page. */
export function pageMeta(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { url: path, title, description },
  };
}
