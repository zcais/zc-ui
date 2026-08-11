<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

export type CountToEasing = 'linear' | 'easeOut' | 'easeIn' | 'easeInOut'

defineOptions({ name: 'ZcCountTo' })

const props = withDefaults(
  defineProps<{
    /** Start value */
    startVal?: number
    /** End value */
    endVal?: number
    /** Animation duration in ms */
    duration?: number
    /** Number of decimal places */
    decimals?: number
    /** Decimal point separator */
    decimal?: string
    /** Thousands separator */
    separator?: string
    /** Prefix string */
    prefix?: string
    /** Suffix string */
    suffix?: string
    /** Whether to use easing function */
    useEasing?: boolean
    /** Easing function type */
    easing?: CountToEasing
    /** Whether to autoplay on mount */
    autoplay?: boolean
    /** Whether to auto restart when value changes */
    autoRestart?: boolean
    /** Font size */
    fontSize?: number
    /** Text color */
    color?: string
  }>(),
  {
    startVal: 0,
    endVal: 0,
    duration: 2000,
    decimals: 0,
    decimal: '.',
    separator: ',',
    prefix: '',
    suffix: '',
    useEasing: true,
    easing: 'easeOut',
    autoplay: true,
    autoRestart: false,
    fontSize: undefined,
    color: '',
  }
)

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'end'): void
  (e: 'mounted'): void
}>()

const ns = useNamespace('count-to')

/* ------------------------------------------------------------------ *
 * Easing functions
 * ------------------------------------------------------------------ */
const easingFunctions: Record<CountToEasing, (t: number) => number> = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeIn: (t) => Math.pow(t, 3),
  easeInOut: (t) => (t < 0.5 ? 4 * Math.pow(t, 3) : 1 - Math.pow(-2 * t + 2, 3) / 2),
}

/* ------------------------------------------------------------------ *
 * Animation state
 * ------------------------------------------------------------------ */
const displayValue = ref<number>(props.startVal)
let rafId: number | null = null
let startTime: number | null = null
let paused = false
let startedFrom: number = props.startVal

/* ------------------------------------------------------------------ *
 * Number formatting
 * ------------------------------------------------------------------ */
function formatNumber(val: number): string {
  const fixed = val.toFixed(props.decimals)
  const [intPart, decPart] = fixed.split('.')

  let formattedInt = intPart
  if (props.separator) {
    formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, props.separator)
  }

  let result = formattedInt
  if (props.decimals > 0 && decPart !== undefined) {
    result += `${props.decimal}${decPart}`
  }

  if (props.prefix) result = `${props.prefix}${result}`
  if (props.suffix) result = `${result}${props.suffix}`

  return result
}

const formattedDisplay = computed(() => formatNumber(displayValue.value))

/* ------------------------------------------------------------------ *
 * Animation engine
 * ------------------------------------------------------------------ */
function animateStep(timestamp: number) {
  if (paused) return

  if (startTime === null) startTime = timestamp

  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / props.duration, 1)

  if (props.useEasing) {
    const easeFn = easingFunctions[props.easing] ?? easingFunctions.easeOut
    displayValue.value = startedFrom + (props.endVal - startedFrom) * easeFn(progress)
  } else {
    displayValue.value = startedFrom + (props.endVal - startedFrom) * progress
  }

  if (progress < 1) {
    rafId = requestAnimationFrame(animateStep)
  } else {
    displayValue.value = props.endVal
    rafId = null
    startTime = null
    emit('end')
  }
}

function start(): void {
  cancelAnimation()
  paused = false
  startTime = null
  startedFrom = props.startVal
  displayValue.value = props.startVal
  emit('start')
  rafId = requestAnimationFrame(animateStep)
}

function pause(): void {
  if (rafId !== null) {
    paused = true
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function reset(): void {
  cancelAnimation()
  paused = false
  startTime = null
  startedFrom = props.startVal
  displayValue.value = props.startVal
}

function cancelAnimation(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  startTime = null
}

/* ------------------------------------------------------------------ *
 * Watchers
 * ------------------------------------------------------------------ */
watch(
  () => props.endVal,
  () => {
    if (props.autoRestart) {
      start()
    }
  }
)

/* ------------------------------------------------------------------ *
 * Lifecycle
 * ------------------------------------------------------------------ */
onMounted(() => {
  emit('mounted')
  if (props.autoplay) {
    start()
  }
})

onUnmounted(() => {
  cancelAnimation()
})

/* ------------------------------------------------------------------ *
 * Expose
 * ------------------------------------------------------------------ */
defineExpose({ start, pause, reset })

/* ------------------------------------------------------------------ *
 * Style binding
 * ------------------------------------------------------------------ */
const textStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.fontSize !== undefined) {
    style.fontSize = `${props.fontSize}px`
  }
  if (props.color) {
    style.color = props.color
  }
  return style
})
</script>

<template>
  <span :class="ns.b()" :style="textStyle">{{ formattedDisplay }}</span>
</template>

<style scoped>
/* ============================================================
 * ZcCountTo styles
 * ============================================================ */

.zc-count-to {
  display: inline-block;
  font-variant-numeric: tabular-nums;
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
}
</style>
