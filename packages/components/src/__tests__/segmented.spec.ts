import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import Segmented from '../segmented/segmented.vue'

describe('ZcSegmented', () => {
  // ── Rendering ──────────────────────────────────────────────
  it('renders with zc-segmented class', () => {
    const wrapper = mount(Segmented, {
      props: { options: ['A', 'B', 'C'] },
    })
    expect(wrapper.classes()).toContain('zc-segmented')
  })

  it('renders correct number of items from string options', () => {
    const wrapper = mount(Segmented, {
      props: { options: ['A', 'B', 'C'] },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    expect(items).toHaveLength(3)
  })

  it('renders correct number of items from object options', () => {
    const wrapper = mount(Segmented, {
      props: {
        options: [
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' },
          { label: 'Monthly', value: 'monthly' },
        ],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    expect(items).toHaveLength(3)
    expect(items[0].text()).toContain('Daily')
    expect(items[1].text()).toContain('Weekly')
    expect(items[2].text()).toContain('Monthly')
  })

  it('renders the thumb indicator', () => {
    const wrapper = mount(Segmented, {
      props: { options: ['A', 'B'] },
    })
    expect(wrapper.find('.zc-segmented__thumb').exists()).toBe(true)
  })

  // ── v-model ────────────────────────────────────────────────
  it('marks the correct item as selected based on modelValue', () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'B',
        options: ['A', 'B', 'C'],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    expect(items[0].classes()).not.toContain('is-selected')
    expect(items[1].classes()).toContain('is-selected')
    expect(items[2].classes()).not.toContain('is-selected')
  })

  it('emits update:modelValue when an item is clicked', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'A',
        options: ['A', 'B', 'C'],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    await items[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['B'])
  })

  it('emits change event when value changes', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'A',
        options: ['A', 'B', 'C'],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    await items[2].trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual(['C'])
  })

  it('does not emit when clicking the already selected item', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'A',
        options: ['A', 'B'],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    await items[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(wrapper.emitted('change')).toBeFalsy()
  })

  // ── Disabled ───────────────────────────────────────────────
  it('disables all items when disabled prop is true', () => {
    const wrapper = mount(Segmented, {
      props: {
        disabled: true,
        options: ['A', 'B'],
      },
    })
    expect(wrapper.classes()).toContain('is-disabled')
    const items = wrapper.findAll('.zc-segmented__item')
    expect(items[0].classes()).toContain('is-disabled')
    expect(items[1].classes()).toContain('is-disabled')
  })

  it('does not emit when disabled control is clicked', async () => {
    const wrapper = mount(Segmented, {
      props: {
        disabled: true,
        modelValue: 'A',
        options: ['A', 'B'],
      },
    })
    await wrapper.findAll('.zc-segmented__item')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('disables individual items via option.disabled', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'A',
        options: [
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B', disabled: true },
        ],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    expect(items[1].classes()).toContain('is-disabled')

    await items[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  // ── Size ───────────────────────────────────────────────────
  it('applies size modifier class', () => {
    const wrapper = mount(Segmented, {
      props: { size: 'large', options: ['A', 'B'] },
    })
    expect(wrapper.classes()).toContain('zc-segmented--large')
  })

  it('applies small size modifier class', () => {
    const wrapper = mount(Segmented, {
      props: { size: 'small', options: ['A', 'B'] },
    })
    expect(wrapper.classes()).toContain('zc-segmented--small')
  })

  it('defaults to default size', () => {
    const wrapper = mount(Segmented, {
      props: { options: ['A', 'B'] },
    })
    expect(wrapper.classes()).toContain('zc-segmented--default')
  })

  // ── Block ──────────────────────────────────────────────────
  it('applies is-block class when block prop is true', () => {
    const wrapper = mount(Segmented, {
      props: { block: true, options: ['A', 'B'] },
    })
    expect(wrapper.classes()).toContain('is-block')
  })

  // ── Slots ──────────────────────────────────────────────────
  it('renders custom content via item-{value} slot', () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'list',
        options: [
          { label: 'List', value: 'list' },
          { label: 'Grid', value: 'grid' },
        ],
      },
      slots: {
        'item-list': '<span class="custom-icon">📋</span>',
      },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })

  // ── Accessibility ──────────────────────────────────────────
  it('has role="radiogroup" on container', () => {
    const wrapper = mount(Segmented, {
      props: { options: ['A', 'B'] },
    })
    expect(wrapper.attributes('role')).toBe('radiogroup')
  })

  it('has role="radio" on each item', () => {
    const wrapper = mount(Segmented, {
      props: { options: ['A', 'B'] },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    items.forEach((item) => {
      expect(item.attributes('role')).toBe('radio')
    })
  })

  it('sets aria-checked on the selected item', () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'B',
        options: ['A', 'B', 'C'],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    expect(items[0].attributes('aria-checked')).toBe('false')
    expect(items[1].attributes('aria-checked')).toBe('true')
    expect(items[2].attributes('aria-checked')).toBe('false')
  })

  it('sets aria-disabled on disabled items', () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'A',
        options: [
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B', disabled: true },
        ],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    expect(items[1].attributes('aria-disabled')).toBe('true')
  })

  it('uses roving tabindex - only selected item has tabindex=0', () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'B',
        options: ['A', 'B', 'C'],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    expect(items[0].attributes('tabindex')).toBe('-1')
    expect(items[1].attributes('tabindex')).toBe('0')
    expect(items[2].attributes('tabindex')).toBe('-1')
  })

  // ── Keyboard Navigation ────────────────────────────────────
  it('navigates to next item on ArrowRight', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'A',
        options: ['A', 'B', 'C'],
      },
      attachTo: document.body,
    })
    const items = wrapper.findAll('.zc-segmented__item')
    await items[0].trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['B'])
    wrapper.unmount()
  })

  it('navigates to previous item on ArrowLeft', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'C',
        options: ['A', 'B', 'C'],
      },
      attachTo: document.body,
    })
    const items = wrapper.findAll('.zc-segmented__item')
    await items[2].trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['B'])
    wrapper.unmount()
  })

  it('navigates to first item on Home', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'C',
        options: ['A', 'B', 'C'],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    await items[2].trigger('keydown', { key: 'Home' })

    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['A'])
  })

  it('navigates to last item on End', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'A',
        options: ['A', 'B', 'C'],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    await items[0].trigger('keydown', { key: 'End' })

    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['C'])
  })

  it('selects current item on Enter/Space', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'A',
        options: ['A', 'B'],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    // Enter on already selected does nothing
    await items[0].trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    // Space on non-selected selects it
    await items[1].trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['B'])
  })

  it('skips disabled items when navigating with arrow keys', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'A',
        options: [
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B', disabled: true },
          { label: 'C', value: 'C' },
        ],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    await items[0].trigger('keydown', { key: 'ArrowRight' })

    // Should skip B (disabled) and land on C
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['C'])
  })

  // ── Default slot ───────────────────────────────────────────
  it('renders items from default slot with VNodes carrying value/label props', () => {
    // Create a dummy component that passes value/label props as VNodes
    const DummyItem = defineComponent({
      props: { value: null, label: String, disabled: Boolean },
      render() {
        return h('span', this.label || String(this.value))
      },
    })

    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'list',
      },
      slots: {
        default: () => [
          h(DummyItem, { value: 'list', label: 'List View' }),
          h(DummyItem, { value: 'grid', label: 'Grid View' }),
        ],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toContain('List View')
    expect(items[1].text()).toContain('Grid View')
  })

  // ── Number values ──────────────────────────────────────────
  it('supports number values', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 1,
        options: [
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 },
        ],
      },
    })
    const items = wrapper.findAll('.zc-segmented__item')
    expect(items[0].classes()).toContain('is-selected')

    await items[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([2])
  })

  // ── Form name ──────────────────────────────────────────────
  it('renders hidden radio inputs when name prop is provided', () => {
    const wrapper = mount(Segmented, {
      props: {
        name: 'viewMode',
        modelValue: 'A',
        options: ['A', 'B'],
      },
    })
    const inputs = wrapper.findAll('.zc-segmented__input')
    expect(inputs).toHaveLength(2)
    expect(inputs[0].attributes('name')).toBe('viewMode')
    expect(inputs[0].attributes('checked')).toBeDefined()
  })

  it('does not render hidden inputs when name prop is not provided', () => {
    const wrapper = mount(Segmented, {
      props: { options: ['A', 'B'] },
    })
    expect(wrapper.findAll('.zc-segmented__input')).toHaveLength(0)
  })
})
