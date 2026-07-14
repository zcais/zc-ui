import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import Collapse from '../collapse/collapse.vue'
import CollapseItem from '../collapse/collapse-item.vue'

describe('ZcCollapse', () => {
  it('renders with default props', () => {
    const wrapper = mount(Collapse)
    expect(wrapper.classes()).toContain('zc-collapse')
  })

  it('renders slot content', () => {
    const wrapper = mount(Collapse, {
      slots: { default: '<div class="child">Content</div>' },
    })
    expect(wrapper.find('.child').exists()).toBe(true)
  })

  // ---- v-model (non-accordion) ----
  it('expands item when name matches modelValue', async () => {
    const activeNames = ref(['1'])
    const wrapper = mount(Collapse, {
      props: { modelValue: activeNames.value },
      slots: {
        default: () =>
          [
            { name: '1', title: 'First', content: 'Content 1' },
            { name: '2', title: 'Second', content: 'Content 2' },
          ].map((item) =>
            h(CollapseItem, { name: item.name, title: item.title }, { default: () => item.content })
          ),
      },
    })
    await nextTick()
    const items = wrapper.findAll('.zc-collapse-item')
    expect(items.length).toBe(2)
  })

  it('updates modelValue on item click', async () => {
    const activeNames = ref<Array<string>>([])
    const wrapper = mount(Collapse, {
      props: {
        modelValue: activeNames.value,
        'onUpdate:modelValue': (val: unknown) => {
          activeNames.value = Array.isArray(val) ? val : [String(val)]
        },
      },
      slots: {
        default: () => [
          h(CollapseItem, { name: '1', title: 'First' }, { default: () => 'Content 1' }),
        ],
      },
    })
    await nextTick()
    const header = wrapper.find('.zc-collapse-item__header')
    await header.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  // ---- accordion ----
  it('adds is-accordion class when accordion is true', () => {
    const wrapper = mount(Collapse, { props: { accordion: true } })
    expect(wrapper.classes()).toContain('is-accordion')
  })

  it('does not add is-accordion class by default', () => {
    const wrapper = mount(Collapse)
    expect(wrapper.classes()).not.toContain('is-accordion')
  })
})

describe('ZcCollapseItem', () => {
  function mountItem(props = {}, slots = {}) {
    return mount(CollapseItem, {
      props: { name: '1', title: 'Test', ...props },
      slots,
    })
  }

  it('renders with title prop', () => {
    const wrapper = mountItem({ title: 'My Panel' })
    expect(wrapper.find('.zc-collapse-item__header-title').text()).toBe('My Panel')
  })

  it('renders title slot over title prop', () => {
    const wrapper = mountItem(
      { title: 'Prop Title' },
      { title: '<span class="custom-title">Slot Title</span>' }
    )
    expect(wrapper.find('.custom-title').text()).toBe('Slot Title')
  })

  it('renders default slot content', () => {
    const wrapper = mountItem({}, { default: 'Panel content here' })
    expect(wrapper.find('.zc-collapse-item__content').text()).toContain('Panel content here')
  })

  // ---- disabled ----
  it('adds is-disabled class when disabled', () => {
    const wrapper = mountItem({ disabled: true })
    expect(wrapper.classes()).toContain('is-disabled')
  })

  // ---- active state ----
  it('shows is-active when name is in active names', async () => {
    const wrapper = mount(Collapse, {
      props: { modelValue: ['1'] },
      slots: {
        default: () => h(CollapseItem, { name: '1', title: 'Active' }),
      },
    })
    await nextTick()
    const item = wrapper.find('.zc-collapse-item')
    expect(item.classes()).toContain('is-active')
  })

  // ---- toggle on click ----
  it('toggles active state on header click', async () => {
    let emittedValue: unknown
    const wrapper = mount(Collapse, {
      props: {
        modelValue: [],
        'onUpdate:modelValue': (val: unknown) => {
          emittedValue = val
        },
      },
      slots: {
        default: () => h(CollapseItem, { name: '1', title: 'Toggle Me' }),
      },
    })
    await nextTick()
    const header = wrapper.find('.zc-collapse-item__header')
    await header.trigger('click')
    expect(emittedValue).toEqual(['1'])
  })

  // ---- disabled item does not toggle ----
  it('does not toggle when disabled', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: [],
        'onUpdate:modelValue': () => {},
      },
      slots: {
        default: () => h(CollapseItem, { name: '1', title: 'Disabled', disabled: true }),
      },
    })
    await nextTick()
    const header = wrapper.find('.zc-collapse-item__header')
    await header.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  // ---- item-click event ----
  it('emits item-click event', async () => {
    const wrapper = mount(CollapseItem, {
      props: { name: '1', title: 'Click' },
    })
    await wrapper.find('.zc-collapse-item__header').trigger('click')
    expect(wrapper.emitted('item-click')).toBeTruthy()
    expect(wrapper.emitted('item-click')![0]).toEqual(['1'])
  })

  // ---- aria-expanded ----
  it('has proper aria attributes', () => {
    const wrapper = mountItem({ name: '1' })
    const header = wrapper.find('.zc-collapse-item__header')
    expect(header.attributes('role')).toBe('tab')
    expect(header.attributes('aria-expanded')).toBe('false')
    expect(header.attributes('tabindex')).toBe('0')
  })

  it('sets tabindex to -1 when disabled', () => {
    const wrapper = mountItem({ disabled: true })
    const header = wrapper.find('.zc-collapse-item__header')
    expect(header.attributes('tabindex')).toBe('-1')
  })

  // ---- keyboard navigation ----
  it('toggles on enter key', async () => {
    let emittedValue: unknown
    const wrapper = mount(Collapse, {
      props: {
        modelValue: [],
        'onUpdate:modelValue': (val: unknown) => {
          emittedValue = val
        },
      },
      slots: {
        default: () => h(CollapseItem, { name: '1', title: 'Keyboard' }),
      },
    })
    await nextTick()
    const header = wrapper.find('.zc-collapse-item__header')
    await header.trigger('keydown.enter')
    expect(emittedValue).toEqual(['1'])
  })

  // ---- accordion mode toggle ----
  it('replaces active in accordion mode (only one open)', async () => {
    const emitted: unknown[] = []
    const wrapper = mount(Collapse, {
      props: {
        modelValue: '1',
        accordion: true,
        'onUpdate:modelValue': (val: unknown) => {
          emitted.push(val)
        },
      },
      slots: {
        default: () => [
          h(CollapseItem, { name: '1', title: 'First' }, { default: () => 'A' }),
          h(CollapseItem, { name: '2', title: 'Second' }, { default: () => 'B' }),
        ],
      },
    })
    await nextTick()
    const headers = wrapper.findAll('.zc-collapse-item__header')
    // Click second item
    await headers[1].trigger('click')
    // In accordion mode, should emit single value (not array)
    expect(emitted.length).toBeGreaterThan(0)
    expect(emitted[emitted.length - 1]).toBe('2')
  })
})

// Helper
import { h } from 'vue'
