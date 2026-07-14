<script setup lang="ts">
import { computed, useSlots, Comment, Fragment, type VNode } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcSpace' })

/**
 * Direction of the space layout.
 */
export type SpaceDirection = 'horizontal' | 'vertical'

/**
 * Alignment of items in the space container.
 */
export type SpaceAlignment = 'start' | 'end' | 'center' | 'baseline' | 'stretch'

/**
 * Space size can be a preset keyword, a number (px), or a tuple [horizontal, vertical].
 */
export type SpaceSize = 'small' | 'medium' | 'large' | number | [number, number]

/**
 * Wrap mode: 'wrap' wraps to next line, 'nowrap' keeps on one line.
 */
export type SpaceWrap = 'wrap' | 'nowrap'

/**
 * Fill mode: true makes Space fill its parent, 'fill' also.
 */
export type SpaceFill = boolean | 'fill'

// Size preset mapping to px values
const sizeMap: Record<'small' | 'medium' | 'large', number> = {
  small: 8,
  medium: 12,
  large: 24,
}

const props = withDefaults(
  defineProps<{
    /** Layout direction. */
    direction?: SpaceDirection
    /** Alignment of child elements. */
    alignment?: SpaceAlignment
    /** Spacing between children. */
    size?: SpaceSize
    /** Wrap children to new lines. */
    wrap?: boolean
    /** Fill the parent container. */
    fill?: SpaceFill
    /** Custom separator between items. */
    spacer?: string | VNode
    /** Render the root as a specific HTML tag. */
    tag?: string
  }>(),
  {
    direction: 'horizontal',
    alignment: 'start',
    size: 'medium',
    wrap: false,
    fill: false,
    tag: 'div',
  }
)

const ns = useNamespace('space')
const slots = useSlots()

// ---- Compute actual spacing values ----
function resolveSize(size: SpaceSize): [number, number] {
  if (typeof size === 'string') {
    const val = sizeMap[size]
    return [val, val]
  }
  if (typeof size === 'number') {
    return [size, size]
  }
  if (Array.isArray(size)) {
    return size
  }
  return [12, 12]
}

// (resolveSize is called inside the computed to preserve reactivity)

// ---- Classes ----
const classes = computed(() => [
  ns.b(),
  ns.is('vertical', props.direction === 'vertical'),
  ns.is('horizontal', props.direction === 'horizontal'),
  ns.is('wrap', props.wrap),
  ns.is('fill', props.fill === true || props.fill === 'fill'),
])

// ---- Inline styles ----
// resolveSize is called inside the computed to preserve reactivity.
// (Previously, destructuring `.value` in setup broke the reactive chain.)
const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  const [hSize, vSize] = resolveSize(props.size)

  // Gap
  if (props.direction === 'horizontal') {
    style['column-gap'] = `${hSize}px`
    style['row-gap'] = `${vSize}px`
  } else {
    style['row-gap'] = `${hSize}px`
  }

  // Alignment mapping
  const alignMap: Record<SpaceAlignment, string> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    baseline: 'baseline',
    stretch: 'stretch',
  }
  style['align-items'] = alignMap[props.alignment]

  // Flex direction
  style['flex-direction'] = props.direction === 'vertical' ? 'column' : 'row'

  // Wrap
  style['flex-wrap'] = props.wrap ? 'wrap' : 'nowrap'

  return style
})

// ---- Collect children and optionally inject separators ----
const items = computed(() => {
  const children = slots.default?.() ?? []
  // Filter out comment nodes and empty fragments
  return children.filter(
    (child) =>
      child.type !== Comment &&
      !(
        child.type === Fragment &&
        (child.children == null || (Array.isArray(child.children) && child.children.length === 0))
      )
  )
})

// Event emission (no native events; Space is layout-only)
defineEmits<{
  /** No custom events for Space. */
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    :style="containerStyle"
    @click="(e: MouseEvent) => $emit('click', e)"
  >
    <template v-for="(child, index) in items" :key="index">
      <component :is="child" />
      <span v-if="spacer && index < items.length - 1" :class="ns.e('spacer')">
        <component :is="spacer" v-if="typeof spacer !== 'string'" />
        <template v-else>{{ spacer }}</template>
      </span>
    </template>
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcSpace styles
 * BEM naming: zc-space / zc-space__spacer
 * Flexbox-based spacing component.
 * ============================================================ */

.zc-space {
  /* Component-level CSS variables (overridable via theming) */
  --zc-space-gap-small: 8px;
--zc-space-gap-medium: 12px;
  --zc-space-gap-large: 24px;

  display: inline-flex;
  box-sizing: border-box;
}

.zc-space.is-vertical {
  display: inline-flex;
}

.zc-space.is-fill {
  display: flex;
  width: 100%;
}

.zc-space__spacer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
