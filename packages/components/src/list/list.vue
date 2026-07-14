<script setup lang="ts">
import { computed, provide } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { LIST_KEY } from './types'

defineOptions({ name: 'ZcList' })

const props = withDefaults(
  defineProps<{
    bordered?: boolean
    split?: boolean
    splitPosition?: 'inside' | 'outside'
    size?: 'large' | 'default' | 'small'
    layout?: 'vertical' | 'horizontal'
    loading?: boolean
    header?: string
    footer?: string
    emptyText?: string
  }>(),
  {
    bordered: false,
    split: true,
    splitPosition: 'outside',
    size: 'default',
    layout: 'vertical',
    loading: false,
    header: '',
    footer: '',
    emptyText: 'No data',
  }
)

const ns = useNamespace('list')

provide(LIST_KEY, {
  split: computed(() => props.split),
  splitPosition: computed(() => props.splitPosition),
  size: computed(() => props.size),
  layout: computed(() => props.layout),
  bordered: computed(() => props.bordered),
})

const classes = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.m(props.layout),
  ns.is('bordered', props.bordered),
])
</script>

<template>
  <div :class="classes">
    <!-- Header -->
    <div v-if="header || $slots.header" :class="ns.e('header')">
      <slot name="header">{{ header }}</slot>
    </div>

    <!-- Loading -->
    <div v-if="loading" :class="ns.e('loading')">
      <slot name="loading">
        <div class="zc-list__loading-spinner">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              opacity="0.3"
            />
            <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="2">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      </slot>
    </div>

    <!-- Items -->
    <div :class="ns.e('items')">
      <slot />
    </div>

    <!-- Empty -->
    <div v-if="!loading && !$slots.default" :class="ns.e('empty')">
      <slot name="empty">{{ emptyText }}</slot>
    </div>

    <!-- Footer -->
    <div v-if="footer || $slots.footer" :class="ns.e('footer')">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcList styles
 * ============================================================ */

.zc-list {
  --zc-list-bg-color: var(--color-zc-bg-base, #fff);
  --zc-list-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-list-text-color: var(--color-zc-text-primary, #303133);
  --zc-list-header-color: var(--color-zc-text-primary, #303133);
  --zc-list-item-padding: 12px 16px;
  --zc-list-item-hover-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-list-font-size: var(--text-zc-base, 14px);
  --zc-list-meta-color: var(--color-zc-text-secondary, #909399);

  font-size: var(--zc-list-font-size);
  color: var(--zc-list-text-color);
  background: var(--zc-list-bg-color);
}

.zc-list.is-bordered {
  border: 1px solid var(--zc-list-border-color);
  border-radius: var(--radius-zc-base, 4px);
}

.zc-list--vertical .zc-list__items {
  display: flex;
  flex-direction: column;
}

.zc-list--horizontal .zc-list__items {
  display: flex;
  flex-direction: row;
}

/* ---- Size ---- */
.zc-list--small .zc-list-item {
  padding: 8px 16px;
}

.zc-list--default .zc-list-item {
  padding: 12px 20px;
}

.zc-list--large .zc-list-item {
  padding: 16px 24px;
}

/* ---- Header / Footer ---- */
.zc-list__header {
  padding: 12px 20px;
  border-bottom: 1px solid var(--zc-list-border-color);
  font-weight: 500;
  color: var(--zc-list-header-color);
}

.zc-list__footer {
  padding: 12px 20px;
  border-top: 1px solid var(--zc-list-border-color);
  color: var(--zc-list-meta-color);
}

/* ---- Loading ---- */
.zc-list__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--color-zc-primary-500, #409eff);
}

.zc-list__loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: zc-list-spin 1s linear infinite;
}

@keyframes zc-list-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ---- Empty ---- */
.zc-list__empty {
  padding: 32px;
  text-align: center;
  color: var(--zc-list-meta-color);
}

/* ---- List Item ---- */
.zc-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.zc-list-item:hover {
  background: var(--zc-list-item-hover-bg-color);
}

.zc-list-item__content {
  flex: 1;
}

.zc-list-item__extra {
  margin-left: 24px;
  color: var(--zc-list-meta-color);
  font-size: var(--text-zc-sm, 13px);
}

.zc-list-item__actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

/* ---- Split line (vertical) ---- */
.zc-list--vertical .zc-list-item + .zc-list-item::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--zc-list-border-color);
}

.zc-list--vertical.zc-list.is-bordered .zc-list-item + .zc-list-item::after {
  left: 0;
  right: 0;
}
</style>
