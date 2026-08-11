import type { Directive, DirectiveBinding } from 'vue'
import { isClient } from '@zc-ui/utils'

export type TooltipDirectivePlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end'

export interface TooltipDirectiveOptions {
  /** Tooltip content text */
  content: string
  /** Placement relative to reference element */
  placement?: TooltipDirectivePlacement
  /** Show delay in ms */
  showDelay?: number
  /** Hide delay in ms */
  hideDelay?: number
  /** Disabled */
  disabled?: boolean
  /** Custom class */
  customClass?: string
  /** Show arrow */
  showArrow?: boolean
  /** Dark/light theme */
  effect?: 'dark' | 'light'
}

type TooltipValue = string | TooltipDirectiveOptions

interface TooltipElement extends HTMLElement {
  __zcTooltip?: {
    tooltipEl: HTMLDivElement | null
    content: string
    placement: TooltipDirectivePlacement
    showDelay: number
    hideDelay: number
    disabled: boolean
    customClass: string
    showArrow: boolean
    effect: 'dark' | 'light'
    showTimer: ReturnType<typeof setTimeout> | null
    hideTimer: ReturnType<typeof setTimeout> | null
    isVisible: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
    onFocus: () => void
    onBlur: () => void
  }
}

/** Parse directive value into options */
function parseOptions(binding: DirectiveBinding): Required<
  Omit<TooltipDirectiveOptions, 'content'>
> & {
  content: string
  disabled: boolean
  customClass: string
} {
  const value = binding.value as TooltipValue

  // Check modifier for placement (e.g. v-tooltip.top)
  const modifierKeys = Object.keys(binding.modifiers)
  const placementFromModifier = modifierKeys.find((k) =>
    [
      'top',
      'bottom',
      'left',
      'right',
      'top-start',
      'top-end',
      'bottom-start',
      'bottom-end',
      'left-start',
      'left-end',
      'right-start',
      'right-end',
    ].includes(k)
  )

  if (typeof value === 'string') {
    return {
      content: value,
      placement: (placementFromModifier as TooltipDirectivePlacement) || 'top',
      showDelay: 100,
      hideDelay: 100,
      disabled: false,
      customClass: '',
      showArrow: true,
      effect: 'dark',
    }
  }

  return {
    content: value.content || '',
    placement: value.placement || (placementFromModifier as TooltipDirectivePlacement) || 'top',
    showDelay: value.showDelay ?? 100,
    hideDelay: value.hideDelay ?? 100,
    disabled: value.disabled ?? false,
    customClass: value.customClass ?? '',
    showArrow: value.showArrow ?? true,
    effect: value.effect ?? 'dark',
  }
}

/** Compute position for tooltip element */
function computePosition(
  el: HTMLElement,
  tooltipEl: HTMLDivElement,
  placement: TooltipDirectivePlacement
) {
  const rect = el.getBoundingClientRect()
  const tooltipRect = tooltipEl.getBoundingClientRect()
  const scrollX = window.scrollX || window.pageXOffset
  const scrollY = window.scrollY || window.pageYOffset

  let top = 0
  let left = 0
  const gap = 8

  const [side, align] = placement.split('-')

  switch (side) {
    case 'top':
      top = rect.top + scrollY - tooltipRect.height - gap
      break
    case 'bottom':
      top = rect.bottom + scrollY + gap
      break
    case 'left':
      left = rect.left + scrollX - tooltipRect.width - gap
      break
    case 'right':
      left = rect.right + scrollX + gap
      break
  }

  // Handle alignment for top/bottom
  if (side === 'top' || side === 'bottom') {
    left = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2
    if (align === 'start') {
      left = rect.left + scrollX
    } else if (align === 'end') {
      left = rect.right + scrollX - tooltipRect.width
    }
  }

  // Handle alignment for left/right
  if (side === 'left' || side === 'right') {
    top = rect.top + scrollY + rect.height / 2 - tooltipRect.height / 2
    if (align === 'start') {
      top = rect.top + scrollY
    } else if (align === 'end') {
      top = rect.bottom + scrollY - tooltipRect.height
    }
  }

  // Clamp to viewport
  const margin = 8
  if (left < scrollX + margin) left = scrollX + margin
  if (left + tooltipRect.width > scrollX + window.innerWidth - margin) {
    left = scrollX + window.innerWidth - tooltipRect.width - margin
  }
  if (top < scrollY + margin) top = scrollY + margin
  if (top + tooltipRect.height > scrollY + window.innerHeight - margin) {
    top = scrollY + window.innerHeight - tooltipRect.height - margin
  }

  tooltipEl.style.top = `${top}px`
  tooltipEl.style.left = `${left}px`
}

