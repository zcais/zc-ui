import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
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
    const wrapper = mount(TreeSelect, { props: { data: mockData, teleport: false } })
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
    const wrapper = mount(TreeSelect, { props: { data: mockData, teleport: false } })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    const nodes = wrapper.findAll('.zc-tree-select__node')
    // Should have at least root nodes
    expect(nodes.length).toBeGreaterThanOrEqual(2)
  })

  it('shows search input when filterable', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, filterable: true, teleport: false },
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
    const wrapper = mount(TreeSelect, { props: { data: [], teleport: false } })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    expect(wrapper.find('.zc-tree-select__empty').exists()).toBe(true)
  })
})

describe('ZcTreeSelect — dropdown teleport', () => {
  it('teleports dropdown to body by default (avoids overflow clipping)', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData },
      attachTo: document.body,
    })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    await nextTick()
    // Dropdown should be in document.body, not inside the component container
    expect(wrapper.find('.zc-tree-select__dropdown').exists()).toBe(false)
    const bodyDropdowns = document.body.querySelectorAll('.zc-tree-select__dropdown')
    expect(bodyDropdowns.length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('renders dropdown inline when teleport=false', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, teleport: false },
    })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')
    expect(wrapper.find('.zc-tree-select__dropdown').exists()).toBe(true)
  })
})

describe('ZcTreeSelect — parentSelectable', () => {
  const findNodeByLabel = (wrapper: ReturnType<typeof mount>, label: string) =>
    wrapper.findAll('.zc-tree-select__node-content').find((n) => n.text().includes(label))

  it('parents are group headers by default: click expands instead of selecting', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, teleport: false },
    })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')

    const rootNode = findNodeByLabel(wrapper, 'Node 1')
    expect(rootNode).toBeTruthy()
    await rootNode!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
    // Root node should be expanded now (default-open state toggled to collapsed
    // and back — either way no selection happened)
    expect(wrapper.find('.zc-tree-select__node.is-group').exists()).toBe(true)
    wrapper.unmount()
  })

  it('hides checkboxes on group-header parents in multiple mode', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, multiple: true, teleport: false },
    })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')

    // Roots (Node 1 / Node 2) are group headers — no checkbox
    // Their children (expanded by default) — have checkboxes
    const nodes = wrapper.findAll('.zc-tree-select__node')
    const groupNodes = nodes.filter((n) => n.classes().includes('is-group'))
    const leafNodes = nodes.filter((n) => n.classes().includes('is-leaf'))
    // root1, child1-1 (has children), root2 are group headers
    expect(groupNodes.length).toBe(3)
    for (const g of groupNodes) {
      // Query the node's own content row (children nest inside the node div)
      const ownCheckbox = g.element.querySelector(
        ':scope > .zc-tree-select__node-content > .zc-tree-select__node-checkbox'
      )
      expect(ownCheckbox).toBeNull()
    }
    expect(leafNodes.length).toBeGreaterThan(0)
    for (const l of leafNodes) {
      const ownCheckbox = l.element.querySelector(
        ':scope > .zc-tree-select__node-content > .zc-tree-select__node-checkbox'
      )
      expect(ownCheckbox).not.toBeNull()
    }
    wrapper.unmount()
  })

  it('parentSelectable=true allows selecting a parent node', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, parentSelectable: true, checkStrictly: true, teleport: false },
    })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')

    const rootNode = findNodeByLabel(wrapper, 'Node 1')
    await rootNode!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['root1'])
    wrapper.unmount()
  })

  it('parent nodes are expandable via the arrow even when acting as group headers', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: mockData, teleport: false },
    })
    await wrapper.find('.zc-tree-select__wrapper').trigger('click')

    const arrow = wrapper.find('.zc-tree-select__node:not(.is-leaf) .zc-tree-select__node-expand')
    await arrow.trigger('click')
    // Collapsing root1 hides its subtree: roots + root2's child remain
    expect(wrapper.findAll('.zc-tree-select__node').length).toBe(3)
    wrapper.unmount()
  })
})
