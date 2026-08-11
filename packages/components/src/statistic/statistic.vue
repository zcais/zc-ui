<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

/** Easing function type for count-up animation */
export type StatisticEasing = 'linear' | 'easeOut' | 'easeIn' | 'easeInOut'

defineOptions({ name: 'ZcStatistic' })

const props = withDefaults(
  defineProps<{
    /** Numeric value to display */
    value?: number
    /** Title text shown above the value */
    title?: string
    /** Prefix string before the value */
    prefix?: string
    /** Suffix string after the value */
    suffix?: string
    /** Number of decimal places */
    precision?: number
    /** Decimal separator character */
    decimalSeparator?: string
    /** Thousands group separator */
    groupSeparator?: string
    /** Custom value formatter function */
    formatter?: (value: number) => string
    /** Inline style for the value element */
    valueStyle?: Record<string, string>
    /** Whether to animate the value with count-up */
    countUp?: boolean
    /** Start value for count-up animation */
    countFrom?: number
    /** Animation duration in ms */
    duration?: number
    /** Whether to use an easing function (only when countUp is true) */
    useEasing?: boolean
    /** Easing function type */
    easing?: StatisticEasing
    /** Whether to auto-play the animation on mount */
    autoplay?: boolean
    /** Whether to auto restart animation when value changes */
    autoRestart?: boolean
    /** Whether to show a countdown timer */
    countdown?: boolean
    /** Target timestamp or duration in ms for countdown */
    startValue?: number
  }>(),
  {
    value: 0,
    title: '',
    prefix: '',
    suffix: '',
    precision: 0,
    decimalSeparator: '.',
    groupSeparator: ',',
    formatter: undefined,
    valueStyle: () => ({}),
    countUp: false,
    countFrom: 0,
    duration: 2000,
    useEasing: true,
    easing: 'easeOut',
    autoplay: true,
    autoRestart: false,
    countdown: false,
    startValue: 0,
  }
)

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'end'): void
}>()

const ns = useNamespace('statistic')

/* ------------------------------------------------------------------ *
 * Easing functions
 * ------------------------------------------------------------------ */
const easingFunctions: Record<StatisticEasing, (t: number) => number> = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeIn: (t) => Math.pow(t, 3),
  easeInOut: (t) => (t < 0.5 ? 4 * Math.pow(t, 3) : 1 - Math.pow(-2 * t + 2, 3) / 2),
}

/* ------------------------------------------------------------------ *
 * State
 * ------------------------------------------------------------------ */
const displayValue = ref<number>(props.countUp ? props.countFrom : props.value)
const countdownDisplay = ref('')
let rafId: number | null = null
let startTime: number | null = null
let paused = false
let startedFrom = props.countFrom
let countdownTimer: ReturnType<typeof setInterval> | null = null

/* ------------------------------------------------------------------ *
 * Number formatting
 * ------------------------------------------------------------------ */
function formatNumber(val: number): string {
  if (props.formatter) return props.formatter(val)
  const fixed = val.toFixed(props.precision)
  const [intPart, decPart] = fixed.split('.')
  const formatted = props.groupSeparator
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator)
    : intPart
  return props.precision > 0 && decPart !== undefined
    ? `${formatted}${props.decimalSeparator}${decPart}`
    : formatted
}

const formattedValue = computed(() => {
  if (props.countdown) return countdownDisplay.value
  return formatNumber(displayValue.value)
})

/* ------------------------------------------------------------------ *
 * Count-up animation engine
 * ------------------------------------------------------------------ */
function animateStep(timestamp: number) {
  if (paused) return

  if (startTime === null) startTime = timestamp

  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / props.duration, 1)

  if (props.useEasing) {
    const easeFn = easingFunctions[props.easing] ?? easingFunctions.easeOut
    displayValue.value = startedFrom + (props.value - startedFrom) * easeFn(progress)
  } else {
    displayValue.value = startedFrom + (props.value - startedFrom) * progress
  }

  if (progress < 1) {
    rafId = requestAnimationFrame(animateStep)
  } else {
    displayValue.value = props.value
    rafId = null
    startTime = null
    emit('end')
  }
}

