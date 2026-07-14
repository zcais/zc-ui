import { useEventListener } from './useEventListener'

/**
 * useEscapeKeydown - Invoke a handler when the ESC key is pressed within a target.
 *
 * @example
 * useEscapeKeydown(() => closeDialog())
 *
 * @example
 * // With a specific element
 * useEscapeKeydown(() => closeMenu(), { target: menuRef })
 */
export function useEscapeKeydown(
  handler: (event: KeyboardEvent) => void,
  options: {
    target?: HTMLElement | Document | Window | null
    capture?: boolean
  } = {}
): void {
  const { target = null, capture = true } = options

  const onKeydown = (event: Event) => {
    if (event instanceof KeyboardEvent && event.key === 'Escape') {
      handler(event)
    }
  }

  useEventListener(
    target ?? (typeof document !== 'undefined' ? document : null),
    'keydown',
    onKeydown as EventListener,
    { capture }
  )
}
