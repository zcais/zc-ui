<script setup lang="ts">
import { ref, computed, watch, provide, reactive } from 'vue'
import { useNamespace, useVirtualList } from '@zc-ui/hooks'
import TreeNode from './tree-node.vue'
import type { TreeNodeData, TreePropsConfig } from './types'
import { TREE_KEY, type TreeContext } from './types'

defineOptions({ name: 'ZcTree' })

const props = withDefaults(
  defineProps<{
    /** Tree data */
    data?: TreeNodeData[]
    /** Currently checked keys (v-model:checkedKeys) */
    checkedKeys?: (string | number)[]
    /** Currently expanded keys (v-model:expandedKeys) */
    expandedKeys?: (string | number)[]
    /** Currently selected node key (v-model) */
    modelValue?: string | number
    /** Show checkbox */
    showCheckbox?: boolean
    /** Whether to strictly check nodes (no parent-child relation) */
    checkStrictly?: boolean
    /** Default expand all nodes */
    defaultExpandAll?: boolean
    /** Default expanded keys */
    defaultExpandedKeys?: (string | number)[]
    /** Enable accordion mode */
    accordion?: boolean
    /** Node click expands */
    expandOnClickNode?: boolean
    /** Lazy load */
    lazy?: boolean
    /** Load function for lazy mode */
    load?: (node: TreeNodeData, callback: (data: TreeNodeData[]) => void) => void
    /** Filter keyword */
    filterValue?: string
    /** Highlight current node */
    highlightCurrent?: boolean
    /** Show connecting lines */
    showLine?: boolean
    /** Indent per level (px) */
    indent?: number
    /** Node key field mapping */
    props?: TreePropsConfig
    /** Empty text */
    emptyText?: string
    /** Whether node is draggable */
    draggable?: boolean
    /** Custom node class */
    nodeClass?: string | ((data: TreeNodeData) => string)
  /** Enable virtual scrolling for large datasets */
  virtual?: boolean
    }>(),
    {
    data: () => [],
    checkedKeys: () => [],
    expandedKeys: () => [],
    modelValue: undefined,
    showCheckbox: false,
    checkStrictly: false,
    defaultExpandAll: false,
    defaultExpandedKeys: () => [],
    accordion: false,
    expandOnClickNode: true,
    lazy: false,
    load: undefined,
    filterValue: '',
    highlightCurrent: true,
    showLine: false,
    indent: 16,
    props: () => ({}),
    emptyText: 'No data',
  draggable: false,
nodeClass: '',
    virtual: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', key: string | number | undefined): void
  (e: 'update:checkedKeys', keys: (string | number)[]): void
  (e: 'update:expandedKeys', keys: (string | number)[]): void
  (e: 'node-click', data: TreeNodeData, node: TreeNodeData, event: Event): void
  (e: 'check-change', data: TreeNodeData, checked: boolean): void
  (e: 'current-change', data: TreeNodeData | undefined, node: TreeNodeData | undefined): void
  (e: 'node-expand', data: TreeNodeData, node: TreeNodeData): void
  (e: 'node-collapse', data: TreeNodeData, node: TreeNodeData): void
  (
    e: 'node-drag-end',
    dragNode: TreeNodeData,
    dropNode: TreeNodeData | null,
    position: string,
    event: DragEvent
  ): void
  (
    e: 'node-drop',
    dragNode: TreeNodeData,
    dropNode: TreeNodeData | null,
    position: string,
    event: DragEvent
  ): void
}>()

const ns = useNamespace('tree')

/* ---- Props config ---- */
const propsConfig = computed(() => ({
  id: props.props?.id ?? 'id',
  label: props.props?.label ?? 'label',
  children: props.props?.children ?? 'children',
  disabled: props.props?.disabled ?? 'disabled',
  isLeaf: props.props?.isLeaf ?? 'isLeaf',
}))

function getNodeKey(node: TreeNodeData): string | number {
  return (node as any)[propsConfig.value.id] ?? node.id
}

function getNodeLabel(node: TreeNodeData): string {
  return (node as any)[propsConfig.value.label] ?? node.label
}

function getNodeChildren(node: TreeNodeData): TreeNodeData[] | undefined {
  return (node as any)[propsConfig.value.children] ?? node.children
}

function isNodeDisabled(node: TreeNodeData): boolean {
  return (node as any)[propsConfig.value.disabled] === true || node.disabled === true
}

function isNodeLeaf(node: TreeNodeData): boolean {
  return (node as any)[propsConfig.value.isLeaf] === true || node.isLeaf === true
}

/* ---- Expanded state ---- */
const expandedKeysSet = ref<Set<string | number>>(new Set(props.defaultExpandedKeys))

// Track whether expandedKeys is controlled by the parent (explicitly passed)
const isExpandedControlled = ref(props.expandedKeys !== undefined && props.expandedKeys.length > 0)

const internalExpanded = computed(() => {
  // Once controlled, always respect the prop (even if empty array)
  if (isExpandedControlled.value) return new Set(props.expandedKeys)
  return expandedKeysSet.value
})

function initExpanded(nodes: TreeNodeData[]) {
  nodes.forEach((node) => {
    const key = getNodeKey(node)
    expandedKeysSet.value.add(key)
    const children = getNodeChildren(node)
    if (children?.length) initExpanded(children)
  })
}
if (props.defaultExpandAll && props.data.length) initExpanded(props.data)

watch(
  () => props.expandedKeys,
  (val) => {
    // If parent provides a non-empty expandedKeys, switch to controlled mode
    if (val && val.length > 0) {
      isExpandedControlled.value = true
      expandedKeysSet.value = new Set(val)
    }
  }
)

function isExpanded(node: TreeNodeData): boolean {
  return internalExpanded.value.has(getNodeKey(node))
}

function toggleExpand(node: TreeNodeData) {
  const key = getNodeKey(node)
  const newSet = new Set(internalExpanded.value)
  if (newSet.has(key)) {
    newSet.delete(key)
    emit('node-collapse', node, node)
  } else {
    newSet.add(key)
    emit('node-expand', node, node)
    if (props.lazy && !getNodeChildren(node)?.length && !isNodeLeaf(node) && props.load) {
      ;(node as any)._loading = true
      props.load(node, (data) => {
        ;(node as any)._loading = false
        node.children = data
      })
    }
  }
  expandedKeysSet.value = newSet
  emit('update:expandedKeys', [...newSet])
}

/* ---- Checkbox state ---- */
const checkedKeysSet = ref<Set<string | number>>(new Set(props.checkedKeys))
const halfCheckedKeysSet = ref<Set<string | number>>(new Set())

watch(
  () => props.checkedKeys,
  (val) => {
    if (val.length > 0) checkedKeysSet.value = new Set(val)
  }
)

function getDescendantKeys(node: TreeNodeData): (string | number)[] {
  const keys: (string | number)[] = []
  const children = getNodeChildren(node)
  if (children?.length) {
    children.forEach((child) => {
      keys.push(getNodeKey(child))
      keys.push(...getDescendantKeys(child))
    })
  }
  return keys
}

function getAncestorKeys(
  node: TreeNodeData,
  nodes: TreeNodeData[],
  parentKeys: (string | number)[] = []
): (string | number)[] {
  for (const n of nodes) {
    const children = getNodeChildren(n)
    if (children?.length) {
      if (children.some((c) => getNodeKey(c) === getNodeKey(node))) {
        return [...parentKeys, getNodeKey(n)]
      }
      const found = getAncestorKeys(node, children, [...parentKeys, getNodeKey(n)])
      if (found.length) return found
    }
  }
  return []
}

function handleCheck(node: TreeNodeData) {
  if (isNodeDisabled(node)) return
  const key = getNodeKey(node)
  const newChecked = new Set(checkedKeysSet.value)
  const newHalf = new Set(halfCheckedKeysSet.value)

  if (newChecked.has(key)) {
    newChecked.delete(key)
    newHalf.delete(key)
    if (!props.checkStrictly) {
      getDescendantKeys(node).forEach((k) => {
        newChecked.delete(k)
        newHalf.delete(k)
      })
      getAncestorKeys(node, props.data).forEach((ancestorKey) => {
        const ancestorNode = findNodeByKey(ancestorKey, props.data)
        if (ancestorNode) {
          const allDescKeys = [ancestorKey, ...getDescendantKeys(ancestorNode)]
          const checkedCount = allDescKeys.filter((k) => newChecked.has(k)).length
          if (checkedCount === 0) {
            newChecked.delete(ancestorKey)
            newHalf.delete(ancestorKey)
          } else if (checkedCount < allDescKeys.length) {
            newChecked.delete(ancestorKey)
            newHalf.add(ancestorKey)
          } else {
            newChecked.add(ancestorKey)
            newHalf.delete(ancestorKey)
          }
        }
      })
    }
  } else {
    newChecked.add(key)
    newHalf.delete(key)
    if (!props.checkStrictly) {
      getDescendantKeys(node).forEach((k) => {
        newChecked.add(k)
        newHalf.delete(k)
      })
      getAncestorKeys(node, props.data).forEach((ancestorKey) => {
        const ancestorNode = findNodeByKey(ancestorKey, props.data)
        if (ancestorNode) {
          const allDescKeys = [ancestorKey, ...getDescendantKeys(ancestorNode)]
          const checkedCount = allDescKeys.filter((k) => newChecked.has(k)).length
          if (checkedCount === allDescKeys.length) {
            newChecked.add(ancestorKey)
            newHalf.delete(ancestorKey)
          } else {
            newChecked.delete(ancestorKey)
            newHalf.add(ancestorKey)
          }
        }
      })
    }
  }

  checkedKeysSet.value = newChecked
  halfCheckedKeysSet.value = newHalf
  emit('update:checkedKeys', [...newChecked])
  emit('check-change', node, newChecked.has(key))
}

function isChecked(node: TreeNodeData): boolean {
  return checkedKeysSet.value.has(getNodeKey(node))
}

function isHalfChecked(node: TreeNodeData): boolean {
  return halfCheckedKeysSet.value.has(getNodeKey(node))
}

/* ---- Selection state ---- */
const currentKey = ref<string | number | undefined>(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    currentKey.value = val
  }
)