/** Start (or restart) the count-up animation */
function start(): void {
  cancelAnimation()
  paused = false
  startTime = null
  startedFrom = props.countFrom
  displayValue.value = props.countFrom
  emit('start')
  rafId = requestAnimationFrame(animateStep)
}

/** Pause the running animation */
function pause(): void {
  if (rafId !== null) {
    paused = true
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

/** Resume a paused animation */
function resume(): void {
  if (paused) {
    paused = false
    startTime = null
    rafId = requestAnimationFrame(animateStep)
  }
}

/** Reset display value to countFrom without animating */
function reset(): void {
  cancelAnimation()
  paused = false
  startTime = null
  startedFrom = props.countFrom
  displayValue.value = props.countFrom
}

function cancelAnimation(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  startTime = null
}

/* ------------------------------------------------------------------ *
 * Countdown
 * ------------------------------------------------------------------ */
function updateCountdown() {
  const now = Date.now()
  let diff = props.startValue - now

  // If startValue is small, treat as duration in ms
  if (props.startValue < 1e10) {
    diff = props.startValue
  }

  if (diff <= 0) {
    countdownDisplay.value = '00:00:00'
    if (countdownTimer) clearInterval(countdownTimer)
    emit('end')
    return
  }

  const seconds = Math.floor(diff / 1000)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  countdownDisplay.value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/* ------------------------------------------------------------------ *
 * Watchers
 * ------------------------------------------------------------------ */
watch(
  () => props.value,
  (val) => {
    if (props.countUp && props.autoRestart) {
      start()
    } else if (!props.countUp) {
      displayValue.value = val
    }
  }
)

/* ------------------------------------------------------------------ *
 * Lifecycle
 * ------------------------------------------------------------------ */
onMounted(() => {
  if (props.countdown) {
    updateCountdown()
    countdownTimer = setInterval(updateCountdown, 1000)
  } else if (props.countUp) {
    if (props.autoplay) {
      start()
    } else {
      displayValue.value = props.countFrom
    }
  } else {
    displayValue.value = props.value
  }
})

onUnmounted(() => {
  cancelAnimation()
  if (countdownTimer) clearInterval(countdownTimer)
})

/* ------------------------------------------------------------------ *
 * Expose
 * ------------------------------------------------------------------ */
defineExpose({ start, pause, resume, reset })
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
        <slot>{{ formattedValue }}</slot>
      </span>
      <span v-if="suffix || $slots.suffix" :class="ns.e('suffix')">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcStatistic styles
 * ============================================================ */

.zc-statistic {
  --zc-statistic-title-color: var(--color-zc-text-regular, #606266);
  --zc-statistic-title-font-size: var(--text-zc-sm, 13px);
  --zc-statistic-value-color: var(--color-zc-text-primary, #303133);
  --zc-statistic-value-font-size: var(--text-zc-xl, 20px);
  --zc-statistic-value-font-weight: 700;
  --zc-statistic-suffix-color: var(--color-zc-text-regular, #606266);
  --zc-statistic-prefix-color: var(--color-zc-text-regular, #606266);

  font-size: var(--text-zc-base, 14px);
  color: var(--zc-statistic-value-color);
}

.zc-statistic__title {
  margin-bottom: 8px;
  font-size: var(--zc-statistic-title-font-size);
  color: var(--zc-statistic-title-color);
}

.zc-statistic__content {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.zc-statistic__value {
  font-size: var(--zc-statistic-value-font-size);
  font-weight: var(--zc-statistic-value-font-weight);
  color: var(--zc-statistic-value-color);
  font-variant-numeric: tabular-nums;
}

.zc-statistic__prefix {
  font-size: var(--text-zc-base, 14px);
  color: var(--zc-statistic-prefix-color);
}

.zc-statistic__suffix {
  font-size: var(--text-zc-base, 14px);
  color: var(--zc-statistic-suffix-color);
}
</style>
