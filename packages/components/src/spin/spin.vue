<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcSpin' })

export type SpinSize = 'large' | 'medium' | 'small'

const props = withDefaults(
  defineProps<{
    /** Whether the spinner is spinning */
    spinning?: boolean
    /** Size of the spinner */
    size?: SpinSize
    /** Tip text to show below the spinner */
    tip?: string
    /** Color of the spinner */
    color?: string
    /** Whether to fullscreen overlay */
    fullscreen?: boolean
    /** Custom loading delay in ms (0 = no delay) */
    delay?: number
    /** Background overlay opacity when used as wrapper */
    overlay?: boolean
  }>(),
  {
    spinning: true,
    size: 'medium',
    tip: '',
    color: '',
    fullscreen: false,
    delay: 0,
    overlay: false,
  }
)

const ns = useNamespace('spin')
const slots = useSlots()

const containerClasses = computed(() => [ns.b(), ns.is('fullscreen', props.fullscreen)])

const spinnerClasses = computed(() => [ns.e('spinner'), ns.m(props.size)])

const spinnerStyle = computed(() => ({
  ...(props.color ? { borderTopColor: props.color } : {}),
}))

const hasContent = computed(() => !!slots.default)

const wrapperClasses = computed(() => [ns.e('wrapper'), ns.is('spinning', props.spinning)])
</script>

<template>
  <!-- Fullscreen mode -->
  <div v-if="fullscreen && spinning" :class="[ns.e('fullscreen-overlay')]">
    <div :class="containerClasses">
      <div :class="spinnerClasses" :style="spinnerStyle" role="status" aria-live="polite">
        <span class="sr-only">Loading</span>
      </div>
      <span v-if="tip" :class="ns.e('tip')">{{ tip }}</span>
    </div>
  </div>

  <!-- Wrapper mode (with content slot) -->
  <div v-else-if="hasContent" :class="wrapperClasses">
    <slot />
    <transition :name="ns.e('fade')">
      <div v-if="spinning" :class="[ns.e('mask'), ns.is('overlay', overlay)]">
        <div :class="containerClasses">
          <div :class="spinnerClasses" :style="spinnerStyle" role="status" aria-live="polite">
            <span class="sr-only">Loading</span>
          </div>
          <span v-if="tip" :class="ns.e('tip')">{{ tip }}</span>
        </div>
      </div>
    </transition>
  </div>

  <!-- Standalone spinner -->
  <div v-else-if="spinning" :class="containerClasses">
    <div :class="spinnerClasses" :style="spinnerStyle" role="status" aria-live="polite">
      <span class="sr-only">Loading</span>
    </div>
    <span v-if="tip" :class="ns.e('tip')">{{ tip }}</span>
  </div>

  <!-- Not spinning, no content -->
  <template v-else>
    <slot />
  </template>
</template>

<style scoped>
/* ============================================================
 * ZcSpin styles
 * BEM naming: zc-spin / zc-spin__spinner / zc-spin__tip
 * ============================================================ */

.zc-spin {
  --zc-spin-color: var(--color-zc-primary, #409eff);
  --zc-spin-text-color: var(--color-zc-text-secondary, #606266);
  --zc-spin-font-size: var(--text-zc-sm, 14px);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* ---- Spinner ---- */
.zc-spin__spinner {
  display: inline-block;
  border-style: solid;
  border-color: var(--color-zc-border-base, #dcdfe6);
  border-top-color: var(--zc-spin-color);
  border-radius: 50%;
  animation: zc-spin-rotate 0.8s linear infinite;
}

/* ---- Size variants ---- */
.zc-spin__spinner--large {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

.zc-spin__spinner--medium {
  width: 28px;
  height: 28px;
  border-width: 3px;
}

.zc-spin__spinner--small {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

/* ---- Tip ---- */
.zc-spin__tip {
  color: var(--zc-spin-text-color);
  font-size: var(--zc-spin-font-size);
}

/* ---- Wrapper ---- */
.zc-spin__wrapper {
  position: relative;
  display: inline-block;
}

/* ---- Mask overlay (wrapper mode) ---- */
.zc-spin__mask {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  transition: opacity 0.3s;
}

.zc-spin__mask.is-overlay {
  background-color: rgba(255, 255, 255, 0.65);
}

/* ---- Fullscreen ---- */
.zc-spin__fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
}

/* ---- Fade transition ---- */
.zc-spin__fade-enter-active,
.zc-spin__fade-leave-active {
  transition: opacity 0.3s ease;
}

.zc-spin__fade-enter-from,
.zc-spin__fade-leave-to {
  opacity: 0;
}

/* ---- Keyframes ---- */
@keyframes zc-spin-rotate {
  to {
    transform: rotate(360deg);
  }
}

/* ---- Screen reader only ---- */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ---- Dark mode ---- */
.dark .zc-spin__mask.is-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.dark .zc-spin__fullscreen-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}

.dark .zc-spin__spinner {
  border-color: var(--color-zc-border-base, #414243);
}
</style>
