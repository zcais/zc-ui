<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount, useSlots } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcTextEllipsis' })

export type TextEllipsisPlacement = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(
  defineProps<{
    /** Text content to display */
    content?: string
    /** Maximum number of lines (0 = single line) */
    lines?: number
    /** Whether to show tooltip on hover when truncated */
    showTooltip?: boolean
    /** Tooltip placement */
    placement?: TextEllipsisPlacement
    /** Whether to show expand/collapse button */
    expandable?: boolean
    /** Custom ellipsis symbol */
    ellipsis?: string
    /** Custom class for tooltip */
    tooltipClass?: string
  }>(),
  {
    content: '',
    lines: 0,
    showTooltip: true,
    placement: 'top',
    expandable: false,
    ellipsis: '…',
    tooltipClass: '',
  }
)

const emit = defineEmits<{
  (e: 'expand', expanded: boolean): void
}>()

const ns = useNamespace('text-ellipsis')
const slots = useSlots()

const containerRef = ref<HTMLElement | null>(null)
const isExpanded = ref(false)
const isTruncated = ref(false)

/** Actual text to display */
const displayText = computed(
  () => props.content || (slots.default?.()?.[0]?.children as string) || ''
)

const containerClasses = computed(() => [
  ns.b(),
  ns.is('expanded', isExpanded.value),
  ns.is('truncated', isTruncated.value && !isExpanded.value),
])

/** Check if text is truncated */
function checkTruncation() {
  if (!containerRef.value) return

  const el = containerRef.value
  if (isExpanded.value) {
    isTruncated.value = el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth
    return
  }

  // Reset to check natural overflow
  isTruncated.value = el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight
}

const tooltipContent = computed(() => {
  if (!props.showTooltip || !isTruncated.value || isExpanded.value) return ''
  return displayText.value
})

function toggleExpand() {
  isExpanded.value = !isExpanded.value
  emit('expand', isExpanded.value)
  nextTick(() => {
    if (!isExpanded.value) {
      checkTruncation()
    }
  })
}

// Observe resize to recalculate truncation
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => {
    checkTruncation()
    if (containerRef.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => checkTruncation())
      resizeObserver.observe(containerRef.value)
    }
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

// Re-check when content or lines change
watch([() => props.content, () => props.lines, () => props.expandable], () => {
  nextTick(() => checkTruncation())
})

defineExpose({ isTruncated })

const textStyles = computed(() => {
  if (props.lines === 0) {
    return {
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }
  }
  if (!isExpanded.value) {
    return {
      display: '-webkit-box',
      WebkitLineClamp: String(props.lines),
      WebkitBoxOrient: 'vertical' as const,
      overflow: 'hidden',
    }
  }
  return {}
})
</script>

<template>
  <div :class="containerClasses">
    <span
      v-if="showTooltip && isTruncated && !isExpanded && tooltipContent"
      :class="ns.e('tooltip-wrapper')"
    >
      <span ref="containerRef" :class="ns.e('text')" :style="textStyles">
        {{ displayText }}
      </span>
      <span :class="[ns.e('tooltip'), ns.m(placement), tooltipClass]">
        {{ tooltipContent }}
      </span>
    </span>
    <span v-else ref="containerRef" :class="ns.e('text')" :style="textStyles">
      {{ displayText }}
    </span>
    <button
      v-if="expandable && isTruncated"
      :class="ns.e('action')"
      type="button"
      @click="toggleExpand"
    >
      {{ isExpanded ? '收起' : '展开' }}
    </button>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcTextEllipsis styles
 * BEM naming: zc-text-ellipsis / zc-text-ellipsis__text
 * ============================================================ */

.zc-text-ellipsis {
  --zc-ellipsis-text-color: var(--color-zc-text-primary, #303133);
  --zc-ellipsis-action-color: var(--color-zc-primary, #409eff);
  --zc-ellipsis-action-hover-color: var(--color-zc-primary-light-3, #79bbff);
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  max-width: 100%;
  color: var(--zc-ellipsis-text-color);
}

/* ---- Text ---- */
.zc-text-ellipsis__text {
  display: inline-block;
  vertical-align: bottom;
}

/* ---- Action button ---- */
.zc-text-ellipsis__action {
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: var(--zc-ellipsis-action-color);
  font-size: inherit;
  white-space: nowrap;
}

.zc-text-ellipsis__action:hover {
  color: var(--zc-ellipsis-action-hover-color);
}

/* ---- Tooltip wrapper ---- */
.zc-text-ellipsis__tooltip-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

/* ---- Tooltip ---- */
.zc-text-ellipsis__tooltip {
  position: absolute;
  z-index: 9999;
  max-width: 300px;
  padding: 8px 12px;
  background-color: var(--color-zc-text-primary, #303133);
  color: #fff;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 4px;
  white-space: normal;
  word-break: break-word;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s,
    visibility 0.2s;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* ---- Tooltip placements ---- */
.zc-text-ellipsis__tooltip--top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

.zc-text-ellipsis__tooltip--bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}

.zc-text-ellipsis__tooltip--left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}

.zc-text-ellipsis__tooltip--right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}

.zc-text-ellipsis__tooltip-wrapper:hover .zc-text-ellipsis__tooltip {
  opacity: 1;
  visibility: visible;
}

/* ---- Dark mode ---- */
.dark .zc-text-ellipsis {
  --zc-ellipsis-text-color: var(--color-zc-text-primary, #e5eaf3);
}

.dark .zc-text-ellipsis__tooltip {
  background-color: #1d1e1f;
  color: #e5eaf3;
}
</style>
