<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcLoading' })

const props = withDefaults(
  defineProps<{
    /** Loading text */
    text?: string
    /** Spinner size */
    size?: number
    /** Custom background */
    background?: string
    /** Custom spinner color */
    color?: string
    /** Full screen overlay */
    fullscreen?: boolean
    /** Lock scroll */
    lock?: boolean
  }>(),
  {
    text: '',
    size: 32,
    background: '',
    color: '',
    fullscreen: false,
    lock: false,
  }
)

const ns = useNamespace('loading')

const overlayStyle = computed(() => ({
  backgroundColor:
    props.background ||
    (props.fullscreen ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)'),
}))

const spinnerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  color: props.color || undefined,
}))

// ---- Body scroll lock ----
let originalOverflow = ''

function lockScroll() {
  if (props.fullscreen && props.lock) {
    originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
}

function unlockScroll() {
  if (props.fullscreen && props.lock) {
    document.body.style.overflow = originalOverflow
  }
}

onMounted(() => {
  lockScroll()
})

onUnmounted(() => {
  unlockScroll()
})
</script>

<template>
  <div
    :class="[ns.e('overlay'), ns.is('fullscreen', fullscreen)]"
    :style="overlayStyle"
    role="status"
    aria-live="polite"
    :aria-modal="fullscreen ? 'true' : undefined"
  >
    <div :class="ns.e('spinner')">
      <svg :class="ns.e('icon')" :style="spinnerStyle" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-dasharray="90 60"
        />
      </svg>
      <p v-if="text" :class="ns.e('text')">{{ text }}</p>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcLoading styles
 * ============================================================ */

.zc-loading__overlay {
  --zc-loading-spinner-color: var(--color-zc-primary-500, #409eff);
  --zc-loading-spinner-size: 32px;
  --zc-loading-text-color: var(--color-zc-primary-500, #409eff);
  --zc-loading-font-size: var(--text-zc-base, 14px);
  --zc-loading-mask-bg-color: rgba(255, 255, 255, 0.9);
  --zc-loading-mask-opacity: 1;
  
position: absolute;
inset: 0;
z-index: var(--z-zc-base, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
}

.zc-loading__overlay.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: var(--z-zc-message, 3000);
  border-radius: 0;
}

.zc-loading__spinner {
  display: flex;
flex-direction: column;
align-items: center;
gap: 8px;
  }
    
  .zc-loading__icon {
  animation: zc-loading-rotate 1s linear infinite;
    }
  
@keyframes zc-loading-rotate {
from {
transform: rotate(0deg);
  }
  to {
  transform: rotate(360deg);
}
}

.zc-loading__text {
  margin: 0;
  color: var(--zc-loading-text-color);
  font-size: var(--zc-loading-font-size);
}
</style>
