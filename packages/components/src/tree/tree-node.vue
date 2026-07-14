<script setup lang="ts">
import { inject, computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import type { TreeNodeData } from './types'
import { TREE_KEY } from './types'

defineOptions({ name: 'ZcTreeNode' })

const props = defineProps<{
  nodeData: TreeNodeData
  level: number
}>()

const ns = useNamespace('tree-node')

/* ---- Inject tree context ---- */
const treeCtx = inject(TREE_KEY, null)!
if (!treeCtx) {
  throw new Error('ZcTreeNode must be used within ZcTree')
}

/* ---- Computed classes ---- */
const isExpanded = computed(() => treeCtx.isExpanded(props.nodeData))
const isChecked = computed(() => treeCtx.isChecked(props.nodeData))
const isHalfChecked = computed(() => treeCtx.isHalfChecked(props.nodeData))
const isDisabled = computed(() => treeCtx.isNodeDisabled(props.nodeData))
const isCurrent = computed(() => treeCtx.currentKey === treeCtx.getNodeKey(props.nodeData))

const nodeChildren = computed(() => treeCtx.getNodeChildren(props.nodeData))
const isLeaf = computed(() => {
  if (treeCtx.isNodeLeaf(props.nodeData)) return true
  return !nodeChildren.value?.length
})

const canExpand = computed(() => !isLeaf.value || !!props.nodeData._loading)

const classes = computed(() => [
  ns.b(),
  ns.is('expanded', isExpanded.value),
  ns.is('current', isCurrent.value && treeCtx.highlightCurrent),
  ns.is('checked', isChecked.value),
  ns.is('half-checked', isHalfChecked.value),
  ns.is('disabled', isDisabled.value),
  ns.is('leaf', isLeaf.value),
  ns.is(
    'drop-before',
    treeCtx.dragState?.dropType === 'before' && treeCtx.dragState?.dropNode === props.nodeData
  ),
  ns.is(
    'drop-after',
    treeCtx.dragState?.dropType === 'after' && treeCtx.dragState?.dropNode === props.nodeData
  ),
  ns.is(
    'drop-inner',
    treeCtx.dragState?.dropType === 'inner' && treeCtx.dragState?.dropNode === props.nodeData
  ),
])

const nodeClassResult = computed(() => {
  if (typeof treeCtx.nodeClass === 'function') {
    return treeCtx.nodeClass(props.nodeData)
  }
  return treeCtx.nodeClass as string
})

/* ---- Handlers ---- */
function handleClick(event: Event) {
  if (isDisabled.value) return
  if (treeCtx.showCheckbox) {
    treeCtx.handleCheck(props.nodeData)
  }
  treeCtx.handleSelect(props.nodeData, event)
  if (treeCtx.expandOnClickNode && canExpand.value) {
    treeCtx.toggleExpand(props.nodeData)
  }
}

function handleExpandClick(event: Event) {
  event.stopPropagation()
  if (isDisabled.value || !canExpand.value) return
  treeCtx.toggleExpand(props.nodeData)
}

function handleCheckClick(event: Event) {
  event.stopPropagation()
  if (isDisabled.value) return
  treeCtx.handleCheck(props.nodeData)
}

function handleDragStart(event: DragEvent) {
  if (treeCtx.draggable && !isDisabled.value) {
    treeCtx.handleDragStart(event, props.nodeData)
  }
}

function handleDragOver(event: DragEvent) {
  if (treeCtx.draggable && treeCtx.dragState?.dragging) {
    treeCtx.handleDragOver(event, props.nodeData)
  }
}

function handleDragEnd(event: DragEvent) {
  if (treeCtx.draggable) {
    treeCtx.handleDragEnd(event, props.nodeData)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      handleClick(event)
      break
    case 'ArrowRight':
      if (canExpand.value && !isExpanded.value) {
        event.preventDefault()
        treeCtx.toggleExpand(props.nodeData)
      }
      break
    case 'ArrowLeft':
      if (canExpand.value && isExpanded.value) {
        event.preventDefault()
        treeCtx.toggleExpand(props.nodeData)
      }
      break
  }
}
</script>

<template>
  <div
    :class="[classes, nodeClassResult]"
    role="treeitem"
    :aria-expanded="canExpand ? isExpanded : undefined"
    :aria-selected="isCurrent"
    :aria-checked="treeCtx.showCheckbox ? isChecked : undefined"
    :aria-level="level"
    :aria-disabled="isDisabled"
    :tabindex="isDisabled ? -1 : 0"
    :draggable="treeCtx.draggable && !isDisabled"
    @click="handleClick"
    @keydown="handleKeydown"
    @dragstart="handleDragStart"
    @dragover="handleDragOver"
    @dragend="handleDragEnd"
  >
    <div :class="ns.e('content')" :style="{ paddingLeft: `${level * treeCtx.indent}px` }">
      <!-- Expand icon -->
      <span
        :class="[
          ns.e('expand-icon'),
          { [`${ns.e('expand-icon')}--leaf`]: isLeaf && !nodeData._loading },
        ]"
        @click="handleExpandClick"
      >
        <template v-if="nodeData._loading">
          <svg viewBox="0 0 24 24" fill="currentColor" class="zc-tree-node__loading">
            <path d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2z" opacity="0.3">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </template>
        <template v-else-if="canExpand">
          <svg viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </template>
      </span>

      <!-- Checkbox -->
      <span
        v-if="treeCtx.showCheckbox"
        :class="ns.e('checkbox')"
        role="checkbox"
        :aria-checked="isHalfChecked ? 'mixed' : isChecked"
        :aria-disabled="isDisabled"
        tabindex="-1"
        @click="handleCheckClick"
      >
        <span :class="ns.e('checkbox-inner')" />
      </span>

      <!-- Node label -->
      <span :class="ns.e('label')">
        <slot>
          <template
            v-for="(part, idx) in treeCtx.getHighlightParts(treeCtx.getNodeLabel(nodeData))"
            :key="idx"
          >
            <span v-if="part.highlight" class="zc-tree-node__label--highlight">{{
              part.text
            }}</span>
            <template v-else>{{ part.text }}</template>
          </template>
        </slot>
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcTreeNode supplementary styles
 * Core styles are defined in tree.vue (parent).
 * This block adds transitions and drag-drop visual feedback.
 * ============================================================ */

.zc-tree-node {
  transition: background-color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-tree-node__content {
  transition: background-color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-tree-node.is-drop-inner > .zc-tree-node__content {
  background-color: rgba(64, 158, 255, 0.1);
  outline: 1px dashed var(--color-zc-primary-500, #409eff);
  outline-offset: -1px;
}

.zc-tree-node__expand-icon {
  transition: transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}
</style>