/** Inject tooltip styles once */
let stylesInjected = false
function injectStyles() {
  if (stylesInjected || !isClient) return
  stylesInjected = true
  const style = document.createElement('style')
  style.setAttribute('data-zc-tooltip', '')
  style.textContent = `
.zc-tooltip-popper {
  position: absolute;
  z-index: 3000;
  padding: 6px 12px;
  font-size: 13px;
  line-height: 1.5;
  border-radius: 4px;
  max-width: 300px;
  word-break: break-word;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.zc-tooltip-popper.is-visible {
  opacity: 1;
  visibility: visible;
}
.zc-tooltip-popper--dark {
  background-color: #303133;
  color: #fff;
}
.zc-tooltip-popper--light {
  background-color: #fff;
  color: #303133;
  border: 1px solid #e4e7ed;
}
.zc-tooltip-popper__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
}
.zc-tooltip-popper--dark .zc-tooltip-popper__arrow {
  background-color: #303133;
}
.zc-tooltip-popper--light .zc-tooltip-popper__arrow {
  background-color: #fff;
}
.dark .zc-tooltip-popper--light {
  background-color: #1d1e1f;
  color: #e5eaf3;
  border-color: #414243;
}
.dark .zc-tooltip-popper--light .zc-tooltip-popper__arrow {
  background-color: #1d1e1f;
}
`
  document.head.appendChild(style)
}

/**
 * v-tooltip directive — declarative tooltip without component wrapper.
 *
 * @example
 * ```html
 * <!-- Basic -->
 * <span v-tooltip="'Hello World'">Hover me</span>
 *
 * <!-- Placement modifiers -->
 * <span v-tooltip.bottom="'Bottom tooltip'">Bottom</span>
 * <span v-tooltip.left="'Left tooltip'">Left</span>
 *
 * <!-- Object options -->
 * <span v-tooltip="{ content: 'Tip', placement: 'right', effect: 'light' }">Right</span>
 *
 * <!-- Disabled -->
 * <span v-tooltip="{ content: 'Tip', disabled: true }">Disabled</span>
 * ```
 */