function handleSelect(node: TreeNodeData, event: Event) {
  const key = getNodeKey(node)
  currentKey.value = key
  emit('update:modelValue', key)
  emit('node-click', node, node, event)
  emit('current-change', node, node)
}

/* ---- Drag state ---- */
const dragState = reactive({
  dragging: false,
  dragNode: null as TreeNodeData | null,
  dropNode: null as TreeNodeData | null,
  dropType: '' as 'before' | 'inner' | 'after' | '',
})

function handleDragStart(_event: DragEvent, node: TreeNodeData) {
  dragState.dragging = true
  dragState.dragNode = node
}

function handleDragOver(event: DragEvent, node: TreeNodeData) {
  event.preventDefault()
  dragState.dropNode = node
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const y = event.clientY - rect.top
  const h = rect.height
  dragState.dropType = y < h / 3 ? 'before' : y > (h * 2) / 3 ? 'after' : 'inner'
}

function handleDragEnd(event: DragEvent, node: TreeNodeData) {
  if (dragState.dropNode) {
    emit('node-drop', node, dragState.dropNode, dragState.dropType, event)
    emit('node-drag-end', node, dragState.dropNode, dragState.dropType, event)
  }
  dragState.dragging = false
  dragState.dragNode = null
  dragState.dropNode = null
  dragState.dropType = ''
}

