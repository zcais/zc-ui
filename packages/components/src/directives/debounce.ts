import type { Directive, DirectiveBinding } from 'vue'
import { isClient } from '@zc-ui/utils'

interface DebounceElement extends HTMLElement {
  __zcDebounce?: {
    fn: (e: Event) => void
    handler: (e: Event) => void
    timer: ReturnType<typeof setTimeout> | null
    delay: number
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

    let timer: ReturnType<typeof setTimeout> | null = null

    const handler = (e: Event) => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn(e)
        timer = null
      }, delay)
    }

    el.addEventListener(event, handler)
    el.__zcDebounce = { fn, handler, timer, delay }
  },

  unmounted(el: DebounceElement) {
    if (el.__zcDebounce) {
      // We don't know which event was used here, try click (most common)
      el.removeEventListener('click', el.__zcDebounce.handler)
      if (el.__zcDebounce.timer) {
        clearTimeout(el.__zcDebounce.timer)
      }
      delete el.__zcDebounce
    }
  },
}

export default ZcDebounceDirective
