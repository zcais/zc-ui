<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcScrollbar' })

export type ScrollbarHeight = string | number

const props = withDefaults(
  defineProps<{
    /** Fixed height (number → px) */
    height?: ScrollbarHeight
    /** Max height (number → px) */
    maxHeight?: ScrollbarHeight
    /** Use browser default scrollbar */
    native?: boolean
    /** Always show scrollbar (not hover-only) */
    always?: boolean
    /** Wrapper element tag */
    tag?: string
  }>(),
  {
    height: undefined,
    maxHeight: undefined,
    native: false,
    always: false,
    tag: 'div',
  }
)

const ns = useNamespace('scrollbar')

const wrapStyles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.height !== undefined) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  if (props.maxHeight !== undefined) {
    styles.maxHeight =
      typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }
  return styles
})

const classes = computed(() => [
  ns.b(),
  ns.is('native', props.native),
  ns.is('always', props.always),
])
</script>

<template>
  <component :is="tag" :class="classes">
    <div :class="ns.e('wrap')" :style="wrapStyles">
      <slot />
    </div>
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcScrollbar styles
 * BEM naming: zc-scrollbar / zc-scrollbar__wrap
 * CSS-only custom scrollbar — no JS thumb rendering
 * ============================================================ */

.zc-scrollbar {
  --zc-scrollbar-thumb-bg-color: rgba(144, 147, 153, 0.3);
  --zc-scrollbar-thumb-hover-bg-color: rgba(144, 147, 153, 0.5);
  --zc-scrollbar-track-bg-color: transparent;
  --zc-scrollbar-thumb-border-radius: var(--radius-zc-base, 4px);
  --zc-scrollbar-thumb-width: 6px;

  position: relative;
  overflow: hidden;
}

.zc-scrollbar__wrap {
  height: 100%;
  overflow: auto;
}

/* ---- Firefox ---- */
.zc-scrollbar__wrap {
  scrollbar-width: thin;
  scrollbar-color: var(--zc-scrollbar-thumb-bg-color) var(--zc-scrollbar-track-bg-color);
}

/* ---- WebKit (Chrome / Safari / Edge) ---- */
.zc-scrollbar__wrap::-webkit-scrollbar {
  width: var(--zc-scrollbar-thumb-width);
  height: var(--zc-scrollbar-thumb-width);
}

.zc-scrollbar__wrap::-webkit-scrollbar-track {
  background: var(--zc-scrollbar-track-bg-color);
}

.zc-scrollbar__wrap::-webkit-scrollbar-thumb {
  background: var(--zc-scrollbar-thumb-bg-color);
  border-radius: var(--zc-scrollbar-thumb-border-radius);
  transition: background var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-scrollbar__wrap::-webkit-scrollbar-thumb:hover {
  background: var(--zc-scrollbar-thumb-hover-bg-color);
}

.zc-scrollbar__wrap::-webkit-scrollbar-corner {
  background: var(--zc-scrollbar-track-bg-color);
}

/* ---- Hover-only mode (default: hide thumb until hover) ---- */
.zc-scrollbar:not(.is-always) .zc-scrollbar__wrap::-webkit-scrollbar-thumb {
  opacity: 0;
}

.zc-scrollbar:not(.is-always) .zc-scrollbar__wrap:hover::-webkit-scrollbar-thumb {
  opacity: 1;
}

.zc-scrollbar:not(.is-always) .zc-scrollbar__wrap {
  scrollbar-color: var(--zc-scrollbar-track-bg-color) var(--zc-scrollbar-track-bg-color);
}

.zc-scrollbar:not(.is-always) .zc-scrollbar__wrap:hover {
  scrollbar-color: var(--zc-scrollbar-thumb-bg-color) var(--zc-scrollbar-track-bg-color);
}

/* ---- Always-visible mode ---- */
.zc-scrollbar.is-always .zc-scrollbar__wrap::-webkit-scrollbar-thumb {
  opacity: 1;
}

/* ---- Native mode: reset to browser default ---- */
.zc-scrollbar.is-native .zc-scrollbar__wrap {
  scrollbar-width: auto;
  scrollbar-color: auto;
}

.zc-scrollbar.is-native .zc-scrollbar__wrap::-webkit-scrollbar {
  width: auto;
  height: auto;
}

.zc-scrollbar.is-native .zc-scrollbar__wrap::-webkit-scrollbar-thumb {
  opacity: 1;
  min-height: auto;
  min-width: auto;
  background: revert;
  border-radius: revert;
}
</style>
