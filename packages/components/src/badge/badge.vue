<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcBadge' })

export type BadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

const props = withDefaults(
  defineProps<{
    value?: string | number
    max?: number
    isDot?: boolean
    hidden?: boolean
    type?: BadgeType
    /** Accessible label for screen readers (e.g., "3 条未读消息") */
    ariaLabel?: string
  }>(),
  {
    value: '',
    max: 99,
    isDot: false,
    hidden: false,
    type: 'danger',
    ariaLabel: '',
  }
)

const ns = useNamespace('badge')

const displayValue = computed(() => {
  if (props.isDot) return ''
  if (typeof props.value === 'number' && props.value > props.max) {
    return `${props.max}+`
  }
  return String(props.value)
})

const classes = computed(() => [
  ns.e('content'),
  ns.em('content', props.type),
  ns.is('dot', props.isDot),
])

const showBadge = computed(
  () => !props.hidden && (props.isDot || (props.value !== '' && props.value !== 0))
)
</script>

<template>
  <div :class="ns.b()">
    <slot />
    <transition name="zc-badge-fade">
      <span v-if="showBadge" :class="classes" :aria-label="ariaLabel || displayValue" role="status">
        {{ displayValue }}
      </span>
    </transition>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcBadge styles
 * BEM naming: zc-badge / zc-badge__content
 * ============================================================ */

.zc-badge {
  position: relative;
  display: inline-block;
}

.zc-badge__content {
  --zc-badge-bg-color: var(--color-zc-danger-500, #f56c6c);
  --zc-badge-text-color: var(--color-zc-white, #fff);
  --zc-badge-font-size: var(--text-zc-xs, 12px);
  --zc-badge-border-radius: var(--radius-zc-round, 20px);
  --zc-badge-padding: 0 5px;
  --zc-badge-height: 18px;
  --zc-badge-min-width: var(--zc-badge-height);
  --zc-badge-border-color: transparent;
  
  position: absolute;
  top: 0;
  right: calc(1px + var(--spacing-zc-xs, 4px));
  transform: translateY(-50%) translateX(100%);
  display: inline-flex;
  align-items: center;
justify-content: center;
min-width: var(--zc-badge-min-width);
height: var(--zc-badge-height);
  padding: var(--zc-badge-padding);
  font-size: var(--zc-badge-font-size);
  line-height: 1;
  color: var(--zc-badge-text-color);
  background: var(--zc-badge-bg-color);
  border: 1px solid var(--zc-badge-border-color);
border-radius: var(--zc-badge-border-radius);
white-space: nowrap;
z-index: var(--z-zc-base, 1);
}
  /* ---- dot mode ---- */
.zc-badge__content.is-dot {
width: 8px;
  height: 8px;
padding: 0;
border-radius: var(--radius-zc-circle, 50%);
  right: calc(-4px);
top: 0;
}
  
/* ---- type colors ---- */
.zc-badge__content--primary {
  --zc-badge-bg-color: var(--color-zc-primary-500, #409eff);
}
.zc-badge__content--success {
  --zc-badge-bg-color: var(--color-zc-success-500, #67c23a);
}
.zc-badge__content--warning {
  --zc-badge-bg-color: var(--color-zc-warning-500, #e6a23c);
}
.zc-badge__content--danger {
  --zc-badge-bg-color: var(--color-zc-danger-500, #f56c6c);
}
.zc-badge__content--info {
  --zc-badge-bg-color: var(--color-zc-info-500, #909399);
}

/* ---- transition ---- */
.zc-badge-fade-enter-active,
.zc-badge-fade-leave-active {
  transition: opacity var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}
.zc-badge-fade-enter-from,
.zc-badge-fade-leave-to {
  opacity: 0;
}
</style>
