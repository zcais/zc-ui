import { ref, type Ref } from 'vue'
import { isClient } from '@zc-ui/utils'
import { useEventListener, isRefTarget, type EventTargetLike } from './useEventListener'
import { useThrottleFn } from './useDebounce'

export type ScrollTarget = HTMLElement | Window | Document | string

/**
 * Options for useScroll.
 */
export interface UseScrollOptions {
  /** Throttle interval in ms. Default: 0 (no throttle) */
  throttle?: number
  /** Called when the element is scrolled to the top */
  onTop?: () => void
  /** Called when the element is scrolled to the bottom */
  onBottom?: () => void
  /** Offset (px) from top/bottom before onTop/onBottom fires. Default: 0 */
  offset?: number
}

/**
 * useScroll - Track scroll position of an element or window reactively.
 *
 * @example
 * const target = ref<HTMLElement | null>(null)
 * const { x, y, arrivedState, isScrolling } = useScroll(target)
 *
 * @example
 * // With window
 * const { y, isScrolling } = useScroll(window)
 */
export function useScroll(
  target: ScrollTarget | Ref<HTMLElement | null | undefined>,
  options: UseScrollOptions = {}
): {
  x: Ref<number>
  y: Ref<number>
  isScrolling: Ref<boolean>
  arrivedState: {
    left: Ref<boolean>
    right: Ref<boolean>
    top: Ref<boolean>
    bottom: Ref<boolean>
  }
} {
  const { throttle = 0, onTop, onBottom, offset = 0 } = options

  const x = ref(0)
  const y = ref(0)
  const isScrolling = ref(false)

  const arrivedState = {
    left: ref(true),
    right: ref(false),
    top: ref(true),
    bottom: ref(false),
  }

  let scrollTimer: ReturnType<typeof setTimeout> | null = null

  const computeScroll = () => {
    let el: Element | Window | null = null

    if (typeof target === 'string') {
      el = isClient ? document.querySelector(target) : null
    } else if (isRefTarget(target)) {
      el = target.value ?? null
    } else if (target === window || target === document) {
      el = window
    } else {
      el = target as HTMLElement
    }

    if (!el) return

    let scrollLeft: number
    let scrollTop: number
    let scrollWidth: number
    let scrollHeight: number
    let clientWidth: number
    let clientHeight: number

    if (el === window) {
      scrollLeft = window.scrollX || window.pageXOffset
      scrollTop = window.scrollY || window.pageYOffset
      scrollWidth = document.documentElement.scrollWidth
      scrollHeight = document.documentElement.scrollHeight
      clientWidth = window.innerWidth
      clientHeight = window.innerHeight
    } else {
      const htmlEl = el as HTMLElement
      scrollLeft = htmlEl.scrollLeft
      scrollTop = htmlEl.scrollTop
      scrollWidth = htmlEl.scrollWidth
      scrollHeight = htmlEl.scrollHeight
      clientWidth = htmlEl.clientWidth
      clientHeight = htmlEl.clientHeight
    }

    x.value = scrollLeft
    y.value = scrollTop

    arrivedState.left.value = scrollLeft <= offset
    arrivedState.right.value = scrollLeft + clientWidth >= scrollWidth - offset
    arrivedState.top.value = scrollTop <= offset
    arrivedState.bottom.value = scrollTop + clientHeight >= scrollHeight - offset

    if (arrivedState.top.value && onTop) onTop()
    if (arrivedState.bottom.value && onBottom) onBottom()
  }

  const throttledCompute = throttle > 0 ? useThrottleFn(computeScroll, throttle) : computeScroll

  const onScrollWrapper = () => {
    isScrolling.value = true
    throttledCompute()
    if (scrollTimer) clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      isScrolling.value = false
    }, 200)
  }

  // Determine the listener target
  let listenTarget: EventTargetLike | Ref<EventTargetLike | null | undefined> | null = null

  if (typeof target === 'string') {
    listenTarget = isClient ? (document.querySelector(target) as HTMLElement | null) : null
  } else if (isRefTarget(target)) {
    // Will be resolved in onMounted via useEventListener
    listenTarget = target as Ref<EventTargetLike | null | undefined>
  } else if (target === window || target === document) {
    listenTarget = window
  } else {
    listenTarget = target as HTMLElement
  }

  useEventListener(listenTarget, 'scroll', onScrollWrapper as EventListener, {
    passive: true,
    immediate: true,
  })

  return { x, y, isScrolling, arrivedState }
}
