<script setup lang="ts">
import { computed, useSlots, type VNode } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcContainer' })

/**
 * Direction for the container layout.
 * - `horizontal`: children laid out side by side (default).
 * - `vertical`: children stacked vertically.
 */
export type ContainerDirection = 'horizontal' | 'vertical'

const props = withDefaults(
  defineProps<{
    /**
     * Layout direction.
     * When omitted, auto-detects: vertical if children include ZcHeader or ZcFooter,
     * horizontal otherwise.
     */
    direction?: ContainerDirection
    /** Custom HTML tag for the root element. */
    tag?: string
  }>(),
  {
    tag: 'section',
  }
)

const ns = useNamespace('container')
const slots = useSlots()

// Auto-detect: if children contain ZcHeader or ZcFooter → vertical layout
const isVertical = computed(() => {
  if (props.direction === 'vertical') return true
  if (props.direction === 'horizontal') return false

  const children = slots.default?.()
  if (!children || children.length === 0) return false

  return children.some((child: VNode) => {
    // `name` comes from defineOptions({ name: 'ZcHeader' })
    // `__name` is the SFC filename (e.g. 'header'), so check `name` first
    const componentName = child.type?.name || child.type?.__name
    return componentName === 'ZcHeader' || componentName === 'ZcFooter'
  })
})

// Only output is-vertical when needed (horizontal is the default, no class required)
const classes = computed(() => [ns.b(), ns.is('vertical', isVertical.value)])
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcContainer styles
 * BEM naming: zc-container
 * Flexbox-based page layout container.
 * Default direction is horizontal (row).
 * Use is-vertical to switch to column layout.
 * ============================================================ */

.zc-container {
  /* Component-level CSS variables (overridable via theming) */
  --zc-container-bg-color: transparent;
  --zc-container-min-height: auto;
  --zc-container-border-color: var(--color-zc-border-base, #dcdfe6);
  
  display: flex;
  flex-direction: row;
flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  min-height: var(--zc-container-min-height);
  background-color: var(--zc-container-bg-color);
}

/* Vertical direction: stack children top to bottom */
.zc-container.is-vertical {
  flex-direction: column;
}
</style>
