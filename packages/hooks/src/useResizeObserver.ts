import { ref, type Ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import { isClient } from '@zc-ui/utils'
import { isRefTarget } from './useEventListener'

export interface ResizeObserverEntry {
  target: Element
  contentRect: DOMRectReadOnly
  borderBoxSize?: ReadonlyArray<ResizeObserverSize>
  contentBoxSize?: ReadonlyArray<ResizeObserverSize>
}

/**
 * useResizeObserver - Observe size changes of an element reactively.
 *
 * Automatically disconnects on component unmount.
 *
 * @example
 * const target = ref<HTMLElement | null>(null)
 * const { width, height, contentRect, stop } = useResizeObserver(target)
 */
export function useResizeObserver(
  target: HTMLElement | Ref<HTMLElement | null | undefined>,
  callback?: (entries: ResizeObserverEntry[]) => void
): {
  width: Ref<number>
  height: Ref<number>
  contentRect: Ref<DOMRectReadOnly | null>
  stop: () => void
} {
  const width = ref(0)
  const height = ref(0)
  const contentRect = ref<DOMRectReadOnly | null>(null)
  let observer: ResizeObserver | null = null

  const stop = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const observe = () => {
    if (!isClient || typeof ResizeObserver === 'undefined') return

    const el = isRefTarget(target) ? target.value : target
    if (!el) return

    stop()

    observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return

      width.value = entry.contentRect.width
      height.value = entry.contentRect.height
      contentRect.value = entry.contentRect

      if (callback) {
        callback(entries as unknown as ResizeObserverEntry[])
      }
    })

    observer.observe(el)
  }

  if (getCurrentInstance()) {
    onMounted(observe)
    onBeforeUnmount(stop)
  } else {
    observe()
  }

  return { width, height, contentRect, stop }
}
