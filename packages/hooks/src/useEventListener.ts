import { onMounted, onBeforeUnmount, getCurrentInstance, type Ref } from 'vue'
import { isClient } from '@zc-ui/utils'

/**
 * Type alias for any event target that supports addEventListener.
 */
export type EventTargetLike = HTMLElement | Window | Document

/**
 * Options for useEventListener.
 */
export interface UseEventListenerOptions {
  /** Whether to use capture phase */
  capture?: boolean
  /** Whether to use passive listener */
  passive?: boolean
  /** Register listener immediately (skip onMounted). Default: false */
  immediate?: boolean
}

/**
 * useEventListener - Register an event listener on a target and
 * automatically clean up on component unmount.
 *
 * Supports reactive Ref<HTMLElement | null> targets, static targets,
 * and SSR-safe operation (no-op when window is undefined).
 *
 * @example
 * useEventListener(window, 'resize', () => console.log('resized'))
 * useEventListener(buttonRef, 'click', handler)
 */
export function useEventListener(
  target: EventTargetLike | Ref<EventTargetLike | null | undefined> | null | undefined,
  event: string,
  handler: EventListener,
  options: UseEventListenerOptions = {}
): () => void {
  const { capture = false, passive = false, immediate = false } = options

  if (!isClient) {
    return () => {}
  }

  let cleanup: (() => void) | null = null

  const attach = (el: EventTargetLike) => {
    const opts: AddEventListenerOptions = { capture }
    if (passive) opts.passive = passive
    el.addEventListener(event, handler, opts)
    cleanup = () => el.removeEventListener(event, handler, opts)
  }

  const attachIfElement = () => {
    if (!isClient) return
    const el = isRefTarget(target) ? target.value : target
    if (el) attach(el)
  }

  // Check if we are inside a component lifecycle
  const instance = getCurrentInstance()

  if (immediate) {
    // Attach immediately (useful for static targets or non-component contexts)
    attachIfElement()
    // For Ref targets, the value may not be ready yet — also register onMounted
    if (isRefTarget(target) && instance) {
      onMounted(attachIfElement)
    }
  } else if (instance) {
    // Defer attachment to onMounted (covers both Ref and static targets)
    onMounted(attachIfElement)
  } else {
    // Non-component context without immediate: listener will never attach
    console.warn(
      '[zc-ui] useEventListener: called outside of a component setup function ' +
        'without `immediate: true`. The listener will not be attached.'
    )
  }

  if (instance) {
    onBeforeUnmount(() => {
      if (cleanup) cleanup()
    })
  }

  return () => {
    if (cleanup) cleanup()
  }
}

/** Type guard: check if value is a Vue Ref — exported for reuse by other composables */
export function isRefTarget(val: unknown): val is Ref<unknown> {
  return val !== null && typeof val === 'object' && '__v_isRef' in (val as object)
}
