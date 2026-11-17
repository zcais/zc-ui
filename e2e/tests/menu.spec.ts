import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Menu collapse-mode icon rendering
 *
 * Regression guard for a CSS bug where the collapsed-menu rules (scoped,
 * wrong BEM class `zc-menu-item` instead of `zc-menu__item`, no :deep())
 * never matched the slotted item components: text stayed visible and flex
 * shrank the 18px icons to 0 width — the menu showed text, not icons.
 */
test.describe('Menu collapse E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('collapsed menu shows span-wrapped icons, hides text, stays centered', async ({ page }) => {
    const menu = page.locator('#menu-collapsed')
    await expect(menu).toBeVisible()
    await expect(menu).toHaveClass(/is-collapse/)

    // Menu collapsed to the icon rail width
    await expect
      .poll(async () => menu.evaluate((el) => el.getBoundingClientRect().width))
      .toBeLessThanOrEqual(64)

    // Icons (span-wrapped, like ZcIconName) survive the collapse CSS
    for (const id of ['menu-icon-home', 'menu-icon-star']) {
      const icon = page.locator(`#${id}`)
      await expect(icon).toBeVisible()
      await expect
        .poll(async () => icon.evaluate((el) => el.getBoundingClientRect().width))
        .toBeGreaterThanOrEqual(18)
    }

    // Text labels are hidden
    const labels = menu.locator('.menu-item-label')
    await expect(labels).toHaveCount(2)
    for (const label of await labels.all()) {
      await expect(label).toBeHidden()
    }

    // The plain item icon is horizontally centered in the 64px rail
    const homeIcon = page.locator('#menu-icon-home')
    const centered = await homeIcon.evaluate((el) => {
      const li = el.closest('li')
      if (!li) return false
      const er = el.getBoundingClientRect()
      const lr = li.getBoundingClientRect()
      return Math.abs(er.left + er.width / 2 - (lr.left + lr.width / 2)) < 2
    })
    expect(centered).toBe(true)

    // Submenu title icon is centered too, and aligned with the plain item icon
    // (regression: arrow's margin-left:auto pushed the star icon to the left)
    const starIcon = page.locator('#menu-icon-star')
    const [starCentered, iconsAligned] = await starIcon.evaluate((el) => {
      const li = el.closest('li')
      if (!li) return [false, false]
      const er = el.getBoundingClientRect()
      const lr = li.getBoundingClientRect()
      const home = document.getElementById('menu-icon-home')
      const hr = home?.getBoundingClientRect()
      return [
        Math.abs(er.left + er.width / 2 - (lr.left + lr.width / 2)) < 2,
        hr ? Math.abs(er.left - hr.left) < 2 : false,
      ]
    })
    expect(starCentered).toBe(true)
    expect(iconsAligned).toBe(true)

    // The expand arrow is hidden in collapsed mode (it belongs to the expanded
    // layout where it sits at the title's right edge)
    const title = menu.locator('.zc-submenu__title').first()
    await expect(title.locator('.zc-submenu__icon-arrow')).toBeHidden()
  })
})

