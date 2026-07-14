<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcPopconfirm' })

export type PopconfirmPlacement =
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

export type PopconfirmTrigger = 'hover' | 'click'

const props = withDefaults(
  defineProps<{
    /** Confirmation title text */
    title?: string
    /** Description text below title */
    description?: string
    /** Confirm button text */
    confirmButtonText?: string
    /** Cancel button text */
    cancelButtonText?: string
    /** Confirm button type */
    confirmButtonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
    /** Cancel button type */
    cancelButtonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
    /** Dangerous action (red confirm button) */
    danger?: boolean
    /** Hidden cancel button */
    hideCancelButton?: boolean
    /** Hidden confirm button */
    hideConfirmButton?: boolean
    /** Disabled */
    disabled?: boolean
    /** Placement relative to reference element */
    placement?: PopconfirmPlacement
    /** Trigger event */
    trigger?: PopconfirmTrigger
    /** Visibility (v-model) */
    visible?: boolean
    /** Show arrow */
    showArrow?: boolean
    /** Popper width */
    width?: number
    /** Icon class */
    icon?: string
  }>(),
  {
    title: 'Are you sure?',
    description: '',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    confirmButtonType: 'primary',
    cancelButtonType: 'default',
    danger: false,
    hideCancelButton: false,
    hideConfirmButton: false,
    disabled: false,
    placement: 'top',
    trigger: 'click',
    visible: false,
    showArrow: true,
    width: 220,
    icon: '',
  }
)

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const ns = useNamespace('popconfirm')

const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)
const internalVisible = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

const GAP = 10 // px gap between trigger and popper

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

function show() {
  if (props.disabled) return
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  internalVisible.value = true
  emit('update:visible', true)
}

function hide() {
  internalVisible.value = false
  emit('update:visible', false)
}

function showDelayed() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  show()
}

function hideDelayed() {
  hideTimer = setTimeout(() => {
    hide()
  }, 150)
}

function toggle() {
  if (internalVisible.value) hide()
  else show()
}

function handleConfirm() {
  emit('confirm')
  hide()
}

function handleCancel() {
  emit('cancel')
  hide()
}

/* ---- Trigger events ---- */
const triggerEvents = computed(() => {
  const events: Record<string, (e?: Event) => void> = {}
  if (props.trigger === 'hover') {
    events.onMouseenter = () => showDelayed()
    events.onMouseleave = () => hideDelayed()
  }
  if (props.trigger === 'click') {
    events.onClick = (e?: Event) => {
      e?.stopPropagation()
      toggle()
    }
  }
  return events
})

/* ---- Sync external visible ---- */
watch(
  () => props.visible,
  (val) => {
    if (val && props.disabled) return
    if (val !== internalVisible.value) {
      internalVisible.value = val
    }
  },
  { immediate: true }
)

// Update position whenever the popper becomes visible
watch(internalVisible, async (visible) => {
  if (visible) {
    await nextTick()
    updatePosition()
  }
})

/* ---- Click outside handler ---- */
function onDocumentClick(e: MouseEvent) {
  if (!internalVisible.value) return
  if (props.trigger === 'hover') return
  const target = e.target as Node
  if (triggerRef.value?.contains(target) || popperRef.value?.contains(target)) return
  hide()
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', onDocumentClick, true)
}

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onDocumentClick, true)
  }
})

const computedConfirmType = computed(() => {
  if (props.danger) return 'danger'
  return props.confirmButtonType
})
</script>

<template>
  <div ref="triggerRef" :class="ns.b()" v-bind="triggerEvents">
    <slot />

    <Teleport to="body" :disabled="!internalVisible">
      <Transition name="zc-popconfirm">
        <div
          v-if="internalVisible"
          ref="popperRef"
          id="zc-popconfirm-dialog"
          :class="[ns.e('popper'), `zc-popconfirm-popper--${placement}`, ns.is('danger', danger)]"
          :style="[{ width: `${width}px` }, popperPosition]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="zc-popconfirm-title"
          :aria-describedby="description ? 'zc-popconfirm-desc' : undefined"
          @keydown.esc="hide"
          @mouseenter="trigger === 'hover' && showDelayed()"
          @mouseleave="trigger === 'hover' && hideDelayed()"
        >
          <!-- Header section: icon + title/description -->
          <div :class="ns.e('header')">
            <!-- Icon -->
            <span :class="ns.e('icon')">
              <i v-if="icon" :class="icon" />
              <svg
                v-else-if="danger"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="zc-popconfirm__icon-svg"
              >
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor" class="zc-popconfirm__icon-svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                />
              </svg>
            </span>
            <div :class="ns.e('header-content')">
              <div :class="ns.e('title')" id="zc-popconfirm-title">{{ title }}</div>
              <div v-if="description" :class="ns.e('description')" id="zc-popconfirm-desc">
                {{ description }}
              </div>
            </div>
          </div>

          <div :class="ns.e('actions')">
            <button
              v-if="!hideCancelButton"
              :class="['zc-popconfirm__btn', `zc-popconfirm__btn--${cancelButtonType}`]"
              type="button"
              @click="handleCancel"
            >
              {{ cancelButtonText }}
            </button>
            <button
              v-if="!hideConfirmButton"
              :class="['zc-popconfirm__btn', `zc-popconfirm__btn--${computedConfirmType}`]"
              type="button"
              @click="handleConfirm"
            >
              {{ confirmButtonText }}
            </button>
          </div>

          <!-- Arrow -->
          <span v-if="showArrow" :class="[ns.e('arrow'), `zc-popconfirm-arrow--${placement}`]" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcPopconfirm styles
 * ============================================================ */

