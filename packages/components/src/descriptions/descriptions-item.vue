<script setup lang="ts">
import { inject, useSlots, onUnmounted, getCurrentInstance } from 'vue'
import { DESCRIPTIONS_KEY, type DescriptionsContext } from './types'

defineOptions({ name: 'ZcDescriptionsItem' })

const props = withDefaults(
  defineProps<{
    label?: string
    span?: number
    labelClassName?: string
    contentClassName?: string
    labelStyle?: Record<string, string>
  }>(),
  {
    label: '',
    span: 1,
    labelClassName: '',
    contentClassName: '',
    labelStyle: () => ({}),
  }
)

const slots = useSlots()

// Global counter ensures each DescriptionsItem gets a unique uid
// across all instances (local `let` would reset per component instance).
let uid = 0
const instance = getCurrentInstance()
uid = instance ? instance.uid : Math.random()

const ctx: DescriptionsContext = inject(DESCRIPTIONS_KEY, {
  column: { value: 3 } as any,
  border: { value: false } as any,
  direction: { value: 'horizontal' } as any,
  size: { value: 'default' } as any,
  colon: { value: true } as any,
  labelStyle: { value: {} } as any,
  contentStyle: { value: {} } as any,
  addItem: () => {},
  removeItem: () => {},
})

// Register this item (including slot content) with the parent Descriptions.
// The parent handles row grouping and rendering based on the `column` prop.
ctx.addItem({
  uid,
  label: props.label,
  span: props.span,
  content: slots.default,
  labelClassName: props.labelClassName,
  contentClassName: props.contentClassName,
  labelStyle: props.labelStyle,
})

onUnmounted(() => {
  ctx.removeItem(uid)
})
</script>

<template>
  <!-- Content is rendered by parent ZcDescriptions via column-based grouping -->
</template>

<style scoped>
/* ============================================================
 * ZcDescriptionsItem supplementary styles
 * Core styles are defined in descriptions.vue (parent).
 * ============================================================ */

.zc-descriptions__label {
  --zc-descriptions-label-color: var(--color-zc-text-regular, #606266);
  --zc-descriptions-label-bg-color: var(--color-zc-fill-light, #f5f7fa);

  font-weight: 500;
  white-space: nowrap;
  transition: background-color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-descriptions__content {
  --zc-descriptions-content-color: var(--color-zc-text-primary, #303133);
  --zc-descriptions-content-bg-color: var(--color-zc-bg-base, #fff);

  transition: background-color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-descriptions__content:hover {
  background-color: var(--zc-descriptions-label-bg-color, #f5f7fa);
}
</style>
