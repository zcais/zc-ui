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
 * ZcTimeline styles.
 * NOTE: ZcTimelineItem internals (.zc-timeline-item__*) must be
 * styled in timeline-item.vue — scoped styles here cannot reach
 * inside child components (only their root element).
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
</style>
