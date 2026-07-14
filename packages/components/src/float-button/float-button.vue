<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  shallowRef,
  watch,
  nextTick,
  inject,
  getCurrentInstance,
  type Ref,
} from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { isClient } from '@zc-ui/utils'
import { useLocale } from '@zc-ui/locale'
import ZcTooltip from '../tooltip/tooltip.vue'
import ZcBadge from '../badge/badge.vue'
import { floatButtonGroupKey, type FloatButtonGroupContext } from './float-button-group.vue'

defineOptions({ name: 'ZcFloatButton' })

/** Shape variants for the floating button. */
export type FloatButtonShape = 'circle' | 'square'
/** Visual style variants. */
export type FloatButtonType = 'primary' | 'default' | 'success' | 'warning' | 'danger'
/** Size variants. */
export type FloatButtonSize = 'default' | 'small' | 'large'
/** Position of the button (e.g. corner of the viewport). */
export type FloatButtonPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

const props = withDefaults(
  defineProps<{
    /** Shape of the button. */
    shape?: FloatButtonShape
    /** Visual type. */
    type?: FloatButtonType
    /** Size. */
    size?: FloatButtonSize
    /** Icon class (e.g. an iconfont or your icon component name). */
    icon?: string
    /** Tooltip content. */
    tooltip?: string
    /** Offset from the right edge (px) when position includes 'right'. */
    right?: number
    /** Offset from the bottom edge (px) when position includes 'bottom'. */
    bottom?: number
    /** Offset from the left edge (px) when position includes 'left'. */
    left?: number
    /** Offset from the top edge (px) when position includes 'top'. */
    top?: number
    /** Position of the button. */
    position?: FloatButtonPosition
    /** Badge value (number or text). */
    badge?: string | number
    /** Badge max value. */
    badgeMax?: number
    /** Render the badge as a dot. */
    badgeDot?: boolean
    /** Disable the button. */
    disabled?: boolean
    /** Whether this button acts as a back-to-top button. */
    backToTop?: boolean
    /** Scroll threshold (px) before back-to-top becomes visible. */
    visibilityHeight?: number
    /** Scroll target selector. */
    target?: string
    /** Custom z-index. */
    zIndex?: number
    /** ARIA label for accessibility. */
    ariaLabel?: string
  }>(),
  {
    shape: 'circle',
    type: 'default',
    size: 'default',
    icon: '',
    tooltip: '',
    right: 40,
    bottom: 40,
    left: 40,
    top: 40,
    position: 'bottom-right',
    badge: '',
    badgeMax: 99,
    badgeDot: false,
    disabled: false,
    backToTop: false,
    visibilityHeight: 200,
    target: '',
    zIndex: 999,
    ariaLabel: '',
  }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
  /** Emitted when the back-to-top button becomes visible. */
  (e: 'show'): void
  /** Emitted when the back-to-top button becomes hidden. */
  (e: 'hide'): void
}>()

const ns = useNamespace('float-button')
const { t } = useLocale()

/**
 * Look up the parent FloatButtonGroup context.
 *
 * We first try Vue's standard `inject` (works when FloatButton is a
 * direct child component of FloatButtonGroup, or in any normal
 * provide/inject scenario). As a defensive fallback for edge cases
 * (e.g., custom render functions, async components, teleports), we
 * walk the component parent chain looking for an ancestor that
 * provided the group context.
 *
 * Note: Vue 3's provide/inject does NOT reliably cross `<slot>`
 * boundaries, so a FloatButton inside a FloatButtonGroup's default
 * slot must typically inherit shape/type via the scoped-slot prop
 * pattern rather than rely on inject. See the docs.
 */
function useGroupContext(): Ref<FloatButtonGroupContext | null> {
  const direct = inject(floatButtonGroupKey, null)
  if (direct) return ref(direct) as Ref<FloatButtonGroupContext | null>
  const result = ref<FloatButtonGroupContext | null>(null)
  const inst = getCurrentInstance()
  if (inst) {
    let p: any = inst.parent
    let depth = 0
    while (p && depth < 10) {
      const provides = p.provides as Record<symbol, unknown> | undefined
      if (provides && floatButtonGroupKey in provides) {
        result.value = provides[floatButtonGroupKey] as FloatButtonGroupContext
        break
      }
      p = p.parent
      depth++
    }
  }
  return result
}

