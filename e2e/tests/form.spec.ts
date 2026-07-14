import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Form Controls Interactions
 * Covers Input, Switch, Checkbox, Radio
 */
test.describe('Form Controls E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should type into input', async ({ page }) => {
    const input = page.locator('#test-input')
    await expect(input).toBeVisible()
    await input.fill('Hello World')
    await expect(input).toHaveValue('Hello World')
  })

  test('should clear input', async ({ page }) => {
    const input = page.locator('#test-input')
    await input.fill('Test')
    await input.clear()
    await expect(input).toHaveValue('')
  })

  test('should toggle switch', async ({ page }) => {
    const switchEl = page.locator('#test-switch')
    await expect(switchEl).toBeVisible()
    // Click to toggle on
    await switchEl.click()
    // Verify state text updated
    await expect(page.locator('#form-controls')).toContainText('Switch: ON')
    // Click again to toggle off
    await switchEl.click()
    await expect(page.locator('#form-controls')).toContainText('Switch: OFF')
  })

  test('should check/uncheck checkbox', async ({ page }) => {
    const checkbox = page.locator('#form-controls .zc-checkbox').first()
    await expect(checkbox).toBeVisible()
    await checkbox.click()
    await expect(checkbox).toHaveClass(/is-checked/)
  })

  test('should select radio', async ({ page }) => {
    const radio = page.locator('#form-controls .zc-radio').first()
    await expect(radio).toBeVisible()
    await radio.click()
    await expect(radio).toHaveClass(/is-checked/)
  })
})
