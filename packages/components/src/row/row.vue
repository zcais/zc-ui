<script setup lang="ts">
import { computed, provide, type ComputedRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcRow' })

/**
 * Responsive breakpoint keys.
 * Values align with standard CSS media query breakpoints.
 */
export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Gutter between columns (px).
 * A single number applies equal horizontal spacing.
 * A tuple `[horizontal, vertical]` sets both directions.
 */
export type Gutter = number | [number, number]

/**
 * Justify content values for flexbox alignment.
 */
export type RowJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'

/**
 * Align items values for flexbox alignment.
 */
export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch'

const props = withDefaults(
  defineProps<{
    /** Gap between columns (px). Number or [horizontal, vertical]. */
    gutter?: Gutter
    /** Horizontal alignment of columns. */
    justify?: RowJustify
    /** Vertical alignment of columns. */
    align?: RowAlign
    /** Wrap columns to new lines when they overflow. */
    wrap?: boolean
    /** Custom HTML tag for the root element. */
    tag?: string
  }>(),
  {
    gutter: 0,
    justify: 'start',
    align: 'top',
    wrap: false,
    tag: 'div',
  }
)

const ns = useNamespace('row')

// ---- Gutter computation ----
const gutterStyle = computed(() => {
  const result: Record<string, string> = {}

  let horizontal = 0
  let vertical = 0

  if (Array.isArray(props.gutter)) {
    horizontal = props.gutter[0]
    vertical = props.gutter[1]
  } else {
    horizontal = props.gutter
  }

  // Horizontal gutter (negative margins on Row, matching padding on Col)
  if (horizontal > 0) {
    result['margin-left'] = `-${horizontal / 2}px`
    result['margin-right'] = `-${horizontal / 2}px`
  }

  // Vertical gutter (row-gap)
  if (vertical > 0) {
    result['row-gap'] = `${vertical}px`
  }

  return result
})

// ---- Alignment mapping ----
const justifyMap: Record<RowJustify, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-around': 'space-around',
  'space-between': 'space-between',
  'space-evenly': 'space-evenly',
}

const alignMap: Record<RowAlign, string> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
  stretch: 'stretch',
}

const rowStyle = computed(() => ({
  ...gutterStyle.value,
  'justify-content': justifyMap[props.justify],
  'align-items': alignMap[props.align],
}))

const classes = computed(() => [ns.b(), ns.is('wrap', props.wrap)])

// Provide gutter to child Col components via injection
export interface RowContext {
  gutter: ComputedRef<Gutter>
}

provide<RowContext>('zcRow', {
  gutter: computed(() => props.gutter),
})
</script>

<template>
  <component :is="tag" :class="classes" :style="rowStyle">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcRow styles
 * BEM naming: zc-row
 * Flexbox-based 24-column grid container.
 * ============================================================ */

.zc-row {
  /* Component-level CSS variables (overridable via theming) */
  --zc-row-gap: 0;

  display: flex;
  flex-wrap: nowrap;
  box-sizing: border-box;
  position: relative;
  width: 100%;
}

.zc-row.is-wrap {
  flex-wrap: wrap;
}
</style>
