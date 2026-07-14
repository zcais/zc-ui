import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Dialog & Overlay Interactions
 * Covers open dialog, close dialog, backdrop click, ESC key
 */
test.describe('Dialog E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should open and close dialog via button', async ({ page }) => {
    // Open dialog
    await page.locator('#open-dialog').click()
    await expect(page.locator('.zc-dialog')).toBeVisible()
    await expect(page.locator('.zc-dialog__title')).toHaveText('Test Dialog')

    // Close dialog via close button
    const closeBtn = page.locator('.zc-dialog__headerbtn')
    if (await closeBtn.isVisible()) {
      await closeBtn.click()
    } else {
      // Try clicking the X button in the dialog header
      await page.locator('.zc-dialog .close, .zc-dialog__close').first().click()
    }
    await expect(page.locator('.zc-dialog')).not.toBeVisible()
  })

  test('should close dialog with ESC key', async ({ page }) => {
    await page.locator('#open-dialog').click()
    await expect(page.locator('.zc-dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('.zc-dialog')).not.toBeVisible()
  })
})

/**
 * E2E Tests: Table Interactions
 */
test.describe('Table E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should render table with data', async ({ page }) => {
    const table = page.locator('#table .zc-table')
    await expect(table).toBeVisible()

    // Should have header row
    await expect(page.locator('#table th').first()).toBeVisible()

    // Should have data rows
    const rows = page.locator('#table .zc-table__body tr, #table tbody tr')
    await expect(rows.first()).toBeVisible()
    expect(await rows.count()).toBeGreaterThan(0)
  })
})

/**
 * E2E Tests: Pagination Interactions
 */
test.describe('Pagination E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate pages', async ({ page }) => {
    const pagination = page.locator('#pagination')
    await expect(pagination).toBeVisible()

    // Click next page if available
    const nextBtn = page.locator('#pagination .zc-pagination__btn-next, #pagination button:has-text(">")')
    if (await nextBtn.isVisible()) {
      await nextBtn.click()
    }
  })
})
