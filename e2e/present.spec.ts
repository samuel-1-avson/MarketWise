import { expect, test, type Page } from "@playwright/test";
import { slides } from "../content/slides";

const title = (page: Page) => page.getByRole("heading", { level: 1 });
const position = (page: Page) => page.getByTestId("deck-position");

const FIRST = slides[0];
const FX = slides.find((s) => s.labId === "fx-quote");
if (!FIRST || !FX) throw new Error("deck content changed: first slide or FX slide missing");

test.describe("live deck (large screen)", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "keyboard presenting is for large screens; mobile is covered below",
  );

  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1280, height: 720 },
  ]) {
    test(`fits ${viewport.width}×${viewport.height} without scrolling and keeps type large enough to read`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      await page.goto("/present");
      await expect(title(page)).toHaveText(FIRST.title);

      const m = await page.evaluate(() => {
        const stage = document.querySelector("[data-testid=stage]") as HTMLElement;
        const box = stage.getBoundingClientRect();
        const scale = box.width / 1920;
        const msg = stage.querySelector("p.text-ink") as HTMLElement;
        const h1 = stage.querySelector("h1") as HTMLElement;
        return {
          scrollOverflowX: document.documentElement.scrollWidth - window.innerWidth,
          scrollOverflowY: document.documentElement.scrollHeight - window.innerHeight,
          ratio: box.width / box.height,
          inside:
            box.left >= 0 &&
            box.right <= window.innerWidth &&
            box.top >= 0 &&
            box.bottom <= window.innerHeight,
          bodyPx: parseFloat(getComputedStyle(msg).fontSize) * scale,
          titlePx: parseFloat(getComputedStyle(h1).fontSize) * scale,
        };
      });
      expect(m.scrollOverflowX).toBeLessThanOrEqual(0);
      expect(m.scrollOverflowY).toBeLessThanOrEqual(0);
      expect(m.ratio).toBeCloseTo(16 / 9, 1);
      expect(m.inside).toBe(true);
      // Effective on-screen sizes: legible when a 720p stream is shrunk further.
      expect(m.bodyPx).toBeGreaterThanOrEqual(20);
      expect(m.titlePx).toBeGreaterThanOrEqual(38);
      await context.close();
    });
  }

  test("has no site header or footer, the deck's own controls, and notes hidden by default", async ({
    page,
  }) => {
    await page.goto("/present");
    await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
    await expect(position(page)).toContainText("Slide 1 of 24");
    await expect(page.getByTestId("notes-status")).toHaveText("Notes hidden");
    await expect(page.getByTestId("notes-panel")).toHaveCount(0);
    expect(await page.locator("body").innerText()).not.toContain(FIRST.notes.teachingPoint);
  });

  test("moves through all 24 slides with the right arrow and shows each title", async ({
    page,
  }) => {
    await page.goto("/present");
    await expect(title(page)).toHaveText(FIRST.title);
    for (let i = 1; i < slides.length; i += 1) {
      await page.keyboard.press("ArrowRight");
      await expect(title(page)).toHaveText(slides[i]?.title ?? "");
      await expect(page).toHaveURL(new RegExp(`/present/${slides[i]?.id}$`));
    }
    await expect(position(page)).toContainText("Slide 24 of 24");
    await page.keyboard.press("ArrowRight");
    await expect(position(page)).toContainText("Slide 24 of 24");
  });

  test("Home, End, left arrow and Space behave, and Back returns to the previous slide", async ({
    page,
  }) => {
    await page.goto("/present");
    await page.keyboard.press("End");
    await expect(position(page)).toContainText("Slide 24 of 24");
    await page.keyboard.press("Home");
    await expect(position(page)).toContainText("Slide 1 of 24");
    await page.keyboard.press("Space");
    await page.keyboard.press("Space");
    await expect(position(page)).toContainText("Slide 3 of 24");
    await page.keyboard.press("ArrowLeft");
    await expect(position(page)).toContainText("Slide 2 of 24");
    // History is: 1 → 24 → 1 → 2 → 3 → 2, so one step back lands on slide 3.
    await page.goBack();
    await expect(position(page)).toContainText("Slide 3 of 24");
  });

  test("Space on a focused button activates it instead of advancing the slide", async ({
    page,
  }) => {
    await page.goto("/present");
    await page.getByRole("button", { name: /Speaker notes/ }).focus();
    await page.keyboard.press("Space");
    await expect(page.getByTestId("notes-panel")).toBeVisible();
    await expect(position(page)).toContainText("Slide 1 of 24");
  });

  test("N shows speaker notes with a clear status; Escape closes them", async ({ page }) => {
    await page.goto("/present");
    await page.keyboard.press("n");
    const panel = page.getByTestId("notes-panel");
    await expect(panel).toBeVisible();
    await expect(page.getByTestId("notes-status")).toHaveText("● Notes visible on this screen");
    await expect(panel).toContainText(FIRST.notes.teachingPoint);
    await expect(panel).toContainText(FIRST.speakerCue);

    await page.keyboard.press("ArrowRight");
    await expect(panel).toContainText(slides[1]?.notes.teachingPoint ?? "");

    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(page.getByTestId("notes-status")).toHaveText("Notes hidden");
  });

  test("speaker notes are hidden again after a reload, so they can never reappear on a stream by accident", async ({
    page,
  }) => {
    await page.goto("/present/03-what-is-a-market");
    await page.keyboard.press("n");
    await expect(page.getByTestId("notes-panel")).toBeVisible();
    await page.reload();
    await expect(page.getByTestId("notes-status")).toHaveText("Notes hidden");
    await expect(page.getByTestId("notes-panel")).toHaveCount(0);
    expect(await page.locator("body").innerText()).not.toContain(
      slides[2]?.notes.teachingPoint ?? "unreachable",
    );
  });

  test("single-letter shortcuts can be switched off in the help dialog; arrows and buttons keep working", async ({
    page,
  }) => {
    await page.goto("/present");
    await page.keyboard.press("?");
    const help = page.getByRole("dialog", { name: "Keyboard shortcuts" });
    await help.getByRole("checkbox", { name: /Single-letter shortcuts/ }).uncheck();
    await expect(help.getByRole("button", { name: "Reduce motion" })).toBeVisible();
    await help.getByRole("button", { name: "Close" }).click();

    await page.keyboard.press("n");
    await expect(page.getByTestId("notes-panel")).toHaveCount(0);
    await page.keyboard.press("ArrowRight");
    await expect(position(page)).toContainText("Slide 2 of 24");
    await page.getByRole("button", { name: /Speaker notes/ }).click();
    await expect(page.getByTestId("notes-panel")).toBeVisible();
  });

  test("the page title follows the slide", async ({ page }) => {
    await page.goto("/present");
    await expect(page).toHaveTitle(/Slide 1: Is Forex Sports Betting in a Suit\?/);
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveTitle(/Slide 2: Tonight's Promise/);
  });

  test("T shows a timer that starts, pauses and resets", async ({ page }) => {
    await page.goto("/present");
    await page.keyboard.press("t");
    const clock = page.getByTestId("timer-clock");
    await expect(clock).toHaveText("00:00");
    await page.getByRole("button", { name: "Start" }).click();
    await expect(clock).not.toHaveText("00:00", { timeout: 4000 });
    await page.getByRole("button", { name: "Pause" }).click();
    const paused = await clock.textContent();
    await page.waitForTimeout(1300);
    expect(await clock.textContent()).toBe(paused);
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(clock).toHaveText("00:00");
  });

  test("? lists the shortcuts and C jumps by chapter", async ({ page }) => {
    await page.goto("/present");
    await page.keyboard.press("?");
    const help = page.getByRole("dialog", { name: "Keyboard shortcuts" });
    await expect(help).toBeVisible();
    await expect(help).toContainText("Fullscreen on or off");
    await page.keyboard.press("Escape");
    await expect(help).toBeHidden();

    await page.keyboard.press("c");
    const chapters = page.getByRole("dialog", { name: "Chapters" });
    await expect(chapters).toBeVisible();
    await chapters.getByRole("button", { name: /Crypto: More Than a Chart/ }).click();
    await expect(title(page)).toHaveText("Crypto: More Than a Chart");
    await expect(page).toHaveURL(/\/present\/14-crypto-more-than-a-chart$/);
    await expect(chapters).toBeHidden();
  });

  test("F toggles fullscreen when the browser allows it", async ({ page }) => {
    await page.goto("/present");
    await expect(page.getByRole("button", { name: /Fullscreen/ })).toBeEnabled();
    await page.keyboard.press("f");
    await expect
      .poll(() => page.evaluate(() => document.fullscreenElement !== null), { timeout: 5000 })
      .toBe(true);
    await page.keyboard.press("f");
    await expect
      .poll(() => page.evaluate(() => document.fullscreenElement === null), { timeout: 5000 })
      .toBe(true);
  });

  test("deep links open the right slide and an unknown slide is a 404", async ({ page }) => {
    await page.goto("/present/12-spot-is-not-futures");
    await expect(title(page)).toHaveText("Spot Is Not Futures");
    await expect(position(page)).toContainText("Slide 12 of 24");

    const missing = await page.goto("/present/99-nope");
    expect(missing?.status()).toBe(404);
  });

  test("a slide settles to a still image: nothing keeps animating once it has appeared", async ({
    page,
  }) => {
    await page.goto("/present/08-fx-reality-check");
    await page.waitForTimeout(2500);
    const running = await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === "running").length,
    );
    expect(running).toBe(0);
  });

  test("no scene animation at all when the visitor prefers reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/present/13-when-supply-changes");
    const duration = await page
      .locator(".scene-rise")
      .first()
      .evaluate((el) => getComputedStyle(el).animationDuration);
    expect(parseFloat(duration)).toBeLessThan(0.001);
    await expect(page.getByText("Fictional drought")).toBeVisible();
  });

  test("makes no external network requests", async ({ page, baseURL }) => {
    const external: string[] = [];
    page.on("request", (r) => {
      if (!r.url().startsWith(baseURL ?? "") && !r.url().startsWith("data:"))
        external.push(r.url());
    });
    await page.goto("/present");
    for (let i = 0; i < 5; i += 1) await page.keyboard.press("ArrowRight");
    await page.waitForLoadState("networkidle");
    expect(external).toEqual([]);
  });
});

