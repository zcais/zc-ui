<script setup lang="ts">
import { computed, ref, onBeforeUnmount, provide, watch, useSlots, type VNode } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcSplitter' })

export type SplitterDirection = 'horizontal' | 'vertical'

const props = withDefaults(
  defineProps<{
    /** Layout direction of the panels */
    direction?: SplitterDirection
    /** Initial sizes of panels (percentages), e.g. [30, 70] */
    sizes?: number[]
    /** Minimum size percentage for each panel */
    minSizes?: number[]
    /** Maximum size percentage for each panel */
    maxSizes?: number[]
    /** Width of the drag handle in px */
    gutterSize?: number
    /** Whether panels can be collapsed by double-clicking the gutter */
    collapsible?: boolean
    /** Disabled dragging */
    disabled?: boolean
    /** Show a visual indicator on the gutter */
    showGutterHandle?: boolean
  }>(),
  {
    direction: 'horizontal',
    sizes: () => [50, 50],
    minSizes: () => [],
    maxSizes: () => [],
    gutterSize: 6,
    collapsible: false,
    disabled: false,
    showGutterHandle: true,
  }
)

const emit = defineEmits<{
  (e: 'update:sizes', sizes: number[]): void
  (e: 'resize', sizes: number[]): void
  (e: 'collapsed', index: number, collapsed: boolean): void
}>()

const ns = useNamespace('splitter')
const slots = useSlots()
const containerRef = ref<HTMLElement | null>(null)

/** Current sizes in percentage */
const panelSizes = ref<number[]>([...props.sizes])
/** Collapsed state per panel */
const collapsedStates = ref<boolean[]>([])

/** Number of panels detected from slots */
const panelCount = computed(() => {
  if (!slots.default) return 0
  const vnodes = slots
    .default()
    .filter((v): v is VNode => typeof v.type === 'object' || typeof v.type === 'string')
  return vnodes.length
})

// Ensure sizes array matches panel count
watch(
  panelCount,
  (count) => {
    if (count > 0 && panelSizes.value.length !== count) {
      const equal = 100 / count
      panelSizes.value = Array(count).fill(equal)
      collapsedStates.value = Array(count).fill(false)
    }
  },
  { immediate: true }
)

watch(
  () => props.sizes,
  (newSizes) => {
    if (newSizes.length === panelCount.value) {
      panelSizes.value = [...newSizes]
    }
  }
)

const isHorizontal = computed(() => props.direction === 'horizontal')

const containerClasses = computed(() => [
  ns.b(),
  ns.m(props.direction),
  ns.is('disabled', props.disabled),
])

/** Get min size for a panel (default 10%) */
function getMinSize(index: number): number {
  return props.minSizes[index] ?? 10
}

/** Get max size for a panel (default 90%) */
function getMaxSize(index: number): number {
  return props.maxSizes[index] ?? 90
}

// ---- Drag logic ----
let dragging = false
let dragGutterIndex = -1
let dragStartPos = 0
let dragStartSizes: number[] = []
let containerSize = 0

function onMouseDown(e: MouseEvent, gutterIndex: number) {
  if (props.disabled) return
  e.preventDefault()

  dragging = true
  dragGutterIndex = gutterIndex
  dragStartPos = isHorizontal.value ? e.clientX : e.clientY
  dragStartSizes = [...panelSizes.value]

  const rect = containerRef.value?.getBoundingClientRect()
  containerSize = isHorizontal.value ? (rect?.width ?? 0) : (rect?.height ?? 0)

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.body.style.cursor = isHorizontal.value ? 'col-resize' : 'row-resize'
  document.body.style.userSelect = 'none'
}

function onMouseMove(e: MouseEvent) {
  if (!dragging) return

  const currentPos = isHorizontal.value ? e.clientX : e.clientY
  const delta = currentPos - dragStartPos
  const deltaPercent = (delta / containerSize) * 100

  const prevIndex = dragGutterIndex
  const nextIndex = dragGutterIndex + 1

  let newPrevSize = dragStartSizes[prevIndex] + deltaPercent
  let newNextSize = dragStartSizes[nextIndex] - deltaPercent

  // Apply constraints
  const minPrev = getMinSize(prevIndex)
  const minNext = getMinSize(nextIndex)
  const maxPrev = getMaxSize(prevIndex)
  const maxNext = getMaxSize(nextIndex)

  if (newPrevSize < minPrev) {
    newPrevSize = minPrev
    newNextSize = dragStartSizes[prevIndex] + dragStartSizes[nextIndex] - minPrev
  }
  if (newNextSize < minNext) {
    newNextSize = minNext
    newPrevSize = dragStartSizes[prevIndex] + dragStartSizes[nextIndex] - minNext
  }
  if (newPrevSize > maxPrev) {
    newPrevSize = maxPrev
    newNextSize = dragStartSizes[prevIndex] + dragStartSizes[nextIndex] - maxPrev
  }
  if (newNextSize > maxNext) {
    newNextSize = maxNext
    newPrevSize = dragStartSizes[prevIndex] + dragStartSizes[nextIndex] - maxNext
  }

  panelSizes.value[prevIndex] = newPrevSize
  panelSizes.value[nextIndex] = newNextSize
  // Trigger reactivity
  panelSizes.value = [...panelSizes.value]

  emit('resize', [...panelSizes.value])
}

