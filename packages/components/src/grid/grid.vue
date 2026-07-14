<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcGrid' })

/**
 * Justify items alignment for CSS Grid.
 */
export type GridJustifyItems = 'start' | 'end' | 'center' | 'stretch'

/**
 * Align items alignment for CSS Grid.
 */
export type GridAlignItems = 'start' | 'end' | 'center' | 'stretch' | 'baseline'

/**
 * Justify content for CSS Grid.
 */
export type GridJustifyContent =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'

/**
 * Align content for CSS Grid.
 */
export type GridAlignContent =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'stretch'

const props = withDefaults(
  defineProps<{
    /** Number of columns. Can be a number or a CSS grid-template-columns string. */
    columns?: number | string
    /** Number of rows. Can be a number or a CSS grid-template-rows string. */
    rows?: number | string
    /** Gap between rows and columns. Number (px) or `[rowGap, columnGap]` (CSS convention).
     *  Note: ZcSpace's `size` uses `[horizontal, vertical]` order instead. */
    gap?: number | [number, number]
    /** Horizontal alignment of grid items within their cells. */
    justifyItems?: GridJustifyItems
    /** Vertical alignment of grid items within their cells. */
    alignItems?: GridAlignItems
    /** Horizontal alignment of the entire grid within the container. */
    justifyContent?: GridJustifyContent
    /** Vertical alignment of the entire grid within the container. */
    alignContent?: GridAlignContent
    /** Auto-flow: rows or columns. */
    autoFlow?: 'row' | 'column' | 'row dense' | 'column dense'
    /** Minimum column width for responsive auto-fit grid. */
    minColumnWidth?: string
    /** Custom HTML tag for the root element. */
    tag?: string
  }>(),
  {
    columns: 12,
    rows: 0,
    gap: 0,
    justifyItems: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'start',
    alignContent: 'start',
    autoFlow: 'row',
    minColumnWidth: '',
    tag: 'div',
  }
)

const ns = useNamespace('grid')

const gridStyle = computed(() => {
  const style: Record<string, string> = {}

  // Grid template columns
  if (props.minColumnWidth) {
    style['grid-template-columns'] = `repeat(auto-fill, minmax(${props.minColumnWidth}, 1fr))`
  } else if (typeof props.columns === 'number') {
    style['grid-template-columns'] = `repeat(${props.columns}, 1fr)`
  } else if (typeof props.columns === 'string') {
    style['grid-template-columns'] = props.columns
  }

  // Grid template rows
  if (typeof props.rows === 'number' && props.rows > 0) {
    style['grid-template-rows'] = `repeat(${props.rows}, 1fr)`
  } else if (typeof props.rows === 'string' && props.rows) {
    style['grid-template-rows'] = props.rows
  }

  // Gap
  if (typeof props.gap === 'number' && props.gap > 0) {
    style['gap'] = `${props.gap}px`
  } else if (Array.isArray(props.gap)) {
    style['row-gap'] = `${props.gap[0]}px`
    style['column-gap'] = `${props.gap[1]}px`
  }

  // Alignment
  style['justify-items'] = props.justifyItems
  style['align-items'] = props.alignItems
  style['justify-content'] = props.justifyContent
  style['align-content'] = props.alignContent
  style['grid-auto-flow'] = props.autoFlow

  return style
})

const classes = computed(() => [ns.b()])
</script>

<template>
  <component :is="tag" :class="classes" :style="gridStyle">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcGrid styles
 * BEM naming: zc-grid
 * CSS Grid-based layout container.
 * ============================================================ */

.zc-grid {
  /* Component-level CSS variables (overridable via theming) */
  --zc-grid-gap: 0px;
  --zc-grid-columns: repeat(12, 1fr);
  --zc-grid-rows: none;
  --zc-grid-box-sizing: border-box;

  display: grid;
  box-sizing: var(--zc-grid-box-sizing);
  width: 100%;
}
</style>
