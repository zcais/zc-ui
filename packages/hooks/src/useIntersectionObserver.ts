import { ref, type Ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import { isClient } from '@zc-ui/utils'
import { isRefTarget } from './useEventListener'

/**
 * Options for useIntersectionObserver.
 */
export interface UseIntersectionObserverOptions {
  /** A root element to use as the viewport for checking visibility. Default: browser viewport */
  root?: Element | null
  /** Margin around the root. CSS margin string. Default: '0px' */
  rootMargin?: string
  /** Visibility threshold(s) at which the callback fires. Default: 0.1 */
  threshold?: number | number[]
}

/**
 * useIntersectionObserver - Detect when an element enters or leaves the viewport.
 *
 * Automatically disconnects on component unmount.
 *
 * @example
 * const target = ref<HTMLElement | null>(null)
 * const { isIntersecting, stop } = useIntersectionObserver(target, ([entry]) => {
 *   console.log('Visible:', entry.isIntersecting)
 * })
 */
export function useIntersectionObserver(
  target: HTMLElement | Ref<HTMLElement | null | undefined>,
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: UseIntersectionObserverOptions = {}
): {
  isIntersecting: Ref<boolean>
  stop: () => void
} {
  const { root = null, rootMargin = '0px', threshold = 0.1 } = options
  const isIntersecting = ref(false)
  let observer: IntersectionObserver | null = null

  const stop = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const observe = () => {
    if (!isClient || typeof IntersectionObserver === 'undefined') return

    const el = isRefTarget(target) ? target.value : target
    if (!el) return

    stop()

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersecting.value = entry.isIntersecting
        }
        callback(entries)
      },
      { root, rootMargin, threshold }
    )

    observer.observe(el)
  }

  if (getCurrentInstance()) {
    onMounted(observe)
    onBeforeUnmount(stop)
  } else {
    // Non-component context: observe immediately
    observe()
  }

  return { isIntersecting, stop }
}
