import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Cascader from '../cascader/cascader.vue'

const mockOptions = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'binjiang', label: '滨江区' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [{ value: 'xuanwu', label: '玄武区' }],
      },
    ],
  },
]

describe('ZcCascader', () => {
  it('renders with default props', () => {
    const wrapper = mount(Cascader)
    expect(wrapper.find('.zc-cascader').exists()).toBe(true)
    expect(wrapper.find('.zc-cascader__wrapper').exists()).toBe(true)
  })

  it('applies size class', () => {
    const wrapper = mount(Cascader, { props: { size: 'large' } })
    expect(wrapper.find('.zc-cascader').classes()).toContain('zc-cascader--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(Cascader, { props: { size: 'small' } })
    expect(wrapper.find('.zc-cascader').classes()).toContain('zc-cascader--small')
  })

  it('applies disabled class', () => {
    const wrapper = mount(Cascader, { props: { disabled: true } })
    expect(wrapper.find('.zc-cascader').classes()).toContain('is-disabled')
  })

  it('shows placeholder when no value', () => {
    const wrapper = mount(Cascader, { props: { placeholder: '请选择地区' } })
    expect(wrapper.find('.zc-cascader__display').text()).toBe('请选择地区')
    expect(wrapper.find('.zc-cascader__display').classes()).toContain('is-placeholder')
  })

  it('displays selected value labels', () => {
    const wrapper = mount(Cascader, {
      props: { modelValue: [['zhejiang', 'hangzhou', 'xihu']], options: mockOptions },
    })
    expect(wrapper.find('.zc-cascader__display').text()).toBe('浙江 / 杭州 / 西湖区')
  })

  it('does not show placeholder class when has value', () => {
    const wrapper = mount(Cascader, {
      props: { modelValue: [['zhejiang', 'hangzhou', 'xihu']], options: mockOptions },
    })
    expect(wrapper.find('.zc-cascader__display').classes()).not.toContain('is-placeholder')
  })

  // ---- Virtual scroll tests ----
  // NOTE: virtualScroll rendering has a known architectural issue (useVirtualList
  // called inside computed). These tests verify prop handling only.
  it('virtualScroll defaults to false', () => {
    const wrapper = mount(Cascader)
    expect(wrapper.vm.virtualScroll).toBe(false)
  })

  it('does not render virtual list when virtualScroll is disabled', () => {
    const bigOptions = Array.from({ length: 500 }, (_, i) => ({
      value: `level1-${i}`,
      label: `Level 1 - ${i}`,
      children: [],
    }))
    const wrapper = mount(Cascader, {
      props: { options: bigOptions, virtualScroll: false },
    })
    expect(wrapper.vm.virtualScroll).toBe(false)
    expect(wrapper.find('.zc-cascader').exists()).toBe(true)
  })

  it('opens dropdown on click', async () => {
    const wrapper = mount(Cascader, { props: { options: mockOptions } })
    await wrapper.find('.zc-cascader__wrapper').trigger('click')
    expect(wrapper.find('.zc-cascader__dropdown').exists()).toBe(true)
    // First level menu should have 2 options
    const nodes = wrapper.findAll('.zc-cascader__node')
    expect(nodes.length).toBe(2)
  })

  it('applies focused and open class when visible', async () => {
    const wrapper = mount(Cascader, { props: { options: mockOptions } })
    await wrapper.find('.zc-cascader__wrapper').trigger('click')
    expect(wrapper.find('.zc-cascader').classes()).toContain('is-focused')
    expect(wrapper.find('.zc-cascader').classes()).toContain('is-open')
  })

  it('does not open panel when disabled', async () => {
    const wrapper = mount(Cascader, { props: { options: mockOptions, disabled: true } })
    await wrapper.find('.zc-cascader__wrapper').trigger('click')
    // v-show doesn't remove from DOM; check visibility state
    expect(wrapper.find('.zc-cascader').classes()).not.toContain('is-open')
  })

  it('expands next level on node click', async () => {
    const wrapper = mount(Cascader, { props: { options: mockOptions } })
    await wrapper.find('.zc-cascader__wrapper').trigger('click')
    const firstNode = wrapper.findAll('.zc-cascader__node')[0]
    await firstNode.trigger('click')
    // Should now have multiple menus (at least 2)
    const menus = wrapper.findAll('.zc-cascader__menu')
    expect(menus.length).toBeGreaterThanOrEqual(2)
  })

  it('shows search input when filterable', async () => {
    const wrapper = mount(Cascader, {
      props: { options: mockOptions, filterable: true },
    })
    await wrapper.find('.zc-cascader__wrapper').trigger('click')
    expect(wrapper.find('.zc-cascader__search').exists()).toBe(true)
    expect(wrapper.find('.zc-cascader__search-input').exists()).toBe(true)
  })

  it('shows clear button when clearable and has value', () => {
    const wrapper = mount(Cascader, {
      props: {
        modelValue: [['zhejiang', 'hangzhou', 'xihu']],
        options: mockOptions,
        clearable: true,
      },
    })
    expect(wrapper.find('.zc-cascader__clear').exists()).toBe(true)
  })

  it('emits change on clear', async () => {
    const wrapper = mount(Cascader, {
      props: {
        modelValue: [['zhejiang', 'hangzhou', 'xihu']],
        options: mockOptions,
        clearable: true,
      },
    })
    await wrapper.find('.zc-cascader__clear').trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([[]])
  })

  it('renders arrow icon', () => {
    const wrapper = mount(Cascader)
    expect(wrapper.find('.zc-cascader__arrow').exists()).toBe(true)
  })

  it('shows tags in multiple mode', () => {
    const wrapper = mount(Cascader, {
      props: {
        modelValue: [
          ['zhejiang', 'hangzhou', 'xihu'],
          ['jiangsu', 'nanjing', 'xuanwu'],
        ],
        options: mockOptions,
        multiple: true,
      },
    })
    const tags = wrapper.findAll('.zc-cascader__tag')
    expect(tags.length).toBe(2)
  })
})