const groupCtx = useGroupContext()

// Effective shape/type: explicit prop > group context (if available) > default
const effectiveShape = computed(() => props.shape || groupCtx.value?.shape || ('circle' as const))
const effectiveType = computed(() => props.type || groupCtx.value?.type || ('default' as const))

// Back-to-top: start visible=true to avoid flash of hidden on first render.
// onMounted evaluates real scroll position and may immediately hide.
const visible = ref(true)
const tooltipVisible = ref(false)
const container = shallowRef<HTMLElement | Window | null>(null)

const positionStyle = computed<Record<string, string>>(() => {
  const styles: Record<string, string> = {
    zIndex: String(props.zIndex),
  }
  if (props.position.includes('right')) styles.right = `${props.right}px`
  if (props.position.includes('left')) styles.left = `${props.left}px`
  if (props.position.includes('bottom')) styles.bottom = `${props.bottom}px`
  if (props.position.includes('top')) styles.top = `${props.top}px`
  return styles
})

const classes = computed(() => [
  ns.b(),
  ns.m(effectiveShape.value),
  ns.m(effectiveType.value),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('back-to-top', props.backToTop),
])

const effectiveAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  if (props.tooltip) return props.tooltip
  if (props.backToTop) return t('zc.backtop.backToTop')
  return ''
})

function getScrollTop(): number {
  if (container.value === window || container.value === null) {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  }
  return (container.value as HTMLElement)?.scrollTop || 0
}