function onMouseUp() {
  if (dragging) {
    dragging = false
    emit('update:sizes', [...panelSizes.value])
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
}

// ---- Collapse logic ----
function onGutterDoubleClick(gutterIndex: number) {
  if (!props.collapsible) return

  const prevIndex = gutterIndex
  const nextIndex = gutterIndex + 1
  const isPrevCollapsed = collapsedStates.value[prevIndex]

  if (isPrevCollapsed) {
    // Restore
    collapsedStates.value[prevIndex] = false
    panelSizes.value[prevIndex] = panelSizes.value[prevIndex] || 50
    // Re-normalize
    const total = panelSizes.value.reduce((a, b) => a + b, 0)
    if (total !== 100) {
      panelSizes.value = panelSizes.value.map((s) => (s / total) * 100)
    }
    emit('collapsed', prevIndex, false)
  } else {
    // Collapse previous panel
    const prevSize = panelSizes.value[prevIndex]
    collapsedStates.value[prevIndex] = true
    panelSizes.value[prevIndex] = 0
    panelSizes.value[nextIndex] += prevSize
    emit('collapsed', prevIndex, true)
  }
  panelSizes.value = [...panelSizes.value]
  emit('update:sizes', [...panelSizes.value])
}

/** Style object for each panel */
function getPanelStyle(index: number) {
  const size = panelSizes.value[index] ?? 0
  const isCollapsed = collapsedStates.value[index]
  if (props.direction === 'horizontal') {
    return {
      width: isCollapsed ? '0%' : `${size}%`,
      minWidth: isCollapsed ? '0' : undefined,
      overflow: 'hidden',
    }
  }
  return {
    height: isCollapsed ? '0%' : `${size}%`,
    minHeight: isCollapsed ? '0' : undefined,
    overflow: 'hidden',
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

// Provide context for child panel components if needed
provide('zcSplitter', {
  direction: computed(() => props.direction),
})
</script>

<template>
  <div ref="containerRef" :class="containerClasses">
    <template v-if="slots.default">
      <template v-for="(vnode, index) in slots.default()" :key="index">
        <div
          v-if="typeof vnode.type === 'object' || typeof vnode.type === 'string'"
          :class="[ns.e('panel'), ns.is('collapsed', collapsedStates[index])]"
          :style="getPanelStyle(index)"
        >
          <component :is="vnode" />
        </div>
        <!-- Gutter between panels -->
        <div
          v-if="index < panelCount - 1 && !disabled"
          :class="ns.e('gutter')"
          :style="{
            [isHorizontal ? 'width' : 'height']: `${gutterSize}px`,
            cursor: isHorizontal ? 'col-resize' : 'row-resize',
          }"
          @mousedown="onMouseDown($event, index)"
          @dblclick="onGutterDoubleClick(index)"
        >
          <div v-if="showGutterHandle" :class="ns.e('gutter-handle')">
            <span :class="ns.e('gutter-dots')" />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcSplitter styles
 * BEM naming: zc-splitter / zc-splitter__panel / zc-splitter__gutter
 * ============================================================ */

.zc-splitter {
  --zc-splitter-gutter-color: var(--color-zc-border-base, #dcdfe6);
  --zc-splitter-gutter-hover-color: var(--color-zc-primary, #409eff);
  --zc-splitter-gutter-handle-color: var(--color-zc-text-placeholder, #a8abb2);
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* ---- Horizontal ---- */
.zc-splitter--horizontal {
  flex-direction: row;
}

/* ---- Vertical ---- */
.zc-splitter--vertical {
  flex-direction: column;
}

/* ---- Panel ---- */
.zc-splitter__panel {
  flex-shrink: 0;
  height: 100%;
  transition: flex-basis 0.1s ease-out;
}

.zc-splitter__panel.is-collapsed {
  padding: 0 !important;
}

/* ---- Gutter ---- */
.zc-splitter__gutter {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--zc-splitter-gutter-color);
  position: relative;
  transition: background-color 0.2s;
  z-index: 1;
}

.zc-splitter__gutter:hover {
  background-color: var(--zc-splitter-gutter-hover-color);
}

/* ---- Gutter Handle ---- */
.zc-splitter__gutter-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* ---- Gutter Dots (visual indicator) ---- */
.zc-splitter__gutter-dots {
  display: block;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: var(--zc-splitter-gutter-handle-color);
  box-shadow:
    0 -6px 0 var(--zc-splitter-gutter-handle-color),
    0 6px 0 var(--zc-splitter-gutter-handle-color);
  opacity: 0.6;
}

.zc-splitter__gutter:hover .zc-splitter__gutter-dots {
  opacity: 1;
}

/* ---- Disabled ---- */
.zc-splitter.is-disabled .zc-splitter__gutter {
  cursor: default;
  pointer-events: none;
}

/* ---- Dark mode ---- */
.dark .zc-splitter {
  --zc-splitter-gutter-color: var(--color-zc-border-base, #414243);
  --zc-splitter-gutter-handle-color: var(--color-zc-text-placeholder, #6b6e72);
}
</style>
