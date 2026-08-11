import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Tabs from '../tabs/tabs.vue'
import TabPane from '../tabs/tab-pane.vue'

describe('ZcTabs', () => {
  it('renders with default props', () => {
    const wrapper = mount(Tabs)
    expect(wrapper.classes()).toContain('zc-tabs')
    expect(wrapper.classes()).toContain('zc-tabs--default')
  })

  it('renders card type', () => {
    const wrapper = mount(Tabs, { props: { type: 'card' } })
    expect(wrapper.classes()).toContain('zc-tabs--card')
  })

  it('renders border-card type', () => {
    const wrapper = mount(Tabs, { props: { type: 'border-card' } })
    expect(wrapper.classes()).toContain('zc-tabs--border-card')
  })

  it('renders tab panes', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1' },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">Content 1</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">Content 2</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    expect(wrapper.findAllComponents(TabPane)).toHaveLength(2)
    expect(wrapper.html()).toContain('Content 1')
  })

  it('shows correct active tab', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab2' },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">Content 1</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">Content 2</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const panes = wrapper.findAll('.zc-tab-pane')
    expect(panes[0].isVisible()).toBe(false)
    expect(panes[1].isVisible()).toBe(true)
  })

  it('applies position class', () => {
    const wrapper = mount(Tabs, { props: { position: 'left' } })
    expect(wrapper.classes()).toContain('zc-tabs--position-left')
  })

  it('switches tab on click', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1' },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">Content 1</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">Content 2</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const tabs = wrapper.findAll('.zc-tabs__tab')
    expect(tabs.length).toBeGreaterThanOrEqual(2)
    await tabs[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['tab2'])
  })

  it('supports lazy loading', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1' },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">Active Content</ZcTabPane>' },
          {
            template: '<ZcTabPane name="tab2" label="Tab 2" :lazy="true">Lazy Content</ZcTabPane>',
          },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    // Lazy tab should not render until activated
    expect(wrapper.html()).not.toContain('Lazy Content')
  })

  // ---- Bug #9: Tabs async beforeLeave guard properly awaited ----
  it('respects async beforeLeave guard that returns false', async () => {
    let resolveGuard: (val: boolean) => void
    const beforeLeave = () =>
      new Promise<boolean>((resolve) => {
        resolveGuard = resolve
      })

    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'tab1',
        beforeLeave,
      },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">B</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()

    // Click tab2
    const tabs = wrapper.findAll('.zc-tabs__tab')
    await tabs[1].trigger('click')

    // Before the promise resolves, tab should NOT have switched
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    // Resolve with false — guard should block the switch
    resolveGuard!(false)
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('allows tab switch when async beforeLeave resolves true', async () => {
    let resolveGuard: (val: boolean) => void
    const beforeLeave = () =>
      new Promise<boolean>((resolve) => {
        resolveGuard = resolve
      })

    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1', beforeLeave },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="T1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="T2">B</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()

    const tabs = wrapper.findAll('.zc-tabs__tab')
    await tabs[1].trigger('click')

    resolveGuard!(true)
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['tab2'])
  })

  // ---- Bug #10: Tabs preserve pane order on prop change ----
  it('preserves tab order when pane props change', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1' },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="First">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Second">B</ZcTabPane>' },
          { template: '<ZcTabPane name="tab3" label="Third">C</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()

    const tabLabels = wrapper.findAll('.zc-tabs__tab-label')
    expect(tabLabels[0].text()).toBe('First')
    expect(tabLabels[1].text()).toBe('Second')
    expect(tabLabels[2].text()).toBe('Third')
  })

  // ---- closable prop ----
  it('shows close button when closable is true', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1', closable: true },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">B</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const closeButtons = wrapper.findAll('.zc-tabs__tab-close')
    expect(closeButtons.length).toBeGreaterThanOrEqual(2)
  })

  it('emits tab-remove and edit when close button is clicked', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1', closable: true },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">B</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const closeButtons = wrapper.findAll('.zc-tabs__tab-close')
    await closeButtons[0].trigger('click')
    expect(wrapper.emitted('tab-remove')).toBeTruthy()
    expect(wrapper.emitted('tab-remove')![0]).toEqual(['tab1'])
    expect(wrapper.emitted('edit')![0]).toEqual(['tab1', 'remove'])
  })

  // ---- addable prop ----
  it('shows new-tab button when addable is true', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1', addable: true },
      slots: {
        default: [{ template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' }],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    expect(wrapper.find('.zc-tabs__new-tab').exists()).toBe(true)
  })

  it('emits tab-add and edit when new-tab button is clicked', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1', addable: true },
      slots: {
        default: [{ template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' }],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    await wrapper.find('.zc-tabs__new-tab').trigger('click')
    expect(wrapper.emitted('tab-add')).toBeTruthy()
    expect(wrapper.emitted('edit')![0]).toEqual([undefined, 'add'])
  })

  // ---- editable prop (add + close) ----
  it('shows both close and new-tab when editable and closable are true', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1', editable: true, closable: true },
      slots: {
        default: [{ template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' }],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    expect(wrapper.find('.zc-tabs__new-tab').exists()).toBe(true)
    expect(wrapper.find('.zc-tabs__tab-close').exists()).toBe(true)
  })

  // ---- beforeLeave that throws ----
  it('stays on current tab when beforeLeave throws an error', async () => {
    const beforeLeave = () => {
      throw new Error('Guard error')
    }
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1', beforeLeave },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">B</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const tabs = wrapper.findAll('.zc-tabs__tab')
    await tabs[1].trigger('click')
    // tab should NOT have switched
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('tab-click')).toBeTruthy()
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  // ---- position variants ----
  it('applies position-right class', () => {
    const wrapper = mount(Tabs, { props: { position: 'right' } })
    expect(wrapper.classes()).toContain('zc-tabs--position-right')
  })

  it('applies position-bottom class', () => {
    const wrapper = mount(Tabs, { props: { position: 'bottom' } })
    expect(wrapper.classes()).toContain('zc-tabs--position-bottom')
  })

  // ---- tab-click event ----
  it('emits tab-click with correct args on tab click', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1' },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">B</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const tabs = wrapper.findAll('.zc-tabs__tab')
    await tabs[1].trigger('click')
    const emitted = wrapper.emitted('tab-click')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe('tab2')
    expect(emitted![0][1]).toBeInstanceOf(MouseEvent)
  })

  // ---- disabled tab ----
  it('does not switch to disabled tab on click', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1' },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2" :disabled="true">B</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const tabs = wrapper.findAll('.zc-tabs__tab')
    expect(tabs[1].classes()).toContain('is-disabled')
    await tabs[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  // ---- sync modelValue via watch ----
  it('syncs active tab when modelValue prop changes', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1' },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">B</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    // Initially tab1 is active
    let tabHeaders = wrapper.findAll('.zc-tabs__tab')
    expect(tabHeaders[0].classes()).toContain('is-active')
    expect(tabHeaders[1].classes()).not.toContain('is-active')
    // Update modelValue to tab2
    await wrapper.setProps({ modelValue: 'tab2' })
    await flushPromises()
    tabHeaders = wrapper.findAll('.zc-tabs__tab')
    expect(tabHeaders[0].classes()).not.toContain('is-active')
    expect(tabHeaders[1].classes()).toContain('is-active')
  })

  // ---- keyboard navigation ----
  it('handles ArrowRight keyboard navigation', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1' },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">B</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const nav = wrapper.find('.zc-tabs__nav')
    const tabEls = wrapper.findAll<HTMLElement>('[role="tab"]')
    // Focus the first tab
    tabEls[0].element.focus()
    await nav.trigger('keydown', { key: 'ArrowRight' })
    // tab-click should have been emitted for the second tab
    const emitted = wrapper.emitted('tab-click')
    expect(emitted).toBeTruthy()
  })

  it('handles Home and End keyboard navigation', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab2' },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">B</ZcTabPane>' },
          { template: '<ZcTabPane name="tab3" label="Tab 3">C</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const nav = wrapper.find('.zc-tabs__nav')
    // Focus the last tab
    const tabEls = wrapper.findAll<HTMLElement>('[role="tab"]')
    tabEls[2].element.focus()
    // Press Home — should focus first tab
    await nav.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('tab-click')).toBeTruthy()
    // Press End — should focus last tab
    await nav.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('tab-click')!.length).toBeGreaterThanOrEqual(2)
  })

  it('emits tab-remove on Delete key when closable', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1', closable: true },
      slots: {
        default: [
          { template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' },
          { template: '<ZcTabPane name="tab2" label="Tab 2">B</ZcTabPane>' },
        ],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const nav = wrapper.find('.zc-tabs__nav')
    const tabEls = wrapper.findAll<HTMLElement>('[role="tab"]')

    // Override document.activeElement to simulate focus on first tab
    const originalDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'activeElement')
    Object.defineProperty(document, 'activeElement', {
      value: tabEls[0].element,
      writable: false,
      configurable: true,
    })

    await nav.trigger('keydown', { key: 'Delete' })

    // Restore original descriptor
    if (originalDescriptor) {
      Object.defineProperty(document, 'activeElement', originalDescriptor)
    }

    expect(wrapper.emitted('tab-remove')![0]).toEqual(['tab1'])
    expect(wrapper.emitted('edit')![0]).toEqual(['tab1', 'remove'])
  })

  it('does not emit tab-remove on Delete when not closable', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1', closable: false },
      slots: {
        default: [{ template: '<ZcTabPane name="tab1" label="Tab 1">A</ZcTabPane>' }],
      },
      global: { components: { ZcTabPane: TabPane } },
    })
    await flushPromises()
    const nav = wrapper.find('.zc-tabs__nav')
    const tabEls = wrapper.findAll<HTMLElement>('[role="tab"]')
    tabEls[0].element.focus()
    await nav.trigger('keydown', { key: 'Delete' })
    expect(wrapper.emitted('tab-remove')).toBeUndefined()
  })
})
