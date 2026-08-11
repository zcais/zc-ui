<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  nextTick,
  onMounted,
  useSlots,
  Comment,
  Fragment,
  type VNode,
} from 'vue'
import { useNamespace, useResizeObserver } from '@zc-ui/hooks'

defineOptions({ name: 'ZcMasonry' })

const props = withDefaults(
  defineProps<{
    /** Number of columns. */
    columns?: number
    /** Gap between items (px number or CSS string like '1rem'). */
    gap?: number | string
    /** Use CSS `column-count` approach (true) or JS column-balancing (false). */
    useColumns?: boolean
    /** Responsive breakpoints: keys are min-width in px, values are column counts.
     *  Example: `{ 768: 2, 1200: 3, 1920: 4 }` */
    breakpoints?: Record<number, number>
    /** HTML tag for the container element. */
    as?: string
  }>(),
  {
    columns: 3,
    gap: 16,
    useColumns: true,
    breakpoints: undefined,
    as: 'div',
  }
)

const emit = defineEmits<{
  (e: 'item-click', item: any, index: number): void
}>()

const ns = useNamespace('masonry')
const slots = useSlots()

/* ------------------------------------------------------------------ *
 * Refs
 * ------------------------------------------------------------------ */

const containerRef = ref<HTMLElement | null>(null)

/* ------------------------------------------------------------------ *
 * Gap helpers
 * ------------------------------------------------------------------ */

function resolveGap(): string {
  if (typeof props.gap === 'number') return `${props.gap}px`
  return props.gap
}

function gapAsNumber(): number {
  if (typeof props.gap === 'number') return props.gap
  return parseFloat(props.gap) || 0
}

/* ------------------------------------------------------------------ *
 * Responsive breakpoints via ResizeObserver
 * ------------------------------------------------------------------ */

const { width: containerWidth } = useResizeObserver(containerRef)

const effectiveColumns = computed(() => {
  const defaultCols = props.columns ?? 3
  if (!props.breakpoints || containerWidth.value === 0) return defaultCols

  // Sort breakpoints descending by min-width so we match the largest first
  const sorted = Object.entries(props.breakpoints)
    .map(([k, v]) => ({ minWidth: Number(k), cols: v }))
    .sort((a, b) => b.minWidth - a.minWidth)

  for (const bp of sorted) {
    if (containerWidth.value >= bp.minWidth) return bp.cols
  }

  // Container narrower than the smallest breakpoint → 1 column
  return 1
})

/* ------------------------------------------------------------------ *
 * Collect slot VNodes
 * ------------------------------------------------------------------ */

interface MasonryEntry {
  vnode: VNode
  index: number
  key: string | number
}

function collectEntries(): MasonryEntry[] {
  const children = slots.default?.() ?? []
  return children
    .filter(
      (child) =>
        child.type !== Comment &&
        !(
          child.type === Fragment &&
          (child.children == null || (Array.isArray(child.children) && child.children.length === 0))
        )
    )
    .map((vnode, index) => ({
      vnode,
      index,
      key: vnode.key != null ? (vnode.key as string | number) : index,
    }))
}

const allEntries = computed(() => collectEntries())

/* ------------------------------------------------------------------ *
 * CSS columns mode — style only (items flow naturally)
 * ------------------------------------------------------------------ */

const containerStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {
    '--zc-masonry-gap': resolveGap(),
  }

  if (props.useColumns) {
    style['column-count'] = String(effectiveColumns.value)
    style['column-gap'] = resolveGap()
  }

  return style
})

/* ------------------------------------------------------------------ *
 * JS balanced mode — distribute items across shortest columns
 * ------------------------------------------------------------------ */

const distributedColumns = ref<MasonryEntry[][]>([])

/** Round-robin distribution (fallback / pre-measurement). */
function roundRobin(): MasonryEntry[][] {
  const numCols = Math.max(1, effectiveColumns.value)
  const cols: MasonryEntry[][] = Array.from({ length: numCols }, () => [])
  allEntries.value.forEach((entry, i) => cols[i % numCols].push(entry))
  return cols
}

/** Greedy measurement-based redistribution to the shortest column. */
async function rebalance(): Promise<void> {
  // 1 — Ensure items are in the DOM (initial round-robin)
  distributedColumns.value = roundRobin()

  // 2 — Wait for the DOM to reflect the distribution
  await nextTick()
  if (!containerRef.value) return

  const entries = allEntries.value
  if (entries.length === 0) return

  // 3 — Measure item heights, sorting back to original index order
  const els = containerRef.value.querySelectorAll<HTMLElement>('[data-masonry-item]')
  const sorted = Array.from(els).sort(
    (a, b) => Number(a.dataset.masonryIndex) - Number(b.dataset.masonryIndex)
  )

  if (sorted.length !== entries.length) return

  const heights = sorted.map((el) => el.offsetHeight)
  const gap = gapAsNumber()
  const numCols = Math.max(1, effectiveColumns.value)

  // 4 — Greedy: assign each item to the currently shortest column
  const colHeights: number[] = new Array(numCols).fill(0)
  const cols: MasonryEntry[][] = Array.from({ length: numCols }, () => [])

  for (let i = 0; i < entries.length; i++) {
    let minIdx = 0
    for (let j = 1; j < numCols; j++) {
      if (colHeights[j] < colHeights[minIdx]) minIdx = j
    }
    cols[minIdx].push(entries[i])
    colHeights[minIdx] += heights[i] + gap
  }

  distributedColumns.value = cols
}

