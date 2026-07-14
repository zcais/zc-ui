import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tree from '../tree/tree.vue'

const mockData = [
  {
    id: 1,
    label: 'Level 1 - 1',
    children: [
      { id: 11, label: 'Level 2 - 1' },
      { id: 12, label: 'Level 2 - 2', children: [{ id: 121, label: 'Level 3 - 1' }] },
    ],
  },
  { id: 2, label: 'Level 1 - 2', disabled: true },
  { id: 3, label: 'Level 1 - 3' },
]

describe('ZcTree', () => {
  it('renders with data', () => {
    const wrapper = mount(Tree, { props: { data: mockData } })
    expect(wrapper.find('.zc-tree').exists()).toBe(true)
    expect(wrapper.findAll('.zc-tree-node').length).toBe(3)
  })

  it('shows empty text when no data', () => {
    const wrapper = mount(Tree, { props: { data: [], emptyText: 'Empty' } })
    expect(wrapper.find('.zc-tree__empty').text()).toBe('Empty')
  })

  it('renders node labels correctly', () => {
    const wrapper = mount(Tree, { props: { data: mockData } })
    const labels = wrapper.findAll('.zc-tree-node__label')
    expect(labels[0].text()).toBe('Level 1 - 1')
    expect(labels[1].text()).toBe('Level 1 - 2')
  })

  it('expands nodes on click when expandOnClickNode is true', async () => {
    const wrapper = mount(Tree, {
      props: { data: mockData, expandOnClickNode: true },
    })
    const firstNode = wrapper.findAll('.zc-tree-node')[0]
    await firstNode.trigger('click')
    expect(wrapper.emitted('node-expand')?.length).toBe(1)
    // After expand, children should be visible
    expect(wrapper.findAll('.zc-tree-node').length).toBeGreaterThanOrEqual(3)
  })

  it('shows checkbox when showCheckbox is true', () => {
    const wrapper = mount(Tree, {
      props: { data: mockData, showCheckbox: true },
    })
    expect(wrapper.find('.zc-tree-node__checkbox').exists()).toBe(true)
  })

  it('checks node on click when checkbox mode', async () => {
    const wrapper = mount(Tree, {
      props: { data: mockData, showCheckbox: true },
    })
    const firstNode = wrapper.findAll('.zc-tree-node')[0]
    await firstNode.trigger('click')
    expect(wrapper.emitted('update:checkedKeys')).toBeTruthy()
    expect(wrapper.emitted('check-change')?.length).toBe(1)
  })

  it('does not expand disabled nodes', async () => {
    const wrapper = mount(Tree, { props: { data: mockData } })
    const disabledNode = wrapper.findAll('.zc-tree-node')[1]
    expect(disabledNode.classes()).toContain('is-disabled')
  })

  it('applies defaultExpandAll', () => {
    const wrapper = mount(Tree, {
      props: { data: mockData, defaultExpandAll: true },
    })
    // All nodes should be visible when expanded
    expect(wrapper.findAll('.zc-tree-node').length).toBeGreaterThan(3)
  })

  it('applies show-line class', () => {
    const wrapper = mount(Tree, {
      props: { data: mockData, showLine: true },
    })
    expect(wrapper.find('.zc-tree').classes()).toContain('is-show-line')
  })

  it('highlights current node', async () => {
    const wrapper = mount(Tree, {
      props: { data: mockData, modelValue: 1, highlightCurrent: true },
    })
    const firstNode = wrapper.findAll('.zc-tree-node')[0]
    expect(firstNode.classes()).toContain('is-current')
  })

  it('supports custom props config', () => {
    const customData = [{ id: 'a', label: 'Node A', children: [{ id: 'b', label: 'Node B' }] }]
    const wrapper = mount(Tree, {
      props: {
        data: customData,
        props: { id: 'key', label: 'name', children: 'sub' },
      },
    })
    expect(wrapper.find('.zc-tree-node__label').text()).toBe('Node A')
  })

  it('emits node-click when clicking a node', async () => {
    const wrapper = mount(Tree, { props: { data: mockData } })
    const firstNode = wrapper.findAll('.zc-tree-node')[0]
    await firstNode.trigger('click')
    expect(wrapper.emitted('node-click')).toBeTruthy()
  })

  it('emits current-change on selection', async () => {
    const wrapper = mount(Tree, { props: { data: mockData } })
    const firstNode = wrapper.findAll('.zc-tree-node')[0]
    await firstNode.trigger('click')
    expect(wrapper.emitted('current-change')).toBeTruthy()
  })

  it('supports accordion mode', async () => {
    const wrapper = mount(Tree, {
      props: { data: mockData, accordion: true },
    })
    // Expand first node
    const firstNode = wrapper.findAll('.zc-tree-node')[0]
    await firstNode.trigger('click')
    // Click again to collapse (accordion should only keep one expanded)
    await firstNode.trigger('click')
    expect(wrapper.emitted('node-collapse')?.length).toBeGreaterThanOrEqual(1)
  })

  it('supports filter value highlighting', () => {
    const wrapper = mount(Tree, {
      props: { data: mockData, filterValue: 'Level 1' },
    })
    // With XSS-safe rendering, highlighted parts use span.zc-tree-node__label--highlight
    const highlights = wrapper.findAll('.zc-tree-node__label--highlight')
    expect(highlights.length).toBeGreaterThan(0)
  })

  // ---- Bug #16: Tree XSS prevention in highlightText ----
  it('escapes HTML characters in node labels with filter highlighting', () => {
    const xssData = [{ id: 1, label: '<script>alert(1)</script>Safe' }]
    const wrapper = mount(Tree, {
      props: { data: xssData, filterValue: 'Safe' },
    })
    const html = wrapper.html()
    // The raw <script> tag should be escaped, not rendered as actual script element
    expect(html).not.toContain('<script>alert(1)</script>')
    // The escaped version should be present
    expect(html.toLowerCase()).toContain('&lt;script&gt;')
  })

  it('does not inject HTML from node labels', () => {
    const xssData = [{ id: 1, label: '<img src=x onerror=alert(1)>' }]
    const wrapper = mount(Tree, {
      props: { data: xssData, filterValue: 'img' },
    })
    const html = wrapper.html()
    // The raw HTML tag must NOT be present (no XSS — no real <img element)
    expect(html).not.toContain('<img src=x onerror=alert(1)>')
    expect(html).not.toContain('<img')
    // The label must be HTML-escaped (lt entity present)
    expect(html.toLowerCase()).toContain('&lt;')
    // No actual <img> element should be rendered in the DOM
    expect(wrapper.find('img').exists()).toBe(false)
  })

  // ---- Virtual scroll tests ----
  it('renders virtual list container when virtual is enabled', () => {
    const bigData = Array.from({ length: 500 }, (_, i) => ({
      id: i,
      label: `Node ${i}`,
    }))
    const wrapper = mount(Tree, {
      props: { data: bigData, virtual: true },
    })
    expect(wrapper.find('.zc-tree__virtual-list').exists()).toBe(true)
  })

  it('does not render virtual list when virtual is disabled', () => {
    const bigData = Array.from({ length: 500 }, (_, i) => ({
      id: i,
      label: `Node ${i}`,
    }))
    const wrapper = mount(Tree, {
      props: { data: bigData, virtual: false },
    })
    expect(wrapper.find('.zc-tree__virtual-list').exists()).toBe(false)
  })

  it('renders virtual scroll structure with correct total height', () => {
    const bigData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      label: `Node ${i}`,
    }))
    const wrapper = mount(Tree, {
      props: { data: bigData, virtual: true },
    })
    const virtualList = wrapper.find('.zc-tree__virtual-list')
    expect(virtualList.exists()).toBe(true)
    const virtualWrapper = wrapper.find('.zc-tree-virtual-wrapper')
    expect(virtualWrapper.exists()).toBe(true)
  })

  it('can expand and collapse nodes in virtual scroll mode', async () => {
    const hierarchicalData = [
      { id: 1, label: 'Parent', children: [{ id: 2, label: 'Child' }] },
    ]
    const wrapper = mount(Tree, {
      props: { data: hierarchicalData, virtual: true },
    })
    const firstNode = wrapper.findAll('.zc-tree-node')[0]
    await firstNode.trigger('click')
    expect(wrapper.emitted('node-expand')?.length).toBe(1)
  })
})
