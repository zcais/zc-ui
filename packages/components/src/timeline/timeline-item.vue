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
 * ZcTimelineItem supplementary styles
 * Core styles are defined in timeline.vue (parent).
 * This block adds transition and responsive enhancements.
 * ============================================================ */

.zc-timeline-item__node {
  transition: all 0.3s var(--ease-zc-in-out, ease);
}

.zc-timeline-item__content {
  transition: color 0.3s var(--ease-zc-in-out, ease);
}

.zc-timeline-item:hover .zc-timeline-item__content {
  color: var(--zc-timeline-dot-bg-color);
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