.zc-popconfirm {
  --zc-popconfirm-bg-color: var(--color-zc-bg-base, #fff);
  --zc-popconfirm-title-color: var(--color-zc-text-primary, #303133);
  --zc-popconfirm-text-color: var(--color-zc-text-regular, #606266);
  --zc-popconfirm-font-size: var(--text-zc-base, 14px);
  --zc-popconfirm-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-popconfirm-border-radius: var(--radius-zc-base, 4px);
  --zc-popconfirm-box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  --zc-popconfirm-padding: 12px 16px;
  --zc-popconfirm-icon-color: var(--color-zc-warning-500, #e6a23c);

  display: inline-flex;
  position: relative;
}

.zc-popconfirm__popper {
  position: fixed;
  z-index: var(--z-zc-popover, 1400);
  background: var(--zc-popconfirm-bg-color);
  border-radius: var(--zc-popconfirm-border-radius);
  box-shadow: var(--zc-popconfirm-box-shadow);
  border: 1px solid var(--zc-popconfirm-border-color);
  padding: var(--zc-popconfirm-padding);
}

/* ---- Header ---- */
.zc-popconfirm__header {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.zc-popconfirm__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--zc-popconfirm-icon-color);
}
.zc-popconfirm__icon-svg {
  width: 16px;
  height: 16px;
}
.zc-popconfirm.is-danger .zc-popconfirm__icon {
  color: var(--color-zc-danger-500, #f56c6c);
}

.zc-popconfirm__header-content {
  flex: 1;
  min-width: 0;
}
.zc-popconfirm__title {
  font-size: var(--zc-popconfirm-font-size);
  font-weight: 500;
  color: var(--zc-popconfirm-title-color);
  line-height: 1.5;
}
.zc-popconfirm__description {
  margin-top: 4px;
  font-size: var(--text-zc-sm, 13px);
  color: var(--color-zc-text-secondary, #909399);
  line-height: 1.5;
}

/* ---- Actions ---- */
.zc-popconfirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

/* ---- Buttons ---- */
.zc-popconfirm__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  font-size: var(--text-zc-sm, 13px);
  border-radius: var(--zc-popconfirm-border-radius);
  cursor: pointer;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  background: var(--zc-popconfirm-bg-color);
  color: var(--zc-popconfirm-text-color);
  transition: all var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  white-space: nowrap;
}
.zc-popconfirm__btn:hover {
  opacity: 0.85;
}

.zc-popconfirm__btn--primary {
  background: var(--color-zc-primary-500, #409eff);
  border-color: var(--color-zc-primary-500, #409eff);
  color: var(--color-zc-white, #fff);
}
.zc-popconfirm__btn--success {
  background: var(--color-zc-success-500, #67c23a);
  border-color: var(--color-zc-success-500, #67c23a);
  color: var(--color-zc-white, #fff);
}
.zc-popconfirm__btn--warning {
  background: var(--color-zc-warning-500, #e6a23c);
  border-color: var(--color-zc-warning-500, #e6a23c);
  color: var(--color-zc-white, #fff);
}
.zc-popconfirm__btn--danger {
  background: var(--color-zc-danger-500, #f56c6c);
  border-color: var(--color-zc-danger-500, #f56c6c);
  color: var(--color-zc-white, #fff);
}
.zc-popconfirm__btn--info {
  background: var(--color-zc-info-500, #909399);
  border-color: var(--color-zc-info-500, #909399);
  color: var(--color-zc-white, #fff);
}
.zc-popconfirm__btn--default {
  background: var(--zc-popconfirm-bg-color);
  border-color: var(--color-zc-border-base, #dcdfe6);
  color: var(--zc-popconfirm-text-color);
}
.zc-popconfirm__btn--default:hover {
  border-color: var(--color-zc-primary-300, #a0cfff);
  color: var(--color-zc-primary-500, #409eff);
}

/* ---- Arrow ---- */
.zc-popconfirm__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--zc-popconfirm-bg-color);
  transform: rotate(45deg);
  border: 1px solid var(--zc-popconfirm-border-color);
}
.zc-popconfirm-arrow--top,
.zc-popconfirm-arrow--top-start,
.zc-popconfirm-arrow--top-end {
  bottom: -5px;
  left: 50%;
  margin-left: -4px;
  border-top: none;
  border-left: none;
}
.zc-popconfirm-arrow--bottom,
.zc-popconfirm-arrow--bottom-start,
.zc-popconfirm-arrow--bottom-end {
  top: -5px;
  left: 50%;
  margin-left: -4px;
  border-bottom: none;
  border-right: none;
}
.zc-popconfirm-arrow--left,
.zc-popconfirm-arrow--left-start,
.zc-popconfirm-arrow--left-end {
  right: -5px;
  top: 50%;
  margin-top: -4px;
  border-bottom: none;
  border-left: none;
}
.zc-popconfirm-arrow--right,
.zc-popconfirm-arrow--right-start,
.zc-popconfirm-arrow--right-end {
  left: -5px;
  top: 50%;
  margin-top: -4px;
  border-top: none;
  border-right: none;
}

/* ---- Transition ---- */
.zc-popconfirm-enter-active,
.zc-popconfirm-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.2s) var(--ease-zc-in-out, ease),
    transform var(--transition-duration-zc-base, 0.2s) var(--ease-zc-in-out, ease);
}
.zc-popconfirm-enter-from,
.zc-popconfirm-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
