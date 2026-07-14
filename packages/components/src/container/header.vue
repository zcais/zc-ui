<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcHeader' })

const props = withDefaults(
  defineProps<{
    /** Header height. */
    height?: string
    /** Custom HTML tag for the root element. */
    tag?: string
  }>(),
  {
    height: '60px',
    tag: 'header',
  }
)

const ns = useNamespace('header')

// Use CSS custom property so the value can be overridden via theming
const headerStyle = computed(() => ({
  '--zc-header-height': props.height,
}))
</script>

<template>
  <component :is="tag" :class="ns.b()" :style="headerStyle">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcHeader styles
 * BEM naming: zc-header
 * ============================================================ */

.zc-header {
  /* Component-level CSS variables (overridable via theming) */
  --zc-header-height: 60px;
  --zc-header-bg-color: var(--color-zc-info-50, #f4f4f5);
  --zc-header-text-color: var(--color-zc-text-primary, #303133);
  --zc-header-padding: 0 var(--spacing-zc-md, 16px);
  
  box-sizing: border-box;
  flex-shrink: 0;
flex-basis: auto;
  width: 100%;
  height: var(--zc-header-height);
  padding: var(--zc-header-padding);
  background-color: var(--zc-header-bg-color);
  color: var(--zc-header-text-color);
}
</style>
