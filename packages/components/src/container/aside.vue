<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcAside' })

const props = withDefaults(
  defineProps<{
    /** Aside sidebar width. */
    width?: string
    /** Custom HTML tag for the root element. */
    tag?: string
  }>(),
  {
    width: '200px',
    tag: 'aside',
  }
)

const ns = useNamespace('aside')

// Use CSS custom property so the value can be overridden via theming
const asideStyle = computed(() => ({
  '--zc-aside-width': props.width,
}))
</script>

<template>
  <component :is="tag" :class="ns.b()" :style="asideStyle">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcAside styles
 * BEM naming: zc-aside
 * ============================================================ */

.zc-aside {
  /* Component-level CSS variables (overridable via theming) */
  --zc-aside-width: 200px;
  --zc-aside-bg-color: var(--color-zc-info-50, #f4f4f5);
  --zc-aside-text-color: var(--color-zc-text-primary, #303133);

  box-sizing: border-box;
  flex-shrink: 0;
  flex-basis: auto;
  width: var(--zc-aside-width);
  overflow: auto;
  background-color: var(--zc-aside-bg-color);
  color: var(--zc-aside-text-color);
}
</style>
