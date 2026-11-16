<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcTimelineItem' })

export type TimelineItemType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

const props = withDefaults(
  defineProps<{
    timestamp?: string
    hideTimestamp?: boolean
    placement?: 'top' | 'bottom'
    type?: TimelineItemType
    color?: string
    size?: 'normal' | 'large'
    icon?: string
    hollow?: boolean
  }>(),
  {
    timestamp: '',
    hideTimestamp: false,
    placement: 'top',
    type: 'primary',
    color: '',
    size: 'normal',
    icon: '',
    hollow: false,
  }
)

const ns = useNamespace('timeline-item')

const nodeClasses = computed(() => [
  ns.e('node'),
  props.type ? `${ns.e('node')}--${props.type}` : '',
  props.size === 'large' ? `${ns.e('node')}--large` : '',
  props.hollow ? 'is-hollow' : '',
])

const nodeStyle = computed(() => {
  if (props.color && !props.type) {
    const style: Record<string, string> = {
      borderColor: props.color,
      color: props.color,
    }
    // Hollow nodes should remain transparent; solid nodes get filled
    if (!props.hollow) {
      style.backgroundColor = props.color
    }
    return style
  }
  return {}
})
</script>

<template>
  <li :class="ns.b()">
    <!-- Tail -->
    <div :class="ns.e('tail')" />

    <!-- Node (dot) -->
    <div v-if="!$slots.dot" :class="nodeClasses" :style="nodeStyle">
      <i v-if="icon" :class="icon" />
    </div>

    <!-- Custom dot slot -->
    <div v-else :class="ns.e('dot')">
      <slot name="dot" />
    </div>

    <!-- Wrapper -->
    <div :class="ns.e('wrapper')">
      <!-- Timestamp top -->
      <div
        v-if="!hideTimestamp && timestamp && placement === 'top'"
        :class="[ns.e('timestamp'), `${ns.e('timestamp')}--top`]"
      >
        {{ timestamp }}
      </div>

      <!-- Content -->
      <div :class="ns.e('content')">
        <slot />
      </div>

      <!-- Timestamp bottom -->
      <div
        v-if="!hideTimestamp && timestamp && placement === 'bottom'"
        :class="[ns.e('timestamp'), `${ns.e('timestamp')}--bottom`]"
      >
        {{ timestamp }}
      </div>
    </div>
  </li>
</template>

<style scoped>
/* ============================================================
 * ZcTimelineItem styles.
 * CSS custom properties are declared on the parent .zc-timeline
 * so items inherit them; fallbacks keep standalone usage working.
 * ============================================================ */

.zc-timeline-item {
  position: relative;
  padding-bottom: 20px;
  padding-left: var(--zc-timeline-padding-left, 28px);
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
  background: var(--zc-timeline-line-color, #e4e7ed);
}

/* ---- Node (dot) ---- */
.zc-timeline-item__node {
  position: absolute;
  left: -1px;
  top: 4px;
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border-radius: 50%;
  background: var(--zc-timeline-line-color, #e4e7ed);
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-zc-base, 1);
  transition: all 0.3s var(--ease-zc-in-out, ease);
}

.zc-timeline-item__node--primary {
  background: var(--zc-timeline-dot-bg-color, #409eff);
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
  box-sizing: border-box;
}

.zc-timeline-item__node.is-hollow {
  background: var(--color-zc-bg, #fff);
  border-color: var(--zc-timeline-line-color, #e4e7ed);
}

.zc-timeline-item__node.is-hollow.zc-timeline-item__node--primary {
  border-color: var(--zc-timeline-dot-bg-color, #409eff);
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
  position: relative;
  padding-left: 20px;
}

/* ---- Timestamp ---- */
.zc-timeline-item__timestamp {
  font-size: var(--text-zc-sm, 13px);
  line-height: 1;
  color: var(--zc-timeline-text-color, #606266);
}

.zc-timeline-item__timestamp--top {
  margin-bottom: 8px;
}

.zc-timeline-item__timestamp--bottom {
  margin-top: 8px;
}

/* ---- Content ---- */
.zc-timeline-item__content {
  font-size: var(--zc-timeline-font-size, 14px);
  color: var(--zc-timeline-text-color, #606266);
  line-height: 1.6;
  transition: color 0.3s var(--ease-zc-in-out, ease);
}

.zc-timeline-item:hover .zc-timeline-item__content {
  color: var(--zc-timeline-dot-bg-color, #409eff);
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

@media (max-width: 768px) {
  .zc-timeline-item {
    padding-left: 14px;
  }

  .zc-timeline-item__wrapper {
    padding-left: 14px;
  }

  .zc-timeline-item__tail {
    left: 2px;
  }
}
</style>
