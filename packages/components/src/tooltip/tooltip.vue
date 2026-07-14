<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcTooltip' })

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export type TooltipTrigger = 'hover' | 'click' | 'focus'

const props = withDefaults(
  defineProps<{
    /** Tooltip content */
    content?: string
    /** Visibility (v-model) */
    visible?: boolean
    /** Placement relative to reference element */
    placement?: TooltipPlacement
    /** Trigger events */
    triggers?: TooltipTrigger[]
    /** Show delay in ms */
    showDelay?: number
    /** Hide delay in ms */
    hideDelay?: number
    /** Disabled */
    disabled?: boolean
    /** Show arrow */
    showArrow?: boolean
    /** Custom class */
    popperClass?: string
  }>(),
  {
    content: '',
    visible: false,
    placement: 'top',
    triggers: () => ['hover'],
    showDelay: 100,
    hideDelay: 100,
    disabled: false,
    showArrow: true,
    popperClass: '',
  }
)

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'show'): void
  (e: 'hide'): void
}>()

const ns = useNamespace('tooltip')

const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)
const internalVisible = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const GAP = 8 // px gap between trigger and popper

/** Dynamically compute popper position based on trigger element rect */
const popperPosition = ref<Record<string, string>>({})

function updatePosition() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const winH = window.innerHeight
  const winW = window.innerWidth

  const placements: Record<string, Record<string, string>> = {
    top: {
      left: `${rect.left + rect.width / 2}px`,
      bottom: `${winH - rect.top + GAP}px`,
      transform: 'translateX(-50%)',
    },
    'top-start': {
      left: `${rect.left}px`,
      bottom: `${winH - rect.top + GAP}px`,
    },
    'top-end': {
      right: `${winW - rect.right}px`,
      bottom: `${winH - rect.top + GAP}px`,
    },
    bottom: {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.bottom + GAP}px`,
      transform: 'translateX(-50%)',
    },
    'bottom-start': {
      left: `${rect.left}px`,
      top: `${rect.bottom + GAP}px`,
    },
    'bottom-end': {
      right: `${winW - rect.right}px`,
      top: `${rect.bottom + GAP}px`,
    },
    left: {
      top: `${rect.top + rect.height / 2}px`,
      right: `${winW - rect.left + GAP}px`,
      transform: 'translateY(-50%)',
    },
    'left-start': {
      top: `${rect.top}px`,
      right: `${winW - rect.left + GAP}px`,
    },
    'left-end': {
      bottom: `${winH - rect.bottom}px`,
      right: `${winW - rect.left + GAP}px`,
    },
    right: {
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.right + GAP}px`,
      transform: 'translateY(-50%)',
    },
    'right-start': {
      top: `${rect.top}px`,
      left: `${rect.right + GAP}px`,
    },
    'right-end': {
      bottom: `${winH - rect.bottom}px`,
      left: `${rect.right + GAP}px`,
    },
  }
  popperPosition.value = placements[props.placement] || placements.top
}

function clearTimers() {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

function handleShow() {
  if (props.disabled) return
  clearTimers()
  if (props.showDelay <= 0) {
    internalVisible.value = true
    emit('update:visible', true)
    emit('show')
  } else {
    showTimer = setTimeout(() => {
      internalVisible.value = true
      emit('update:visible', true)
      emit('show')
    }, props.showDelay)
  }
}

function handleHide() {
  clearTimers()
  if (props.hideDelay <= 0) {
    internalVisible.value = false
    emit('update:visible', false)
    emit('hide')
  } else {
    hideTimer = setTimeout(() => {
      internalVisible.value = false
      emit('update:visible', false)
      emit('hide')
    }, props.hideDelay)
  }
}

function handleToggle() {
  if (internalVisible.value) handleHide()
  else handleShow()
}

// Event bindings based on triggers
const triggerEvents = computed(() => {
  const events: Record<string, () => void> = {}
  if (props.triggers.includes('hover')) {
    events.onMouseenter = handleShow
    events.onMouseleave = handleHide
  }
  if (props.triggers.includes('click')) {
    events.onClick = handleToggle
  }
  if (props.triggers.includes('focus')) {
    events.onFocus = handleShow
    events.onBlur = handleHide
  }
  return events
})

// Sync external visible prop
watch(
  () => props.visible,
  (val) => {
    if (val !== internalVisible.value) {
      internalVisible.value = val
    }
  }
)

// Update position whenever the popper becomes visible
watch(internalVisible, async (visible) => {
  if (visible) {
    await nextTick()
    updatePosition()
  }
})

// Document click handler for click trigger
function onDocumentClick(e: MouseEvent) {
  if (!props.triggers.includes('click')) return
  const target = e.target as Node
  if (triggerRef.value?.contains(target) || popperRef.value?.contains(target)) return
  if (internalVisible.value) handleHide()
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', onDocumentClick, true)
}

onBeforeUnmount(() => {
  clearTimers()
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onDocumentClick, true)
  }
})
</script>

