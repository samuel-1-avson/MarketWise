import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { slides } from "../content/slides";
import { choose } from "./helpers";
import { routes } from "./routes";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

async function scan(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return results.violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
  }));
}

for (const route of routes) {
  test(`axe finds no WCAG A/AA violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    expect(await scan(page)).toEqual([]);
  });
}

test("axe finds no violations in changed lab states", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto("/labs/leverage-sensitivity");
  await choose(page, "More");
  expect(await scan(page)).toEqual([]);

  await page.goto("/labs/supply-shock");
  await choose(page, /Both at once/);
  expect(await scan(page)).toEqual([]);

  await page.goto("/labs/ownership-lens");
  await choose(page, /pays a fictional pool/);
  expect(await scan(page)).toEqual([]);

  await page.goto("/labs/ledger-journey");
  for (let i = 0; i < 3; i += 1) await page.getByRole("button", { name: /Next step/ }).click();
  expect(await scan(page)).toEqual([]);

  await page.goto("/labs/uncertainty-tiles");
  await page.getByRole("button", { name: "Reveal all" }).click();
  expect(await scan(page)).toEqual([]);

  await page.goto("/labs/fx-quote");
  await choose(page, /GHS\/USD/);
  await page.getByRole("button", { name: /Next quote/ }).click();
  expect(await scan(page)).toEqual([]);
});

test("axe finds no violations in the deck with notes, timer and dialogs open", async ({ page }) => {
  await page.goto("/present/08-fx-reality-check");
  await page.getByRole("button", { name: /Speaker notes/ }).click();
  await page.getByRole("button", { name: /^Timer/ }).click();
  await expect(page.getByTestId("notes-panel")).toBeVisible();
  await expect(page.getByTestId("timer-panel")).toBeVisible();
  expect(await scan(page)).toEqual([]);

  await page.getByRole("button", { name: /Shortcuts/ }).click();
  await expect(page.getByRole("dialog", { name: "Keyboard shortcuts" })).toBeVisible();
  expect(await scan(page)).toEqual([]);
  await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();

  await page.getByRole("button", { name: /Chapters/ }).click();
  await expect(page.getByRole("dialog", { name: "Chapters" })).toBeVisible();
  expect(await scan(page)).toEqual([]);
});

test("axe finds no violations on any of the 24 slides", async ({ page }) => {
  test.setTimeout(120_000);
  expect(slides).toHaveLength(24);
  for (const { id } of slides) {
    await page.goto(`/present/${id}`);
    await page.waitForLoadState("networkidle");
    expect(await scan(page), id).toEqual([]);
  }
});

test("axe finds no violations after revealing myths, answering a quiz and opening the menu", async ({
  page,
  isMobile,
}) => {
  await page.goto("/myths");
  await page.getByRole("button", { name: "Reveal all answers" }).click();
  expect(await scan(page)).toEqual([]);

  await page.goto("/explore/stocks");
  const first = page.locator("#check li").first();
  await first.getByRole("radio").first().check();
  await first.getByRole("button", { name: "Check answer" }).click();
  expect(await scan(page)).toEqual([]);

  if (isMobile) {
    await page.getByText("Menu", { exact: true }).click();
    expect(await scan(page)).toEqual([]);
  }
});