test.describe('Menu inline submenu E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  /**
   * Regression guard for the "detached card" bug: inline (vertical, expanded)
   * submenu children rendered as a floating card — border, shadow, radius,
   * opaque white background and a content-box min-width that poked past the
   * 200px sidebar edge. They must flatten into the sidebar and indent by
   * nesting depth instead.
   */
  test('inline submenu children flatten into the sidebar and indent', async ({ page }) => {
    const menu = page.locator('#menu-expanded')
    await expect(menu).toBeVisible()

    // Open the submenu, then the nested one
    const titles = menu.locator('.zc-submenu__title')
    await titles.nth(0).click()
    await titles.nth(1).click()
    const children = menu.locator('.zc-submenu__children')
    await expect(children.first()).toBeVisible()

    // Inline children carry no card chrome…
    const chrome = await children.first().evaluate((ul) => {
      const cs = getComputedStyle(ul)
      return {
        border: cs.borderTopWidth,
        shadow: cs.boxShadow,
        radius: cs.borderTopLeftRadius,
        bg: cs.backgroundColor,
      }
    })
    expect(chrome.border).toBe('0px')
    expect(chrome.shadow).toBe('none')
    expect(chrome.radius).toBe('0px')
    expect(chrome.bg).toBe('rgba(0, 0, 0, 0)')

    // …and never overflow the sidebar
    const metrics = await children.first().evaluate((ul) => {
      const menuRect = (ul.closest('.zc-menu') as HTMLElement).getBoundingClientRect()
      return { overflow: ul.getBoundingClientRect().right - menuRect.right }
    })
    expect(metrics.overflow).toBeLessThanOrEqual(0.5)

    // Child items indent one 20px step deeper than the parent title. The <li>
    // boxes span the full sidebar width, so indentation is measured from the
    // text start (Range over contents), not the box edge.
    const indents = await menu.evaluate((root) => {
      const textLeft = (el: Element) => {
        const range = document.createRange()
        range.selectNodeContents(el)
        return range.getBoundingClientRect().left
      }
      const menuLeft = root.getBoundingClientRect().left
      const title = root.querySelectorAll('.zc-submenu__title')[0]
      const item21 = [...root.querySelectorAll('.zc-menu__item')].find((el) =>
        el.textContent?.includes('用户管理')
      )
      const titleOfNested = root.querySelectorAll('.zc-submenu__title')[1]
      const item221 = [...root.querySelectorAll('.zc-menu__item')].find((el) =>
        el.textContent?.includes('登录日志')
      )
      return {
        childVsParent: textLeft(item21!) - textLeft(title),
        level2VsMenu: textLeft(item221!) - menuLeft,
        parentVsMenu: textLeft(titleOfNested) - menuLeft,
      }
    })
    expect(Math.round(indents.childVsParent)).toBe(20)
    // …nested level-2 children indent two steps from the sidebar edge
    expect(Math.round(indents.level2VsMenu)).toBe(60)
    expect(Math.round(indents.parentVsMenu)).toBe(40)
  })
})

test.describe('Menu click-trigger popup E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  /**
   * Regression guard for the overlapping-popups bug: in click-trigger
   * horizontal menus, opening the second submenu left the first popup open,
   * so both panels rendered at once and visually overlapped.
   */
  test('opening one popup closes the sibling popup', async ({ page }) => {
    const menu = page.locator('#menu-horiz-click')
    await expect(menu).toBeVisible()

    const titles = menu.locator('.zc-submenu__title')
    const popups = menu.locator('.zc-submenu__children--popup')

    // Open the first submenu
    await titles.nth(0).click()
    await expect(popups.first()).toBeVisible()
    expect(await popups.count()).toBeGreaterThanOrEqual(1)

    // Opening the sibling must close the first popup — only one stays open
    await titles.nth(1).click()
    await expect.poll(async () => menu.locator('.zc-submenu.is-opened').count()).toBe(1)
    const openedTitle = await menu.locator('.zc-submenu.is-opened .zc-submenu__title').textContent()
    expect(openedTitle).toContain('文档')

    // The closed panel is hidden (v-show) even mid-transition-leave
    const firstPopup = menu.locator('.zc-submenu').nth(0).locator('.zc-submenu__children--popup')
    const secondPopup = menu.locator('.zc-submenu').nth(1).locator('.zc-submenu__children--popup')
    await expect(firstPopup).toBeHidden()
    await expect(secondPopup).toBeVisible()
    expect(await secondPopup.textContent()).toContain('快速上手')
  })
})

test.describe('Menu custom dark colors E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  /**
   * Regression guard for the dark-sidebar bug: text-color was only applied
   * to menu items (inline style), never to submenu titles, so titles kept
   * the light-theme #303133 and vanished on dark backgrounds. Colors are
   * now delegated through menu-root CSS variables that both nodes consume.
   */
  test('submenu titles inherit text-color/active-text-color on a dark sidebar', async ({
    page,
  }) => {
    const menu = page.locator('#menu-dark')
    await expect(menu).toBeVisible()

    const title = menu.locator('.zc-submenu__title')
    const item = menu.locator('.zc-menu__item').first()
    const activeItem = menu.locator('.zc-menu__item.is-active')

    // All labels — including the submenu title — resolve to text-color
    await expect(title).toHaveCSS('color', 'rgb(191, 203, 217)')
    await expect(item).toHaveCSS('color', 'rgb(191, 203, 217)')
    // The active item (2-1 用户管理) uses active-text-color
    await expect(activeItem).toHaveCSS('color', 'rgb(64, 158, 255)')
    // Submenu title of the active path is NOT highlighted (EP parity: only
    // the item itself + horizontal titles), it stays on text-color
    // …hover keeps the menu dark instead of flashing the light hover gray
    await title.hover()
    await expect(title).toHaveCSS('background-color', 'rgb(25, 36, 49)')
  })
})