/* ---- Filter ---- */
const filterText = computed(() => props.filterValue)

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function highlightText(text: string): string {
  if (!filterText.value) return escapeHtml(text)
  const regex = new RegExp(`(${escapeRegExp(filterText.value)})`, 'gi')
  return escapeHtml(text).replace(regex, '<span class="zc-tree-node__label--highlight">$1</span>')
}

function getHighlightParts(text: string): Array<{ text: string; highlight: boolean }> {
  if (!filterText.value) return [{ text, highlight: false }]
  const escaped = escapeRegExp(filterText.value)
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts: Array<{ text: string; highlight: boolean }> = []
  let lastIdx = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push({ text: text.slice(lastIdx, match.index), highlight: false })
    }
    parts.push({ text: match[1], highlight: true })
    lastIdx = regex.lastIndex
  }
  if (lastIdx < text.length) {
    parts.push({ text: text.slice(lastIdx), highlight: false })
  }
  return parts.length > 0 ? parts : [{ text, highlight: false }]
}

function matchesFilter(node: TreeNodeData): boolean {
  if (!filterText.value) return true
  const label = getNodeLabel(node).toLowerCase()
  if (label.includes(filterText.value.toLowerCase())) return true
  const children = getNodeChildren(node)
  if (children?.length) return children.some(matchesFilter)
  return false
}

