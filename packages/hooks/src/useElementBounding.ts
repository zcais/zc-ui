import { onMounted, onBeforeUnmount, watch, toRefs, type Ref, reactive } from 'vue'

export interface ElementBounding {
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
  x: number
  y: number
}

const initialState = (): ElementBounding => ({
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  x: 0,
  y: 0,
})

/**
 * Reactive bounding rect of an element.
 * Automatically updates on scroll and resize.
 *
 * @example
 * ```ts
 * const el = ref<HTMLElement>()
 * const { width, height, top, left } = useElementBounding(el)
 * ```
 */
export function useElementBounding(target: Ref<HTMLElement | null | undefined>) {
  const rect = reactive(initialState())

  function update() {
    const el = target.value
    if (!el) {
      Object.assign(rect, initialState())
      return
    }
    const domRect = el.getBoundingClientRect()
    rect.width = domRect.width
    rect.height = domRect.height
    rect.top = domRect.top
    rect.right = domRect.right
    rect.bottom = domRect.bottom
    rect.left = domRect.left
    rect.x = domRect.x
    rect.y = domRect.y
  }

  let resizeObserver: ResizeObserver | null = null

  function start() {
    update()

    // Listen to scroll events
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })

    // Use ResizeObserver if supported
    if (typeof ResizeObserver !== 'undefined' && target.value) {
      resizeObserver = new ResizeObserver(update)
      resizeObserver.observe(target.value)
    }
  }

  function stop() {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }

  onMounted(start)

  // Re-start when target changes
  watch(target, () => {
    stop()
    start()
  })

  onBeforeUnmount(stop)

  return {
    ...toRefs(rect),
    update,
  }
}

export default useElementBounding
