<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useZIndex, useFocusTrap } from '@zc-ui/hooks'

defineOptions({ name: 'ZcDrawer' })

import type { DrawerDirection } from './types'

const props = withDefaults(
  defineProps<{
    /** Visibility (v-model) */
    modelValue: boolean
    /** Drawer title */
    title?: string
    /** Drawer direction: rtl(right)|ltr(left)|ttb(top)|btt(bottom) */
    direction?: DrawerDirection
    /** Drawer size (width for ltr/rtl, height for ttb/btt) */
    size?: string | number
    /** Show close button */
    showClose?: boolean
    /** Close on overlay click */
    closeOnClickOverlay?: boolean
    /** Close on Escape key */
    closeOnEsc?: boolean
    /** Lock body scroll when open */
    lockScroll?: boolean
    /** Enable drag to resize */
    resizable?: boolean
    /** Min size when dragging */
    minSize?: number
    /** Max size when dragging */
    maxSize?: number
    /** Custom drawer class */
    drawerClass?: string
  }>(),
  {
    title: '',
    direction: 'rtl',
    size: '30%',
    showClose: true,
    closeOnClickOverlay: true,
    closeOnEsc: true,
    lockScroll: true,
    resizable: false,
    minSize: 200,
    maxSize: 800,
    drawerClass: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const ns = useNamespace('drawer')
const { nextZIndex } = useZIndex()
const focusTrap = useFocusTrap()

const isVisible = ref(false)
const zIndex = ref(2000)

const panelRef = shallowRef<HTMLElement>()
const titleId = `zc-drawer-title-${Math.random().toString(36).slice(2, 9)}`

/* ---- Drag-to-resize state ---- */
const dragSize = ref<string | null>(null)
let isDragging = false
let dragStartSize = 0
let dragStartPos = 0

const isHorizontal = computed(() => props.direction === 'rtl' || props.direction === 'ltr')

const computedSize = computed(() => {
  const s = dragSize.value ?? props.size
  return typeof s === 'number' ? `${s}px` : s
})

const drawerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (isHorizontal.value) {
    style.width = computedSize.value
  } else {
    style.height = computedSize.value
  }
  return style
})

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
    }, 300)
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
  emit('update:modelValue', false)
}

function handleOverlayClick() {
  if (props.closeOnClickOverlay) handleClose()
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc && isVisible.value) {
    handleClose()
  }
}

/* ---- Drag-to-resize handlers ---- */
function getSizeInPx(): number {
  const s = computedSize.value
  if (s.endsWith('px')) return parseInt(s)
  if (s.endsWith('%')) {
    const percent = parseInt(s) / 100
    if (isHorizontal.value) {
      return typeof window !== 'undefined' ? window.innerWidth * percent : 0
    }
    return typeof window !== 'undefined' ? window.innerHeight * percent : 0
  }
  return parseInt(s) || 0
}

function handleDragStart(e: MouseEvent) {
  if (!props.resizable) return
  isDragging = true
  dragStartSize = getSizeInPx()
  dragStartPos = isHorizontal.value ? e.clientX : e.clientY
  document.body.style.cursor = isHorizontal.value ? 'col-resize' : 'row-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
}

function handleDragMove(e: MouseEvent) {
  if (!isDragging) return
  const currentPos = isHorizontal.value ? e.clientX : e.clientY
  let delta: number

  switch (props.direction) {
    case 'rtl': // right drawer: drag left edge, moving left = bigger
      delta = dragStartPos - currentPos
      break
    case 'ltr': // left drawer: drag right edge, moving right = bigger
      delta = currentPos - dragStartPos
      break
    case 'ttb': // top drawer: drag bottom edge, moving down = bigger
      delta = currentPos - dragStartPos
      break
    case 'btt': // bottom drawer: drag top edge, moving up = bigger
      delta = dragStartPos - currentPos
      break
    default:
      delta = 0
  }

  let newSize = dragStartSize + delta
  newSize = Math.max(props.minSize, Math.min(props.maxSize, newSize))
  dragSize.value = `${newSize}px`
}

