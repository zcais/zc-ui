import { ref, type Ref, nextTick, onBeforeUnmount } from 'vue'

export interface FocusTrapOptions {
  /** Whether to return focus to the previously focused element on release */
  returnFocusOnRelease?: boolean
}

/**
 * useFocusTrap — traps keyboard focus within a container element.
 *
 * When `active` is true, Tab/Shift+Tab cycles only through focusable elements
 * inside the container. On release, focus is optionally restored to the element
 * that was focused before activation.
 *
 * @example
 * const trap = useFocusTrap()
 * trap.activate(el)
 * // later...
 * trap.release()
 */
export function useFocusTrap(options: FocusTrapOptions = {}) {
  const { returnFocusOnRelease = true } = options

  const active = ref(false)
  let container: HTMLElement | null = null
  let previouslyFocused: HTMLElement | null = null

  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ')

  function getFocusableElements(): HTMLElement[] {
    if (!container) return []
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) =>
        el.offsetParent !== null || el.getClientRects().length > 0 || el === document.activeElement
    )
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return
    if (!active.value || !container) return

    const focusable = getFocusableElements()
    if (focusable.length === 0) {
      e.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first || !container.contains(document.activeElement)) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last || !container.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  function activate(el: HTMLElement | Ref<HTMLElement | undefined>) {
    const resolved = 'value' in el ? el.value : el
    if (!resolved) return

    previouslyFocused = document.activeElement as HTMLElement
    container = resolved
    active.value = true

    document.addEventListener('keydown', handleKeydown)

    // Move focus to the first focusable element inside the container
    nextTick(() => {
      const focusable = getFocusableElements()
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        // Make the container itself focusable
        resolved.setAttribute('tabindex', '-1')
        resolved.focus()
      }
    })
  }

  function release() {
    if (!active.value) return

    document.removeEventListener('keydown', handleKeydown)
    active.value = false
    container = null

    if (returnFocusOnRelease && previouslyFocused) {
      previouslyFocused.focus()
      previouslyFocused = null
    }
  }

  onBeforeUnmount(() => {
    release()
  })

  return {
    active,
    activate,
    release,
  }
}
