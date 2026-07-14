import type { InjectionKey } from 'vue'

export interface TreeNodeData {
  /** Unique identifier for the node */
  id: string | number
  /** Display label */
  label: string
  /** Child nodes */
  children?: TreeNodeData[]
  /** Whether the node is disabled */
  disabled?: boolean
  /** Whether the node is a leaf (no children or no more to load) */
  isLeaf?: boolean
  /** Extra data attached to the node */
  data?: Record<string, unknown>
  /** Icon class or name */
  icon?: string
  /** Internal loading state */
  _loading?: boolean
}

export interface TreePropsConfig {
  /** Key for node id (default: 'id') */
  id?: string
  /** Key for node label (default: 'label') */
  label?: string
  /** Key for node children (default: 'children') */
  children?: string
  /** Key for node disabled (default: 'disabled') */
  disabled?: string
  /** Key for node isLeaf (default: 'isLeaf') */
  isLeaf?: string
}

export interface TreeProps {
  data?: TreeNodeData[]
  checkedKeys?: (string | number)[]
  expandedKeys?: (string | number)[]
  modelValue?: string | number
  showCheckbox?: boolean
  checkStrictly?: boolean
  defaultExpandAll?: boolean
  defaultExpandedKeys?: (string | number)[]
  accordion?: boolean
  expandOnClickNode?: boolean
  lazy?: boolean
  load?: (node: TreeNodeData, callback: (data: TreeNodeData[]) => void) => void
  filterValue?: string
  highlightCurrent?: boolean
  showLine?: boolean
  indent?: number
  props?: TreePropsConfig
  emptyText?: string
  draggable?: boolean
  nodeClass?: string | ((data: TreeNodeData) => string)
  virtual?: boolean
}

/** Context provided by ZcTree to child nodes */
export interface TreeContext {
  isExpanded: (node: TreeNodeData) => boolean
  toggleExpand: (node: TreeNodeData) => void
  isChecked: (node: TreeNodeData) => boolean
  isHalfChecked: (node: TreeNodeData) => boolean
  handleCheck: (node: TreeNodeData) => void
  handleSelect: (node: TreeNodeData, event: Event) => void
  currentKey: string | number | undefined
  showCheckbox: boolean
  checkStrictly: boolean
  draggable: boolean
  showLine: boolean
  indent: number
  expandOnClickNode: boolean
  nodeClass?: string | ((data: TreeNodeData) => string)
  lazy: boolean
  highlightCurrent: boolean
  getNodeKey: (node: TreeNodeData) => string | number
  getNodeLabel: (node: TreeNodeData) => string
  getNodeChildren: (node: TreeNodeData) => TreeNodeData[] | undefined
  isNodeDisabled: (node: TreeNodeData) => boolean
  isNodeLeaf: (node: TreeNodeData) => boolean
  highlightText: (text: string) => string
  getHighlightParts: (text: string) => Array<{ text: string; highlight: boolean }>
  matchesFilter: (node: TreeNodeData) => boolean
  handleDragStart: (e: DragEvent, node: TreeNodeData) => void
  handleDragOver: (e: DragEvent, node: TreeNodeData) => void
  handleDragEnd: (e: DragEvent, node: TreeNodeData) => void
  dragState: {
    dragging: boolean
    dragNode: TreeNodeData | null
    dropNode: TreeNodeData | null
    dropType: 'before' | 'inner' | 'after' | ''
  }
}

export const TREE_KEY: InjectionKey<TreeContext> = Symbol('zcTree')
