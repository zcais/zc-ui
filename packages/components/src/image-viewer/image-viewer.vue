<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useZIndex } from '@zc-ui/hooks'
import { isClient } from '@zc-ui/utils'

defineOptions({ name: 'ZcImageViewer' })

const props = withDefaults(
  defineProps<{
    /** Image URL list */
    urlList?: string[]
    /** Current index (v-model) */
    modelValue?: number
    /** Whether the viewer is visible (v-model:visible) */
    visible?: boolean
    /** Show close button */
    showClose?: boolean
    /** Infinite loop */
    infinite?: boolean
    /** Zoom rate */
    zoomRate?: number
    /** Min zoom */
    minScale?: number
    /** Max zoom */
    maxScale?: number
    /** Initial zIndex */
    zIndex?: number
  }>(),
  {
    urlList: () => [],
    modelValue: 0,
    visible: false,
    showClose: true,
    infinite: true,
    zoomRate: 0.2,
    minScale: 0.2,
    maxScale: 7,
    zIndex: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', index: number): void
  (e: 'update:visible', val: boolean): void
  (e: 'switch', index: number): void
  (e: 'close'): void
}>()

const ns = useNamespace('image-viewer')
const { nextZIndex } = useZIndex()

const currentIndex = ref(props.modelValue)
const transform = ref({ scale: 1, deg: 0, offsetX: 0, offsetY: 0, enableTransition: false })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0, offsetX: 0, offsetY: 0 })

// Compute z-index once — calling nextZIndex() inside a computed would
// cause an infinite re-render loop because it mutates a shared ref.
const effectiveZIndex = computed(() => props.zIndex ?? computedZIndex.value)
const computedZIndex = ref(nextZIndex())
const currentUrl = computed(() => props.urlList[currentIndex.value] ?? '')
const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value === props.urlList.length - 1)

const imageStyle = computed(() => ({
  transform: `translate(${transform.value.offsetX}px, ${transform.value.offsetY}px) scale(${transform.value.scale}) rotate(${transform.value.deg}deg)`,
  transition: transform.value.enableTransition ? 'transform 0.3s ease' : 'none',
}))

function setActiveItem(index: number) {
  if (index < 0 || index >= props.urlList.length) return
  currentIndex.value = index
  emit('update:modelValue', index)
  emit('switch', index)
  resetTransform()
}

function next() {
  if (isLast.value) {
    if (props.infinite) setActiveItem(0)
  } else {
    setActiveItem(currentIndex.value + 1)
  }
}

function prev() {
  if (isFirst.value) {
    if (props.infinite) setActiveItem(props.urlList.length - 1)
  } else {
    setActiveItem(currentIndex.value - 1)
  }
}

function zoomIn() {
  const newScale = transform.value.scale + props.zoomRate
  if (newScale <= props.maxScale) {
    transform.value.enableTransition = true
    transform.value.scale = newScale
  }
}

function zoomOut() {
  const newScale = transform.value.scale - props.zoomRate
  if (newScale >= props.minScale) {
    transform.value.enableTransition = true
    transform.value.scale = newScale
  }
}

function rotate() {
  transform.value.enableTransition = true
  transform.value.deg += 90
}

function resetTransform() {
  transform.value = { scale: 1, deg: 0, offsetX: 0, offsetY: 0, enableTransition: true }
}

function close() {
  emit('update:visible', false)
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'Escape':
      close()
      break
    case 'ArrowLeft':
      prev()
      break
    case 'ArrowRight':
      next()
      break
    case 'ArrowUp':
      zoomIn()
      break
    case 'ArrowDown':
      zoomOut()
      break
    case ' ':
      e.preventDefault()
      resetTransform()
      break
  }
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  if (e.deltaY > 0) zoomOut()
  else zoomIn()
}

function handleDragStart(e: MouseEvent) {
  isDragging.value = true
  transform.value.enableTransition = false
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
    offsetX: transform.value.offsetX,
    offsetY: transform.value.offsetY,
  }
}

function handleDragMove(e: MouseEvent) {
  if (!isDragging.value) return
  transform.value.offsetX = dragStart.value.offsetX + (e.clientX - dragStart.value.x)
  transform.value.offsetY = dragStart.value.offsetY + (e.clientY - dragStart.value.y)
}

function handleDragEnd() {
  isDragging.value = false
}

function handleOverlayClick() {
  close()
}

