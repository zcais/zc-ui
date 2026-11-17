<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcMenuItemGroup' })

defineProps<{
  /** Group title shown above the items */
  title?: string
}>()

const ns = useNamespace('menu-item-group')

const groupClasses = computed(() => [ns.b()])
</script>

<template>
  <li :class="groupClasses" role="group">
    <div :class="ns.e('title')">
      <slot name="title">{{ title }}</slot>
    </div>
    <ul :class="ns.e('children')">
      <slot />
    </ul>
  </li>
</template>

<style scoped>
.zc-menu-item-group > li {
  list-style: none;
}

.zc-menu-item-group__title {
  padding: 8px 0 8px 20px;
  font-size: 12px;
  line-height: normal;
  color: var(--color-zc-text-secondary, #909399);
}

.zc-menu-item-group__children {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Items inside a group render slightly denser than top-level items */
.zc-menu-item-group__children :deep(.zc-menu__item) {
  height: 40px;
  line-height: 40px;
}
</style>