test.describe("lab round trip", () => {
  test.skip(({ isMobile }) => isMobile, "round trip is exercised on desktop");

  test("opens a lab from its slide and returns to the exact slide with timer and notes intact", async ({
    page,
  }) => {
    await page.goto(`/present/${FX.id}`);
    await expect(title(page)).toHaveText(FX.title);

    await page.keyboard.press("n"); // notes open
    await page.keyboard.press("t");
    await page.getByRole("button", { name: "Start" }).click();
    await expect(page.getByTestId("timer-clock")).not.toHaveText("00:00", { timeout: 4000 });

    await page.getByTestId("deck-detour").click();
    await expect(page).toHaveURL(
      new RegExp(`/labs/fx-quote\\?returnTo=${encodeURIComponent(`/present/${FX.id}`)}`),
    );
    const back = page.getByTestId("return-to-deck");
    await expect(back).toContainText(`Back to slide ${FX.number}: ${FX.title}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("FX Quote Explainer");

    // Use the lab, then return.
    await page.getByRole("button", { name: /Next quote/ }).click();
    await expect(page.getByTestId("lab-live")).toContainText("The number rose from 10.00 to 10.50");
    await page.waitForTimeout(1100);

    await back.click();
    await expect(page).toHaveURL(new RegExp(`/present/${FX.id}$`));
    await expect(title(page)).toHaveText(FX.title);
    await expect(position(page)).toContainText(`Slide ${FX.number} of 24`);
    await expect(page.getByTestId("notes-panel")).toBeVisible(); // notes state kept
    const chip = page.getByTestId("timer-chip");
    await expect(chip).toBeVisible();
    await expect(chip).not.toContainText("paused"); // still running
    await expect(chip).not.toContainText("00:00");
  });

  test("every slide with a lab or related page links to it with a working way back", async ({
    page,
  }) => {
    for (const s of slides.filter((x) => x.labId || x.relatedRoute)) {
      await page.goto(`/present/${s.id}`);
      await page.getByTestId("deck-detour").click();
      const back = page.getByTestId("return-to-deck");
      await expect(back, s.id).toBeVisible();
      await back.click();
      await expect(page, s.id).toHaveURL(new RegExp(`/present/${s.id}$`));
    }
  });

  test("a tampered or unknown returnTo shows no banner and cannot redirect away", async ({
    page,
  }) => {
    for (const bad of [
      "https://evil.example/",
      "//evil.example",
      "/present/not-a-slide",
      "/labs/fx-quote",
      "javascript:alert(1)",
    ]) {
      await page.goto(`/labs/fx-quote?returnTo=${encodeURIComponent(bad)}`);
      await expect(page.getByTestId("return-to-deck")).toHaveCount(0);
      await expect(page).toHaveURL(/\/labs\/fx-quote/);
    }
  });
});

test.describe("handout", () => {
  test("is audience-safe by default, lists all 24 slides with sources, and adds the notes only on request", async ({
    page,
  }) => {
    await page.goto("/present/handout");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("All 24 slides on paper");
    await expect(page.locator("article")).toHaveCount(24);
    await expect(page.getByText(FIRST.keyMessage)).toBeVisible();
    await expect(page.locator("main a[href^='/resources#']").first()).toBeVisible();

    // No notes and no presenter cues until the presenter asks for them.
    const notesBox = page.getByRole("checkbox", { name: "Include speaker notes" });
    await expect(notesBox).not.toBeChecked();
    await expect(page.getByText(FIRST.notes.teachingPoint)).toHaveCount(0);
    await expect(page.getByText(FIRST.speakerCue)).toHaveCount(0);
    await expect(page.getByText("Audience-safe copy")).toBeVisible();

    await notesBox.check();
    await expect(page.getByText(FIRST.notes.teachingPoint)).toBeVisible();
    await expect(page.getByText(/Do not share it with the audience/)).toBeVisible();
    await notesBox.uncheck();
    await expect(page.getByText(FIRST.notes.teachingPoint)).toHaveCount(0);
  });

  test("prints black on white with the site header and controls hidden", async ({ page }) => {
    await page.goto("/present/handout");
    await page.getByRole("checkbox", { name: "Include speaker notes" }).check();
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("checkbox", { name: "Include speaker notes" })).toBeHidden();
    await expect(page.getByRole("button", { name: /Print/ })).toBeHidden();
    await expect(page.getByRole("banner")).toBeHidden();
    await expect(page.getByRole("contentinfo")).toBeHidden();

    const colours = await page.evaluate(() => {
      const bg = getComputedStyle(document.body).backgroundColor;
      const pick = (sel: string) => getComputedStyle(document.querySelector(sel) as Element).color;
      return {
        bg,
        title: pick("main h1"),
        slideTitle: pick("article h3"),
        message: pick("article p.text-lg"),
        notes: pick("article strong"),
        link: pick("main a[href^='/resources#']"),
      };
    });
    expect(colours.bg).toBe("rgb(255, 255, 255)");
    for (const [name, colour] of Object.entries(colours).filter(([k]) => k !== "bg")) {
      expect(colour, name).toBe("rgb(0, 0, 0)");
    }
  });

  test("the deck's handout link carries a way back to the exact slide", async ({ page }) => {
    await page.goto("/present/07-why-fx-rates-change");
    await page.getByRole("link", { name: "Handout" }).first().click();
    await expect(page).toHaveURL(/\/present\/handout\?returnTo=/);
    const back = page.getByTestId("return-to-deck");
    await expect(back).toContainText("Back to slide 7: Why FX Rates Change");
    await back.click();
    await expect(page).toHaveURL(/\/present\/07-why-fx-rates-change$/);
    await expect(title(page)).toHaveText("Why FX Rates Change");
  });
});

test("the home page offers the presentation, which opens full-screen without the site header", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Launch presentation" }).click();
  await expect(page).toHaveURL(/\/present$/);
  await expect(title(page)).toHaveText(FIRST.title);
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0);
  // And back out again: Exit returns to the site with its header.
  await page.getByRole("link", { name: /Exit/ }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Five worlds");
});

test("the footer links to the deck and the handout", async ({ page }) => {
  await page.goto("/about");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Launch the presentation" })).toHaveAttribute(
    "href",
    "/present",
  );
  await expect(footer.getByRole("link", { name: "Presentation handout" })).toHaveAttribute(
    "href",
    "/present/handout",
  );
});

test.describe("small screens", () => {
  test.skip(({ isMobile }) => !isMobile, "phone-only");

  test("tell the visitor the deck is built for a large screen and point to the handout", async ({
    page,
  }) => {
    await page.goto("/present");
    const note = page.getByText("This deck is built for a large screen");
    await expect(note).toBeVisible();
    await note.getByRole("link", { name: "handout" }).click();
    await expect(page).toHaveURL(/\/present\/handout$/);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
