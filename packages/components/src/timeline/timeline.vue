<script setup lang="ts">
import { computed, provide } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcTimeline' })

const props = withDefaults(
  defineProps<{
    reverse?: boolean
  }>(),
  {
    reverse: false,
  }
)

const ns = useNamespace('timeline')

provide('zcTimeline', {
  reverse: computed(() => props.reverse),
})
</script>

<template>
  <ul :class="[ns.b(), ns.is('reverse', reverse)]">
    <slot />
  </ul>
</template>

<style scoped>
/* ============================================================
 * ZcTimeline styles
 * ============================================================ */

.zc-timeline {
  --zc-timeline-text-color: var(--color-zc-text-regular, #606266);
  --zc-timeline-line-color: var(--color-zc-border-light, #e4e7ed);
  --zc-timeline-dot-bg-color: var(--color-zc-primary-500, #409eff);
  --zc-timeline-dot-size: 14px;
  --zc-timeline-padding-left: 28px;
  --zc-timeline-font-size: var(--text-zc-base, 14px);

  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.zc-timeline.is-reverse {
  flex-direction: column-reverse;
}

/* ---- Timeline Item ---- */
.zc-timeline-item {
  display: flex;
  position: relative;
  padding-bottom: 20px;
  padding-left: var(--zc-timeline-padding-left);
}

.zc-timeline-item:last-child {
  padding-bottom: 0;
}

.zc-timeline-item:last-child .zc-timeline-item__tail {
  display: none;
}

/* ---- Tail (connecting line) ---- */
.zc-timeline-item__tail {
  position: absolute;
  top: 6px;
  left: 4px;
  height: calc(100% - 6px);
  width: 2px;
  background: var(--zc-timeline-line-color);
}

/* ---- Node (dot) ---- */
.zc-timeline-item__node {
  position: absolute;
  left: -1px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--zc-timeline-line-color);
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-zc-base, 1);
}

.zc-timeline-item__node--primary {
  background: var(--zc-timeline-dot-bg-color);
}

.zc-timeline-item__node--success {
  background: var(--color-zc-success-500, #67c23a);
}

.zc-timeline-item__node--warning {
  background: var(--color-zc-warning-500, #e6a23c);
}

.zc-timeline-item__node--danger {
  background: var(--color-zc-danger-500, #f56c6c);
}

.zc-timeline-item__node--info {
  background: var(--color-zc-info-500, #909399);
}

.zc-timeline-item__node--large {
  width: 14px;
  height: 14px;
  left: -2px;
  top: 3px;
}

.zc-timeline-item__node.is-hollow {
  background: var(--color-zc-bg, #fff);
  border-color: var(--zc-timeline-line-color);
}

.zc-timeline-item__node.is-hollow.zc-timeline-item__node--primary {
  border-color: var(--zc-timeline-dot-bg-color);
}

.zc-timeline-item__node.is-hollow.zc-timeline-item__node--success {
  border-color: var(--color-zc-success-500, #67c23a);
}

.zc-timeline-item__node.is-hollow.zc-timeline-item__node--warning {
  border-color: var(--color-zc-warning-500, #e6a23c);
}

.zc-timeline-item__node.is-hollow.zc-timeline-item__node--danger {
  border-color: var(--color-zc-danger-500, #f56c6c);
}

/* ---- Wrapper ---- */
.zc-timeline-item__wrapper {
  flex: 1;
  position: relative;
  padding-left: 20px;
}

/* ---- Timestamp ---- */
.zc-timeline-item__timestamp {
  font-size: var(--text-zc-sm, 13px);
  color: var(--zc-timeline-text-color);
  line-height: 1;
}

.zc-timeline-item__timestamp--top {
  margin-bottom: 8px;
}

.zc-timeline-item__timestamp--bottom {
  margin-top: 8px;
}

/* ---- Content ---- */
.zc-timeline-item__content {
  font-size: var(--zc-timeline-font-size);
  color: var(--zc-timeline-text-color);
  line-height: 1.6;
}

/* ---- Custom dot slot ---- */
.zc-timeline-item__dot {
  position: absolute;
  left: -1px;
  top: 4px;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-zc-base, 1);
}
</style>
