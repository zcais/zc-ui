<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useZIndex, useFocusTrap } from '@zc-ui/hooks'

defineOptions({ name: 'ZcDialog' })

import type { DialogSize } from './types'

const props = withDefaults(
  defineProps<{
    /** Visibility (v-model) */
    modelValue: boolean
    /** Dialog title */
    title?: string
    /** Dialog width (CSS string or number in px) */
    width?: string | number
    /** Dialog size preset */
    size?: DialogSize
    /** Show fullscreen toggle button */
    fullscreen?: boolean
    /** Enable header drag */
    draggable?: boolean
    /** Show close button */
    showClose?: boolean
    /** Center the dialog */
    center?: boolean
    /** Overlay background */
    overlayClass?: string
    /** Close on overlay click */
    closeOnClickOverlay?: boolean
    /** Close on Escape key */
    closeOnEsc?: boolean
    /** Lock body scroll when open */
    lockScroll?: boolean
    /** Custom dialog class */
    dialogClass?: string
    /** Hook called before closing. If returns false / rejects, close is aborted. */
    beforeClose?: (done: () => void) => void
  }>(),
  {
    title: '',
    width: undefined,
    size: 'medium',
    fullscreen: false,
    draggable: false,
    showClose: true,
    center: false,
    overlayClass: '',
    closeOnClickOverlay: true,
    closeOnEsc: true,
    lockScroll: true,
    dialogClass: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'closed'): void
}>()

const ns = useNamespace('dialog')
const { nextZIndex } = useZIndex()
const focusTrap = useFocusTrap()

const isVisible = ref(false)
const isFullScreen = ref(false)
const zIndex = ref(2000)

const panelRef = shallowRef<HTMLElement>()
const titleId = `zc-dialog-title-${Math.random().toString(36).slice(2, 9)}`

// Drag state
const dragOffset = ref({ x: 0, y: 0 })
let isDragging = false
let dragStart = { x: 0, y: 0, offsetX: 0, offsetY: 0 }