function smoothScrollTo(target: HTMLElement | Window) {
  if (target === window) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    ;(target as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function handleScroll() {
  if (!props.backToTop) return
  const scrollTop = getScrollTop()
  const shouldShow = scrollTop >= props.visibilityHeight
  if (shouldShow !== visible.value) {
    visible.value = shouldShow
    if (shouldShow) emit('show')
    else emit('hide')
  }
}

function getContainer(): HTMLElement | Window {
  if (props.target) {
    const el = document.querySelector(props.target) as HTMLElement | null
    if (el) return el
  }
  return window
}

function handleClick(event: MouseEvent) {
  if (props.disabled) return
  emit('click', event)
  if (props.backToTop && container.value) {
    smoothScrollTo(container.value)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick(event as unknown as MouseEvent)
  }
}

// Re-evaluate container when backToTop/target changes
watch(
  () => [props.backToTop, props.target] as const,
  async () => {
    if (!isClient) return
    if (container.value) {
      container.value.removeEventListener('scroll', handleScroll as EventListener)
    }
    if (props.backToTop) {
      await nextTick()
      container.value = getContainer()
      container.value.addEventListener('scroll', handleScroll as EventListener, { passive: true })
      // Sync initial visible state from current scroll position
      visible.value = getScrollTop() >= props.visibilityHeight
    } else {
      container.value = null
      visible.value = true
    }
  }
)

onMounted(() => {
  if (!isClient) return
  if (props.backToTop) {
    container.value = getContainer()
    container.value.addEventListener('scroll', handleScroll as EventListener, { passive: true })
    // Sync initial visible state from current scroll position.
    // This may hide the button immediately if the user is at the top of
    // the page, preventing a flash of "visible" content.
    visible.value = getScrollTop() >= props.visibilityHeight
  }
})

onBeforeUnmount(() => {
  if (container.value) {
    container.value.removeEventListener('scroll', handleScroll as EventListener)
  }
})

function onTooltipShow() {
  tooltipVisible.value = true
}
function onTooltipHide() {
  tooltipVisible.value = false
}
</script>

<template>
  <Transition :name="`zc-float-button-fade`">
    <div
      v-show="visible"
      :class="classes"
      :style="positionStyle"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled"
      :aria-label="effectiveAriaLabel"
      :aria-describedby="tooltipVisible ? 'zc-float-button-tooltip' : undefined"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <ZcTooltip
        v-if="tooltip"
        :content="tooltip"
        placement="left"
        :triggers="['hover']"
        :disabled="disabled"
        @show="onTooltipShow"
        @hide="onTooltipHide"
      >
        <span :class="ns.e('trigger')" />
      </ZcTooltip>

      <span v-if="badge || badgeDot" :class="ns.e('badge-wrapper')">
        <ZcBadge
          :value="badge"
          :max="badgeMax"
          :is-dot="badgeDot"
          :hidden="!badge && !badgeDot"
          type="danger"
        >
          <span :class="ns.e('inner')">
            <span v-if="icon" :class="[ns.e('icon'), icon]" aria-hidden="true" />
            <span v-else-if="$slots.icon" :class="ns.e('icon')" aria-hidden="true">
              <slot name="icon" />
            </span>
            <slot />
          </span>
        </ZcBadge>
      </span>

      <span v-else :class="ns.e('inner')">
        <span v-if="icon" :class="[ns.e('icon'), icon]" aria-hidden="true" />
        <span v-else-if="$slots.icon" :class="ns.e('icon')" aria-hidden="true">
          <slot name="icon" />
        </span>
        <slot />
      </span>
    </div>
  </Transition>
</template>

<style scoped>
/* ============================================================
 * ZcFloatButton styles
 * BEM naming: zc-float-button / zc-float-button--primary
 *
 * Component-level CSS variables (--zc-float-button-*) reference
 * global design tokens by default. Override to customize:
 *   .my-section { --zc-float-button-bg-color: red; }
 * ============================================================ */

.zc-float-button {
  --zc-float-button-bg-color: var(--color-zc-white, #ffffff);
  --zc-float-button-text-color: var(--color-zc-text-regular, #606266);
  --zc-float-button-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-float-button-hover-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-float-button-hover-text-color: var(--color-zc-primary-500, #409eff);
  --zc-float-button-hover-border-color: var(--color-zc-primary-300, #a0cfff);
  --zc-float-button-active-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-float-button-box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  --zc-float-button-hover-box-shadow: var(--shadow-zc-lg, 0 6px 16px 0 rgba(0, 0, 0, 0.12));
  --zc-float-button-border-radius: var(--radius-zc-circle, 50%);
  --zc-float-button-border-radius-square: var(--radius-zc-base, 4px);
  --zc-float-button-size: 48px;
  --zc-float-button-size-small: 36px;
  --zc-float-button-size-large: 56px;
  --zc-float-button-font-size: 20px;
  --zc-float-button-z-index: 999;

  position: fixed;
  z-index: var(--zc-float-button-z-index);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--zc-float-button-bg-color);
  color: var(--zc-float-button-text-color);
  border: 1px solid var(--zc-float-button-border-color);
  border-radius: var(--zc-float-button-border-radius);
  box-shadow: var(--zc-float-button-box-shadow);
  cursor: pointer;
  user-select: none;
  transition:
    background var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    border-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    box-shadow var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-float-button__trigger {
  position: absolute;
  inset: 0;
  cursor: inherit;
  pointer-events: none;
}

/* ---- Shape: square ---- */
.zc-float-button--square {
  border-radius: var(--zc-float-button-border-radius-square);
}

/* ---- Size: small ---- */
.zc-float-button--small {
  width: var(--zc-float-button-size-small);
  height: var(--zc-float-button-size-small);
  font-size: 14px;
}

/* ---- Size: large ---- */
.zc-float-button--large {
  width: var(--zc-float-button-size-large);
  height: var(--zc-float-button-size-large);
  font-size: 24px;
}

/* ---- Default size ---- */
.zc-float-button--default:not(.zc-float-button--small):not(.zc-float-button--large) {
  width: var(--zc-float-button-size);
  height: var(--zc-float-button-size);
}

/* ---- Type: primary ---- */
.zc-float-button--primary {
  --zc-float-button-bg-color: var(--color-zc-primary-500, #409eff);
  --zc-float-button-text-color: var(--color-zc-white, #ffffff);
  --zc-float-button-border-color: var(--color-zc-primary-500, #409eff);
  --zc-float-button-hover-bg-color: var(--color-zc-primary-400, #79bbff);
  --zc-float-button-hover-text-color: var(--color-zc-white, #ffffff);
  --zc-float-button-hover-border-color: var(--color-zc-primary-400, #79bbff);
  --zc-float-button-active-bg-color: var(--color-zc-primary-600, #337ecc);
}
/* ---- Type: success ---- */
.zc-float-button--success {
  --zc-float-button-bg-color: var(--color-zc-success-500, #67c23a);
  --zc-float-button-text-color: var(--color-zc-white, #ffffff);
  --zc-float-button-border-color: var(--color-zc-success-500, #67c23a);
  --zc-float-button-hover-bg-color: var(--color-zc-success-400, #95d575);
  --zc-float-button-hover-text-color: var(--color-zc-white, #ffffff);
  --zc-float-button-hover-border-color: var(--color-zc-success-400, #95d575);
  --zc-float-button-active-bg-color: var(--color-zc-success-600, #529b2e);
}
/* ---- Type: warning ---- */
.zc-float-button--warning {
  --zc-float-button-bg-color: var(--color-zc-warning-500, #e6a23c);
  --zc-float-button-text-color: var(--color-zc-white, #ffffff);
  --zc-float-button-border-color: var(--color-zc-warning-500, #e6a23c);
  --zc-float-button-hover-bg-color: var(--color-zc-warning-400, #ecbe77);
  --zc-float-button-hover-text-color: var(--color-zc-white, #ffffff);
  --zc-float-button-hover-border-color: var(--color-zc-warning-400, #ecbe77);
  --zc-float-button-active-bg-color: var(--color-zc-warning-600, #b88230);
}
/* ---- Type: danger ---- */
.zc-float-button--danger {
  --zc-float-button-bg-color: var(--color-zc-danger-500, #f56c6c);
  --zc-float-button-text-color: var(--color-zc-white, #ffffff);
  --zc-float-button-border-color: var(--color-zc-danger-500, #f56c6c);
  --zc-float-button-hover-bg-color: var(--color-zc-danger-400, #f89898);
  --zc-float-button-hover-text-color: var(--color-zc-white, #ffffff);
  --zc-float-button-hover-border-color: var(--color-zc-danger-400, #f89898);
  --zc-float-button-active-bg-color: var(--color-zc-danger-600, #c45656);
}

/* ---- Hover / focus / active states ---- */
.zc-float-button:hover {
  background: var(--zc-float-button-hover-bg-color);
  color: var(--zc-float-button-hover-text-color);
  border-color: var(--zc-float-button-hover-border-color);
  box-shadow: var(--zc-float-button-hover-box-shadow);
}

.zc-float-button:active {
  background: var(--zc-float-button-active-bg-color);
  transform: scale(0.96);
}

.zc-float-button:focus-visible {
  outline: 2px solid var(--color-zc-primary-400, #79bbff);
  outline-offset: 2px;
}

/* ---- Disabled ---- */
.zc-float-button.is-disabled,
.zc-float-button--disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: var(--color-zc-fill-light, #f5f7fa);
  color: var(--color-zc-text-placeholder, #a8abb2);
  box-shadow: none;
}

.zc-float-button.is-disabled:hover,
.zc-float-button--disabled:hover {
  background: var(--color-zc-fill-light, #f5f7fa);
  color: var(--color-zc-text-placeholder, #a8abb2);
  border-color: var(--color-zc-border-light, #e4e7ed);
  box-shadow: none;
}

/* ---- Icon ---- */
.zc-float-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--zc-float-button-font-size);
  line-height: 1;
}

/* ---- Inner (when using badge) ---- */
.zc-float-button__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* ---- Badge wrapper ---- */
.zc-float-button__badge-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* ---- Transition ---- */
.zc-float-button-fade-enter-active,
.zc-float-button-fade-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-float-button-fade-enter-from,
.zc-float-button-fade-leave-to {
  opacity: 0;
  transform: scale(0.6) translateY(8px);
}

/* ============================================================
 * Dark mode support
 * ============================================================ */
:global(html.zc-dark) .zc-float-button,
:global(.zc-dark) .zc-float-button,
:global([data-theme='dark']) .zc-float-button {
  --zc-float-button-bg-color: var(--color-zc-bg-base-dark, #1f1f1f);
  --zc-float-button-text-color: var(--color-zc-text-regular-dark, #dcdfe6);
  --zc-float-button-border-color: var(--color-zc-border-dark, #4c4d4f);
  --zc-float-button-hover-bg-color: var(--color-zc-fill-dark, #262727);
  --zc-float-button-hover-text-color: var(--color-zc-primary-300, #a0cfff);
  --zc-float-button-hover-border-color: var(--color-zc-primary-400, #79bbff);
}
</style>
