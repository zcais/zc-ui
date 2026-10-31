import type { Directive, DirectiveBinding } from 'vue'
import { ref, watch, type Ref } from 'vue'
import { isClient } from '@zc-ui/utils'
import { usePopper } from '../popper/usePopper'
import type { UsePopperReturn } from '../popper/usePopper'

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
    popper: UsePopperReturn | null
    popperElRef?: Ref<HTMLElement | null>
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

/** Inject tooltip styles once */
let stylesInjected = false
function injectStyles() {
  if (stylesInjected || !isClient) return
  stylesInjected = true
  const style = document.createElement('style')
  style.setAttribute('data-zc-tooltip', '')
  style.textContent = `
.zc-tooltip-popper {
  position: fixed;
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
      popper: null as UsePopperReturn | null,
      popperElRef: undefined as Ref<HTMLElement | null> | undefined,
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

    // ---- Positioning via ZcPopper engine (fixed strategy, appended to body) ----
    const popperElRef = ref<HTMLElement | null>(null)
    const popper = usePopper({
      reference: () => el,
      popper: popperElRef,
      placement: state.placement,
      offset: 8,
      strategy: 'fixed',
    })

    // Sync engine styles onto the tooltip element
    const stopStyleWatch = watch(
      popper.styles,
      (styles) => {
        if (!state.tooltipEl) return
        state.tooltipEl.style.position = String(styles.position ?? '')
        state.tooltipEl.style.top = String(styles.top ?? '')
        state.tooltipEl.style.left = String(styles.left ?? '')
      },
      { immediate: true }
    )

    state.popper = {
      ...popper,
      stop: () => {
        stopStyleWatch()
        popper.stop()
      },
    }
    state.popperElRef = popperElRef

    state.onMouseEnter = () => {
      if (state.disabled || !state.content) return
      if (state.hideTimer) {
        clearTimeout(state.hideTimer)
        state.hideTimer = null
      }
      if (state.isVisible) return
      state.showTimer = setTimeout(() => {
        showTooltip(state)
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
      el.__zcTooltip.popper?.update()
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

    state.popper?.stop()

    if (state.tooltipEl && state.tooltipEl.parentNode) {
      state.tooltipEl.parentNode.removeChild(state.tooltipEl)
    }

    delete el.__zcTooltip
  },
}

/** Show tooltip for element */
function showTooltip(state: NonNullable<TooltipElement['__zcTooltip']>) {
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

  state.tooltipEl = tooltipEl
  if (state.popperElRef) state.popperElRef.value = tooltipEl

  // Position via ZcPopper engine after DOM insertion to get accurate measurements
  state.popper?.update()

  requestAnimationFrame(() => {
    state.popper?.update()
    tooltipEl.classList.add('is-visible')
  })

  state.isVisible = true
}

/** Hide tooltip */
function hideTooltip(state: NonNullable<TooltipElement['__zcTooltip']>) {
  if (!state.tooltipEl) return
  state.tooltipEl.classList.remove('is-visible')
  const tooltipEl = state.tooltipEl
  state.tooltipEl = null
  if (state.popperElRef) state.popperElRef.value = null
  state.isVisible = false

  setTimeout(() => {
    if (tooltipEl.parentNode) {
      tooltipEl.parentNode.removeChild(tooltipEl)
    }
  }, 200)
}

export default ZcTooltipDirective