const dialogWidth = computed(() => {
  if (isFullScreen.value) return '100%'
  if (props.width) {
    return typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  const sizeMap: Record<DialogSize, string> = {
    small: '400px',
    medium: '50%',
    large: '800px',
    full: '90%',
  }
  return sizeMap[props.size] || '50%'
})

const dialogStyle = computed(() => ({
  width: dialogWidth.value,
  marginTop: isFullScreen.value ? '0' : '15vh',
  transform:
    props.draggable && dragOffset.value
      ? `translate(${dragOffset.value.x}px, ${dragOffset.value.y}px)`
      : 'none',
}))

function open() {
  isVisible.value = true
  zIndex.value = nextZIndex()
  emit('open')
  if (props.lockScroll && typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
  // Activate focus trap after transition
  nextTick(() => {
    setTimeout(() => {
      if (panelRef.value) {
        focusTrap.activate(panelRef)
      }
    }, 100)
  })
}

function close() {
  focusTrap.release()
  isVisible.value = false
  emit('close')
  if (props.lockScroll && typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

function handleClose() {
  if (typeof props.beforeClose === 'function') {
    props.beforeClose(() => {
      emit('update:modelValue', false)
    })
  } else {
    emit('update:modelValue', false)
  }
}

function handleOverlayClick() {
  if (props.closeOnClickOverlay) handleClose()
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc && isVisible.value) {
    handleClose()
  }
}

function toggleFullScreen() {
  isFullScreen.value = !isFullScreen.value
  dragOffset.value = { x: 0, y: 0 }
}

// Drag handlers
function handleDragStart(e: MouseEvent) {
  if (!props.draggable || isFullScreen.value) return
  isDragging = true
  dragStart = {
    x: e.clientX,
    y: e.clientY,
    offsetX: dragOffset.value.x,
    offsetY: dragOffset.value.y,
  }
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
}

function handleDragMove(e: MouseEvent) {
  if (!isDragging) return
  dragOffset.value = {
    x: dragStart.offsetX + (e.clientX - dragStart.x),
    y: dragStart.offsetY + (e.clientY - dragStart.y),
  }
}

function handleDragEnd() {
  isDragging = false
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
}

// Sync with v-model
watch(
  () => props.modelValue,
  (val) => {
    if (val) open()
    else {
      if (isVisible.value) close()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  focusTrap.release()
  if (props.lockScroll && typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
})

// Attach keyboard listener when visible
watch(isVisible, (val) => {
  if (val && props.closeOnEsc) {
    document.addEventListener('keydown', handleEsc)
  } else {
    document.removeEventListener('keydown', handleEsc)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEsc)
})
</script>

<template>
  <Teleport to="body" :disabled="!isVisible">
    <Transition name="zc-dialog-overlay">
      <div
        v-if="isVisible"
        :class="[ns.e('overlay'), overlayClass]"
        :style="{ zIndex }"
        @click="handleOverlayClick"
      >
        <Transition name="zc-dialog" appear>
          <div
            v-if="isVisible"
            ref="panelRef"
            :class="[
              ns.e('panel'),
              ns.is('fullscreen', isFullScreen),
              ns.is('center', center),
              dialogClass,
            ]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? titleId : undefined"
            :style="dialogStyle"
            @click.stop
          >
            <!-- Header -->
            <div
              v-if="title || $slots.title || showClose || fullscreen"
              :class="ns.e('header')"
              @mousedown="handleDragStart"
            >
              <slot name="title">
                <span :id="titleId" :class="ns.e('title-text')">{{ title }}</span>
              </slot>
              <div :class="ns.e('header-actions')">
                <button
                  v-if="fullscreen"
                  :class="ns.e('fullscreen-btn')"
                  type="button"
                  :aria-label="isFullScreen ? '退出全屏' : '全屏'"
                  @click="toggleFullScreen"
                >
                  <svg v-if="!isFullScreen" viewBox="0 0 24 24" fill="none" class="zc-dialog__icon">
                    <path
                      d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" class="zc-dialog__icon">
                    <path
                      d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button
                  v-if="showClose"
                  :class="ns.e('close-btn')"
                  type="button"
                  aria-label="关闭对话框"
                  @click="handleClose"
                >
                  <svg viewBox="0 0 24 24" fill="none" class="zc-dialog__icon">
                    <path
                      d="M6 6l12 12M6 18L18 6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div :class="ns.e('body')">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" :class="ns.e('footer')">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ============================================================
 * ZcDialog styles
 * ============================================================ */

.zc-dialog__overlay {
  /* Component-level CSS variables */
  --zc-dialog-overlay-bg-color: rgba(0, 0, 0, 0.5);
  --zc-dialog-bg-color: var(--color-zc-bg-base, #fff);
  --zc-dialog-border-radius: var(--radius-zc-lg, 8px);
  --zc-dialog-box-shadow: var(--shadow-zc-xl, 0 16px 48px 0 rgba(0, 0, 0, 0.16));
  --zc-dialog-title-font-size: var(--text-zc-lg, 18px);
  --zc-dialog-title-color: var(--color-zc-text-primary, #303133);
  --zc-dialog-header-padding: 16px 20px;
  --zc-dialog-body-padding: 20px;
  --zc-dialog-body-color: var(--color-zc-text-regular, #606266);
  --zc-dialog-body-font-size: var(--text-zc-base, 14px);
  --zc-dialog-footer-padding: 12px 20px 16px;
  --zc-dialog-close-color: var(--color-zc-text-secondary, #909399);
  --zc-dialog-close-hover-color: var(--color-zc-text-primary, #303133);
  --zc-dialog-close-hover-bg: var(--color-zc-fill-light, #f5f7fa);
  --zc-dialog-close-border-radius: var(--radius-zc-base, 4px);

  position: fixed;
  inset: 0;
  background: var(--zc-dialog-overlay-bg-color);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.zc-dialog__panel {
  background: var(--zc-dialog-bg-color);
  border-radius: var(--zc-dialog-border-radius);
  box-shadow: var(--zc-dialog-box-shadow);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 15vh 16px;
}

.zc-dialog__panel.is-fullscreen {
  width: 100% !important;
  height: 100vh;
  max-height: 100vh;
  margin: 0;
  border-radius: 0;
}

.zc-dialog__panel.is-center {
  text-align: center;
}

/* Header */
.zc-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zc-dialog-header-padding);
  cursor: default;
  user-select: none;
  flex-shrink: 0;
}

.zc-dialog__header:hover {
  cursor: move;
}

.zc-dialog__title-text {
  font-size: var(--zc-dialog-title-font-size);
  font-weight: 600;
  color: var(--zc-dialog-title-color);
  line-height: 1.5;
}

.zc-dialog__header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zc-dialog__close-btn,
.zc-dialog__fullscreen-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--zc-dialog-close-color);
  cursor: pointer;
  border-radius: var(--zc-dialog-close-border-radius);
  transition: all var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-dialog__close-btn:hover,
.zc-dialog__fullscreen-btn:hover {
  color: var(--zc-dialog-close-hover-color);
  background: var(--zc-dialog-close-hover-bg);
}

.zc-dialog__icon {
  width: 18px;
  height: 18px;
}

/* Body */
.zc-dialog__body {
  flex: 1;
  padding: var(--zc-dialog-body-padding);
  overflow-y: auto;
  color: var(--zc-dialog-body-color);
  font-size: var(--zc-dialog-body-font-size);
  line-height: 1.6;
}

/* Footer */
.zc-dialog__footer {
  padding: var(--zc-dialog-footer-padding);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.zc-dialog__panel.is-center .zc-dialog__footer {
  justify-content: center;
}

/* Transitions */
.zc-dialog-overlay-enter-active,
.zc-dialog-overlay-leave-active {
  transition: opacity var(--transition-duration-zc-base, 0.25s);
}
.zc-dialog-overlay-enter-from,
.zc-dialog-overlay-leave-to {
  opacity: 0;
}

.zc-dialog-enter-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s),
    transform var(--transition-duration-zc-base, 0.25s);
}
.zc-dialog-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s),
    transform var(--transition-duration-zc-base, 0.25s);
}
.zc-dialog-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}
.zc-dialog-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}
</style>
