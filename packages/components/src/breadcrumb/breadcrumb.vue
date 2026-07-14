<script setup lang="ts">
import { computed, provide } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcBreadcrumb' })

export type BreadcrumbSeparator = string

const props = withDefaults(
  defineProps<{
    /** Separator between items */
    separator?: BreadcrumbSeparator
    /** Custom separator icon (render via slot) */
    separatorIcon?: string
  }>(),
  {
    separator: '/',
    separatorIcon: '',
  }
)

const ns = useNamespace('breadcrumb')

// Provide context for child breadcrumb items
provide('zcBreadcrumb', {
  separator: computed(() => props.separator),
  separatorIcon: computed(() => props.separatorIcon),
})
</script>

<template>
  <div :class="ns.b()" aria-label="Breadcrumb" role="navigation">
    <slot />
  </div>
</template>

<style scoped>
.zc-breadcrumb {
  --zc-breadcrumb-text-color: var(--color-zc-text-primary, #303133);
  --zc-breadcrumb-active-color: var(--color-zc-primary-500, #409eff);
--zc-breadcrumb-hover-color: var(--color-zc-primary-500, #409eff);
  --zc-breadcrumb-separator-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-breadcrumb-font-size: var(--text-zc-base, 14px);
  --zc-breadcrumb-item-padding: 0 8px;
  --zc-breadcrumb-icon-size: 14px;

  font-size: var(--zc-breadcrumb-font-size);
  line-height: 1.5;
}

.zc-breadcrumb::after,
.zc-breadcrumb::before {
  display: table;
  content: '';
}

.zc-breadcrumb::after {
  clear: both;
}
</style>
