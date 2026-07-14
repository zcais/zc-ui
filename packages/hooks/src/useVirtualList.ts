import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
  type ComputedRef,
  type Ref,
  type ShallowRef,
} from 'vue'

export interface UseVirtualListOptions<T> {
  /** The full data list to virtualize */
  data: ComputedRef<T[]> | Ref<T[]>
  /** Fixed item height in pixels. Can be a reactive ref/computed for dynamic height. */
  itemHeight: number | ComputedRef<number> | Ref<number>
  /** Number of extra items to render above/below the visible area (default: 5) */
  overscan?: number
}

export interface VirtualListReturn<T> {
  /** Ref to attach to the scroll container element */
  containerRef: ShallowRef<HTMLElement | undefined>
  /** Visible items slice */
  visibleData: ComputedRef<T[]>
  /** Total height of the phantom content (for scroll bar) */
  totalHeight: ComputedRef<number>
  /** translateY value for the visible items wrapper */
  offsetY: ComputedRef<number>
  /** The start index of visible items (including overscan) */
  startIndex: ComputedRef<number>
  /** The end index (exclusive) of visible items */
  endIndex: ComputedRef<number>
  /** Call this on container @scroll event (or rely on auto-attached listener) */
  handleScroll: () => void
  /** Programmatically scroll to a specific index */
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void
}

/**
 * useVirtualList — a lightweight virtual scrolling composable.
 *
 * Computes which items fall within the visible viewport and only renders those
 * (plus an `overscan` buffer) to the DOM. This dramatically reduces DOM node
 * count for large lists (1000+ items).
 *
 * @example
 * ```ts
 * const { containerRef, visibleData, totalHeight, offsetY } = useVirtualList({
 *   data: computed(() => bigArray.value),
 *   itemHeight: 36,
 *   overscan: 5,
 * })
 * ```
 *
 * In template:
 * ```html
 * <div ref="containerRef" style="height: 300px; overflow-y: auto;">
 *   <div :style="{ height: totalHeight + 'px', position: 'relative' }">
 *     <div :style="{ transform: `translateY(${offsetY}px)` }">
 *       <div v-for="item in visibleData" :key="item.id" style="height: 36px;">
 *         {{ item.label }}
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @limitations
 * - Currently supports only **fixed item height** (variable height is not supported)
 * - Best suited for scenarios where all items have consistent height
 * - For variable height requirements, consider implementing size-based caching
 */
export function useVirtualList<T>(options: UseVirtualListOptions<T>): VirtualListReturn<T> {
  const { data, overscan = 5 } = options

  // Normalize itemHeight to a ComputedRef<number> for full reactivity
  const itemHeight = computed(() => {
    const raw = options.itemHeight
    if (typeof raw === 'number') return raw
    return raw.value
  })

  const containerRef = shallowRef<HTMLElement>()
  const scrollTop = ref(0)
  const viewportHeight = ref(0)

  // ResizeObserver to track container height changes
  let resizeObserver: ResizeObserver | null = null

  function measureContainer() {
    const el = containerRef.value
    if (el) {
      viewportHeight.value = el.clientHeight
    }
  }

  function handleScroll() {
    const el = containerRef.value
    if (el) {
      scrollTop.value = el.scrollTop
    }
  }

  function scrollToIndex(index: number, behavior: ScrollBehavior = 'auto') {
    const el = containerRef.value
    if (!el || typeof el.scrollTo !== 'function') return
    const clampedIndex = Math.max(0, Math.min(index, data.value.length - 1))
    el.scrollTo({ top: clampedIndex * itemHeight.value, behavior })
  }

  onMounted(() => {
    measureContainer()
    const el = containerRef.value
    if (el && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        measureContainer()
      })
      resizeObserver.observe(el)
    }
    // Also listen for scroll
    el?.addEventListener('scroll', handleScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    const el = containerRef.value
    el?.removeEventListener('scroll', handleScroll)
  })

  // Re-measure when container ref changes
  watch(containerRef, () => {
    measureContainer()
    containerRef.value?.addEventListener('scroll', handleScroll, { passive: true })
  })

  const totalCount = computed(() => data.value.length)

  const startIndex = computed(() => {
    const rawStart = Math.floor(scrollTop.value / itemHeight.value) - overscan
    return Math.max(0, rawStart)
  })

  const endIndex = computed(() => {
    const visibleCount =
      viewportHeight.value > 0
        ? Math.ceil(viewportHeight.value / itemHeight.value) + overscan * 2
        : totalCount.value
    const end = startIndex.value + visibleCount
    return Math.min(totalCount.value, end)
  })

  const visibleData = computed(() => {
    return data.value.slice(startIndex.value, endIndex.value)
  })

  const totalHeight = computed(() => totalCount.value * itemHeight.value)

  const offsetY = computed(() => startIndex.value * itemHeight.value)

  return {
    containerRef,
    visibleData,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    handleScroll,
    scrollToIndex,
  }
}
