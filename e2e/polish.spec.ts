import { expect, test, type Page } from "@playwright/test";
import { sceneDescription } from "../content/sceneText";
import { slides } from "../content/slides";
import { absoluteUrl } from "../lib/site";

const WIDTHS = [360, 768, 1280, 1920] as const;
const SAMPLE = [
  "/",
  "/explore/forex",
  "/explore/sports-betting",
  "/compare",
  "/labs/fx-quote",
  "/present",
] as const;

async function overflowPx(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

test.describe("responsive widths", () => {
  test.skip(({ isMobile }) => isMobile, "these widths are set explicitly on the desktop project");

  for (const width of WIDTHS) {
    test(`no horizontal overflow at ${width}px`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width, height: width < 800 ? 800 : 1080 },
      });
      const page = await context.newPage();
      for (const route of SAMPLE) {
        await page.goto(route);
        expect(await overflowPx(page), route).toBeLessThanOrEqual(1);
      }
      await page.goto("/");
      for (const name of [
        "Forex lesson",
        "Stocks lesson",
        "Commodities lesson",
        "Crypto lesson",
        "Sports betting lesson",
      ]) {
        await expect(page.getByRole("link", { name })).toBeVisible();
      }
      await context.close();
    });
  }
});

test("the constellation finishes its entrance and then stays still", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2500);
  const running = await page.evaluate(
    () => document.getAnimations().filter((animation) => animation.playState === "running").length,
  );
  expect(running).toBe(0);
});

test("reduced motion removes the constellation entrance", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("marketwise:motion", "reduced");
  });
  await page.goto("/");
  const duration = await page
    .locator(".constellation-in")
    .first()
    .evaluate((el) => getComputedStyle(el).animationDuration);
  expect(parseFloat(duration)).toBeLessThan(0.001);
});

test("text version shows the scene description and can be closed", async ({ page, isMobile }) => {
  test.skip(isMobile, "the deck controls are covered on the large-screen project");
  await page.goto("/present");
  const first = slides[0];
  if (!first) throw new Error("missing first slide");
  await page.getByRole("button", { name: "Text version" }).click();
  await expect(page.getByTestId("scene-text")).toContainText(
    sceneDescription(first.visual).slice(0, 40),
  );
  await page.getByRole("button", { name: "Text version" }).click();
  await expect(page.getByTestId("scene-text")).toHaveCount(0);
});

test("a touch swipe moves to the next slide", async ({ page, isMobile }) => {
  test.skip(!isMobile, "swipe is a touch gesture");
  await page.goto("/present");
  const surface = page.getByTestId("swipe-surface");
  const box = await surface.boundingBox();
  if (!box) throw new Error("stage missing");
  const y = box.y + box.height / 2;
  const startX = box.x + box.width * 0.8;
  const endX = box.x + box.width * 0.15;
  await surface.evaluate(
    (el, coords) => {
      const init = {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: "touch",
        clientY: coords.y,
      };
      el.dispatchEvent(new PointerEvent("pointerdown", { ...init, clientX: coords.startX }));
      el.dispatchEvent(new PointerEvent("pointerup", { ...init, clientX: coords.endX }));
    },
    { startX, endX, y },
  );
  await expect(page.getByTestId("deck-position")).toContainText("Slide 2 of 24");
});

test("sitemap, robots and the share image are served", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain(absoluteUrl("/explore/forex"));
  expect(xml).toContain(absoluteUrl("/present/handout"));
  expect(xml).not.toContain("/present/01-forex-sports-betting-suit");

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(absoluteUrl("/sitemap.xml"));

  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");

  const topicImage = await request.get("/explore/forex/opengraph-image");
  expect(topicImage.status()).toBe(200);
  expect(topicImage.headers()["content-type"]).toContain("image/png");
});

test("focus moves to the main landmark after a client navigation", async ({ page, isMobile }) => {
  test.skip(isMobile, "the desktop navigation is the one that stays on screen");
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Explore", exact: true })
    .click();
  await expect(page).toHaveURL(/\/explore$/);
  await expect(page.locator("#main")).toBeFocused();
});

test("lesson pages publish a canonical URL from the configured origin", async ({ page }) => {
  await page.goto("/explore/forex");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    absoluteUrl("/explore/forex"),
  );
});
