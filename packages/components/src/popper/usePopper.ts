import { ref, watch, toValue, nextTick, type Ref, type CSSProperties } from 'vue'
import { useEventListener } from '@zc-ui/hooks'
import { computePosition } from './computePosition'
import type { PopperPlacement, PositionResult, ViewportSize } from './types'

export type PopperStrategy = 'fixed' | 'absolute'

export interface UsePopperOptions {
  reference?: (() => HTMLElement | null | undefined) | Ref<HTMLElement | null | undefined>
  virtualReference?: Ref<{ x: number; y: number } | null | undefined>
  popper?: (() => HTMLElement | null | undefined) | Ref<HTMLElement | null | undefined>
  placement: Ref<PopperPlacement> | PopperPlacement
  offset: Ref<number> | number
  flip?: Ref<boolean> | boolean
  preventOverflow?: Ref<boolean> | boolean
  boundaryPadding?: Ref<number> | number
  viewport?: Ref<ViewportSize | null | undefined>
  /** Positioning strategy: 'fixed' (viewport-relative) or 'absolute' (offsetParent-relative) */
  strategy?: Ref<PopperStrategy> | PopperStrategy
  /** When the popper becomes visible, re-run positioning (handles v-show/v-if delayed mount) */
  visible?: Ref<boolean>
}

export interface UsePopperReturn {
  styles: Ref<CSSProperties>
  actualPlacement: Ref<PopperPlacement>
  arrowStyles: Ref<CSSProperties>
  update: () => void
  /** Stop all listeners and watchers (required for directive/imperative contexts) */
  stop: () => void
}

