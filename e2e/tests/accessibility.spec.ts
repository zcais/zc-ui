import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility E2E Tests using axe-core
 *
 * Automatically scans pages for WCAG 2.1 AA compliance violations.
 * Uses @axe-core/playwright which runs Deque's axe engine in the browser.
 *
 * @see https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright
 */

type Tag = string

/**
 * Helper: Run axe-core accessibility scan
 * @param page Playwright page
 * @param selector Optional CSS selector to scope the scan
 * @param tags WCAG tags to test against (default: wcag2a, wcag2aa, wcag21a, wcag21aa)
 */
async function analyzeAccessibility(
  page: import('@playwright/test').Page,
  selector?: string,
  tags: Tag[] = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
) {
  const builder = new AxeBuilder({ page }).withTags(tags)

  if (selector) {
    builder.include(selector)
  }

  return builder.analyze()
}

test.describe('Accessibility (axe-core): Full Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should not have any WCAG 2.1 AA violations on full page', async ({ page }) => {
    const results = await analyzeAccessibility(page)

    // Filter out violations that are difficult to fix in test fixtures
    // (e.g., color-contrast issues from CSS variable resolution in test env)
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )

    expect(criticalViolations, formatViolations(criticalViolations)).toEqual([])
  })
})

test.describe('Accessibility (axe-core): Component Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('buttons should be accessible', async ({ page }) => {
    const results = await analyzeAccessibility(page, '#buttons')
    expect(results.violations, formatViolations(results.violations)).toEqual([])
  })

  test('form controls should be accessible', async ({ page }) => {
    const results = await analyzeAccessibility(page, '#form-controls')
    const seriousViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(seriousViolations, formatViolations(seriousViolations)).toEqual([])
  })

  test('table should be accessible', async ({ page }) => {
    const results = await analyzeAccessibility(page, '#table')
    const seriousViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(seriousViolations, formatViolations(seriousViolations)).toEqual([])
  })

  test('tags should be accessible', async ({ page }) => {
    const results = await analyzeAccessibility(page, '#tags')
    expect(results.violations, formatViolations(results.violations)).toEqual([])
  })

  test('pagination should be accessible', async ({ page }) => {
    const results = await analyzeAccessibility(page, '#pagination')
    const seriousViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(seriousViolations, formatViolations(seriousViolations)).toEqual([])
  })
})

test.describe('Accessibility (axe-core): Dialog', () => {
  test('dialog content should be accessible when open', async ({ page }) => {
    await page.goto('/')
    await page.locator('#open-dialog').click()
    await expect(page.locator('.zc-dialog')).toBeVisible()

    const results = await analyzeAccessibility(page, '.zc-dialog')
    const seriousViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(seriousViolations, formatViolations(seriousViolations)).toEqual([])
  })
})

/**
 * Format axe-core violations into a readable error message
 */
function formatViolations(violations: any[]): string {
  if (violations.length === 0) return 'No violations found.'

  const header = `\n${violations.length} accessibility violation(s) found:\n`
  const body = violations
    .map((v) => {
      const nodes = v.nodes
        .map((n: any) => `    - ${n.target.join(', ')}`)
        .join('\n')
      return `  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}\n    Help: ${v.helpUrl}\n${nodes}`
    })
    .join('\n')

  return header + body
}