/* ------------------------------------------------------------------ *
 * Rebalance triggers
 * ------------------------------------------------------------------ */

// Initial state so the first paint has content
distributedColumns.value = roundRobin()

onMounted(() => {
  if (!props.useColumns) {
    rebalance()
  }
})

watch([effectiveColumns, allEntries, () => props.gap, () => props.useColumns], () => {
  if (!props.useColumns) {
    rebalance()
  }
})

/* ------------------------------------------------------------------ *
 * Public API — manual relayout
 * ------------------------------------------------------------------ */

defineExpose({
  /** Trigger a manual re-layout (useful after async content loads). */
  relayout: () => {
    if (!props.useColumns) {
      rebalance()
    }
  },
})

/* ------------------------------------------------------------------ *
 * Classes & event handler
 * ------------------------------------------------------------------ */

const containerClasses = computed(() => [
  ns.b(),
  ns.is('css-columns', props.useColumns),
  ns.is('js-balanced', !props.useColumns),
])

function onItemClick(item: VNode, index: number): void {
  emit('item-click', item, index)
}
</script>

<template>
  <component :is="as" ref="containerRef" :class="containerClasses" :style="containerStyle">
    <!-- CSS columns mode -->
    <template v-if="useColumns">
      <div
        v-for="entry in allEntries"
        :key="entry.key"
        :class="ns.e('item')"
        data-masonry-item
        :data-masonry-index="entry.index"
        @click="onItemClick(entry.vnode, entry.index)"
      >
        <component :is="entry.vnode" />
      </div>
    </template>

    <!-- JS balanced mode -->
    <template v-else>
      <div
        v-for="(col, colIdx) in distributedColumns"
        :key="`masonry-col-${colIdx}`"
        :class="ns.e('column')"
      >
        <div
          v-for="entry in col"
          :key="entry.key"
          :class="ns.e('item')"
          data-masonry-item
          :data-masonry-index="entry.index"
          @click="onItemClick(entry.vnode, entry.index)"
        >
          <component :is="entry.vnode" />
        </div>
      </div>
    </template>
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcMasonry styles
 * BEM naming: zc-masonry / zc-masonry__item / zc-masonry__column
 * Two rendering modes:
 *   1. CSS columns  (useColumns=true)  — native column-count
 *   2. JS balanced  (useColumns=false) — flex + greedy balancing
 * ============================================================ */

.zc-masonry {
  /* Component-level CSS variables (overridable via theming) */
  --zc-masonry-gap: 16px;
  --zc-masonry-bg: transparent;
  --zc-masonry-item-radius: var(--radius-zc-base, 4px);
  --zc-masonry-transition: transform 0.3s ease, opacity 0.3s ease;

  box-sizing: border-box;
  width: 100%;
}

/* ---- CSS columns mode ---- */

.zc-masonry.is-css-columns {
  column-gap: var(--zc-masonry-gap);
}

.zc-masonry.is-css-columns .zc-masonry__item {
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: var(--zc-masonry-gap);
}

/* ---- JS balanced mode ---- */

.zc-masonry.is-js-balanced {
  display: flex;
  align-items: flex-start;
  gap: var(--zc-masonry-gap);
}

.zc-masonry__column {
  flex: 1 1 0%;
  min-width: 0;
  box-sizing: border-box;
}

.zc-masonry.is-js-balanced .zc-masonry__item {
  margin-bottom: var(--zc-masonry-gap);
}

/* Remove trailing margin on last item per column (JS mode) */
.zc-masonry.is-js-balanced .zc-masonry__column > .zc-masonry__item:last-child {
  margin-bottom: 0;
}

/* ---- Common item styles ---- */

.zc-masonry__item {
  box-sizing: border-box;
  transition: var(--zc-masonry-transition);
}

/* ---- Item enter animation ---- */

@keyframes zc-masonry-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.zc-masonry__item {
  animation: zc-masonry-fade-in 0.35s ease both;
}

/* Respect reduced-motion preference */
@media (prefers-reduced-motion: reduce) {
  .zc-masonry__item {
    animation: none;
    transition: none;
  }
}

/* ---- Dark mode ---- */

.dark .zc-masonry {
  --zc-masonry-bg: transparent;
}

/* ---- Item hover (subtle lift) ---- */

.zc-masonry__item:hover {
  transform: translateY(-2px);
}
</style>
