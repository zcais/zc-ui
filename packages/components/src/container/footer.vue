<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcFooter' })

const props = withDefaults(
  defineProps<{
    /** Footer height. */
    height?: string
    /** Custom HTML tag for the root element. */
    tag?: string
  }>(),
  {
    height: '60px',
    tag: 'footer',
  }
)

const ns = useNamespace('footer')

// Use CSS custom property so the value can be overridden via theming
const footerStyle = computed(() => ({
  '--zc-footer-height': props.height,
}))
</script>

<template>
  <component :is="tag" :class="ns.b()" :style="footerStyle">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcFooter styles
 * BEM naming: zc-footer
 * ============================================================ */

.zc-footer {
  /* Component-level CSS variables (overridable via theming) */
  --zc-footer-height: 60px;
  --zc-footer-bg-color: var(--color-zc-info-50, #f4f4f5);
  --zc-footer-text-color: var(--color-zc-text-primary, #303133);
  --zc-footer-padding: 0 var(--spacing-zc-md, 16px);
  
  box-sizing: border-box;
  flex-shrink: 0;
flex-basis: auto;
  width: 100%;
  height: var(--zc-footer-height);
  padding: var(--zc-footer-padding);
  background-color: var(--zc-footer-bg-color);
  color: var(--zc-footer-text-color);
}
</style>
