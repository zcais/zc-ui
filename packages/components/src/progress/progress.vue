<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcProgress' })

import type { ProgressType, ProgressStatus } from './types'

const props = withDefaults(
  defineProps<{
    /** Progress type */
    type?: ProgressType
    /** Percentage (0-100) */
    percentage?: number
    /** Progress status */
    status?: ProgressStatus
    /** Stroke width in px */
    strokeWidth?: number
    /** Show text inside the bar */
    textInside?: boolean
    /** Show percentage text */
    showText?: boolean
    /** Diameter for circle/dashboard type */
    width?: number
    /** Custom color (overrides status color) */
    color?: string
    /** Enable striped animation */
    striped?: boolean
    /** Animate striped bars */
    stripedFlow?: boolean
    /** Duration of animation in seconds */
    duration?: number
  }>(),
  {
    type: 'line',
    percentage: 0,
    status: 'primary',
    strokeWidth: 6,
    textInside: false,
    showText: true,
    width: 126,
    color: '',
    striped: false,
    stripedFlow: false,
    duration: 3,
  }
)

const ns = useNamespace('progress')

const clampedPercentage = computed(() => {
  const p = Math.max(0, Math.min(100, props.percentage))
  return Math.round(p * 100) / 100
})

const statusColor = computed(() => {
  if (props.color) return props.color
  const colors: Record<ProgressStatus, string> = {
    primary: 'var(--color-zc-primary-500, #409eff)',
    success: 'var(--color-zc-success-500, #67c23a)',
    warning: 'var(--color-zc-warning-500, #e6a23c)',
    error: 'var(--color-zc-danger-500, #f56c6c)',
    info: 'var(--color-zc-info-500, #909399)',
  }
  return colors[props.status]
})

const barStyle = computed(() => ({
  width: `${clampedPercentage.value}%`,
  backgroundColor: statusColor.value,
  height: `${props.strokeWidth}px`,
}))

const isCircle = computed(() => props.type === 'circle' || props.type === 'dashboard')

/* ---- Circle geometry ---- */
const radius = computed(() => (props.width - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const strokeDashoffset = computed(() => {
  if (props.type === 'dashboard') {
    const arc = circumference.value * 0.75
    return arc - (arc * clampedPercentage.value) / 100
  }
  return circumference.value - (circumference.value * clampedPercentage.value) / 100
})

const circleStyle = computed(() => {
  if (!isCircle.value) return {}
  return {
    strokeDasharray:
      props.type === 'dashboard'
        ? `${circumference.value * 0.75} ${circumference.value}`
        : `${circumference.value}`,
    strokeDashoffset: String(strokeDashoffset.value),
    stroke: statusColor.value,
    strokeWidth: `${props.strokeWidth}px`,
    transition: 'stroke-dashoffset 0.35s ease, stroke 0.35s ease',
  } as Record<string, string>
})

const viewBoxSize = computed(() => props.width)
const centerPoint = computed(() => props.width / 2)

const circlePath = computed(() => {
  if (props.type === 'dashboard') {
    const r = radius.value
    const c = centerPoint.value
    return `M ${c - r} ${c} A ${r} ${r} 0 1 1 ${c + r} ${c}`
  }
  return ''
})
</script>

<template>
  <div
    :class="[ns.b(), ns.m(type)]"
    role="progressbar"
    :aria-valuenow="clampedPercentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <!-- Line type -->
    <template v-if="type === 'line'">
      <div :class="ns.e('bar')" :style="{ height: `${strokeWidth}px` }">
        <div :class="ns.e('bar-outer')">
          <div
            :class="[
              ns.e('bar-inner'),
              ns.is('striped', striped),
              ns.is('striped-flow', stripedFlow),
            ]"
            :style="barStyle"
          >
            <div
              v-if="stripedFlow"
              :class="ns.e('striped-flow')"
              :style="{ animationDuration: `${duration}s` }"
            />
          </div>
          <span v-if="showText && textInside && clampedPercentage > 8" :class="ns.e('text-inside')">
            {{ clampedPercentage }}%
          </span>
        </div>
      </div>
      <span v-if="showText && !textInside" :class="[ns.e('text'), ns.em('text', status)]">
        {{ clampedPercentage }}%
      </span>
    </template>

    <!-- Circle / Dashboard type -->
    <template v-else>
      <div :class="ns.e('circle')" :style="{ width: `${width}px`, height: `${width}px` }">
        <svg :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`">
          <!-- Track -->
          <path
            v-if="type === 'dashboard'"
            :d="circlePath"
            fill="none"
            :stroke-width="strokeWidth"
            stroke="var(--color-zc-border-light, #e4e7ed)"
            stroke-linecap="round"
          />
          <circle
            v-else
            :cx="centerPoint"
            :cy="centerPoint"
            :r="radius"
            fill="none"
            :stroke-width="strokeWidth"
            stroke="var(--color-zc-border-light, #e4e7ed)"
          />
          <!-- Progress -->
          <path
            v-if="type === 'dashboard'"
            :d="circlePath"
            fill="none"
            stroke-linecap="round"
            :style="circleStyle"
          />
          <circle
            v-else
            :cx="centerPoint"
            :cy="centerPoint"
            :r="radius"
            fill="none"
            stroke-linecap="round"
            :style="circleStyle"
            :transform="`rotate(-90 ${centerPoint} ${centerPoint})`"
          />
        </svg>
        <div v-if="showText" :class="ns.e('circle-text')">
          <slot :percentage="clampedPercentage"> {{ clampedPercentage }}% </slot>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcProgress styles
 * ============================================================ */

.zc-progress {
  display: flex;
  align-items: center;
  font-size: var(--text-zc-base, 14px);
  line-height: 1;
}

/* ---- Line ---- */
.zc-progress__bar {
  flex: 1;
  background: var(--color-zc-border-light, #e4e7ed);
  border-radius: 100px;
  overflow: hidden;
  position: relative;
}

.zc-progress__bar-outer {
  height: 100%;
  border-radius: var(--zc-progress-border-radius);
  position: relative;
}

.zc-progress__bar-inner {
  height: 100%;
  border-radius: var(--zc-progress-border-radius);
  transition:
    width 0.35s ease,
    background-color 0.35s ease;
  position: relative;
  overflow: hidden;
}

/* ---- Striped ---- */
.zc-progress__bar-inner.is-striped {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
}

.zc-progress__bar-inner.is-striped-flow::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
  animation: zc-progress-stripes 3s linear infinite;
}

@keyframes zc-progress-stripes {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 20px 0;
  }
}

/* ---- Text ---- */
.zc-progress__text {
  margin-left: 10px;
  min-width: 2.5em;
  font-size: var(--zc-progress-font-size);
  color: var(--zc-progress-text-color);
  text-align: right;
}
.zc-progress__text--success {
  color: var(--zc-progress-success-color);
}
.zc-progress__text--error {
  color: var(--zc-progress-danger-color);
}
.zc-progress__text--warning {
  color: var(--zc-progress-warning-color);
}

.zc-progress__text-inside {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--zc-progress-font-size);
  color: var(--color-zc-white, #fff);
  white-space: nowrap;
}

/* ---- Circle / Dashboard ---- */
.zc-progress__circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.zc-progress__circle svg {
  width: 100%;
  height: 100%;
}
.zc-progress__circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--text-zc-md, 16px);
  font-weight: 600;
  color: var(--zc-progress-text-color);
  text-align: center;
}
</style>
