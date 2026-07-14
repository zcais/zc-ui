<script setup lang="ts">
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcMain' })

withDefaults(
  defineProps<{
    /** Custom HTML tag for the root element. */
    tag?: string
  }>(),
  {
    tag: 'main',
  }
)

const ns = useNamespace('main')
</script>

<template>
  <component :is="tag" :class="ns.b()">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcMain styles
 * BEM naming: zc-main
 * ============================================================ */

.zc-main {
  /* Component-level CSS variables (overridable via theming) */
  --zc-main-bg-color: var(--color-zc-fill-lighter, #fafafa);
  --zc-main-text-color: var(--color-zc-text-primary, #303133);
  --zc-main-padding: var(--spacing-zc-lg, 24px);
  
  display: block;
  box-sizing: border-box;
  flex: 1;
  flex-basis: auto;
width: 100%;
  overflow: auto;
  padding: var(--zc-main-padding);
  background-color: var(--zc-main-bg-color);
  color: var(--zc-main-text-color);
}
</style>
