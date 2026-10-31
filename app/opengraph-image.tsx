import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { ogCard } from "@/lib/ogCard";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}. Education only, not financial advice.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    ogCard({
      kicker: SITE_NAME,
      title: "Five worlds. Five mechanisms.",
      detail: SITE_DESCRIPTION,
    }),
    { ...size },
  );
}
