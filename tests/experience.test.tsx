import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { MarketConstellation } from "@/components/design/MarketConstellation";
import { SCENE_TEXT_IDS, sceneDescription } from "@/content/sceneText";
import { sceneComponents } from "@/components/presenter/scenes/registry";
import { indexablePaths } from "@/lib/indexablePaths";
import { contrastRatio } from "@/lib/contrast";
import { swipeDirection } from "@/lib/presenter/swipe";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { palette } from "@/lib/tokens";

const css = readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8");

describe("market constellation", () => {
  it("links each of the five systems and names the picture", () => {
    render(<MarketConstellation />);
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href")).sort()).toEqual([
      "/explore/commodities",
      "/explore/crypto",
      "/explore/forex",
      "/explore/sports-betting",
      "/explore/stocks",
    ]);
    expect(screen.getByRole("figure")).toHaveAccessibleName(/five systems/i);
  });

  it("fades in once and then stays still", () => {
    expect(css).toMatch(/\.constellation-in\s*\{[^}]*animation:\s*constellation-in/s);
    expect(css).not.toMatch(/constellation-in[^;{]*infinite/);
    expect(css).toMatch(/html\[data-page-hidden="true"\] \*/);
  });
});

describe("motion", () => {
  it("crossfades pages inside 180–450ms and does not block pointer events", () => {
    expect(css).toMatch(/::view-transition\s*\{[^}]*pointer-events:\s*none/s);
    expect(css).toMatch(/::view-transition-old\(\.page-exit\)\s*\{[^}]*220ms/s);
    expect(css).toMatch(/::view-transition-new\(\.page-enter\)\s*\{[^}]*320ms/s);
    expect(css).toMatch(/html\[data-motion="reduced"\]::view-transition-old/);
  });
});

describe("scene descriptions", () => {
  it("has one description for every scene and no empty copy", () => {
    expect([...SCENE_TEXT_IDS].sort()).toEqual(Object.keys(sceneComponents).sort());
    for (const id of Object.keys(sceneComponents)) {
      expect(sceneDescription(id).length, id).toBeGreaterThan(60);
    }
  });
});

describe("swipe", () => {
  it("treats a leftward swipe as next and a rightward swipe as previous", () => {
    expect(swipeDirection({ x: 200, y: 100 }, { x: 40, y: 110 })).toBe("next");
    expect(swipeDirection({ x: 40, y: 100 }, { x: 200, y: 90 })).toBe("previous");
  });

  it("ignores a short move and a mostly vertical move", () => {
    expect(swipeDirection({ x: 100, y: 100 }, { x: 140, y: 100 })).toBeNull();
    expect(swipeDirection({ x: 100, y: 40 }, { x: 130, y: 220 })).toBeNull();
  });
});

describe("public metadata", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;

  it("uses NEXT_PUBLIC_SITE_URL only when it is an absolute http(s) URL", () => {
    try {
      process.env.NEXT_PUBLIC_SITE_URL = "https://learn.example";
      expect(siteUrl().origin).toBe("https://learn.example");
      expect(absoluteUrl("/explore/forex")).toBe("https://learn.example/explore/forex");
      process.env.NEXT_PUBLIC_SITE_URL = "not a host";
      expect(siteUrl().origin).toBe("http://localhost:3000");
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = previous;
    }
  });

  it("lists learning pages and the handout, and not individual slides", () => {
    const paths = indexablePaths();
    expect(paths).toContain("/explore/forex");
    expect(paths).toContain("/labs/uncertainty-tiles");
    expect(paths).toContain("/present/handout");
    expect(paths.some((item) => item.startsWith("/present/") && item !== "/present/handout")).toBe(
      false,
    );
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual(paths.map((item) => absoluteUrl(item)));
    expect(robots().sitemap).toBe(absoluteUrl("/sitemap.xml"));
  });

  it("keeps share-card colours inside the checked palette", () => {
    expect(contrastRatio(palette.ink, palette.midnight)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.commodities, palette.midnight)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.muted, palette.midnight)).toBeGreaterThanOrEqual(4.5);
  });
});
