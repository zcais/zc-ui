import type { Directive, DirectiveBinding } from 'vue'
import { isClient } from '@zc-ui/utils'

interface CopyElement extends HTMLElement {
  __zcCopy?: {
    handler: () => Promise<void>
    value: string
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (!isClient) return false

  // Use Clipboard API if available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fallback to legacy method
    }
  }

  // Legacy fallback
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  try {
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  } catch {
    document.body.removeChild(textarea)
    return false
  }
}

/**
 * v-copy directive — copy text to clipboard on click.
 *
 * @example
 * ```html
 * <button v-copy="'Hello World'">Copy Text</button>
 * <button v-copy="someRefValue" @copy-success="onSuccess">Copy</button>
 * ```
 *
 * @events
 * - `copy-success` — emitted on successful copy
 * - `copy-error` — emitted on failure
 */
export const ZcCopyDirective: Directive = {
  mounted(el: CopyElement, binding: DirectiveBinding) {
    if (!isClient) return

    el.style.cursor = 'pointer'

    const handler = async () => {
      const text = binding.value as string
      if (!text) return

      const success = await copyToClipboard(text)

      if (success) {
        el.dispatchEvent(new CustomEvent('copy-success', { bubbles: true, detail: { text } }))
      } else {
        el.dispatchEvent(new CustomEvent('copy-error', { bubbles: true, detail: { text } }))
      }
    }

    el.addEventListener('click', handler)
    el.__zcCopy = { handler, value: binding.value }
  },

  updated(el: CopyElement, binding: DirectiveBinding) {
    if (el.__zcCopy) {
      el.__zcCopy.value = binding.value
    }
  },

  unmounted(el: CopyElement) {
    if (el.__zcCopy) {
      el.removeEventListener('click', el.__zcCopy.handler)
      delete el.__zcCopy
    }
  },
}

export default ZcCopyDirective