/* ---- Helper ---- */
function findNodeByKey(key: string | number, nodes: TreeNodeData[]): TreeNodeData | undefined {
  for (const node of nodes) {
    if (getNodeKey(node) === key) return node
    const children = getNodeChildren(node)
    if (children?.length) {
      const found = findNodeByKey(key, children)
      if (found) return found
    }
  }
  return undefined
}

/* ---- Provide context ---- */
const treeCtxValue = {
  isExpanded,
  toggleExpand,
  isChecked,
  isHalfChecked,
  handleCheck,
  handleSelect,
  get currentKey() {
    return currentKey.value
  },
  showCheckbox: props.showCheckbox,
  checkStrictly: props.checkStrictly,
  draggable: props.draggable,
  showLine: props.showLine,
  indent: props.indent,
  expandOnClickNode: props.expandOnClickNode,
  nodeClass: props.nodeClass,
  lazy: props.lazy,
  highlightCurrent: props.highlightCurrent,
  getNodeKey,
  getNodeLabel,
  getNodeChildren,
  isNodeDisabled,
  isNodeLeaf,
  highlightText,
  getHighlightParts,
  matchesFilter,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  dragState,
}

provide(TREE_KEY, treeCtxValue as TreeContext)

/* ---- Flatten visible nodes ---- */
function flattenVisibleNodes(
  nodes: TreeNodeData[],
  level: number
): Array<{ node: TreeNodeData; level: number }> {
  const result: Array<{ node: TreeNodeData; level: number }> = []
  nodes.forEach((node) => {
    if (matchesFilter(node)) {
      result.push({ node, level })
      const children = getNodeChildren(node)
      if (children?.length && isExpanded(node)) {
        result.push(...flattenVisibleNodes(children, level + 1))
      }
    }
  })
  return result
}

const visibleNodes = computed(() => flattenVisibleNodes(props.data, 0))

/* ---- Virtual scroll integration ---- */
const virtualItemHeight = 32

const {
  containerRef: virtualContainerRef,
  visibleData: virtualVisibleData,
  totalHeight: virtualTotalHeight,
  offsetY: virtualOffsetY,
} = useVirtualList<{ node: TreeNodeData; level: number }>({
  data: visibleNodes,
  itemHeight: virtualItemHeight,
  overscan: 5,
})
</script>

<template>
  <div
    :class="[ns.b(), ns.is('show-line', showLine), ns.is('highlight-current', highlightCurrent)]"
    role="tree"
  >
    <div v-if="visibleNodes.length === 0" :class="ns.e('empty')">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
    <!-- Virtual scroll mode -->
      <template v-else-if="virtual">
        <div
        ref="virtualContainerRef"
        :class="ns.e('virtual-list')"
        style="height: 300px; overflow-y: auto;"
      >
    <div :style="{ height: `${virtualTotalHeight}px`, position: 'relative' }">
  <div
