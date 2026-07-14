import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E + Visual Regression + Cross-Browser Testing Configuration
 *
 * Features:
 * - E2E tests for key component interaction flows
 * - Visual regression via screenshot comparison
 * - Cross-browser: Chrome, Firefox, Safari (WebKit)
 * - Accessibility testing via axe-core
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI, use local cores otherwise
  workers: process.env.CI ? 2 : undefined,

  // Reporter configuration
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'e2e-results.xml' }]]
    : 'html',

  // Shared settings for all tests
  use: {
    // Base URL for tests - uses a simple dev server serving component demos
    baseURL: 'http://localhost:5174',

    // Capture trace on first retry
    trace: 'on-first-retry',

    // Capture screenshot on failure
    screenshot: 'only-on-failure',

    // Capture video on failure
    video: 'retain-on-failure',

    // Visual regression: tolerance for screenshot comparison
    // Allows minor anti-aliasing differences across browsers
    expect: {
      toHaveScreenshot: {
        maxDiffPixelRatio: 0.01,
        threshold: 0.2,
      },
    },
  },

  // Configure projects for cross-browser testing
  projects: [
    // --- Desktop Browsers ---
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // --- Mobile Viewport (responsive smoke tests) ---
    // Only Chromium to keep CI fast; full mobile testing is done manually
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 7'] },
    //   testMatch: /.*\.visual\.spec\.ts/,
    // },
  ],

  // Local dev server: serve the e2e fixtures directory
  webServer: {
    command: 'npx vite serve e2e/fixtures --port 5174',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
