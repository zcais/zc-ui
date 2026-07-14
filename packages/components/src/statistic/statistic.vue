<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcStatistic' })

const props = withDefaults(
  defineProps<{
    value?: number
    title?: string
    prefix?: string
    suffix?: string
    precision?: number
    decimalSeparator?: string
    groupSeparator?: string
    formatter?: (value: number) => string
    valueStyle?: Record<string, string>
    countUp?: boolean
    countFrom?: number
    duration?: number
    countdown?: boolean
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
    countdown: false,
    startValue: 0,
  }
)

const ns = useNamespace('statistic')

const displayValue = ref<number>(props.value)
const countdownDisplay = ref('')
let timer: ReturnType<typeof setInterval> | null = null

function formatNumber(val: number): string {
  if (props.formatter) return props.formatter(val)
  const fixed = val.toFixed(props.precision)
  const [intPart, decPart] = fixed.split('.')
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator)
  return decPart !== undefined ? `${formatted}${props.decimalSeparator}${decPart}` : formatted
}

/* ---- Count-up animation ---- */
function animateCountUp() {
  const startTime = performance.now()
  const startVal = props.countFrom
  const endVal = props.value
  const duration = props.duration

  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
    displayValue.value = startVal + (endVal - startVal) * eased
    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      displayValue.value = endVal
    }
  }

  requestAnimationFrame(step)
}

/* ---- Countdown ---- */
function updateCountdown() {
  const now = Date.now()
  let diff = props.startValue - now

  if (props.startValue < 1e10) {
    diff = props.startValue
  }

  if (diff <= 0) {
    countdownDisplay.value = '00:00:00'
    if (timer) clearInterval(timer)
    return
  }

  const seconds = Math.floor(diff / 1000)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  countdownDisplay.value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

onMounted(() => {
  if (props.countUp) {
    animateCountUp()
  } else {
    displayValue.value = props.value
  }
  if (props.countdown) {
    updateCountdown()
    timer = setInterval(updateCountdown, 1000)
  }
})

watch(
  () => props.value,
  (val) => {
    if (!props.countUp && !props.countdown) {
      displayValue.value = val
    }
  }
)

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const formattedValue = computed(() => {
  if (props.countdown) return countdownDisplay.value
  return formatNumber(displayValue.value)
})
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
