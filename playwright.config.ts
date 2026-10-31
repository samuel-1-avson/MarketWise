import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * E2E runs against a production build (`next build` + `next start`) in the locally installed Google
 * Chrome (`channel: "chrome"`), so no browser binaries need to be downloaded. To use bundled
 * Chromium instead, run `npx playwright install chromium` and remove the `channel` lines.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  /* Axe scans and production-page loads overrun 30s when several Chrome profiles share the machine. */
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: process.env.CI ? undefined : 3,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT} --hostname 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
