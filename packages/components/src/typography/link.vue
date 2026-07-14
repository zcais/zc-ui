<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcLink' })

export type LinkType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'

const props = withDefaults(
  defineProps<{
    /** Link color type */
    type?: LinkType
    /** Show underline */
    underline?: boolean
    /** Disable the link */
    disabled?: boolean
    /** href attribute */
    href?: string
    /** target attribute */
    target?: '_self' | '_blank' | '_parent' | '_top'
  }>(),
  {
    type: 'default',
    underline: false,
    disabled: false,
    href: undefined,
    target: undefined,
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const ns = useNamespace('link')

const classes = computed(() => [
  ns.b(),
  props.type !== 'default' ? ns.m(props.type) : '',
  ns.is('underline', props.underline),
  ns.is('disabled', props.disabled),
])

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <a
    :class="classes"
    :href="disabled ? undefined : href"
    :target="target"
    :tabindex="disabled ? -1 : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="handleClick"
  >
    <slot />
  </a>
</template>

<style scoped>
/* ============================================================
 * ZcLink styles
 * BEM naming: zc-link / zc-link--{type}
 * ============================================================ */

.zc-link {
  --zc-link-color: var(--color-zc-text-primary, #303133);
  --zc-link-hover-color: var(--color-zc-primary-600, #337ecc);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--zc-link-color);
  font-size: var(--text-zc-base, 14px);
  text-decoration: none;
  cursor: pointer;
  outline: none;
  transition: color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
  user-select: none;
}

/* ---- Hover ---- */
.zc-link:hover {
  color: var(--zc-link-hover-color);
}

/* ---- Underline ---- */
.zc-link.is-underline:hover:not(.is-disabled) {
  text-decoration: underline;
}

/* ---- Type colors ---- */
.zc-link--primary {
  --zc-link-color: var(--color-zc-primary-500, #409eff);
  --zc-link-hover-color: var(--color-zc-primary-600, #337ecc);
}
.zc-link--success {
  --zc-link-color: var(--color-zc-success-500, #67c23a);
  --zc-link-hover-color: var(--color-zc-success-600, #529b2e);
}
.zc-link--warning {
  --zc-link-color: var(--color-zc-warning-500, #e6a23c);
  --zc-link-hover-color: var(--color-zc-warning-600, #b88230);
}
.zc-link--danger {
  --zc-link-color: var(--color-zc-danger-500, #f56c6c);
  --zc-link-hover-color: var(--color-zc-danger-600, #c45656);
}
.zc-link--info {
  --zc-link-color: var(--color-zc-info-500, #909399);
  --zc-link-hover-color: var(--color-zc-info-600, #73767a);
}

/* ---- Disabled ---- */
.zc-link.is-disabled {
  --zc-link-color: var(--color-zc-text-placeholder, #c0c4cc);
  --zc-link-hover-color: var(--color-zc-text-placeholder, #c0c4cc);
  cursor: not-allowed;
}

/* ---- Dark mode ---- */
html[data-theme='dark'] .zc-link {
  --zc-link-color: var(--color-zc-text-primary, #e5eaf3);
}
html[data-theme='dark'] .zc-link--primary {
  --zc-link-color: var(--color-zc-primary-400, #79bbff);
  --zc-link-hover-color: var(--color-zc-primary-300, #a0cfff);
}
html[data-theme='dark'] .zc-link--success {
  --zc-link-color: var(--color-zc-success-400, #95d475);
  --zc-link-hover-color: var(--color-zc-success-300, #b3e19d);
}
html[data-theme='dark'] .zc-link--warning {
  --zc-link-color: var(--color-zc-warning-400, #eebe77);
  --zc-link-hover-color: var(--color-zc-warning-300, #f3d19e);
}
html[data-theme='dark'] .zc-link--danger {
  --zc-link-color: var(--color-zc-danger-400, #f89898);
  --zc-link-hover-color: var(--color-zc-danger-300, #fab6b6);
}
html[data-theme='dark'] .zc-link--info {
  --zc-link-color: var(--color-zc-info-400, #b1b3b8);
  --zc-link-hover-color: var(--color-zc-info-300, #c8c9cc);
}
html[data-theme='dark'] .zc-link.is-disabled {
  --zc-link-color: var(--color-zc-text-placeholder, #414243);
}
</style>
