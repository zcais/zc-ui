<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcPopover' })

export type PopoverPlacement =
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

export type PopoverTrigger = 'hover' | 'click' | 'focus' | 'contextmenu'

const props = withDefaults(
  defineProps<{
    /** Popover title */
    title?: string
    /** Popover content text */
    content?: string
    /** Visibility (v-model) */
    visible?: boolean
    /** Placement relative to reference element */
    placement?: PopoverPlacement
    /** Trigger events */
    trigger?: PopoverTrigger
    /** Show delay in ms (for hover) */
    showDelay?: number
    /** Hide delay in ms (for hover) */
    hideDelay?: number
    /** Disabled */
    disabled?: boolean
    /** Show arrow */
    showArrow?: boolean
    /** Custom class */
    popperClass?: string
    /** Popper width in px */
    width?: number | string
    /** Popper min-width in px */
    minWidth?: number | string
    /** Transition name */
    transition?: string
    /** Offset in px between trigger and popper */
    offset?: number
    /** Hide when clicking outside (for click trigger) */
    hideAfterClickOutside?: boolean
  }>(),
  {
    title: '',
    content: '',
    visible: false,
    placement: 'bottom',
    trigger: 'click',
    showDelay: 100,
    hideDelay: 100,
    disabled: false,
    showArrow: true,
    popperClass: '',
    width: undefined,
    minWidth: undefined,
    transition: 'zc-popover',
    offset: 8,
    hideAfterClickOutside: true,
  }
)

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'show'): void
  (e: 'hide'): void
  (e: 'after-enter'): void
  (e: 'after-leave'): void
}>()

const ns = useNamespace('popover')

const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)
const internalVisible = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const GAP = computed(() => props.offset)

/** Dynamically compute popper position based on trigger element rect */
const popperPosition = ref<Record<string, string>>({})

function updatePosition() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const winH = window.innerHeight
  const winW = window.innerWidth
  const gap = GAP.value

  const placements: Record<string, Record<string, string>> = {
    top: {
      left: `${rect.left + rect.width / 2}px`,
      bottom: `${winH - rect.top + gap}px`,
      transform: 'translateX(-50%)',
    },
    'top-start': {
      left: `${rect.left}px`,
      bottom: `${winH - rect.top + gap}px`,
    },
    'top-end': {
      right: `${winW - rect.right}px`,
      bottom: `${winH - rect.top + gap}px`,
    },
    bottom: {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.bottom + gap}px`,
      transform: 'translateX(-50%)',
    },
    'bottom-start': {
      left: `${rect.left}px`,
      top: `${rect.bottom + gap}px`,
    },
    'bottom-end': {
      right: `${winW - rect.right}px`,
      top: `${rect.bottom + gap}px`,
    },
    left: {
      top: `${rect.top + rect.height / 2}px`,
      right: `${winW - rect.left + gap}px`,
      transform: 'translateY(-50%)',
    },
    'left-start': {
      top: `${rect.top}px`,
      right: `${winW - rect.left + gap}px`,
    },
    'left-end': {
      bottom: `${winH - rect.bottom}px`,
      right: `${winW - rect.left + gap}px`,
    },
    right: {
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.right + gap}px`,
      transform: 'translateY(-50%)',
    },
    'right-start': {
      top: `${rect.top}px`,
      left: `${rect.right + gap}px`,
    },
    'right-end': {
      bottom: `${winH - rect.bottom}px`,
      left: `${rect.right + gap}px`,
    },
  }
  popperPosition.value = placements[props.placement] || placements.bottom
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
  if (props.trigger === 'hover' && props.showDelay > 0) {
    showTimer = setTimeout(() => {
      doShow()
    }, props.showDelay)
  } else {
    doShow()
  }
}

function doShow() {
  if (props.disabled) return
  internalVisible.value = true
  emit('update:visible', true)
  emit('show')
}

function handleHide() {
  clearTimers()
  if (props.trigger === 'hover' && props.hideDelay > 0) {
    hideTimer = setTimeout(() => {
      doHide()
    }, props.hideDelay)
  } else {
    doHide()
  }
}

