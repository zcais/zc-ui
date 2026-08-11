<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'

defineOptions({ name: 'ZcTag' })

export type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type TagEffect = 'dark' | 'light' | 'plain'

const props = withDefaults(
  defineProps<{
    type?: TagType
    effect?: TagEffect
    closable?: boolean
    round?: boolean
    hit?: boolean
    disableTransitions?: boolean
  }>(),
  {
    type: 'info',
    effect: 'light',
    closable: false,
    round: false,
    hit: false,
    disableTransitions: false,
  }
)

const emit = defineEmits<{
  (e: 'close', event: MouseEvent | KeyboardEvent): void
  (e: 'click', event: MouseEvent): void
}>()

const ns = useNamespace('tag')
const { t } = useLocale()

const classes = computed(() => [
  ns.b(),
  ns.m(props.type),
  ns.m(props.effect),
  ns.is('round', props.round),
  ns.is('hit', props.hit),
])

function handleClose(event: MouseEvent | KeyboardEvent) {
  emit('close', event)
}

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <span
    :class="classes"
    :style="{ transition: disableTransitions ? 'none' : undefined }"
    @click="handleClick"
  >
    <span :class="ns.e('content')">
      <slot />
    </span>
    <button
      v-if="closable"
      :class="ns.e('close')"
      :aria-label="t('zc.tag.close')"
      type="button"
      @click.stop="handleClose"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </span>
</template>

<style scoped>
/* ============================================================
 * ZcTag styles
 * BEM naming: zc-tag / zc-tag__content / zc-tag__close
 * ============================================================ */

.zc-tag {
  /* Component-level CSS variables */
  --zc-tag-bg-color: transparent;
  --zc-tag-text-color: var(--color-zc-text-primary, #303133);
  --zc-tag-border-color: transparent;
  --zc-tag-border-radius: var(--radius-zc-base, 4px);
  --zc-tag-font-size: var(--text-zc-sm, 13px);
  --zc-tag-padding: 0 8px;
  --zc-tag-height: 24px;

  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: var(--zc-tag-padding);
  height: var(--zc-tag-height);
  font-size: var(--zc-tag-font-size);
  line-height: 22px;
  border: 1px solid var(--zc-tag-border-color);
  border-radius: var(--zc-tag-border-radius);
  background: var(--zc-tag-bg-color);
  color: var(--zc-tag-text-color);
  white-space: nowrap;
  cursor: default;
  user-select: none;
}

.zc-tag__content {
  display: inline-flex;
  align-items: center;
}

.zc-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-tag__close:hover {
  opacity: 1;
}

.zc-tag__close svg {
  width: 100%;
  height: 100%;
}

/* ---- Round shape ---- */
.zc-tag.is-round {
  border-radius: var(--radius-zc-round, 20px);
}

/* ---- Hit style ---- */
.zc-tag.is-hit {
  border-width: 1px;
}

/* ---- dark effect ---- */
.zc-tag--dark.zc-tag--primary {
  --zc-tag-bg-color: var(--color-zc-primary-500, #409eff);
  --zc-tag-border-color: var(--color-zc-primary-500, #409eff);
  --zc-tag-text-color: var(--color-zc-white, #fff);
}
.zc-tag--dark.zc-tag--success {
  --zc-tag-bg-color: var(--color-zc-success-500, #67c23a);
  --zc-tag-border-color: var(--color-zc-success-500, #67c23a);
  --zc-tag-text-color: var(--color-zc-white, #fff);
}
.zc-tag--dark.zc-tag--warning {
  --zc-tag-bg-color: var(--color-zc-warning-500, #e6a23c);
  --zc-tag-border-color: var(--color-zc-warning-500, #e6a23c);
  --zc-tag-text-color: var(--color-zc-white, #fff);
}
.zc-tag--dark.zc-tag--danger {
  --zc-tag-bg-color: var(--color-zc-danger-500, #f56c6c);
  --zc-tag-border-color: var(--color-zc-danger-500, #f56c6c);
  --zc-tag-text-color: var(--color-zc-white, #fff);
}
.zc-tag--dark.zc-tag--info {
  --zc-tag-bg-color: var(--color-zc-info-500, #909399);
  --zc-tag-border-color: var(--color-zc-info-500, #909399);
  --zc-tag-text-color: var(--color-zc-white, #fff);
}

/* ---- light effect ---- */
.zc-tag--light.zc-tag--primary {
  --zc-tag-bg-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-tag-border-color: var(--color-zc-primary-200, #c6e2ff);
  --zc-tag-text-color: var(--color-zc-primary-600, #337ecc);
}
.zc-tag--light.zc-tag--success {
  --zc-tag-bg-color: var(--color-zc-success-50, #f0f9eb);
  --zc-tag-border-color: var(--color-zc-success-200, #cfe8c3);
  --zc-tag-text-color: var(--color-zc-success-600, #529b2e);
}
.zc-tag--light.zc-tag--warning {
  --zc-tag-bg-color: var(--color-zc-warning-50, #fdf6ec);
  --zc-tag-border-color: var(--color-zc-warning-200, #f8e3c5);
  --zc-tag-text-color: var(--color-zc-warning-600, #b88230);
}
.zc-tag--light.zc-tag--danger {
  --zc-tag-bg-color: var(--color-zc-danger-50, #fef0f0);
  --zc-tag-border-color: var(--color-zc-danger-200, #fcd3d3);
  --zc-tag-text-color: var(--color-zc-danger-600, #c45656);
}
.zc-tag--light.zc-tag--info {
  --zc-tag-bg-color: var(--color-zc-info-50, #f4f4f5);
  --zc-tag-border-color: var(--color-zc-info-200, #dedfe0);
  --zc-tag-text-color: var(--color-zc-info-600, #73767a);
}

/* ---- plain effect ---- */
.zc-tag--plain.zc-tag--primary {
  --zc-tag-bg-color: transparent;
  --zc-tag-border-color: var(--color-zc-primary-300, #a0cfff);
  --zc-tag-text-color: var(--color-zc-primary-500, #409eff);
}
.zc-tag--plain.zc-tag--success {
  --zc-tag-bg-color: transparent;
  --zc-tag-border-color: var(--color-zc-success-300, #b3e19d);
  --zc-tag-text-color: var(--color-zc-success-500, #67c23a);
}
.zc-tag--plain.zc-tag--warning {
  --zc-tag-bg-color: transparent;
  --zc-tag-border-color: var(--color-zc-warning-300, #f3d19e);
  --zc-tag-text-color: var(--color-zc-warning-500, #e6a23c);
}
.zc-tag--plain.zc-tag--danger {
  --zc-tag-bg-color: transparent;
  --zc-tag-border-color: var(--color-zc-danger-300, #fab6b6);
  --zc-tag-text-color: var(--color-zc-danger-500, #f56c6c);
}
.zc-tag--plain.zc-tag--info {
  --zc-tag-bg-color: transparent;
  --zc-tag-border-color: var(--color-zc-info-300, #c8c9cc);
  --zc-tag-text-color: var(--color-zc-info-500, #909399);
}
</style>
