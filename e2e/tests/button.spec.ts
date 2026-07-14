import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Button Component Interactions
 * Covers click, type variants, disabled state
 */
test.describe('Button E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should render all button variants', async ({ page }) => {
    await expect(page.locator('#btn-default')).toBeVisible()
    await expect(page.locator('#btn-primary')).toBeVisible()
    await expect(page.locator('#btn-success')).toBeVisible()
    await expect(page.locator('#btn-warning')).toBeVisible()
    await expect(page.locator('#btn-danger')).toBeVisible()
  })

  test('should be clickable', async ({ page }) => {
    const btn = page.locator('#open-dialog')
    await expect(btn).toBeVisible()
    await btn.click()
    // Dialog should appear
    await expect(page.locator('.zc-dialog')).toBeVisible()
    await expect(page.locator('.zc-dialog__title')).toHaveText('Test Dialog')
  })

  test('disabled button should not be clickable', async ({ page }) => {
    const btn = page.locator('#btn-disabled')
    await expect(btn).toBeDisabled()
  })

  test('should trigger message on click', async ({ page }) => {
    await page.locator('#msg-success').click()
    // Message should appear in DOM
    await expect(page.locator('.zc-message')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.zc-message__content')).toContainText('success')
  })
})
