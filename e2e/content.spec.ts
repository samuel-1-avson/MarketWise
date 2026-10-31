import { expect, test } from "@playwright/test";

test("the forex lesson answers a quiz question and explains a wrong answer", async ({ page }) => {
  await page.goto("/explore/forex");
  const check = page.locator("#check");
  const first = check.locator("li").first();
  await first.getByRole("radio", { name: /One Ghana cedi is worth 10 US dollars/ }).check();
  await first.getByRole("button", { name: "Check answer" }).click();
  await expect(first.getByRole("status")).toContainText("Not quite");
  await expect(first.getByRole("status")).toContainText("base/quote");
  await first.getByRole("button", { name: "Try again" }).click();
  await first.getByRole("radio", { name: /One US dollar is worth 10 Ghana cedis/ }).check();
  await first.getByRole("button", { name: "Check answer" }).click();
  await expect(first.getByRole("status")).toContainText("Correct");
});

test("fictional-number sections show the illustrative label", async ({ page }) => {
  await page.goto("/explore/forex");
  for (const id of ["purpose", "mechanism", "narrative"]) {
    await expect(
      page.locator(`#${id}`).getByText("Illustrative only — not live data").first(),
    ).toBeVisible();
  }
  await expect(page.locator("figure").getByText("Illustrative only — not live data")).toBeVisible();
});

test("every lesson has eleven sections, a diagram with a text version, and a review note", async ({
  page,
}) => {
  for (const slug of ["forex", "stocks", "commodities", "crypto", "sports-betting"]) {
    await page.goto(`/explore/${slug}`);
    await expect(page.locator("main section[id]")).toHaveCount(12); // 11 lesson sections + review status
    await expect(page.getByRole("img", { name: /.+/ }).first()).toBeVisible();
    await expect(page.getByText("Text version of this diagram")).toBeVisible();
    await expect(page.getByRole("heading", { name: "How this lesson was reviewed" })).toBeVisible();
  }
});

test("the sports betting lesson offers no gambling links, tools or services", async ({ page }) => {
  await page.goto("/explore/sports-betting");
  const hrefs = await page
    .locator("a[href^='http']")
    .evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).href));
  for (const href of hrefs)
    expect(new URL(href).hostname).toMatch(/gov\.uk|cftc\.gov|investor\.gov|moneysmart\.gov\.au/);
  await expect(
    page.locator("main input[type=number], main input[type=text], main select"),
  ).toHaveCount(0);
  const text = (await page.locator("main").innerText()).toLowerCase();
  for (const banned of [
    "sportsbook",
    "bookmaker",
    "free bet",
    "welcome bonus",
    "promo code",
    "place your bet",
  ]) {
    expect(text).not.toContain(banned);
  }
});

test("the compare view narrows by question, updates the address and restores from it", async ({
  page,
  isMobile,
}) => {
  await page.goto("/compare");
  const chip = page.getByRole("button", { name: /Core uncertainty/ });
  await expect(chip).toHaveAttribute("aria-pressed", "true");
  await chip.click();
  await expect(chip).toHaveAttribute("aria-pressed", "false");
  await expect(page).toHaveURL(/dims=/);
  await expect(
    page.getByRole("status").filter({ hasText: "Comparing five systems" }),
  ).toContainText("7 of 8");

  await page.reload();
  await expect(page.getByRole("button", { name: /Core uncertainty/ })).toHaveAttribute(
    "aria-pressed",
    "false",
  );

  if (isMobile) {
    await expect(page.locator("table")).toBeHidden();
    await expect(page.locator("main details").first()).toBeVisible();
  } else {
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("columnheader")).toHaveCount(6);
  }
});

test("myths reveal on demand and filter by topic", async ({ page }) => {
  await page.goto("/myths");
  const first = page.locator("main details").first();
  await expect(first).not.toHaveAttribute("open", "");
  await first.locator("summary").click();
  await expect(first).toContainText("Verdict:");
  await page.getByRole("button", { name: "Crypto", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Showing" })).toContainText(
    /Showing 3 of \d+ myths|Showing 2 of \d+ myths/,
  );
});

test("the glossary search narrows the list and term links jump to the definition", async ({
  page,
}) => {
  await page.goto("/glossary");
  await page.getByLabel("Search terms and definitions").fill("spread");
  await expect(page.getByRole("term").first()).toBeVisible();
  const count = await page.getByRole("term").count();
  expect(count).toBeLessThan(10);

  // A "See also" link to a term the search is hiding clears the search and jumps to that term.
  await page.getByRole("link", { name: "Liquidity", exact: true }).first().click();
  await expect(page.getByLabel("Search terms and definitions")).toHaveValue("");
  await expect(page.locator("#liquidity")).toBeInViewport();

  // A fresh deep link (as used by the lessons) lands on the term.
  await page.goto("/about");
  await page.goto("/glossary#leverage");
  await expect(page.locator("#leverage")).toBeInViewport();
});

test("the quiz page saves progress only after the learner opts in, and About clears it", async ({
  page,
}) => {
  await page.goto("/quiz");
  const first = page.locator("main ol > li").first();
  await first.getByRole("radio", { name: /One US dollar is worth 10 Ghana cedis/ }).check();
  await first.getByRole("button", { name: "Check answer" }).click();
  expect(await page.evaluate(() => localStorage.getItem("marketwise:progress"))).toBeNull();

  await page.getByRole("checkbox", { name: /Remember which questions/ }).check();
  await first.getByRole("button", { name: "Try again" }).click();
  await first.getByRole("radio", { name: /One US dollar is worth 10 Ghana cedis/ }).check();
  await first.getByRole("button", { name: "Check answer" }).click();
  expect(await page.evaluate(() => localStorage.getItem("marketwise:progress"))).toContain(
    "forex-q1",
  );

  await page.goto("/about");
  await page.getByRole("button", { name: "Clear saved preferences" }).click();
  await expect(page.getByRole("status")).toContainText("Cleared");
  expect(await page.evaluate(() => localStorage.getItem("marketwise:progress"))).toBeNull();
});

test("resources lists every source with its status and a safe external link", async ({ page }) => {
  await page.goto("/resources");
  const cards = page.locator("main ul > li[id]");
  await expect(cards).toHaveCount(8);
  await expect(page.getByText(/Verified \d+ \w+ 2026/)).toHaveCount(8);
  const links = page.locator("main a[href^='https://']");
  for (let i = 0; i < (await links.count()); i += 1) {
    await expect(links.nth(i)).toHaveAttribute("rel", /noopener/);
    await expect(links.nth(i)).toHaveAttribute("target", "_blank");
  }
});
