import { choose } from "./helpers";
import { expect, test, type Page } from "@playwright/test";

const live = (page: Page) => page.getByTestId("lab-live");

test("the labs index lists all six labs and each opens", async ({ page }) => {
  await page.goto("/labs");
  const cards = page.locator("main ul > li a[href^='/labs/']");
  await expect(cards).toHaveCount(6);
  for (const [title, path] of [
    ["FX Quote Explainer", "fx-quote"],
    ["Leverage Sensitivity Bands", "leverage-sensitivity"],
    ["Equity Ownership Lens", "ownership-lens"],
    ["Commodity Supply Story", "supply-shock"],
    ["Ledger Journey", "ledger-journey"],
    ["Uncertainty Tiles", "uncertainty-tiles"],
  ] as const) {
    await page.goto("/labs");
    await page.getByRole("heading", { level: 2, name: title }).click();
    await expect(page).toHaveURL(new RegExp(`/labs/${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  }
});

test("every lab says it is fictional and what it does not do", async ({ page }) => {
  for (const slug of [
    "fx-quote",
    "leverage-sensitivity",
    "ownership-lens",
    "supply-shock",
    "ledger-journey",
    "uncertainty-tiles",
  ]) {
    await page.goto(`/labs/${slug}`);
    await expect(page.getByText("Illustrative only — not live data").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "What this lab does not do" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "In plain words" })).toBeVisible();
    await expect(live(page)).not.toBeEmpty();
  }
});

test("FX Quote: step the series, flip the pair and reset", async ({ page }) => {
  await page.goto("/labs/fx-quote");
  await expect(live(page)).toContainText("1 US dollar is worth 10.00 Ghana cedis");
  await page.getByRole("button", { name: /Next quote/ }).click();
  await expect(live(page)).toContainText("The number rose from 10.00 to 10.50");
  await choose(page, /GHS\/USD/);
  await expect(live(page)).toContainText("1 Ghana cedi is worth 0.0952 US dollars");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(live(page)).toContainText("1 US dollar is worth 10.00 Ghana cedis");
  await expect(page.getByRole("slider")).toHaveAttribute("aria-valuetext", /Quote 3 of 5/);
});

test("Leverage: arrow keys move through the levels and the high level uses up the deposit", async ({
  page,
}) => {
  await page.goto("/labs/leverage-sensitivity");
  await page.getByRole("radio", { name: "None" }).focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "More" })).toBeChecked();
  await expect(live(page)).toContainText("20× sensitivity");
  await expect(page.getByText("All the money put in is used up in this toy model")).toBeVisible();
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.getByRole("radio", { name: "None" })).toBeChecked();
});

test("Ownership: slider, typed numbers (clamped) and the dividend choice", async ({ page }) => {
  await page.goto("/labs/ownership-lens");
  await expect(live(page)).toContainText("25 of 1,000 shares is 2.5%");

  await page.getByRole("slider").focus();
  await page.keyboard.press("End");
  await expect(live(page)).toContainText("1,000 of 1,000 shares is 100%");

  const box = page.getByLabel(/Or type a number/);
  await box.fill("5000");
  await expect(live(page)).toContainText("1,000 of 1,000 shares is 100%");
  await box.fill("100");
  await expect(live(page)).toContainText("100 of 1,000 shares is 10%");
  await box.fill("");
  await expect(live(page)).toContainText("own none");

  await box.fill("100");
  await choose(page, /pays a fictional pool/);
  await expect(live(page)).toContainText("500 cedis");
  await expect(live(page)).not.toContainText(/NaN|undefined/);
});

test("Supply: a fictional drought moves the supply line and price pressure upward", async ({
  page,
}) => {
  await page.goto("/labs/supply-shock");
  await expect(live(page)).toContainText("Nothing has changed");
  await choose(page, /drought/);
  await expect(live(page)).toContainText("higher price and a lower quantity");
  await expect(page.getByText("▲ Upward pressure in this model")).toBeVisible();
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(live(page)).toContainText("Nothing has changed");
});

test("Supply: no animation when the visitor prefers reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/labs/supply-shock");
  await choose(page, /Both at once/);
  const duration = await page
    .locator("svg g[style*='transition']")
    .first()
    .evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(parseFloat(duration)).toBeLessThan(0.001);
  await expect(page.getByText("▲ Upward pressure in this model")).toBeVisible();
});

test("Ledger: a valid request is recorded; a request that breaks a rule is rejected", async ({
  page,
}) => {
  await page.goto("/labs/ledger-journey");
  await expect(page.getByRole("button", { name: /Back/ })).toBeDisabled();
  for (let i = 0; i < 3; i += 1) await page.getByRole("button", { name: /Next step/ }).click();
  await expect(page.getByText("✓ New entry")).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Ledger entries" }).getByRole("listitem"),
  ).toHaveCount(3);

  await page.getByRole("button", { name: /Replay/ }).click();
  await expect(page.getByRole("heading", { name: /Step 1 of 4/ })).toBeVisible();

  await choose(page, /breaks a rule/);
  for (let i = 0; i < 3; i += 1) await page.getByRole("button", { name: /Next step/ }).click();
  await expect(page.getByText(/Request rejected — the ledger has not changed/)).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Ledger entries" }).getByRole("listitem"),
  ).toHaveCount(2);
});

test("Uncertainty: tiles reveal deterministically and short runs appear", async ({ page }) => {
  await page.goto("/labs/uncertainty-tiles");
  const reveal10 = async () => {
    await page.getByRole("button", { name: "Reveal 10 more" }).click();
    const details = page.locator("details", { hasText: "Sequence as text" });
    if (!(await details.evaluate((el) => (el as HTMLDetailsElement).open)))
      await details.locator("summary").click();
    return page.getByTestId("tile-sequence").textContent();
  };
  const first = await reveal10();
  await page.getByRole("button", { name: "Reset" }).click();
  const second = await reveal10();
  expect(first).toBe(second);

  await page.getByRole("button", { name: "Reveal all" }).click();
  await expect(live(page)).toContainText("Revealed 60 of 60 tiles");
  await expect(live(page)).toContainText(/Longest streak so far: [4-9]|\d{2} /);
  await expect(page.getByRole("button", { name: "Reveal next" })).toBeDisabled();

  await choose(page, "Uneven mix");
  await expect(live(page)).toContainText("No tiles revealed yet");
});

test("lessons link to their labs", async ({ page }) => {
  await page.goto("/explore/forex");
  const tryIt = page.getByRole("heading", { name: "Try it yourself" }).locator("..");
  await expect(tryIt.getByRole("link")).toHaveCount(2); // FX quote and leverage
  await tryIt.getByRole("link", { name: "FX Quote Explainer" }).click();
  await expect(page).toHaveURL(/\/labs\/fx-quote$/);

  await page.goto("/explore/sports-betting");
  await page.getByRole("link", { name: "Uncertainty Tiles" }).click();
  await expect(page).toHaveURL(/\/labs\/uncertainty-tiles$/);
});

test("labs work offline after load and make no external requests", async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith(baseURL ?? "") && !request.url().startsWith("data:"))
      external.push(request.url());
  });
  for (const slug of ["fx-quote", "ownership-lens", "uncertainty-tiles"]) {
    await page.goto(`/labs/${slug}`);
    await page.waitForLoadState("networkidle");
  }
  expect(external).toEqual([]);

  await page.goto("/labs/ledger-journey");
  await page.waitForLoadState("networkidle");
  await page.context().setOffline(true);
  await page.getByRole("button", { name: /Next step/ }).click();
  await expect(page.getByRole("heading", { name: /Step 2 of 4/ })).toBeVisible();
  await page.context().setOffline(false);
});
