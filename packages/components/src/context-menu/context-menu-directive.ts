import type { Directive, DirectiveBinding } from 'vue'
import { isClient } from '@zc-ui/utils'
import type { ContextMenuItem } from './types'

interface ContextMenuElement extends HTMLElement {
  __zcContextMenu?: {
    items: ContextMenuItem[]
    handler: (e: MouseEvent) => void
  }
}

/**
 * v-contextmenu directive — bind right-click context menu to an element.
 *
 * @example
 * ```html
 * <div v-contextmenu="[{ key: 'copy', label: '复制' }, { key: 'delete', label: '删除', danger: true }]"
 *      @contextmenu-select="handleSelect">
 *   Right-click here
 * </div>
 * ```
 *
 * NOTE: For full control (custom styling, submenu support), use the ZcContextMenu
 * component directly. This directive provides a lightweight API.
 */
export const ZcContextMenuDirective: Directive = {
  mounted(el: ContextMenuElement, binding: DirectiveBinding) {
    if (!isClient) return

    const items = (binding.value || []) as ContextMenuItem[]

    function handleContext(e: MouseEvent) {
      e.preventDefault()

      // Dispatch a custom event that parent can listen for
      const detail = {
        items,
        x: e.clientX,
        y: e.clientY,
      }

      el.dispatchEvent(
        new CustomEvent('contextmenu-select', {
          detail,
          bubbles: true,
        })
      )
    }

    el.addEventListener('contextmenu', handleContext)
    el.__zcContextMenu = { items, handler: handleContext }
  },

  updated(el: ContextMenuElement, binding: DirectiveBinding) {
    if (el.__zcContextMenu) {
      el.__zcContextMenu.items = binding.value || []
    }
  },

  unmounted(el: ContextMenuElement) {
    if (el.__zcContextMenu) {
      el.removeEventListener('contextmenu', el.__zcContextMenu.handler)
      delete el.__zcContextMenu
    }
  },
}

export default ZcContextMenuDirective
