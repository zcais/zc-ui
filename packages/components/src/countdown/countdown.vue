<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { isClient } from '@zc-ui/utils'
import type { CountdownProps, CountdownExposed } from './types'

defineOptions({ name: 'ZcCountdown' })

const props = withDefaults(defineProps<CountdownProps>(), {
  value: 0,
  format: 'HH:mm:ss',
  title: '',
  prefix: '',
  suffix: '',
  valueStyle: () => ({}),
  interval: undefined,
})

const emit = defineEmits<{
  finish: []
  change: [remaining: number]
}>()

const ns = useNamespace('countdown')

/* ---------------------------------------------------------------- *
 * State
 * ---------------------------------------------------------------- */
const displayValue = ref('')
let timer: ReturnType<typeof setInterval> | null = null
let deadline = 0 // absolute timestamp (ms) when countdown hits zero
let isPaused = false
let pausedAt = 0 // timestamp when pause() was called
let finished = false

/** Threshold: values ≥ this are treated as absolute timestamps, not durations */
const TIMESTAMP_THRESHOLD = 1e10

/* ---------------------------------------------------------------- *
 * Interval — auto-detect from format if not explicitly set
 * ---------------------------------------------------------------- */
const tickInterval = computed(() => {
  if (props.interval !== undefined) return props.interval
  return /S/.test(props.format) ? 50 : 1000
})

/* ---------------------------------------------------------------- *
 * Core logic
 * ---------------------------------------------------------------- */

/**
 * Resolve the deadline timestamp from props.value.
 * - value ≥ 1e10 → absolute timestamp (ms since epoch)
 * - value  < 1e10 → relative duration in ms from now
 */
function computeDeadline(): number {
  if (props.value >= TIMESTAMP_THRESHOLD) return props.value
  return Date.now() + props.value
}

/** Pad a non-negative integer to the given string length */
function pad(num: number, len: number): string {
  return String(Math.max(0, Math.floor(num))).padStart(len, '0')
}

/**
 * Format a remaining-duration (ms) into a display string.
 * Supported tokens: YYYY MM DD HH mm ss SSS S
 */
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalDays = Math.floor(totalHours / 24)

  const tokens: Record<string, string> = {
    YYYY: pad(Math.floor(totalDays / 365), 4),
    MM: pad(Math.floor((totalDays % 365) / 30), 2),
    DD: pad(totalDays, 2),
    HH: pad(totalHours % 24, 2),
    mm: pad(totalMinutes % 60, 2),
    ss: pad(totalSeconds % 60, 2),
    SSS: pad(ms % 1000, 3),
    S: String(Math.floor((ms % 1000) / 100)),
  }

  // Regex alternation is tried left-to-right, so SSS matches before S
  return props.format.replace(/YYYY|MM|DD|HH|mm|ss|SSS|S/g, (m) => tokens[m])
}

/** Called on every tick */
function tick(): void {
  const remaining = Math.max(0, deadline - Date.now())

  displayValue.value = formatDuration(remaining)
  emit('change', remaining)

  if (remaining <= 0 && !finished) {
    finished = true
    stopTimer()
    emit('finish')
  }
}

/** Start (or restart) the interval timer */
function startTimer(): void {
  stopTimer()
  if (!isClient) return // SSR-safe: no timers on server
  tick()
  timer = setInterval(tick, tickInterval.value)
}

/** Clear the interval timer */
function stopTimer(): void {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

/* ---------------------------------------------------------------- *
 * Public methods (exposed via ref)
 * ---------------------------------------------------------------- */
function pause(): void {
  if (isPaused || finished) return
  isPaused = true
  pausedAt = Date.now()
  stopTimer()
}

function resume(): void {
  if (!isPaused || finished) return
  isPaused = false
  // Shift the deadline forward by the paused duration
  deadline += Date.now() - pausedAt
  startTimer()
}

function reset(): void {
  finished = false
  isPaused = false
  deadline = computeDeadline()
  startTimer()
}

defineExpose<CountdownExposed>({ pause, resume, reset })

/* ---------------------------------------------------------------- *
 * Initial state — compute during setup so SSR and first paint
 * already show the correct value (no flash of empty content).
 * ---------------------------------------------------------------- */
deadline = computeDeadline()
displayValue.value = formatDuration(Math.max(0, deadline - Date.now()))

/* ---------------------------------------------------------------- *
 * Lifecycle
 * ---------------------------------------------------------------- */
onMounted(() => {
  startTimer()
})

onBeforeUnmount(() => {
  stopTimer()
})

// Restart when the value prop changes
watch(
  () => props.value,
  () => reset()
)
</script>

<template>
  <div :class="ns.b()">
    <div v-if="title || $slots.title" :class="ns.e('title')">
      <slot name="title">{{ title }}</slot>
    </div>
    <div :class="ns.e('content')">
      <span v-if="prefix || $slots.prefix" :class="ns.e('prefix')">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      <span :class="ns.e('value')" :style="valueStyle">
        <slot :display-value="displayValue">{{ displayValue }}</slot>
      </span>
      <span v-if="suffix || $slots.suffix" :class="ns.e('suffix')">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcCountdown styles
 * Mirrors ZcStatistic visual language
 * ============================================================ */

.zc-countdown {
  --zc-countdown-text-color: var(--color-zc-text-primary, #303133);
  --zc-countdown-font-size: var(--text-zc-xl, 20px);
  --zc-countdown-font-weight: 700;

  font-size: var(--text-zc-base, 14px);
  color: var(--zc-countdown-text-color);
}

.zc-countdown__title {
  margin-bottom: 8px;
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-secondary, #909399);
}

.zc-countdown__content {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.zc-countdown__value {
  font-size: var(--zc-countdown-font-size);
  font-weight: var(--zc-countdown-font-weight);
  color: var(--zc-countdown-text-color);
  font-variant-numeric: tabular-nums;
}

.zc-countdown__prefix {
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-secondary, #909399);
}

.zc-countdown__suffix {
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-secondary, #909399);
}
</style>
