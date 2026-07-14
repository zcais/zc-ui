import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'
import { isClient } from '@zc-ui/utils'

export interface ElementSize {
  width: number
  height: number
}

export interface UseSizeReturn {
  width: Ref<number>
  height: Ref<number>
}

/**
 * useSize - Track the width and height of a DOM element reactively.
 * Uses ResizeObserver under the hood and cleans up automatically.
 *
 * @example
 * const elRef = ref<HTMLElement | null>(null)
 * const { width, height } = useSize(elRef)
 */
export function useSize(target: Ref<HTMLElement | null | undefined>): UseSizeReturn {
  const width = ref(0)
  const height = ref(0)

  if (!isClient) {
    return { width, height }
  }

  let resizeObserver: ResizeObserver | null = null

  const updateSize = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    width.value = rect.width
    height.value = rect.height
  }

  onMounted(() => {
    const el = target.value
    if (!el) return

    // Initial measurement
    updateSize(el)

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: w, height: h } = entry.contentRect
          width.value = w
          height.value = h
        }
      })
      resizeObserver.observe(el)
    }
  })

  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  })

  return { width, height }
}
