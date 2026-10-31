import type { Directive, DirectiveBinding } from 'vue'
import { isClient } from '@zc-ui/utils'

interface DebounceElement extends HTMLElement {
  __zcDebounce?: {
    fn: (e: Event) => void
    handler: (e: Event) => void
    timer: ReturnType<typeof setTimeout> | null
    delay: number
    event: string
  }
}

/**
 * v-debounce directive — debounce click events.
 *
 * @example
 * ```html
 * <!-- Basic: 300ms default delay -->
 * <button v-debounce="handleClick">Click Me</button>
 *
 * <!-- Custom delay -->
 * <button v-debounce:500="handleClick">Click Me</button>
 *
 * <!-- On 'input' event instead of 'click' -->
 * <input v-debounce.input:300="handleInput" />
 * ```
 */
export const ZcDebounceDirective: Directive = {
  mounted(el: DebounceElement, binding: DirectiveBinding) {
    if (!isClient) return

    const fn = binding.value as (e: Event) => void
    const event = Object.keys(binding.modifiers)[0] || 'click'
    const delay = Number(binding.arg) || 300

    const handler = (e: Event) => {
      const state = el.__zcDebounce
      if (!state) return
      if (state.timer) {
        clearTimeout(state.timer)
      }
      state.timer = setTimeout(() => {
        fn(e)
        state.timer = null
      }, delay)
    }

    el.addEventListener(event, handler)
    // The timer lives in the element store so `unmounted` can cancel a
    // pending invocation (a local closure variable would be unreachable).
    el.__zcDebounce = { fn, handler, timer: null, delay, event }
  },

  unmounted(el: DebounceElement) {
    if (el.__zcDebounce) {
      el.removeEventListener(el.__zcDebounce.event, el.__zcDebounce.handler)
      if (el.__zcDebounce.timer) {
        clearTimeout(el.__zcDebounce.timer)
      }
      delete el.__zcDebounce
    }
  },
}

export default ZcDebounceDirective
