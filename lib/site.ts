/**
 * Public origin for canonical URLs, the sitemap and Open Graph.
 * Set NEXT_PUBLIC_SITE_URL to an absolute http(s) URL before publishing.
 * On Vercel, falls back to VERCEL_URL if NEXT_PUBLIC_SITE_URL is not set.
 * Until then, links use the local fallback and do not invent a production host.
 */
const LOCAL_FALLBACK = "http://localhost:3000";

export function siteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw && /^https?:\/\//i.test(raw)) {
    try {
      return new URL(raw);
    } catch {
      // Malformed value: fallback below.
    }
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel && !raw) {
    try {
      const url = vercel.startsWith("http") ? vercel : `https://${vercel}`;
      return new URL(url);
    } catch {
      // Malformed value: fallback to local.
    }
  }

  return new URL(LOCAL_FALLBACK);
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl()).href;
}