<template>
  <div
    ref="triggerRef"
    :class="ns.b()"
    :aria-describedby="internalVisible ? 'zc-tooltip-content' : undefined"
    v-bind="triggerEvents"
  >
    <slot />

    <Teleport to="body" :disabled="!internalVisible">
      <Transition name="zc-tooltip">
        <div
          v-if="internalVisible"
          ref="popperRef"
          id="zc-tooltip-content"
          :class="[ns.e('popper'), ns.e('popper--' + placement), popperClass]"
          :style="popperPosition"
          role="tooltip"
          @mouseenter="triggers.includes('hover') && handleShow()"
          @mouseleave="triggers.includes('hover') && handleHide()"
        >
          <slot name="content">{{ content }}</slot>
          <span v-if="showArrow" :class="[ns.e('arrow'), ns.e('arrow--' + placement)]" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcTooltip styles
 * ============================================================ */

.zc-tooltip {
  /* Component-level CSS variables */
  --zc-tooltip-bg-color: var(--color-zc-text-primary, #303133);
  --zc-tooltip-text-color: var(--color-zc-white, #fff);
  --zc-tooltip-font-size: var(--text-zc-sm, 13px);
  --zc-tooltip-border-radius: var(--radius-zc-base, 4px);
  --zc-tooltip-padding: 8px 12px;
  --zc-tooltip-max-width: 300px;
  --zc-tooltip-arrow-size: 8px;
  --zc-tooltip-box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  --zc-tooltip-arrow-color: var(--color-zc-text-primary, #303133);

  display: inline-flex;
  position: relative;
}

.zc-tooltip__popper {
  position: fixed;
  z-index: var(--z-zc-tooltip, 1500);
  padding: var(--zc-tooltip-padding);
  background: var(--zc-tooltip-bg-color);
  color: var(--zc-tooltip-text-color);
  font-size: var(--zc-tooltip-font-size);
  line-height: 1.5;
  border-radius: var(--zc-tooltip-border-radius);
  max-width: var(--zc-tooltip-max-width);
  word-wrap: break-word;
  box-shadow: var(--zc-tooltip-box-shadow);
}

.zc-tooltip__arrow {
  position: absolute;
  width: var(--zc-tooltip-arrow-size);
  height: var(--zc-tooltip-arrow-size);
  background: var(--zc-tooltip-arrow-color);
  transform: rotate(45deg);
}

/* Arrow positions */
.zc-tooltip__arrow--top,
.zc-tooltip__arrow--top-start,
.zc-tooltip__arrow--top-end {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}
.zc-tooltip__arrow--top-start {
  left: 8px;
  margin-left: 0;
}
.zc-tooltip__arrow--top-end {
  right: 8px;
  left: auto;
  margin-left: 0;
}

.zc-tooltip__arrow--bottom,
.zc-tooltip__arrow--bottom-start,
.zc-tooltip__arrow--bottom-end {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}
.zc-tooltip__arrow--bottom-start {
  left: 8px;
  margin-left: 0;
}
.zc-tooltip__arrow--bottom-end {
  right: 8px;
  left: auto;
  margin-left: 0;
}

.zc-tooltip__arrow--left,
.zc-tooltip__arrow--left-start,
.zc-tooltip__arrow--left-end {
  right: -4px;
  top: 50%;
  margin-top: -4px;
}
.zc-tooltip__arrow--left-start {
  top: 8px;
  margin-top: 0;
}
.zc-tooltip__arrow--left-end {
  bottom: 8px;
  top: auto;
  margin-top: 0;
}

.zc-tooltip__arrow--right,
.zc-tooltip__arrow--right-start,
.zc-tooltip__arrow--right-end {
  left: -4px;
  top: 50%;
  margin-top: -4px;
}
.zc-tooltip__arrow--right-start {
  top: 8px;
  margin-top: 0;
}
.zc-tooltip__arrow--right-end {
  bottom: 8px;
  top: auto;
  margin-top: 0;
}

/* Transition */
.zc-tooltip-enter-active,
.zc-tooltip-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-tooltip-enter-from,
.zc-tooltip-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
