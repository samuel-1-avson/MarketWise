import type { Page } from "@playwright/test";

/**
 * Picks an option in a pill-style choice group the way a visitor does: by clicking its label. (The
 * native radio inside is visually hidden but stays keyboard- and screen-reader-accessible.)
 */
export async function choose(page: Page, name: string | RegExp): Promise<void> {
  await page.locator("label", { has: page.getByRole("radio", { name }) }).click();
}
