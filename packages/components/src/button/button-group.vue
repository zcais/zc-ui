<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcButtonGroup' })

export type ButtonGroupSize = 'large' | 'medium' | 'small' | 'mini'
export type ButtonGroupDirection = 'horizontal' | 'vertical'

const props = withDefaults(
  defineProps<{
    /** Group size — propagated to child buttons via CSS */
    size?: ButtonGroupSize
    /** Layout direction */
    direction?: ButtonGroupDirection
  }>(),
  {
    size: undefined,
    direction: 'horizontal',
  }
)

const ns = useNamespace('button-group')

const classes = computed(() => [ns.b(), ns.m(props.direction), props.size ? ns.m(props.size) : ''])
</script>

<template>
  <div :class="classes" role="group">
    <slot />
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcButtonGroup styles
 * Groups multiple buttons together with seamless borders.
 * ============================================================ */

.zc-button-group {
  display: inline-flex;
  vertical-align: middle;
}

.zc-button-group--vertical {
  flex-direction: column;
}

/* ---- Horizontal: merge adjacent borders ---- */
.zc-button-group--horizontal > :deep(.zc-button) {
  border-radius: 0;
}
.zc-button-group--horizontal > :deep(.zc-button:not(:first-child)) {
  margin-left: -1px;
}
.zc-button-group--horizontal > :deep(.zc-button:first-child) {
  border-top-left-radius: var(--zc-button-border-radius, 4px);
  border-bottom-left-radius: var(--zc-button-border-radius, 4px);
}
.zc-button-group--horizontal > :deep(.zc-button:last-child) {
  border-top-right-radius: var(--zc-button-border-radius, 4px);
  border-bottom-right-radius: var(--zc-button-border-radius, 4px);
}

/* ---- Vertical: merge adjacent borders ---- */
.zc-button-group--vertical > :deep(.zc-button) {
  border-radius: 0;
}
.zc-button-group--vertical > :deep(.zc-button:not(:first-child)) {
  margin-top: -1px;
  margin-left: 0;
}
.zc-button-group--vertical > :deep(.zc-button:first-child) {
  border-top-left-radius: var(--zc-button-border-radius, 4px);
  border-top-right-radius: var(--zc-button-border-radius, 4px);
}
.zc-button-group--vertical > :deep(.zc-button:last-child) {
  border-bottom-left-radius: var(--zc-button-border-radius, 4px);
  border-bottom-right-radius: var(--zc-button-border-radius, 4px);
}

/* ---- Size propagation via CSS variables ---- */
.zc-button-group--large > :deep(.zc-button) {
  padding: 12px 20px;
  font-size: var(--text-zc-md, 16px);
}
.zc-button-group--medium > :deep(.zc-button) {
  padding: 8px 16px;
  font-size: var(--text-zc-base, 14px);
}
.zc-button-group--small > :deep(.zc-button) {
  padding: 6px 12px;
  font-size: var(--text-zc-sm, 13px);
}
.zc-button-group--mini > :deep(.zc-button) {
  padding: 4px 8px;
  font-size: var(--text-zc-xs, 12px);
}
</style>
