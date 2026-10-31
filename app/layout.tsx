import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { AppProviders } from "@/components/a11y/AppProviders";
import { SkipLink } from "@/components/a11y/SkipLink";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#091225",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Applies a saved reduced-motion or theme choice before first paint so the page never flashes. */
const headInit = `try{var m=localStorage.getItem("marketwise:motion");if(m==="reduced"||m==="full"){document.documentElement.dataset.motion=m};var t=localStorage.getItem("marketwise:theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headInit }} />
      </head>
      <body>
        <SkipLink />
        <AppProviders>
          <SiteChrome>{children}</SiteChrome>
        </AppProviders>
      </body>
    </html>
  );
}