function handleDragEnd() {
  isDragging = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
}

// Sync with v-model
watch(
  () => props.modelValue,
  (val) => {
    if (val) open()
    else if (isVisible.value) close()
  },
  { immediate: true }
)

watch(isVisible, (val) => {
  if (val && props.closeOnEsc) {
    document.addEventListener('keydown', handleEsc)
  } else {
    document.removeEventListener('keydown', handleEsc)
  }
})

onBeforeUnmount(() => {
  focusTrap.release()
  if (props.lockScroll && typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
  document.removeEventListener('keydown', handleEsc)
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
})
</script>

<template>
  <Teleport to="body" :disabled="!isVisible">
    <Transition :name="`zc-drawer-overlay`">
      <div
        v-if="isVisible"
        :class="[ns.e('overlay'), `zc-drawer-overlay--${direction}`]"
        :style="{ zIndex }"
        @click="handleOverlayClick"
      >
        <Transition :name="`zc-drawer-slide-${direction}`" appear>
          <div
            v-if="isVisible"
            ref="panelRef"
            :class="[ns.e('panel'), `zc-drawer-panel--${direction}`, drawerClass]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? titleId : undefined"
            :style="drawerStyle"
            @click.stop
          >
            <!-- Resize handle -->
            <div
              v-if="resizable"
              :class="[ns.e('resize-handle'), `zc-drawer-resize-handle--${direction}`]"
              @mousedown="handleDragStart"
            />

            <!-- Header -->
            <div v-if="title || $slots.title || showClose" :class="ns.e('header')">
              <slot name="title">
                <span :id="titleId" :class="ns.e('title-text')">{{ title }}</span>
              </slot>
              <button
                v-if="showClose"
                :class="ns.e('close-btn')"
                type="button"
                aria-label="关闭抽屉"
                @click="handleClose"
              >
                <svg viewBox="0 0 24 24" fill="none" class="zc-drawer__icon">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
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
 * ZcDrawer styles
 * ============================================================ */

.zc-drawer__overlay {
  /* Component-level CSS variables */
  --zc-drawer-overlay-bg-color: rgba(0, 0, 0, 0.5);
  --zc-drawer-bg-color: var(--color-zc-bg-base, #fff);
  --zc-drawer-box-shadow: var(--shadow-zc-xl, 0 16px 48px 0 rgba(0, 0, 0, 0.16));
  --zc-drawer-title-font-size: var(--text-zc-lg, 18px);
  --zc-drawer-title-color: var(--color-zc-text-primary, #303133);
  --zc-drawer-header-padding: 16px 20px;
  --zc-drawer-header-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-drawer-body-padding: 20px;
  --zc-drawer-body-color: var(--color-zc-text-regular, #606266);
  --zc-drawer-body-font-size: var(--text-zc-base, 14px);
  --zc-drawer-footer-padding: 12px 20px 16px;
  --zc-drawer-footer-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-drawer-close-color: var(--color-zc-text-secondary, #909399);
  --zc-drawer-close-hover-color: var(--color-zc-text-primary, #303133);
  --zc-drawer-close-hover-bg: var(--color-zc-fill-light, #f5f7fa);
  --zc-drawer-close-border-radius: var(--radius-zc-base, 4px);

  position: fixed;
  inset: 0;
  background: var(--zc-drawer-overlay-bg-color);
}

/* ---- Panel base ---- */
.zc-drawer__panel {
  position: absolute;
  background: var(--zc-drawer-bg-color);
  box-shadow: var(--zc-drawer-box-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ---- Direction positions ---- */
.zc-drawer-panel--rtl {
  top: 0;
  right: 0;
  height: 100%;
}
.zc-drawer-panel--ltr {
  top: 0;
  left: 0;
  height: 100%;
}
.zc-drawer-panel--ttb {
  top: 0;
  left: 0;
  width: 100%;
}
.zc-drawer-panel--btt {
  bottom: 0;
  left: 0;
  width: 100%;
}

/* ---- Header ---- */
.zc-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zc-drawer-header-padding);
  flex-shrink: 0;
  border-bottom: 1px solid var(--zc-drawer-header-border-color);
}
.zc-drawer__title-text {
  font-size: var(--zc-drawer-title-font-size);
  font-weight: 600;
  color: var(--zc-drawer-title-color);
}
.zc-drawer__close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--zc-drawer-close-color);
  cursor: pointer;
  border-radius: var(--zc-drawer-close-border-radius);
  transition: all var(--transition-duration-zc-base, 0.25s);
}
.zc-drawer__close-btn:hover {
  color: var(--zc-drawer-close-hover-color);
  background: var(--zc-drawer-close-hover-bg);
}
.zc-drawer__icon {
  width: 18px;
  height: 18px;
}

/* ---- Body ---- */
.zc-drawer__body {
  flex: 1;
  padding: var(--zc-drawer-body-padding);
  overflow-y: auto;
  color: var(--zc-drawer-body-color);
  font-size: var(--zc-drawer-body-font-size);
  line-height: 1.6;
}

/* ---- Footer ---- */
.zc-drawer__footer {
  padding: var(--zc-drawer-footer-padding);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-top: 1px solid var(--zc-drawer-footer-border-color);
}

/* ---- Resize handle ---- */
.zc-drawer__resize-handle {
  position: absolute;
  z-index: var(--z-zc-base, 1);
}
.zc-drawer-resize-handle--rtl {
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  cursor: col-resize;
}
.zc-drawer-resize-handle--ltr {
  right: 0;
  top: 0;
  width: 4px;
  height: 100%;
  cursor: col-resize;
}
.zc-drawer-resize-handle--ttb {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  cursor: row-resize;
}
.zc-drawer-resize-handle--btt {
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  cursor: row-resize;
}
.zc-drawer__resize-handle:hover {
  background: var(--color-zc-primary-300, #a0cfff);
}

/* ---- Transitions: overlay ---- */
.zc-drawer-overlay-enter-active,
.zc-drawer-overlay-leave-active {
  transition: opacity var(--transition-duration-zc-base, 0.25s);
}
.zc-drawer-overlay-enter-from,
.zc-drawer-overlay-leave-to {
  opacity: 0;
}

/* ---- Transitions: rtl (right to left) ---- */
.zc-drawer-slide-rtl-enter-active,
.zc-drawer-slide-rtl-leave-active {
  transition: transform var(--transition-duration-zc-base, 0.3s) var(--ease-zc-in-out, ease);
}
.zc-drawer-slide-rtl-enter-from,
.zc-drawer-slide-rtl-leave-to {
  transform: translateX(100%);
}

/* ---- Transitions: ltr (left to right) ---- */
.zc-drawer-slide-ltr-enter-active,
.zc-drawer-slide-ltr-leave-active {
  transition: transform var(--transition-duration-zc-base, 0.3s) var(--ease-zc-in-out, ease);
}
.zc-drawer-slide-ltr-enter-from,
.zc-drawer-slide-ltr-leave-to {
  transform: translateX(-100%);
}

/* ---- Transitions: ttb (top to bottom) ---- */
.zc-drawer-slide-ttb-enter-active,
.zc-drawer-slide-ttb-leave-active {
  transition: transform var(--transition-duration-zc-base, 0.3s) var(--ease-zc-in-out, ease);
}
.zc-drawer-slide-ttb-enter-from,
.zc-drawer-slide-ttb-leave-to {
  transform: translateY(-100%);
}

/* ---- Transitions: btt (bottom to top) ---- */
.zc-drawer-slide-btt-enter-active,
.zc-drawer-slide-btt-leave-active {
  transition: transform var(--transition-duration-zc-base, 0.3s) var(--ease-zc-in-out, ease);
}
.zc-drawer-slide-btt-enter-from,
.zc-drawer-slide-btt-leave-to {
  transform: translateY(100%);
}
</style>