function doHide() {
  internalVisible.value = false
  emit('update:visible', false)
  emit('hide')
}

function handleToggle() {
  if (internalVisible.value) handleHide()
  else handleShow()
}

function handleContextMenu(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  handleToggle()
}

// ---- Trigger events based on trigger type ----
const triggerEvents = computed(() => {
  const events: Record<string, (e?: Event) => void> = {}
  if (props.trigger === 'hover') {
    events.onMouseenter = () => handleShow()
    events.onMouseleave = () => handleHide()
  }
  if (props.trigger === 'click') {
    events.onClick = (e?: Event) => {
      e?.stopPropagation()
      handleToggle()
    }
  }
  if (props.trigger === 'focus') {
    events.onFocus = () => handleShow()
    events.onBlur = () => handleHide()
  }
  if (props.trigger === 'contextmenu') {
    events.onContextmenu = (e?: Event) => handleContextMenu(e!)
  }
  return events
})

// ---- Sync external visible prop ----
watch(
  () => props.visible,
  (val) => {
    if (val !== internalVisible.value) {
      if (val) doShow()
      else doHide()
    }
  },
  { immediate: true }
)

// ---- Update position whenever popper becomes visible ----
watch(internalVisible, async (visible) => {
  if (visible) {
    await nextTick()
    updatePosition()
  }
})

// ---- Click outside handler for click trigger ----
let documentClickHandler: ((e: MouseEvent) => void) | null = null

function attachDocumentClick() {
  if (documentClickHandler) return
  documentClickHandler = (e: MouseEvent) => {
    if (!props.hideAfterClickOutside) return
    if (props.trigger !== 'click') return
    const target = e.target as Node
    if (triggerRef.value?.contains(target) || popperRef.value?.contains(target)) return
    if (internalVisible.value) handleHide()
  }
  document.addEventListener('click', documentClickHandler, true)
}

function detachDocumentClick() {
  if (documentClickHandler) {
    document.removeEventListener('click', documentClickHandler, true)
    documentClickHandler = null
  }
}

// Register document click when visible with click trigger
watch(internalVisible, (visible) => {
  if (visible && props.trigger === 'click') {
    nextTick(() => attachDocumentClick())
  } else {
    detachDocumentClick()
  }
})

// Also detach if trigger changes away from click
watch(
  () => props.trigger,
  (trigger) => {
    if (trigger !== 'click') {
      detachDocumentClick()
    }
  }
)

onBeforeUnmount(() => {
  clearTimers()
  detachDocumentClick()
})

// ---- Popper style (width + position) ----
const popperStyle = computed(() => {
  const styles: Record<string, string> = {}
  if (props.width !== undefined) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.minWidth !== undefined) {
    styles.minWidth = typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth
  }
  return [styles, popperPosition.value]
})

// ---- Transition hooks ----
function onAfterEnter() {
  emit('after-enter')
}

function onAfterLeave() {
  emit('after-leave')
}

// ---- Expose methods ----
defineExpose({
  show: handleShow,
  hide: handleHide,
  toggle: handleToggle,
  updatePosition,
})
</script>

<template>
  <div ref="triggerRef" :class="ns.b()" v-bind="triggerEvents">
    <slot />

    <Teleport to="body" :disabled="!internalVisible">
      <Transition :name="transition" @after-enter="onAfterEnter" @after-leave="onAfterLeave">
        <div
          v-if="internalVisible"
          ref="popperRef"
          :class="[ns.e('popper'), `zc-popover-popper--${placement}`, popperClass]"
          :style="popperStyle"
          role="dialog"
          @mouseenter="trigger === 'hover' && handleShow()"
          @mouseleave="trigger === 'hover' && handleHide()"
        >
          <!-- Title -->
          <div v-if="title || $slots.title" :class="ns.e('title')">
            <slot name="title">{{ title }}</slot>
          </div>

          <!-- Content -->
          <div :class="ns.e('content')">
            <slot name="content">{{ content }}</slot>
          </div>

          <!-- Arrow -->
          <span v-if="showArrow" :class="[ns.e('arrow'), `zc-popover-arrow--${placement}`]" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcPopover styles
 * ============================================================ */

