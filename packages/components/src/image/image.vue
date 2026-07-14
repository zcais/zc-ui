<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import ImagePreview from './image-preview.vue'

defineOptions({ name: 'ZcImage' })

export type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    fit?: ImageFit
    width?: string | number
    height?: string | number
    lazy?: boolean
    placeholder?: string
    error?: string
    preview?: boolean
    previewSrc?: string
    hideOnClickModal?: boolean
    zIndex?: number
    round?: boolean
    loading?: 'eager' | 'lazy'
  }>(),
  {
    src: '',
    alt: '',
    fit: 'fill',
    width: '',
    height: '',
    lazy: false,
    placeholder: '',
    error: '',
    preview: false,
    previewSrc: '',
    hideOnClickModal: true,
    zIndex: 2000,
    round: false,
    loading: 'eager',
  }
)

const emit = defineEmits<{
  (e: 'load', event: Event): void
  (e: 'error', event: Event): void
}>()

const ns = useNamespace('image')

const status = ref<'loading' | 'loaded' | 'error'>('loading')
const showPreview = ref(false)
const shouldLoad = ref(!props.lazy)

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  if (props.height)
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  return style
})

const fitStyle = computed(() => ({
  objectFit: props.fit,
}))

function handleLoad(event: Event) {
  status.value = 'loaded'
  emit('load', event)
}

function handleError(event: Event) {
  if (props.error) {
    status.value = 'loaded'
  } else {
    status.value = 'error'
  }
  emit('error', event)
}

function handleImageClick() {
  if (props.preview && props.src) {
    showPreview.value = true
  }
}

function closePreview() {
  showPreview.value = false
}

/* ---- Lazy load with IntersectionObserver ---- */
const containerRef = ref<HTMLDivElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (props.lazy && containerRef.value) {
    // Observe the container (always visible) rather than the img (may be display:none)
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            shouldLoad.value = true
            status.value = 'loading'
            observer?.disconnect()
            observer = null
          }
        })
      },
      { rootMargin: '0px 0px 100px 0px' }
    )
    observer.observe(containerRef.value)
  } else if (!props.lazy) {
    status.value = 'loading'
  }
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div ref="containerRef" :class="[ns.b(), ns.is('round', round)]" :style="containerStyle">
    <!-- Loading placeholder -->
    <div v-if="status === 'loading'" :class="ns.e('placeholder')">
      <slot name="placeholder">
        <div class="zc-image__placeholder-default" />
      </slot>
    </div>

    <!-- Error state -->
    <div v-else-if="status === 'error'" :class="ns.e('error')">
      <slot name="error">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          width="24"
          height="24"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </slot>
    </div>

    <!-- Image -->
    <img
      v-show="status === 'loaded'"
      ref="imgRef"
      :class="ns.e('inner')"
      :src="shouldLoad ? src : undefined"
      :alt="alt"
      :style="fitStyle"
      :loading="loading"
      @load="handleLoad"
      @error="handleError"
      @click="handleImageClick"
    />

    <!-- Preview -->
    <image-preview
      v-if="preview"
      :visible="showPreview"
      :src="previewSrc || src"
      :hide-on-click-modal="hideOnClickModal"
      :z-index="zIndex"
      @close="closePreview"
    />
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcImage styles
 * ============================================================ */

.zc-image {
  /* Component-level CSS variables */
  --zc-image-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-image-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-image-border-radius: var(--radius-zc-base, 4px);
  --zc-image-error-color: var(--color-zc-text-placeholder, #a8abb2);
--zc-image-error-font-size: var(--text-zc-sm, 13px);
  --zc-image-placeholder-color: var(--color-zc-text-placeholder, #a8abb2);

  display: inline-block;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--zc-image-border-color);
  border-radius: var(--zc-image-border-radius);
  background: var(--zc-image-bg-color);
}

.zc-image.is-round {
  border-radius: 50%;
}

.zc-image__inner {
  display: block;
  width: 100%;
  height: 100%;
}

.zc-image__placeholder,
.zc-image__error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--zc-image-placeholder-color);
  font-size: var(--zc-image-error-font-size);
}

.zc-image__placeholder-default {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-zc-fill-light, #f5f7fa) 25%,
    var(--color-zc-fill-base, #f0f2f5) 50%,
    var(--color-zc-fill-light, #f5f7fa) 75%
  );
  background-size: 200% 100%;
  animation: zc-image-loading 1.5s infinite;
}

@keyframes zc-image-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ============================================================
 * ZcImagePreview styles
 * ============================================================ */

.zc-image-preview {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--z-zc-modal, 1300);
}

.zc-image-preview__mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}

.zc-image-preview__wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zc-image-preview__img {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
  transform-origin: center;
  transition: transform 0.3s ease;
  user-select: none;
}

.zc-image-preview__close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: var(--color-zc-white, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  font-size: 20px;
  line-height: 1;
}

.zc-image-preview__close:hover {
  background: rgba(0, 0, 0, 0.7);
}

.zc-image-preview__actions {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 24px;
  padding: 8px 16px;
}

.zc-image-preview__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: var(--color-zc-white, #fff);
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 18px;
}

.zc-image-preview__btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>
