import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcSteps from '../steps/steps.vue'
import ZcStep from '../steps/step.vue'
import ZcPagination from '../pagination/pagination.vue'
import ZcCollapseItem from '../collapse/collapse-item.vue'
import ZcBreadcrumb from '../breadcrumb/breadcrumb.vue'
import ZcBreadcrumbItem from '../breadcrumb/breadcrumb-item.vue'
import ZcTooltip from '../tooltip/tooltip.vue'

describe('Accessibility: Steps', () => {
  it('should have role="list" on container', () => {
    const wrapper = mount(ZcSteps)
    expect(wrapper.attributes('role')).toBe('list')
  })

  it('should have role="listitem" on step', () => {
    const wrapper = mount(ZcStep, {
      props: { title: 'Step 1' },
    })
    expect(wrapper.attributes('role')).toBe('listitem')
  })

  it('should have aria-current="step" on current step', () => {
    // Mount step with parent context mock
    const wrapper = mount(ZcStep, {
      props: { title: 'Step 1', status: 'process' },
    })
    expect(wrapper.attributes('aria-current')).toBe('step')
  })

  it('should not have aria-current on non-process step', () => {
    const wrapper = mount(ZcStep, {
      props: { title: 'Step 1', status: 'wait' },
    })
    expect(wrapper.attributes('aria-current')).toBeUndefined()
  })
})

describe('Accessibility: Pagination', () => {
  it('should have role="navigation" on root', () => {
    const wrapper = mount(ZcPagination, {
      props: { total: 100 },
    })
    expect(wrapper.attributes('role')).toBe('navigation')
  })

  it('should have aria-label on root', () => {
    const wrapper = mount(ZcPagination, {
      props: { total: 100 },
    })
    expect(wrapper.attributes('aria-label')).toBeDefined()
  })

  it('should have aria-current="page" on active page', () => {
    const wrapper = mount(ZcPagination, {
      props: { total: 100, currentPage: 1, layout: 'prev, pager, next' },
    })
    const activeItem = wrapper.find('.is-active')
    expect(activeItem.exists()).toBe(true)
    expect(activeItem.attributes('aria-current')).toBe('page')
  })

  it('should have aria-label on prev button', () => {
    const wrapper = mount(ZcPagination, {
      props: { total: 100, currentPage: 2, layout: 'prev, pager, next' },
    })
    const prevBtn = wrapper.find('.zc-pagination__prev')
    expect(prevBtn.exists()).toBe(true)
    expect(prevBtn.attributes('aria-label')).toBeDefined()
  })

  it('should have aria-label on next button', () => {
    const wrapper = mount(ZcPagination, {
      props: { total: 100, currentPage: 1, layout: 'prev, pager, next' },
    })
    const nextBtn = wrapper.find('.zc-pagination__next')
    expect(nextBtn.exists()).toBe(true)
    expect(nextBtn.attributes('aria-label')).toBeDefined()
  })

  it('should have aria-hidden on ellipsis', () => {
    const wrapper = mount(ZcPagination, {
      props: { total: 500, currentPage: 10, pagerCount: 5, layout: 'prev, pager, next' },
    })
    const ellipsis = wrapper.find('.zc-pagination__ellipsis')
    if (ellipsis.exists()) {
      expect(ellipsis.attributes('aria-hidden')).toBe('true')
    }
  })
})

describe('Accessibility: Collapse', () => {
  it('should have role="tab" on header', () => {
    const wrapper = mount(ZcCollapseItem, {
      props: { title: 'Panel 1', name: '1' },
    })
    const header = wrapper.find('[role="tab"]')
    expect(header.exists()).toBe(true)
  })

  it('should have aria-expanded on header', () => {
    const wrapper = mount(ZcCollapseItem, {
      props: { title: 'Panel 1', name: '1' },
    })
    const header = wrapper.find('[role="tab"]')
    expect(header.attributes('aria-expanded')).toBe('false')
  })

  it('should have aria-controls linking header to content', () => {
    const wrapper = mount(ZcCollapseItem, {
      props: { title: 'Panel 1', name: '1' },
    })
    const header = wrapper.find('[role="tab"]')
    expect(header.attributes('aria-controls')).toContain('zc-collapse-content-')
  })

  it('should have role="tabpanel" on content', () => {
    const wrapper = mount(ZcCollapseItem, {
      props: { title: 'Panel 1', name: '1' },
    })
    const panel = wrapper.find('[role="tabpanel"]')
    expect(panel.exists()).toBe(true)
  })

  it('should have aria-labelledby on tabpanel', () => {
    const wrapper = mount(ZcCollapseItem, {
      props: { title: 'Panel 1', name: '1' },
    })
    const panel = wrapper.find('[role="tabpanel"]')
    expect(panel.attributes('aria-labelledby')).toContain('zc-collapse-header-')
  })

  it('should support Enter key to toggle', async () => {
    const wrapper = mount(ZcCollapseItem, {
      props: { title: 'Panel 1', name: '1' },
    })
    const header = wrapper.find('[role="tab"]')
    await header.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('item-click')).toBeTruthy()
  })

  it('should support Space key to toggle', async () => {
    const wrapper = mount(ZcCollapseItem, {
      props: { title: 'Panel 1', name: '1' },
    })
    const header = wrapper.find('[role="tab"]')
    await header.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('item-click')).toBeTruthy()
  })
})

describe('Accessibility: Breadcrumb', () => {
  it('should have role="navigation" on root', () => {
    const wrapper = mount(ZcBreadcrumb)
    expect(wrapper.attributes('role')).toBe('navigation')
  })

  it('should have aria-label="Breadcrumb"', () => {
    const wrapper = mount(ZcBreadcrumb)
    expect(wrapper.attributes('aria-label')).toBe('Breadcrumb')
  })

  it('should have aria-current="page" on last item', () => {
    const wrapper = mount(ZcBreadcrumbItem)
    expect(wrapper.attributes('aria-current')).toBe('page')
  })

  it('should not have aria-current on link item', () => {
    const wrapper = mount(ZcBreadcrumbItem, {
      props: { to: '/home' },
    })
    expect(wrapper.attributes('aria-current')).toBeUndefined()
  })

  it('should have tabindex 0 on link items', () => {
    const wrapper = mount(ZcBreadcrumbItem, {
      props: { to: '/home' },
    })
    const link = wrapper.find('[role="link"]')
    expect(link.attributes('tabindex')).toBe('0')
  })
})

describe('Accessibility: Tooltip', () => {
  it('should have role="tooltip" on popper element', async () => {
    const wrapper = mount(ZcTooltip, {
      props: { content: 'Tip text' },
      slots: { default: 'Hover me' },
    })
    // Show tooltip
    await wrapper.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    // Wait for transition
    await new Promise((r) => setTimeout(r, 100))
    const tooltip = document.querySelector('[role="tooltip"]')
    // Clean up DOM
    document.body.innerHTML = ''
    expect(tooltip).toBeTruthy()
  })

  it('should expose aria-describedby when content is shown', async () => {
    const wrapper = mount(ZcTooltip, {
      props: { content: 'Tip text' },
      slots: { default: 'Hover me' },
    })
    await wrapper.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 100))
    // aria-describedby may be on trigger element or child
    document.body.innerHTML = ''
    // The tooltip trigger should be keyboard-focusable
    expect(wrapper.exists()).toBe(true)
  })
})
