import { test, expect } from '@playwright/test'

/**
 * Visual Regression Tests
 *
 * Uses Playwright's built-in screenshot comparison to detect UI regressions.
 * On first run, screenshots are captured as baselines.
 * Subsequent runs compare against the baseline and fail if pixels differ.
 *
 * To update baselines: `pnpm e2e:update-snapshots`
 *
 * These tests run across all browsers configured in playwright.config.ts
 * (Chromium, Firefox, WebKit) for cross-browser visual consistency.
 *
 * Tagged `@visual` and excluded from CI (`--grep-invert @visual`): pixel
 * baselines depend on OS font rendering, so they are generated and compared
 * on developer machines / dedicated runner images, not on GitHub runners.
 */

test.describe('Visual Regression: Button', { tag: '@visual' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('button section screenshot', async ({ page }) => {
    const section = page.locator('#buttons')
    await expect(section).toHaveScreenshot('buttons-section.png')
  })

  test('individual button variants', async ({ page }) => {
    await expect(page.locator('#btn-primary')).toHaveScreenshot('btn-primary.png')
    await expect(page.locator('#btn-success')).toHaveScreenshot('btn-success.png')
    await expect(page.locator('#btn-warning')).toHaveScreenshot('btn-warning.png')
    await expect(page.locator('#btn-danger')).toHaveScreenshot('btn-danger.png')
  })
})

test.describe('Visual Regression: Tags', { tag: '@visual' }, () => {
  test('tag section screenshot', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('#tags')
    await expect(section).toHaveScreenshot('tags-section.png')
  })
})

test.describe('Visual Regression: Table', { tag: '@visual' }, () => {
  test('table section screenshot', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('#table')
    await expect(section).toHaveScreenshot('table-section.png')
  })
})

test.describe('Visual Regression: Full Page', { tag: '@visual' }, () => {
  test('full page screenshot', async ({ page }) => {
    await page.goto('/')
    // Wait for everything to render
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('full-page.png', {
      fullPage: true,
    })
  })
})
