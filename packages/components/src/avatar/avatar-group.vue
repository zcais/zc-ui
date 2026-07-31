<script setup lang="ts">
import { computed, provide, reactive, useSlots, type VNode } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import type { AvatarSize } from '../avatar/avatar.vue'

defineOptions({ name: 'ZcAvatarGroup' })

export type AvatarGroupSize = AvatarSize

export const avatarGroupKey = 'zc-avatar-group'

const props = withDefaults(
  defineProps<{
    /** Maximum number of avatars to show; excess display as +N */
    max?: number
    /** Avatar size for all children */
    size?: AvatarGroupSize
    /** Overlap spacing in px */
    spacing?: number
    /** Show additional count badge */
    showCount?: boolean
  }>(),
  {
    max: undefined,
    size: 'medium',
    spacing: -8,
    showCount: false,
  }
)

const ns = useNamespace('avatar-group')
const slots = useSlots()

/** Provide context for child Avatar components */
provide(
  avatarGroupKey,
  reactive({
    size: computed(() => props.size),
  })
)

/** Compute visible vs hidden avatars */
const avatarVNodes = computed<VNode[]>(() => {
  if (!slots.default) return []
  const nodes = slots.default()
  return nodes.filter(
    (node) =>
      typeof node.type === 'object' ||
      typeof node.type === 'function' ||
      typeof node.type === 'string'
  )
})

const visibleAvatars = computed(() => {
  if (props.max === undefined) return avatarVNodes.value
  return avatarVNodes.value.slice(0, props.max)
})

const hiddenCount = computed(() => {
  if (props.max === undefined) return 0
  return avatarVNodes.value.length - props.max
})
</script>

<template>
  <div :class="ns.b()" :style="{ '--zc-avatar-group-spacing': `${spacing}px` }">
    <!-- Visible avatars -->
    <template v-for="(vnode, index) in visibleAvatars" :key="index">
      <component :is="vnode" />
    </template>

    <!-- Overflow count -->
    <span v-if="hiddenCount > 0" :class="ns.e('excess')"> +{{ hiddenCount }} </span>
  </div>
</template>

<style scoped>
.zc-avatar-group {
  display: inline-flex;
  align-items: center;
}

.zc-avatar-group :deep(.zc-avatar) {
  border: 2px solid var(--color-zc-bg-base, #fff);
  margin-right: var(--zc-avatar-group-spacing, -8px);
  transition: transform 0.2s;
}

.zc-avatar-group :deep(.zc-avatar:last-child) {
  margin-right: 0;
}

.zc-avatar-group :deep(.zc-avatar:hover) {
  transform: translateY(-2px);
  z-index: 1;
}

.zc-avatar-group__excess {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-zc-fill-base, #f0f2f5);
  color: var(--color-zc-text-regular, #606266);
  font-size: var(--text-zc-sm, 13px);
  font-weight: 500;
  border: 2px solid var(--color-zc-bg-base, #fff);
  border-radius: var(--radius-zc-circle, 50%);
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* Sync with avatar sizes */
.zc-avatar-group__excess {
  --size: 36px;
}
</style>
