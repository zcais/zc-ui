import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcTree from '../tree/tree.vue'
import ZcTreeNode from '../tree/tree-node.vue'
import { TREE_KEY } from '../tree/types'

// Mock tree context for tree-node
const mockTreeCtx = {
  showCheckbox: true,
  highlightCurrent: false,
  indent: 16,
  expandOnClickNode: false,
  draggable: false,
  currentKey: '',
  isExpanded: () => false,
  isChecked: () => false,
  isHalfChecked: () => false,
  isNodeDisabled: () => false,
  isNodeLeaf: () => false,
  getNodeKey: (n: any) => n.id,
  getNodeLabel: (n: any) => n.label,
  getNodeChildren: (n: any) => n.children,
  getHighlightParts: (s: string) => [{ text: s, highlight: false }],
  handleSelect: () => {},
  handleCheck: () => {},
  toggleExpand: () => {},
  handleDragStart: () => {},
  handleDragOver: () => {},
  handleDragEnd: () => {},
  dragState: null,
  nodeClass: '',
}

describe('Accessibility: Tree', () => {
  const treeData = [
    {
      id: 1,
      label: 'Node 1',
      children: [
        { id: 11, label: 'Node 1-1' },
        { id: 12, label: 'Node 1-2' },
      ],
    },
    { id: 2, label: 'Node 2' },
  ]

  it('should have role="tree" on root', () => {
    const wrapper = mount(ZcTree, {
      props: { data: treeData },
    })
    expect(wrapper.find('.zc-tree').attributes('role')).toBe('tree')
  })

  it('should have role="treeitem" on nodes', () => {
    const wrapper = mount(ZcTreeNode, {
      global: {
        provide: {
          [TREE_KEY as symbol]: mockTreeCtx,
        },
      },
      props: {
        nodeData: { id: 1, label: 'Node 1', children: [] },
        level: 1,
      },
    })
    expect(wrapper.attributes('role')).toBe('treeitem')
  })

  it('should have aria-level on tree nodes', () => {
    const wrapper = mount(ZcTreeNode, {
      global: {
        provide: {
          [TREE_KEY as symbol]: mockTreeCtx,
        },
      },
      props: {
        nodeData: { id: 1, label: 'Node 1', children: [] },
        level: 2,
      },
    })
    expect(wrapper.attributes('aria-level')).toBe('2')
  })

  it('should have tabindex 0 when not disabled', () => {
    const wrapper = mount(ZcTreeNode, {
      global: {
        provide: {
          [TREE_KEY as symbol]: mockTreeCtx,
        },
      },
      props: {
        nodeData: { id: 1, label: 'Node 1' },
        level: 1,
      },
    })
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('should have tabindex -1 when disabled', () => {
    const disabledCtx = { ...mockTreeCtx, isNodeDisabled: () => true }
    const wrapper = mount(ZcTreeNode, {
      global: {
        provide: {
          [TREE_KEY as symbol]: disabledCtx,
        },
      },
      props: {
        nodeData: { id: 1, label: 'Node 1' },
        level: 1,
      },
    })
    expect(wrapper.attributes('tabindex')).toBe('-1')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('should have aria-selected for current node', () => {
    const currentCtx = { ...mockTreeCtx, currentKey: 1, highlightCurrent: true }
    const wrapper = mount(ZcTreeNode, {
      global: {
        provide: {
          [TREE_KEY as symbol]: currentCtx,
        },
      },
      props: {
        nodeData: { id: 1, label: 'Node 1' },
        level: 1,
      },
    })
    expect(wrapper.attributes('aria-selected')).toBe('true')
  })

  it('should have role="checkbox" on tree checkbox', () => {
    const wrapper = mount(ZcTreeNode, {
      global: {
        provide: {
          [TREE_KEY as symbol]: mockTreeCtx,
        },
      },
      props: {
        nodeData: { id: 1, label: 'Node 1' },
        level: 1,
      },
    })
    const checkbox = wrapper.find('[role="checkbox"]')
    expect(checkbox.exists()).toBe(true)
  })

  it('should have aria-checked on tree checkbox', () => {
    const wrapper = mount(ZcTreeNode, {
      global: {
        provide: {
          [TREE_KEY as symbol]: mockTreeCtx,
        },
      },
      props: {
        nodeData: { id: 1, label: 'Node 1' },
        level: 1,
      },
    })
    const checkbox = wrapper.find('[role="checkbox"]')
    expect(checkbox.attributes('aria-checked')).toBe('false')
  })

  it('should have aria-expanded when node can expand', () => {
    const wrapper = mount(ZcTreeNode, {
      global: {
        provide: {
          [TREE_KEY as symbol]: mockTreeCtx,
        },
      },
      props: {
        nodeData: { id: 1, label: 'Node 1', children: [{ id: 11, label: 'Child' }] },
        level: 1,
      },
    })
    // Node with children should have aria-expanded
    expect(wrapper.attributes('aria-expanded')).toBeDefined()
  })

  it('should support Enter key to activate node', async () => {
    const mockHandleSelect = vi.fn()
    const ctx = { ...mockTreeCtx, handleSelect: mockHandleSelect }
    const wrapper = mount(ZcTreeNode, {
      global: {
        provide: {
          [TREE_KEY as symbol]: ctx,
        },
      },
      props: {
        nodeData: { id: 1, label: 'Node 1' },
        level: 1,
      },
    })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(mockHandleSelect).toHaveBeenCalled()
  })

  it('should support Space key to activate node', async () => {
    const mockHandleSelect = vi.fn()
    const ctx = { ...mockTreeCtx, handleSelect: mockHandleSelect }
    const wrapper = mount(ZcTreeNode, {
      global: {
        provide: {
          [TREE_KEY as symbol]: ctx,
        },
      },
      props: {
        nodeData: { id: 1, label: 'Node 1' },
        level: 1,
      },
    })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(mockHandleSelect).toHaveBeenCalled()
  })
})