export function usePopper(options: UsePopperOptions): UsePopperReturn {
  const styles = ref<CSSProperties>({ position: 'fixed', top: '0px', left: '0px' })
  const actualPlacement = ref<PopperPlacement>(toValue(options.placement))
  const arrowStyles = ref<CSSProperties>({})

  const scrollListeners = new Map<HTMLElement, () => void>()
  const stopFns: Array<() => void> = []
  const stopWatches: Array<() => void> = []

  function getViewportSize(): ViewportSize {
    if (typeof window === 'undefined') return { width: 1024, height: 768 }
    return { width: window.innerWidth, height: window.innerHeight }
  }

  function resolveRefRect(): { x: number; y: number; width: number; height: number } | null {
    const virtualRef = toValue(options.virtualReference)
    if (virtualRef) {
      return { x: virtualRef.x, y: virtualRef.y, width: 0, height: 0 }
    }
    const referenceEl = options.reference ? toValue(options.reference) : null
    if (!referenceEl) return null
    const rect = referenceEl.getBoundingClientRect()
    setupScrollListeners(referenceEl)
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  }

  function update() {
    const popperEl = options.popper ? toValue(options.popper) : null
    if (!popperEl) return

    const viewport = toValue(options.viewport) ?? getViewportSize()
    const placement = toValue(options.placement)
    const offset = toValue(options.offset)
    const refRect = resolveRefRect()
    if (!refRect) return

    const popperSize = {
      width: popperEl.offsetWidth || 0,
      height: popperEl.offsetHeight || 0,
    }

    const result: PositionResult = computePosition({
      reference: refRect,
      popperSize,
      placement,
      offset,
      viewport,
      flip: toValue(options.flip) ?? true,
      preventOverflow: toValue(options.preventOverflow) ?? true,
      boundaryPadding: toValue(options.boundaryPadding) ?? 8,
    })

    applyStyles(popperEl, result)
    actualPlacement.value = result.placement
  }

  function applyStyles(popperEl: HTMLElement, result: PositionResult) {
    const strategy = toValue(options.strategy) ?? 'fixed'
    if (strategy === 'absolute') {
      const offsetParent = popperEl.offsetParent as HTMLElement | null
      if (offsetParent) {
        const parentRect = offsetParent.getBoundingClientRect()
        styles.value = {
          position: 'absolute',
          top: `${result.y - parentRect.top - offsetParent.clientTop}px`,
          left: `${result.x - parentRect.left - offsetParent.clientLeft}px`,
        }
      } else {
        styles.value = {
          position: 'absolute',
          top: `${result.y}px`,
          left: `${result.x}px`,
        }
      }
    } else {
      styles.value = {
        position: 'fixed',
        top: `${result.y}px`,
        left: `${result.x}px`,
      }
    }
  }

  function setupScrollListeners(referenceEl: HTMLElement) {
    let current: HTMLElement | null = referenceEl.parentElement
    while (current) {
      if (!scrollListeners.has(current)) {
        const cleanup = useEventListener(current, 'scroll', update, {
          immediate: true,
          passive: true,
        })
        scrollListeners.set(current, cleanup)
        stopFns.push(cleanup)
      }
      current = current.parentElement
    }
  }

  const stopResize = useEventListener(
    typeof window !== 'undefined' ? window : null,
    'resize',
    update,
    {
      immediate: true,
      passive: true,
    }
  )
  stopFns.push(stopResize)

  // Track element size changes (dynamic popper content, animated references).
  // ResizeObserver only exists in the browser; skip it during SSR.
  if (typeof ResizeObserver !== 'undefined') {
    const observedRefs = new WeakSet<HTMLElement>()

    const observeEl = (getter: () => HTMLElement | null | undefined) => {
      const el = getter()
      if (el && !observedRefs.has(el)) {
        observedRefs.add(el)
        const ro = new ResizeObserver(() => update())
        ro.observe(el)
        stopFns.push(() => ro.disconnect())
      }
    }

    if (options.reference) {
      watch(
        () => toValue(options.reference),
        (el) => {
          if (el) observeEl(() => toValue(options.reference))
        },
        { immediate: true, flush: 'post' }
      )
    }
    if (options.popper) {
      watch(
        () => toValue(options.popper),
        (el) => {
          if (el) observeEl(() => toValue(options.popper))
        },
        { immediate: true, flush: 'post' }
      )
    }
  }

  stopWatches.push(
    watch([() => toValue(options.placement), () => toValue(options.offset)], () => update(), {
      immediate: true,
      flush: 'sync',
    })
  )

  if (options.visible) {
    stopWatches.push(
      watch(
        options.visible,
        (val) => {
          if (val) nextTick(() => update())
        },
        { immediate: true }
      )
    )
  }

  function stop() {
    scrollListeners.forEach((cleanup) => cleanup())
    scrollListeners.clear()
    stopFns.forEach((fn) => fn())
    stopFns.length = 0
    stopWatches.forEach((w) => w())
    stopWatches.length = 0
  }

  // Establish an initial position from the reference when the popper element
  // is not yet mounted (hidden poppers / v-if delayed render).
  function applyInitialPosition() {
    const viewport = toValue(options.viewport) ?? getViewportSize()
    const placement = toValue(options.placement)
    const refRect = resolveRefRect()
    if (!refRect) return

    const result: PositionResult = computePosition({
      reference: refRect,
      popperSize: { width: 0, height: 0 },
      placement,
      offset: toValue(options.offset),
      viewport,
      flip: toValue(options.flip) ?? true,
      preventOverflow: toValue(options.preventOverflow) ?? true,
      boundaryPadding: toValue(options.boundaryPadding) ?? 8,
    })

    styles.value = {
      position: (toValue(options.strategy) ?? 'fixed') === 'absolute' ? 'absolute' : 'fixed',
      top: `${result.y}px`,
      left: `${result.x}px`,
    }
  }

  // Position synchronously when both reference and popper exist at setup time
  // (covers initially-visible poppers; hidden poppers are positioned on show)
  update()
  applyInitialPosition()

  return { styles, actualPlacement, arrowStyles, update, stop }
}
