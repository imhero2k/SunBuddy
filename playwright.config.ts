import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright-tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:5173/SunBuddy",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    command: "npm run dev:client",
    url: "http://localhost:5173/SunBuddy",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});