export const ZcTooltipDirective: Directive = {
  mounted(el: TooltipElement, binding: DirectiveBinding) {
    if (!isClient) return
    injectStyles()

    const opts = parseOptions(binding)

    const state = {
      tooltipEl: null as HTMLDivElement | null,
      content: opts.content,
      placement: opts.placement,
      showDelay: opts.showDelay,
      hideDelay: opts.hideDelay,
      disabled: opts.disabled,
      customClass: opts.customClass,
      showArrow: opts.showArrow,
      effect: opts.effect,
      showTimer: null as ReturnType<typeof setTimeout> | null,
      hideTimer: null as ReturnType<typeof setTimeout> | null,
      isVisible: false,
      onMouseEnter: () => {},
      onMouseLeave: () => {},
      onFocus: () => {},
      onBlur: () => {},
    }

    state.onMouseEnter = () => {
      if (state.disabled || !state.content) return
      if (state.hideTimer) {
        clearTimeout(state.hideTimer)
        state.hideTimer = null
      }
      if (state.isVisible) return
      state.showTimer = setTimeout(() => {
        showTooltip(el, state)
      }, state.showDelay)
    }

    state.onMouseLeave = () => {
      if (state.showTimer) {
        clearTimeout(state.showTimer)
        state.showTimer = null
      }
      if (!state.isVisible) return
      state.hideTimer = setTimeout(() => {
        hideTooltip(state)
      }, state.hideDelay)
    }

    state.onFocus = state.onMouseEnter
    state.onBlur = state.onMouseLeave

    el.addEventListener('mouseenter', state.onMouseEnter)
    el.addEventListener('mouseleave', state.onMouseLeave)
    el.addEventListener('focusin', state.onFocus)
    el.addEventListener('focusout', state.onBlur)

    el.__zcTooltip = state
  },

  updated(el: TooltipElement, binding: DirectiveBinding) {
    if (!el.__zcTooltip) return

    const opts = parseOptions(binding)
    el.__zcTooltip.content = opts.content
    el.__zcTooltip.placement = opts.placement
    el.__zcTooltip.showDelay = opts.showDelay
    el.__zcTooltip.hideDelay = opts.hideDelay
    el.__zcTooltip.disabled = opts.disabled
    el.__zcTooltip.customClass = opts.customClass
    el.__zcTooltip.showArrow = opts.showArrow
    el.__zcTooltip.effect = opts.effect

    // Update tooltip content if visible
    if (el.__zcTooltip.tooltipEl && el.__zcTooltip.isVisible) {
      el.__zcTooltip.tooltipEl.textContent = opts.content
      computePosition(el, el.__zcTooltip.tooltipEl, opts.placement)
    }

    // Hide if disabled
    if (opts.disabled && el.__zcTooltip.isVisible) {
      hideTooltip(el.__zcTooltip)
    }
  },

  unmounted(el: TooltipElement) {
    if (!el.__zcTooltip) return
    const state = el.__zcTooltip

    if (state.showTimer) clearTimeout(state.showTimer)
    if (state.hideTimer) clearTimeout(state.hideTimer)

    el.removeEventListener('mouseenter', state.onMouseEnter)
    el.removeEventListener('mouseleave', state.onMouseLeave)
    el.removeEventListener('focusin', state.onFocus)
    el.removeEventListener('focusout', state.onBlur)

    if (state.tooltipEl && state.tooltipEl.parentNode) {
      state.tooltipEl.parentNode.removeChild(state.tooltipEl)
    }

    delete el.__zcTooltip
  },
}

/** Show tooltip for element */
function showTooltip(el: TooltipElement, state: NonNullable<TooltipElement['__zcTooltip']>) {
  if (state.tooltipEl) {
    state.tooltipEl.parentNode?.removeChild(state.tooltipEl)
  }

  const tooltipEl = document.createElement('div')
  tooltipEl.className = `zc-tooltip-popper zc-tooltip-popper--${state.effect}`
  if (state.customClass) {
    tooltipEl.classList.add(state.customClass)
  }
  tooltipEl.textContent = state.content

  // Add arrow
  if (state.showArrow) {
    const arrow = document.createElement('span')
    arrow.className = 'zc-tooltip-popper__arrow'
    tooltipEl.appendChild(arrow)
  }

  document.body.appendChild(tooltipEl)

  // Position after DOM insertion to get accurate measurements
  requestAnimationFrame(() => {
    computePosition(el, tooltipEl, state.placement)
    tooltipEl.classList.add('is-visible')
  })

  state.tooltipEl = tooltipEl
  state.isVisible = true
}

/** Hide tooltip */
function hideTooltip(state: NonNullable<TooltipElement['__zcTooltip']>) {
  if (!state.tooltipEl) return
  state.tooltipEl.classList.remove('is-visible')
  const tooltipEl = state.tooltipEl
  state.tooltipEl = null
  state.isVisible = false

  setTimeout(() => {
    if (tooltipEl.parentNode) {
      tooltipEl.parentNode.removeChild(tooltipEl)
    }
  }, 200)
}

export default ZcTooltipDirective
