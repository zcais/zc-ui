import type { Directive, DirectiveBinding } from 'vue'
import { isClient } from '@zc-ui/utils'

export interface InfiniteScrollOptions {
  /** Distance (in px) from bottom to trigger load. Default: 0 */
  distance?: number
  /** Whether the directive is disabled. Default: false */
  disabled?: boolean
  /** Whether to call the handler immediately on mount. Default: false */
  immediate?: boolean
}

/** The handler function bound via v-infinite-scroll */
type InfiniteScrollHandler = () => void | Promise<void>

interface InfiniteScrollElement extends HTMLElement {
  __zcInfiniteScroll?: {
    handler: InfiniteScrollHandler
    options: InfiniteScrollOptions
    cleanup: () => void
  }
}

/** Default options */
const DEFAULT_DISTANCE = 0
const DEFAULT_DELAY = 200

/**
 * Throttle a function to avoid calling too frequently.
 */
function throttle<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const now = Date.now()
    const remaining = delay - (now - lastCall)

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      lastCall = now
      fn(...args)
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now()
        timer = null
        fn(...args)
      }, remaining)
    }
  }
}

/**
 * Finds the scroll container: either the element itself (if scrollable)
 * or the nearest scrollable ancestor, or document/window.
 */
function getScrollContainer(el: HTMLElement): HTMLElement | Window {
  let parent: HTMLElement | null = el
  while (parent) {
    // Stop at body
    if (parent.tagName === 'BODY') {
      return window
    }
    const style = getComputedStyle(parent)
    const overflowY = style.overflowY
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      return parent
    }
    parent = parent.parentElement
  }
  return window
}

/**
 * Checks whether the scroll position is within the distance threshold
 * from the bottom.
 */
function isNearBottom(container: HTMLElement | Window, distance: number): boolean {
  if (container === window) {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    const clientHeight = document.documentElement.clientHeight || window.innerHeight
    return scrollTop + clientHeight >= scrollHeight - distance
  }
  const el = container as HTMLElement
  return el.scrollTop + el.clientHeight >= el.scrollHeight - distance
}

/**
 * v-infinite-scroll directive
 *
 * @example
 * ```html
 * <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
 *      :infinite-scroll-distance="10">
 *   <div v-for="item in list" :key="item.id">{{ item.name }}</div>
 * </div>
 * ```
 */
export const ZcInfiniteScrollDirective: Directive = {
  mounted(el: InfiniteScrollElement, binding: DirectiveBinding) {
    if (!isClient) return

    const handler = binding.value as InfiniteScrollHandler
    if (typeof handler !== 'function') {
      console.warn('[ZcInfiniteScroll] directive value must be a function')
      return
    }

    // Read options from element attributes (set via modifiers/attrs)
    function getOption<T>(key: string, defaultValue: T, coerce?: (v: string) => T): T {
      // Check modifiers (e.g., .disabled)
      if (binding.modifiers[key]) return true as unknown as T
      // Check attributes on the element (e.g., :infinite-scroll-disabled)
      const attr = el.getAttribute(`infinite-scroll-${key}`)
      if (attr !== null) {
        return coerce ? coerce(attr) : (attr as unknown as T)
      }
      return defaultValue
    }

    const options: InfiniteScrollOptions = {
      distance: getOption('distance', DEFAULT_DISTANCE, Number),
      disabled: getOption('disabled', false, (v) => v === 'true'),
      immediate: getOption('immediate', false, (v) => v === 'true'),
    }

    // Watch for attribute changes
    const observer = new MutationObserver(() => {
      const newDisabled = el.getAttribute('infinite-scroll-disabled')
      if (newDisabled !== null) {
        __zcInfiniteScroll.options.disabled = newDisabled === 'true'
      }
    })
    observer.observe(el, { attributes: true, attributeFilter: ['infinite-scroll-disabled'] })

    const scrollContainer = getScrollContainer(el)

    const throttledCheck = throttle(() => {
      if (__zcInfiniteScroll.options.disabled) return
      const dist = Number(el.getAttribute('infinite-scroll-distance')) || DEFAULT_DISTANCE
      if (isNearBottom(scrollContainer, dist)) {
        handler()
      }
    }, DEFAULT_DELAY)

    scrollContainer.addEventListener('scroll', throttledCheck, { passive: true })

    function cleanup() {
      scrollContainer.removeEventListener('scroll', throttledCheck)
      observer.disconnect()
    }

    const __zcInfiniteScroll = { handler, options, cleanup }
    el.__zcInfiniteScroll = __zcInfiniteScroll

    // Immediate check on mount
    if (options.immediate) {
      nextTick(() => throttledCheck())
    }
  },

  unmounted(el: InfiniteScrollElement) {
    if (el.__zcInfiniteScroll) {
      el.__zcInfiniteScroll.cleanup()
      delete el.__zcInfiniteScroll
    }
  },
}

/** Simple nextTick polyfill for directive usage */
function nextTick(cb: () => void) {
  setTimeout(cb, 0)
}

export default ZcInfiniteScrollDirective