.zc-popover {
  --zc-popover-bg-color: var(--color-zc-bg-base, #fff);
  --zc-popover-title-color: var(--color-zc-text-primary, #303133);
  --zc-popover-text-color: var(--color-zc-text-regular, #606266);
  --zc-popover-title-font-size: var(--text-zc-md, 16px);
  --zc-popover-font-size: var(--text-zc-base, 14px);
  --zc-popover-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-popover-border-radius: var(--radius-zc-base, 4px);
  --zc-popover-box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  --zc-popover-padding: 12px 16px;

  display: inline-flex;
  position: relative;
}

.zc-popover__popper {
  position: fixed;
  z-index: var(--z-zc-popover, 1400);
  background: var(--zc-popover-bg-color);
  color: var(--zc-popover-text-color);
  border-radius: var(--zc-popover-border-radius);
  border: 1px solid var(--zc-popover-border-color);
  box-shadow: var(--zc-popover-box-shadow);
  padding: var(--zc-popover-padding);
  max-width: 300px;
  line-height: 1.5;
  word-wrap: break-word;
}

/* ---- Title ---- */
.zc-popover__title {
  font-size: var(--zc-popover-title-font-size);
  font-weight: 600;
  color: var(--zc-popover-title-color);
  line-height: 1.5;
  margin-bottom: 8px;
}
.zc-popover__title:empty {
  display: none;
}

/* ---- Content ---- */
.zc-popover__content {
  font-size: var(--zc-popover-font-size);
  color: var(--zc-popover-text-color);
  line-height: 1.6;
}

/* ---- Arrow ---- */
.zc-popover__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--zc-popover-bg-color);
  transform: rotate(45deg);
  border: 1px solid var(--zc-popover-border-color);
}

/* Arrow positions: top */
.zc-popover-arrow--top,
.zc-popover-arrow--top-start,
.zc-popover-arrow--top-end {
  bottom: -5px;
  left: 50%;
  margin-left: -4px;
  border-top: none;
  border-left: none;
}
.zc-popover-arrow--top-start {
  left: 8px;
  margin-left: 0;
}
.zc-popover-arrow--top-end {
  right: 8px;
  left: auto;
  margin-left: 0;
}

/* Arrow positions: bottom */
.zc-popover-arrow--bottom,
.zc-popover-arrow--bottom-start,
.zc-popover-arrow--bottom-end {
  top: -5px;
  left: 50%;
  margin-left: -4px;
  border-bottom: none;
  border-right: none;
}
.zc-popover-arrow--bottom-start {
  left: 8px;
  margin-left: 0;
}
.zc-popover-arrow--bottom-end {
  right: 8px;
  left: auto;
  margin-left: 0;
}

/* Arrow positions: left */
.zc-popover-arrow--left,
.zc-popover-arrow--left-start,
.zc-popover-arrow--left-end {
  right: -5px;
  top: 50%;
  margin-top: -4px;
  border-bottom: none;
  border-left: none;
}
.zc-popover-arrow--left-start {
  top: 8px;
  margin-top: 0;
}
.zc-popover-arrow--left-end {
  bottom: 8px;
  top: auto;
  margin-top: 0;
}

/* Arrow positions: right */
.zc-popover-arrow--right,
.zc-popover-arrow--right-start,
.zc-popover-arrow--right-end {
  left: -5px;
  top: 50%;
  margin-top: -4px;
  border-top: none;
  border-right: none;
}
.zc-popover-arrow--right-start {
  top: 8px;
  margin-top: 0;
}
.zc-popover-arrow--right-end {
  bottom: 8px;
  top: auto;
  margin-top: 0;
}

/* ---- Default transition ---- */
.zc-popover-enter-active,
.zc-popover-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-popover-enter-from,
.zc-popover-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
