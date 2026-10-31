import { expect, test } from "@playwright/test";
import { routes } from "./routes";

for (const route of routes) {
  test(`${route} loads with a heading, no errors and no horizontal overflow`, async ({ page }) => {
    const problems: string[] = [];
    page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`console: ${message.text()}`);
    });

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, "horizontal overflow in px").toBeLessThanOrEqual(0);
    expect(problems).toEqual([]);
  });
}

test("an unknown lesson returns the not-found page", async ({ page }) => {
  const response = await page.goto("/explore/not-a-topic");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("not in the observatory");
});

test("primary navigation reaches each section and marks the current page", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  for (const [name, path] of [
    ["Explore", "/explore"],
    ["Compare", "/compare"],
    ["Labs", "/labs"],
    ["Myths", "/myths"],
    ["Quiz", "/quiz"],
    ["Glossary", "/glossary"],
    ["Resources", "/resources"],
    ["About", "/about"],
  ] as const) {
    if (isMobile) await page.locator("header summary").click();
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    if (!isMobile) {
      await expect(
        page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name, exact: true }),
      ).toHaveAttribute("aria-current", "page");
    }
  }
});

test("the home page cards lead to the five lessons", async ({ page }) => {
  await page.goto("/");
  for (const [name, slug] of [
    ["Forex", "forex"],
    ["Stocks", "stocks"],
    ["Commodities", "commodities"],
    ["Crypto", "crypto"],
    ["Sports betting", "sports-betting"],
  ] as const) {
    await page.goto("/");
    await page.getByRole("link", { name: new RegExp(`Read the lesson on ${name}`) }).click();
    await expect(page).toHaveURL(new RegExp(`/explore/${slug}$`));
  }
});

test("the skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/about");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("reduced motion can be switched on, persists across pages and applies to the document", async ({
  page,
  isMobile,
}) => {
  await page.goto("/about");
  const openMenu = async () => {
    if (isMobile) await page.locator("header summary").click();
  };
  await openMenu();
  const toggle = page.getByRole("button", { name: "Reduce motion" }).first();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");

  await page.goto("/explore");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await openMenu();
  await expect(page.getByRole("button", { name: "Reduce motion" }).first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
