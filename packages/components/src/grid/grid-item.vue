<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcGridItem' })

const props = withDefaults(
  defineProps<{
    /** Grid column start line. */
    columnStart?: number | string
    /** Grid column end line. */
    columnEnd?: number | string
    /** Grid row start line. */
    rowStart?: number | string
    /** Grid row end line. */
    rowEnd?: number | string
    /** Shorthand: how many columns to span. */
    colSpan?: number
    /** Shorthand: how many rows to span. */
    rowSpan?: number
    /** Grid area name. */
    area?: string
    /** Custom HTML tag for the root element. */
    tag?: string
  }>(),
  {
    tag: 'div',
  }
)

const ns = useNamespace('grid-item')

const itemStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.area) {
    style['grid-area'] = props.area
  }

  if (props.colSpan != null) {
    style['grid-column'] = `span ${props.colSpan}`
  } else {
    if (props.columnStart != null) style['grid-column-start'] = String(props.columnStart)
    if (props.columnEnd != null) style['grid-column-end'] = String(props.columnEnd)
  }

  if (props.rowSpan != null) {
    style['grid-row'] = `span ${props.rowSpan}`
  } else {
    if (props.rowStart != null) style['grid-row-start'] = String(props.rowStart)
    if (props.rowEnd != null) style['grid-row-end'] = String(props.rowEnd)
  }

  return style
})

const classes = computed(() => [ns.b()])
</script>

<template>
  <component :is="tag" :class="classes" :style="itemStyle">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcGridItem styles
 * BEM naming: zc-grid-item
 * ============================================================ */

.zc-grid-item {
  /* Component-level CSS variables (overridable via theming) */
  --zc-grid-item-span: auto;
--zc-grid-item-offset: 0;
  --zc-grid-item-box-sizing: border-box;

  box-sizing: var(--zc-grid-item-box-sizing);
  min-width: 0;
}
</style>
