<script setup lang="ts">
import { ref, watch, nextTick, shallowRef, onBeforeUnmount } from 'vue'
import { useFocusTrap } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'

defineOptions({ name: 'ZcImagePreview' })

const props = withDefaults(
  defineProps<{
    visible?: boolean
    src?: string
    hideOnClickModal?: boolean
    zIndex?: number
  }>(),
  {
    visible: false,
    src: '',
    hideOnClickModal: true,
    zIndex: 2000,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:visible', val: boolean): void
}>()

const scale = ref(1)
const rotate = ref(0)
const previewRef = shallowRef<HTMLElement>()
const focusTrap = useFocusTrap()
const { t } = useLocale()

function handleZoomIn() {
  scale.value += 0.2
}

function handleZoomOut() {
  scale.value = Math.max(0.2, scale.value - 0.2)
}

function handleRotateLeft() {
  rotate.value -= 90
}

function handleRotateRight() {
  rotate.value += 90
}

function handleClose() {
  scale.value = 1
  rotate.value = 0
  emit('close')
  emit('update:visible', false)
}

function handleMaskClick() {
  if (props.hideOnClickModal) {
    scale.value = 1
    rotate.value = 0
    emit('close')
    emit('update:visible', false)
  }
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    handleClose()
  }
}

// Focus trap + Escape listener
watch(
  () => props.visible,
  (val) => {
    if (val) {
      nextTick(() => {
        setTimeout(() => {
          if (previewRef.value) {
            focusTrap.activate(previewRef)
          }
        }, 50)
      })
      document.addEventListener('keydown', handleEsc)
    } else {
      focusTrap.release()
      document.removeEventListener('keydown', handleEsc)
    }
  }
)

// Cleanup listeners on unmount to prevent memory leaks
onBeforeUnmount(() => {
  focusTrap.release()
  document.removeEventListener('keydown', handleEsc)
})
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      ref="previewRef"
      class="zc-image-preview"
      :style="{ zIndex }"
      role="dialog"
      aria-modal="true"
      :aria-label="t('zc.image.preview')"
    >
      <div class="zc-image-preview__mask" @click="handleMaskClick" />
      <div class="zc-image-preview__wrapper">
        <img
          class="zc-image-preview__img"
          :src="src"
          :style="{
            transform: `scale(${scale}) rotate(${rotate}deg)`,
          }"
        />
      </div>
      <button
        class="zc-image-preview__close"
        :aria-label="t('zc.image.closePreview')"
        @click="handleClose"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div class="zc-image-preview__actions">
        <button
          class="zc-image-preview__btn"
          :aria-label="t('zc.image.zoomIn')"
          :title="t('zc.image.zoomIn')"
          @click="handleZoomIn"
        >
          +
        </button>
        <button
          class="zc-image-preview__btn"
          :aria-label="t('zc.image.zoomOut')"
          :title="t('zc.image.zoomOut')"
          @click="handleZoomOut"
        >
          −
        </button>
        <button
          class="zc-image-preview__btn"
          :aria-label="t('zc.image.rotateLeft')"
          :title="t('zc.image.rotateLeft')"
          @click="handleRotateLeft"
        >
          ↺
        </button>
        <button
          class="zc-image-preview__btn"
          :aria-label="t('zc.image.rotateRight')"
          :title="t('zc.image.rotateRight')"
          @click="handleRotateRight"
        >
          ↻
        </button>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
/* ============================================================
 * ZcImagePreview styles
 * ============================================================ */

.zc-image-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.zc-image-preview__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.zc-image-preview__wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateZ(0);
}

.zc-image-preview__img {
  max-width: 80%;
  max-height: 80%;
  transition: transform 0.3s var(--ease-zc-in-out, ease);
  user-select: none;
  -webkit-user-drag: none;
}

.zc-image-preview__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--color-zc-white, #fff);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  z-index: var(--z-zc-base, 1);
}

.zc-image-preview__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.zc-image-preview__actions {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 24px;
  z-index: 1;
}

.zc-image-preview__btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--color-zc-white, #fff);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.zc-image-preview__btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>
