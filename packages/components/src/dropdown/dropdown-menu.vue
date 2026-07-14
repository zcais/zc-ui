<script setup lang="ts">
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcDropdownMenu' })

const ns = useNamespace('dropdown')
</script>

<template>
  <ul :class="ns.e('menu-list')" role="menu">
    <slot />
  </ul>
</template>

<style scoped>
.zc-dropdown__menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
