<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcStatisticCard' })

export type StatisticCardTrend = 'up' | 'down' | 'none'

const props = withDefaults(
  defineProps<{
    /** Title/label for the card */
    title?: string
    /** Numeric value */
    value?: number | string
    /** Prefix (e.g. currency symbol) */
    prefix?: string
    /** Suffix (e.g. unit) */
    suffix?: string
    /** Trend direction */
    trend?: StatisticCardTrend
    /** Trend percentage (e.g. 12.5 for +12.5%) */
    trendValue?: number
    /** Trend label */
    trendLabel?: string
    /** Number of decimal places */
    decimals?: number
    /** Value separator */
    separator?: boolean
    /** Loading state */
    loading?: boolean
    /** Whether to show border */
    bordered?: boolean
    /** Card padding */
    padding?: number
  }>(),
  {
    title: '',
    value: '',
    prefix: '',
    suffix: '',
    trend: 'none',
    trendValue: undefined,
    trendLabel: 'vs last period',
    decimals: 0,
    separator: true,
    loading: false,
    bordered: true,
    padding: 20,
  }
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

const ns = useNamespace('statistic-card')
const slots = useSlots()

/* ---- Formatted value ---- */
const formattedValue = computed(() => {
  if (typeof props.value !== 'number') return String(props.value)

  const fixed = props.value.toFixed(props.decimals)

  if (!props.separator) return fixed

  const [intPart, decPart] = fixed.split('.')
  const withSeparator = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart !== undefined ? `${withSeparator}.${decPart}` : withSeparator
})

/* ---- Trend sign ---- */
const trendSign = computed(() => {
  if (props.trendValue === undefined) return ''
  return props.trendValue > 0 ? '+' : ''
})

const trendDisplay = computed(() => {
  if (props.trendValue === undefined) return ''
  return `${trendSign.value}${props.trendValue}%`
})

/* ---- Classes ---- */
const cardClasses = computed(() => [
  ns.b(),
  ns.is('bordered', props.bordered),
  ns.is('loading', props.loading),
])

const trendClasses = computed(() => [ns.e('trend'), ns.m(props.trend)])

const cardStyle = computed(() => ({
  padding: `${props.padding}px`,
}))

/* ---- Handlers ---- */
function handleClick() {
  emit('click')
}
</script>

<template>
  <div :class="cardClasses" :style="cardStyle" @click="handleClick">
    <!-- Loading skeleton -->
    <template v-if="loading">
      <div :class="ns.e('skeleton')">
        <div :class="ns.e('skeleton-title')" />
        <div :class="ns.e('skeleton-value')" />
        <div :class="ns.e('skeleton-trend')" />
      </div>
    </template>

    <!-- Actual content -->
    <template v-else>
      <!-- Header: title + avatar -->
      <div :class="ns.e('header')">
        <div v-if="slots.title || title" :class="ns.e('title')">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="slots.avatar" :class="ns.e('avatar')">
          <slot name="avatar" />
        </div>
      </div>

      <!-- Body: value + trend -->
      <div :class="ns.e('body')">
        <div :class="ns.e('value')">
          <span v-if="slots.prefix || prefix" :class="ns.e('prefix')">
            <slot name="prefix">{{ prefix }}</slot>
          </span>
          <span :class="ns.e('value-content')">
            <slot>{{ formattedValue }}</slot>
          </span>
          <span v-if="slots.suffix || suffix" :class="ns.e('suffix')">
            <slot name="suffix">{{ suffix }}</slot>
          </span>
        </div>

        <!-- Trend indicator -->
        <div
          v-if="slots.trend || trend !== 'none' || trendValue !== undefined"
          :class="trendClasses"
        >
          <slot name="trend" :trend="trend" :trend-value="trendValue">
            <span v-if="trend === 'up'" :class="ns.e('trend-arrow')" aria-hidden="true">
              <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                <path
                  d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
                />
              </svg>
            </span>
            <span v-else-if="trend === 'down'" :class="ns.e('trend-arrow')" aria-hidden="true">
              <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                <path
                  d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L840.4 335c12.2-14.2 1.2-35-18.5-35z"
                />
              </svg>
            </span>
            <span v-if="trendDisplay" :class="ns.e('trend-value')">{{ trendDisplay }}</span>
            <span v-if="trendLabel" :class="ns.e('trend-label')">{{ trendLabel }}</span>
          </slot>
        </div>
      </div>

      <!-- Footer slot -->
      <div v-if="slots.footer" :class="ns.e('footer')">
        <slot name="footer" />
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcStatisticCard styles
 * BEM naming: zc-statistic-card / zc-statistic-card__title / ...
 * ============================================================ */

.zc-statistic-card {
  --zc-sc-bg-color: var(--color-zc-bg-color, #ffffff);
  --zc-sc-border-color: var(--color-zc-border-base, #e4e7ed);
  --zc-sc-border-radius: var(--border-zc-radius, 8px);
  --zc-sc-title-color: var(--color-zc-text-secondary, #909399);
  --zc-sc-value-color: var(--color-zc-text-primary, #303133);
  --zc-sc-trend-up-color: var(--color-zc-success, #52c41a);
  --zc-sc-trend-down-color: var(--color-zc-danger, #ff4d4f);
  --zc-sc-trend-label-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-sc-prefix-color: var(--color-zc-text-regular, #606266);
  --zc-sc-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  --zc-sc-hover-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
  min-width: 200px;
  background-color: var(--zc-sc-bg-color);
  border-radius: var(--zc-sc-border-radius);
  box-shadow: var(--zc-sc-box-shadow);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  cursor: pointer;
}

/* ---- Bordered ---- */
.zc-statistic-card.is-bordered {
  border: 1px solid var(--zc-sc-border-color);
}

/* ---- Hover effect ---- */
.zc-statistic-card:hover {
  box-shadow: var(--zc-sc-hover-shadow);
  transform: translateY(-2px);
}

/* ---- Header ---- */
.zc-statistic-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* ---- Title ---- */
.zc-statistic-card__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--zc-sc-title-color);
  line-height: 1.5;
}

/* ---- Avatar ---- */
.zc-statistic-card__avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
}

/* ---- Body ---- */
.zc-statistic-card__body {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px 12px;
}

/* ---- Value ---- */
.zc-statistic-card__value {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--zc-sc-value-color);
}

.zc-statistic-card__value-content {
  font-variant-numeric: tabular-nums;
}

/* ---- Prefix / Suffix ---- */
.zc-statistic-card__prefix {
  font-size: 16px;
  font-weight: 600;
  color: var(--zc-sc-prefix-color);
}

.zc-statistic-card__suffix {
  font-size: 14px;
  font-weight: 500;
  color: var(--zc-sc-prefix-color);
}

/* ---- Trend ---- */
.zc-statistic-card__trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  line-height: 1.5;
}

/* ---- Trend: up ---- */
.zc-statistic-card__trend.zc-statistic-card--up {
  color: var(--zc-sc-trend-up-color);
}

/* ---- Trend: down ---- */
.zc-statistic-card__trend.zc-statistic-card--down {
  color: var(--zc-sc-trend-down-color);
}

/* ---- Trend: none ---- */
.zc-statistic-card__trend.zc-statistic-card--none {
  color: var(--zc-sc-trend-label-color);
}

.zc-statistic-card__trend-arrow {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.zc-statistic-card__trend-arrow svg {
  width: 0.85em;
  height: 0.85em;
}

.zc-statistic-card__trend-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.zc-statistic-card__trend-label {
  color: var(--zc-sc-trend-label-color);
  font-weight: 400;
}

/* ---- Footer ---- */
.zc-statistic-card__footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--zc-sc-border-color);
}

/* ---- Skeleton loading ---- */
.zc-statistic-card__skeleton {
  width: 100%;
}

.zc-statistic-card__skeleton-title,
.zc-statistic-card__skeleton-value,
.zc-statistic-card__skeleton-trend {
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--color-zc-fill-light, #f5f7fa) 25%,
    var(--color-zc-fill, #e9ecef) 37%,
    var(--color-zc-fill-light, #f5f7fa) 63%
  );
  background-size: 400% 100%;
  animation: zc-sc-skeleton-loading 1.4s ease infinite;
}

.zc-statistic-card__skeleton-title {
  width: 40%;
  height: 16px;
  margin-bottom: 16px;
}

.zc-statistic-card__skeleton-value {
  width: 55%;
  height: 32px;
  margin-bottom: 12px;
}

.zc-statistic-card__skeleton-trend {
  width: 30%;
  height: 14px;
}

@keyframes zc-sc-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

/* ============================================================
 * Dark mode
 * ============================================================ */
.dark .zc-statistic-card {
  --zc-sc-bg-color: var(--color-zc-bg-color, #1d1e1f);
  --zc-sc-border-color: var(--color-zc-border-base, #414243);
  --zc-sc-title-color: var(--color-zc-text-secondary, #a3a6ad);
  --zc-sc-value-color: var(--color-zc-text-primary, #e5eaf3);
  --zc-sc-trend-label-color: var(--color-zc-text-placeholder, #8d9095);
  --zc-sc-prefix-color: var(--color-zc-text-regular, #cfd3dc);
  --zc-sc-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  --zc-sc-hover-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.4);
}

.dark .zc-statistic-card__skeleton-title,
.dark .zc-statistic-card__skeleton-value,
.dark .zc-statistic-card__skeleton-trend {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 37%,
    rgba(255, 255, 255, 0.05) 63%
  );
  background-size: 400% 100%;
}
</style>
