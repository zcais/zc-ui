<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcSkeletonItem' })

export type SkeletonItemVariant =
  | 'text'
  | 'circle'
  | 'rect'
  | 'image'
  | 'button'

export type SkeletonItemAnimation = 'wave' | 'shimmer' | 'none'

const props = withDefaults(
  defineProps<{
    /** Shape variant of the skeleton item */
    variant?: SkeletonItemVariant
    /** Width: number treated as px, or CSS string */
    width?: string | number
    /** Height: number treated as px, or CSS string */
    height?: string | number
    /** Animation type */
    animation?: SkeletonItemAnimation
    /** Number of times to repeat the item */
    count?: number
    /** For text variant: number of rows, last row is narrower */
    rows?: number
    /** Border radius override */
    rounded?: string | number | boolean
  }>(),
  {
    variant: 'text',
    width: undefined,
    height: undefined,
    animation: 'wave',
    count: 1,
    rows: 0,
    rounded: undefined,
  },
)

const ns = useNamespace('skeleton-item')

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function toCssSize(val: string | number | undefined, fallback?: string): string | undefined {
  if (val === undefined || val === null) return fallback
  if (typeof val === 'number') return `${val}px`
  return val
}

function toRounded(val: string | number | boolean | undefined): string | undefined {
  if (val === undefined) return undefined
  if (val === true) return 'var(--radius-zc-base, 4px)'
  if (val === false) return '0'
  if (typeof val === 'number') return `${val}px`
  return val
}

/* ------------------------------------------------------------------ *
 * Computed
 * ------------------------------------------------------------------ */

const repeatCount = computed(() => Math.max(1, props.count))

/** For `text` variant with `rows`, generate width list (last row narrower). */
const textRowWidths = computed<string[]>(() => {
  if (props.variant !== 'text' || props.rows <= 0) return []
  const base = toCssSize(props.width, '100%')!
  const result: string[] = []
  for (let i = 0; i < props.rows; i++) {
    if (i === props.rows - 1) {
      result.push('60%')
    } else {
      result.push(base)
    }
  }
  return result
})

/** Whether to render a text paragraph block (variant=text + rows>0). */
const hasTextRows = computed(() => textRowWidths.value.length > 0)

/** Whether multiple items are requested via count. */
const hasMultipleItems = computed(
  () => !hasTextRows.value && repeatCount.value > 1,
)

const itemClass = computed(() => ({
  [ns.b()]: true,
  [ns.m(props.variant)]: true,
  [ns.m(`anim-${props.animation}`)]: props.animation !== 'none',
}))

const itemStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  const w = toCssSize(props.width)
  const h = toCssSize(props.height)
  if (w) style.width = w
  if (h) style.height = h
  const r = toRounded(props.rounded)
  if (r !== undefined) style.borderRadius = r
  return style
})
</script>

<template>
  <!-- text variant with rows → render a paragraph block -->
  <div v-if="hasTextRows" :class="ns.e('paragraph')">
    <div
      v-for="(w, i) in textRowWidths"
      :key="i"
      :class="[ns.b(), ns.m('text'), ns.m(`anim-${animation}`)]"
      :style="{ width: w }"
    />
  </div>

  <!-- multiple items via count → wrapped in a group container -->
  <div v-else-if="hasMultipleItems" :class="ns.e('group')">
    <div
      v-for="n in repeatCount"
      :key="n"
      :class="itemClass"
      :style="itemStyle"
      role="status"
      aria-busy="true"
      aria-live="polite"
    />
  </div>

  <!-- single item (default) -->
  <div
    v-else
    :class="itemClass"
    :style="itemStyle"
    role="status"
    aria-busy="true"
    aria-live="polite"
  />
</template>

<style scoped>
/* ============================================================
 * ZcSkeletonItem base styles
 * ============================================================ */
.zc-skeleton-item {
  --zc-skeleton-item-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-skeleton-item-border-radius: var(--radius-zc-base, 4px);

display: block;
background: var(--zc-skeleton-item-bg-color);
}
  
  /* ---- variant: text (default) ---- */
  .zc-skeleton-item--text {
width: 100%;
height: 14px;
border-radius: var(--radius-zc-sm, 2px);
}
  
  /* ---- variant: circle ---- */
  .zc-skeleton-item--circle {
  width: 36px;
height: 36px;
border-radius: var(--radius-zc-circle, 50%);
flex-shrink: 0;
}
  
  /* ---- variant: rect ---- */
  .zc-skeleton-item--rect {
width: 100%;
height: 40px;
border-radius: var(--zc-skeleton-item-border-radius);
}
  
  /* ---- variant: image ---- */
  .zc-skeleton-item--image {
  width: 100%;
height: 120px;
border-radius: 0;
position: relative;
  }
  
  .zc-skeleton-item--image::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32px;
  height: 32px;
  transform: translate(-50%, -50%);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c0c4cc'%3E%3Cpath d='M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E");
  background-size: contain;
background-repeat: no-repeat;
background-position: center;
opacity: 0.5;
}
  
  /* ---- variant: button ---- */
  .zc-skeleton-item--button {
width: 80px;
  height: 32px;
  border-radius: var(--zc-skeleton-item-border-radius);
}

/* ---- group container (for count > 1) ---- */
.zc-skeleton-item__group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-zc-sm, 8px);
}

/* ---- paragraph wrapper ---- */
.zc-skeleton-item__paragraph {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-zc-sm, 8px);
}

/* ============================================================
 * Animations
 * ============================================================ */

/* ---- shimmer animation ---- */
.zc-skeleton-item--anim-shimmer {
  background: linear-gradient(
    90deg,
    var(--zc-skeleton-item-bg-color) 25%,
    var(--color-zc-fill-base, #e9ecef) 37%,
    var(--zc-skeleton-item-bg-color) 63%
  );
  background-size: 400% 100%;
  animation: zc-skeleton-item-shimmer 1.4s ease infinite;
}

@keyframes zc-skeleton-item-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

/* ---- wave animation ---- */
.zc-skeleton-item--anim-wave {
  position: relative;
  overflow: hidden;
}

.zc-skeleton-item--anim-wave::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.45),
    transparent
  );
  animation: zc-skeleton-item-wave 1.6s ease-in-out infinite;
}

@keyframes zc-skeleton-item-wave {
  100% {
    transform: translateX(100%);
  }
}
</style>
