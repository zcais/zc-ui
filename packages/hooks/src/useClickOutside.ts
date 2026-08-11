import { useEventListener, isRefTarget, type EventTargetLike } from './useEventListener'

export type { EventTargetLike, UseEventListenerOptions } from './useEventListener'

/**
 * Options for useClickOutside.
 */
export interface ClickOutsideOptions {
  /** Additional elements that should NOT trigger the outside-click. */
  ignore?: Array<EventTargetLike | { value: EventTargetLike | null | undefined } | null | undefined>
  /** Event type to listen for. Default: 'click' */
  event?: string
}

/**
 * useClickOutside - Invoke a handler when the user clicks outside
 * the referenced element(s).
 *
 * @example
 * const targetRef = ref<HTMLElement | null>(null)
 * useClickOutside(targetRef, () => {
 *   console.log('Clicked outside!')
 * })
 */
export function useClickOutside(
  target: EventTargetLike | { value: EventTargetLike | null | undefined },
  handler: (e: MouseEvent) => void,
  options: ClickOutsideOptions = {}
): void {
  const { ignore = [], event = 'click' } = options

  const listener = (e: Event) => {
    const targetEl = (isRefTarget(target) ? target.value : target) as
      | EventTargetLike
      | null
      | undefined
    if (!targetEl) return

    const path = e.composedPath ? e.composedPath() : []
    const clickedTarget = (e.target as Node) || path[0]

    // Check if click was inside target
    if (contains(targetEl, clickedTarget)) return

    // Check if click was inside any ignored element
    for (const ignoredEl of ignore) {
      if (!ignoredEl) continue
      const resolved = (isRefTarget(ignoredEl) ? ignoredEl.value : ignoredEl) as
        | EventTargetLike
        | null
        | undefined
      if (!resolved) continue
      if (contains(resolved, clickedTarget)) return
    }

    handler(e as MouseEvent)
  }

  // Avoid referencing `document` in SSR (Node.js) to prevent ReferenceError
  useEventListener(
    typeof document !== 'undefined' ? document : null,
    event,
    listener as EventListener
  )
}

/**
 * Check if parent contains child (or is the same node).
 * Unlike `contains` from `@zc-ui/utils`, this version accepts `EventTargetLike`
 * (which includes `Window`) and uses duck-typing via `'contains' in parent`.
 */
function contains(parent: EventTargetLike, child: Node | null): boolean {
  if (!child) return false
  // Window does not have `.contains()`; HTMLElement and Document do
  if ('contains' in parent) {
    return parent.contains(child)
  }
  return false
}
