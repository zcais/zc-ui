import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeSelect from '../tree-select/tree-select.vue'

const mockData = [
  {
    value: 'root1',
    label: 'Node 1',
    children: [
      {
        value: 'child1-1',
        label: 'Child 1-1',
        children: [
          { value: 'leaf1-1-1', label: 'Leaf 1-1-1' },
          { value: 'leaf1-1-2', label: 'Leaf 1-1-2' },
        ],
      },
      { value: 'child1-2', label: 'Child 1-2' },
    ],
  },
  {
    value: 'root2',
    label: 'Node 2',
    children: [{ value: 'child2-1', label: 'Child 2-1' }],
  },
]

describe('ZcTreeSelect', () => {
  it('renders with default props', () => {
    const wrapper = mount(TreeSelect)
    expect(wrapper.find('.zc-tree-select').exists()).toBe(true)
    expect(wrapper.find('.zc-tree-select__wrapper').exists()).toBe(true)
  })

  it('applies size class', () => {
    const wrapper = mount(TreeSelect, { props: { size: 'large' } })
    expect(wrapper.find('.zc-tree-select').classes()).toContain('zc-tree-select--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(TreeSelect, { props: { size: 'small' } })
    expect(wrapper.find('.zc-tree-select').classes()).toContain('zc-tree-select--small')
  })

  it('applies disabled class', () => {
    const wrapper = mount(TreeSelect, { props: { disabled: true } })
    expect(wrapper.find('.zc-tree-select').classes()).toContain('is-disabled')
  })

  it('shows placeholder when no value', () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, placeholder: 'Select node' },
    })
    expect(wrapper.find('.zc-tree-select__display').text()).toBe('Select node')
    expect(wrapper.find('.zc-tree-select__display').classes()).toContain('is-placeholder')
  })

  it('displays selected value label', () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, modelValue: 'child1-1' },
    })
    expect(wrapper.find('.zc-tree-select__display').text()).toBe('Child 1-1')
  })

  it('opens dropdown on click', async () => {
    const wrapper = mount(TreeSelect, { props: { data: mockData } })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    expect(wrapper.find('.zc-tree-select__dropdown').exists()).toBe(true)
  })

  it('applies focused and open class when visible', async () => {
    const wrapper = mount(TreeSelect, { props: { data: mockData } })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    expect(wrapper.find('.zc-tree-select').classes()).toContain('is-focused')
    expect(wrapper.find('.zc-tree-select').classes()).toContain('is-open')
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(TreeSelect, { props: { data: mockData, disabled: true } })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    expect(wrapper.find('.zc-tree-select').classes()).not.toContain('is-open')
  })

  it('renders tree nodes when open', async () => {
    const wrapper = mount(TreeSelect, { props: { data: mockData } })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    const nodes = wrapper.findAll('.zc-tree-select__node')
    // Should have at least root nodes
    expect(nodes.length).toBeGreaterThanOrEqual(2)
  })

  it('shows search input when filterable', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, filterable: true },
    })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    expect(wrapper.find('.zc-tree-select__search').exists()).toBe(true)
  })

  it('shows clear button when clearable and has value', () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, modelValue: 'child1-1', clearable: true },
    })
    expect(wrapper.find('.zc-tree-select__clear').exists()).toBe(true)
  })

  it('does not show clear button when no value', () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, clearable: true },
    })
    expect(wrapper.find('.zc-tree-select__clear').exists()).toBe(false)
  })

  it('emits change on clear', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, modelValue: 'child1-1', clearable: true },
    })
    await wrapper.find('.zc-tree-select__clear').trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([undefined])
  })

  it('shows tags in multiple mode', () => {
    const wrapper = mount(TreeSelect, {
      props: {
        data: mockData,
        modelValue: ['child1-1', 'child1-2'],
        multiple: true,
      },
    })
    const tags = wrapper.findAll('.zc-tree-select__tag')
    expect(tags.length).toBe(2)
  })

  it('renders arrow icon', () => {
    const wrapper = mount(TreeSelect)
    expect(wrapper.find('.zc-tree-select__arrow').exists()).toBe(true)
  })

  it('applies arrow reverse class when open', async () => {
    const wrapper = mount(TreeSelect, { props: { data: mockData } })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    expect(wrapper.find('.zc-tree-select__arrow').classes()).toContain('is-reverse')
  })

  it('shows empty state when no data', async () => {
    const wrapper = mount(TreeSelect, { props: { data: [] } })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    expect(wrapper.find('.zc-tree-select__empty').exists()).toBe(true)
  })
})
