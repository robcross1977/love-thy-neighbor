import { defineConfig, devices } from "@playwright/test";

import type { PlaywrightTestConfig } from "@playwright/test";

/**
 * Playwright configuration
 * See https://playwright.dev/docs/test-configuration
 */
const config: PlaywrightTestConfig = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],
  // Comment out webServer for now - we'll start the server manually
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   timeout: 120000, // Increased to 120 seconds
  //   reuseExistingServer: !process.env.CI,
  // },
});

export default config;