// Watch modelValue
watch(
  () => props.modelValue,
  (val) => {
    currentIndex.value = val
  }
)

watch(
  () => props.visible,
  (val) => {
    if (val && isClient) {
      document.addEventListener('keydown', handleKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = ''
    }
  }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

defineExpose({ next, prev, setActiveItem })
</script>

<template>
  <Teleport to="body" :disabled="!visible">
    <Transition name="zc-image-viewer">
      <div
        v-if="visible"
        :class="ns.e('overlay')"
        :style="{ zIndex: effectiveZIndex }"
        @click="handleOverlayClick"
        @wheel="handleWheel"
      >
        <!-- Image container -->
        <div :class="ns.e('canvas')" @click.stop>
          <img
            :src="currentUrl"
            :class="ns.e('img')"
            :style="imageStyle"
            draggable="false"
            @mousedown="handleDragStart"
            @mousemove="handleDragMove"
            @mouseup="handleDragEnd"
            @mouseleave="handleDragEnd"
          />
        </div>

        <!-- Header / Actions bar -->
        <div :class="ns.e('actions')" @click.stop>
          <button :class="ns.e('action-btn')" type="button" title="缩小" @click="zoomOut">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
              <path
                d="M21 21l-4.35-4.35M8 11h6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <span :class="ns.e('zoom-label')"> {{ Math.round(transform.scale * 100) }}% </span>

          <button :class="ns.e('action-btn')" type="button" title="放大" @click="zoomIn">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
              <path
                d="M21 21l-4.35-4.35M11 8v6M8 11h6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <span :class="ns.e('divider')" />

          <button :class="ns.e('action-btn')" type="button" title="旋转" @click="rotate">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12a9 9 0 11-3-6.7L21 8M21 3v5h-5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <button :class="ns.e('action-btn')" type="button" title="重置" @click="resetTransform">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12a9 9 0 1015.5-6.4L21 8M21 3v5h-5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <!-- Navigation arrows -->
        <template v-if="urlList.length > 1">
          <button
            v-show="!isFirst || infinite"
            :class="[ns.e('nav'), ns.e('nav-prev')]"
            type="button"
            @click.stop="prev"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            v-show="!isLast || infinite"
            :class="[ns.e('nav'), ns.e('nav-next')]"
            type="button"
            @click.stop="next"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- Page indicator -->
          <div :class="ns.e('indicator')" @click.stop>
            {{ currentIndex + 1 }} / {{ urlList.length }}
          </div>
        </template>

        <!-- Close button -->
        <button
          v-if="showClose"
          :class="ns.e('close')"
          type="button"
          aria-label="关闭"
          @click="close"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.zc-image-viewer__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.zc-image-viewer__canvas {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: grab;
}

.zc-image-viewer__canvas:active {
  cursor: grabbing;
}

.zc-image-viewer__img {
  max-width: 90vw;
  max-height: 90vh;
  user-select: none;
  pointer-events: none;
}

/* Actions bar */
.zc-image-viewer__actions {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 22px;
  backdrop-filter: blur(4px);
}

.zc-image-viewer__action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #fff;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
}

.zc-image-viewer__action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.zc-image-viewer__action-btn svg {
  width: 20px;
  height: 20px;
}

.zc-image-viewer__zoom-label {
  color: #fff;
  font-size: 14px;
  min-width: 48px;
  text-align: center;
}

.zc-image-viewer__divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
}

/* Navigation */
.zc-image-viewer__nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
}

.zc-image-viewer__nav:hover {
  background: rgba(0, 0, 0, 0.8);
}

.zc-image-viewer__nav svg {
  width: 24px;
  height: 24px;
}

.zc-image-viewer__nav-prev {
  left: 40px;
}

.zc-image-viewer__nav-next {
  right: 40px;
}

/* Indicator */
.zc-image-viewer__indicator {
  position: fixed;
  bottom: 30px;
  right: 40px;
  color: #fff;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 12px;
  border-radius: 12px;
}

/* Close */
.zc-image-viewer__close {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
}

.zc-image-viewer__close:hover {
  background: rgba(0, 0, 0, 0.8);
}

.zc-image-viewer__close svg {
  width: 22px;
  height: 22px;
}

/* Transition */
.zc-image-viewer-enter-active,
.zc-image-viewer-leave-active {
  transition: opacity 0.3s;
}
.zc-image-viewer-enter-from,
.zc-image-viewer-leave-to {
  opacity: 0;
}
</style>