:style="{ transform: `translateY(${virtualOffsetY}px)` }"
            class="zc-tree-virtual-wrapper"
          >
            <tree-node
              v-for="{ node, level } in virtualVisibleData"
              :key="getNodeKey(node)"
              :node-data="node"
              :level="level"
            />
          </div>
        </div>
      </div>
    </template>
    <!-- Normal mode -->
    <template v-else>
      <tree-node
        v-for="{ node, level } in visibleNodes"
        :key="getNodeKey(node)"
        :node-data="node"
        :level="level"
      />
    </template>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcTree styles
 * BEM naming: zc-tree / zc-tree-node
 * ============================================================ */

.zc-tree {
  position: relative;
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-primary, #303133);
  background: var(--color-zc-bg, #fff);
}

.zc-tree__empty {
  padding: 24px 0;
  text-align: center;
  color: var(--color-zc-text-secondary, #909399);
  font-size: var(--text-zc-base, 14px);
}

/* Virtual list container */
.zc-tree__virtual-list {
  overflow: auto;
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: 4px;
  }
  
  .zc-tree-virtual-wrapper {
  position: absolute;
  top: 0;
left: 0;
  right: 0;
}

/* ---- Tree Node ---- */
.zc-tree-node {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 26px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
  user-select: none;
}

.zc-tree-node:hover > .zc-tree-node__content {
  background-color: var(--color-zc-fill-light, #f5f7fa);
}

.zc-tree-node.is-current > .zc-tree-node__content {
  background-color: var(--color-zc-fill-light, #f5f7fa);
}

.zc-tree-node.is-expanded > .zc-tree-node__expand-icon svg,
.zc-tree-node.is-expanded > .zc-tree-node__expand-icon {
  transform: rotate(90deg);
}

.zc-tree-node.is-checked > .zc-tree-node__checkbox .zc-tree-node__checkbox-inner {
  background-color: var(--color-zc-primary-500, #409eff);
  border-color: var(--color-zc-primary-500, #409eff);
}

.zc-tree-node.is-checked > .zc-tree-node__checkbox .zc-tree-node__checkbox-inner::after {
  content: '';
  display: block;
  width: 4px;
  height: 8px;
  border: 2px solid var(--color-zc-white, #fff);
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
  margin-top: -1px;
  margin-left: 2px;
}

.zc-tree-node.is-half-checked > .zc-tree-node__checkbox .zc-tree-node__checkbox-inner {
  background-color: var(--color-zc-primary-500, #409eff);
  border-color: var(--color-zc-primary-500, #409eff);
}

.zc-tree-node.is-half-checked > .zc-tree-node__checkbox .zc-tree-node__checkbox-inner::after {
  content: '';
  display: block;
  width: 8px;
  height: 0;
  border-top: 2px solid #fff;
  margin-top: 4px;
  margin-left: 1px;
}

.zc-tree-node.is-disabled {
  color: var(--color-zc-text-disabled, #c0c4cc);
  cursor: not-allowed;
}

/* ---- Node Content ---- */
.zc-tree-node__content {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 4px;
  height: 100%;
  border-radius: var(--radius-zc-sm, 2px);
  box-sizing: border-box;
}

/* ---- Expand Icon ---- */
.zc-tree-node__expand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-tree-node__expand-icon svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.zc-tree-node__expand-icon--leaf {
  visibility: hidden;
}

.zc-tree-node__loading {
  width: 12px;
  height: 12px;
}

/* ---- Checkbox ---- */
.zc-tree-node__checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
}

.zc-tree-node__checkbox-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: 2px;
  background: var(--color-zc-bg-base, #fff);
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-tree-node__checkbox-inner:hover {
  border-color: var(--color-zc-primary-500, #409eff);
}

/* ---- Node Label ---- */
.zc-tree-node__label {
  flex: 1;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.zc-tree-node__label--highlight {
  color: var(--color-zc-primary-500, #409eff);
  font-weight: 600;
}

/* ---- Drop indicators ---- */
.zc-tree-node.is-drop-before > .zc-tree-node__content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-zc-primary-500, #409eff);
}

.zc-tree-node.is-drop-after > .zc-tree-node__content::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-zc-primary-500, #409eff);
}
</style>
