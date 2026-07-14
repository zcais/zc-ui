<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcFlex' })

/**
 * Main-axis alignment values (justify-content).
 */
export type FlexJustify =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

/**
 * Cross-axis alignment values (align-items).
 */
export type FlexAlign =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'stretch'
  | 'baseline'

/**
 * Wrap behaviour for flex items.
 */
export type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse'

/**
 * Gap can be a preset keyword or a raw pixel number.
 */
export type FlexGap = 'small' | 'middle' | 'large' | number

/** Preset gap values as CSS var() references, overridable via theme. */
const gapMap: Record<'small' | 'middle' | 'large', string> = {
  small: 'var(--zc-flex-gap-small, 8px)',
  middle: 'var(--zc-flex-gap-middle, 16px)',
  large: 'var(--zc-flex-gap-large, 24px)',
}

const props = withDefaults(
  defineProps<{
    /** Layout vertically (column) instead of horizontally (row). */
    vertical?: boolean
    /** Main-axis alignment. */
    justify?: FlexJustify
    /** Cross-axis alignment. */
    align?: FlexAlign
    /** Wrap behaviour. */
    wrap?: FlexWrap
    /** Gap between items — preset keyword or pixel number. */
    gap?: FlexGap
    /**
     * CSS `flex` shorthand for the container itself.
     * Useful when ZcFlex is nested inside another flex parent.
     */
    flex?: string | number
    /** Render the root as a specific HTML tag. */
    tag?: string
  }>(),
  {
    vertical: false,
    justify: 'flex-start',
    align: 'flex-start',
    wrap: 'nowrap',
    gap: 0,
    flex: undefined,
    tag: 'div',
  },
)

const ns = useNamespace('flex')

// ---- Classes ----
const classes = computed(() => [
  ns.b(),
  ns.is('vertical', props.vertical),
  ns.is('horizontal', !props.vertical),
])

// ---- Inline styles ----
// Only emit properties that differ from CSS defaults to keep the DOM clean.
const containerStyle = computed(() => {
  const style: Record<string, string> = {}

  // Flex direction — CSS default is 'row', only override when vertical
  if (props.vertical) {
    style['flex-direction'] = 'column'
  }

  // Justify content — CSS default (normal) behaves as 'flex-start'
  if (props.justify !== 'flex-start') {
    style['justify-content'] = props.justify
  }

  // Align items — always set (component default 'flex-start' ≠ CSS default 'stretch')
  style['align-items'] = props.align

  // Flex wrap — CSS default is 'nowrap'
  if (props.wrap !== 'nowrap') {
    style['flex-wrap'] = props.wrap
  }

  // Gap — skip when 0 (no gap)
  if (typeof props.gap === 'number') {
    if (props.gap !== 0) {
      style.gap = `${props.gap}px`
    }
  } else if (props.gap in gapMap) {
    style.gap = gapMap[props.gap]
  }

  // Flex shorthand for nested layouts
  if (props.flex !== undefined) {
    style.flex =
      typeof props.flex === 'number' ? String(props.flex) : props.flex
  }

  return style
})
</script>

<template>
  <component :is="tag" :class="classes" :style="containerStyle">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcFlex styles
 * BEM naming: zc-flex
 * CSS Flexbox semantic wrapper.
 * Customisable via CSS variables:
 *   --zc-flex-display, --zc-flex-box-sizing
 *   --zc-flex-gap-small, --zc-flex-gap-middle, --zc-flex-gap-large
 * Note: flex-direction / justify-content / align-items / flex-wrap
 * are all controlled via inline styles (single source of truth).
 * ============================================================ */

.zc-flex {
  display: var(--zc-flex-display, flex);
  box-sizing: var(--zc-flex-box-sizing, border-box);
}
</style>
