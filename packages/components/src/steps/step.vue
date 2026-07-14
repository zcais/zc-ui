<script setup lang="ts">
import { computed, inject, onBeforeUnmount, watch, getCurrentInstance } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { stepsKey } from './types'
import type { StepStatus } from './types'

defineOptions({ name: 'ZcStep' })

const props = withDefaults(
  defineProps<{
    /** Step title */
    title?: string
    /** Step description */
    description?: string
    /** Custom icon class */
    icon?: string
    /** Override status: wait | process | finish | error */
    status?: StepStatus
  }>(),
  {
    title: '',
    description: '',
    icon: '',
    status: undefined,
  }
)

const ns = useNamespace('step')

const parent = inject(stepsKey, null)

// Use Vue's internal uid for uniqueness across instances
const uid = getCurrentInstance()?.uid ?? 0

const stepData = computed(() => ({
  uid,
  title: props.title,
  description: props.description,
  icon: props.icon,
  status: props.status,
}))

if (parent) {
  parent.addStep(stepData.value)
}

watch(
  stepData,
  (val) => {
    if (parent) {
      const idx = parent.steps.value.findIndex((s) => s.uid === uid)
      if (idx > -1) {
        parent.steps.value[idx] = val
      }
    }
  },
  { deep: true }
)

onBeforeUnmount(() => {
  parent?.removeStep(uid)
})

const currentStatus = computed<StepStatus>(() => {
  if (props.status) return props.status
  if (!parent) return 'wait'
  const current = parent.current.value
  const myIndex = parent.steps.value.findIndex((s) => s.uid === uid)
  if (myIndex === -1) return 'wait'
  if (myIndex < current) return 'finish'
  if (myIndex === current) {
    return parent.error.value ? 'error' : 'process'
  }
  return 'wait'
})

const isLast = computed(() => {
  if (!parent) return false
  const myIndex = parent.steps.value.findIndex((s) => s.uid === uid)
  return myIndex === parent.steps.value.length - 1
})

const isVertical = computed(() => parent?.direction.value === 'vertical')
const isSimple = computed(() => parent?.type.value === 'simple')

/* ---- Status icons ---- */
const statusIcon = computed(() => {
  switch (currentStatus.value) {
    case 'finish':
      return 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'
    case 'error':
      return 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
    default:
      return ''
  }
})

const showCheckIcon = computed(() => currentStatus.value === 'finish')
const showCrossIcon = computed(() => currentStatus.value === 'error')
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.is('vertical', isVertical),
      ns.is('simple', isSimple),
      ns.is('last', isLast),
      ns.is(currentStatus),
    ]"
    role="listitem"
    :aria-current="currentStatus === 'process' ? 'step' : undefined"
  >
    <div :class="ns.e('head')">
      <!-- Connector line -->
      <div v-if="!isLast && !isSimple" :class="[ns.e('line'), ns.is('vertical', isVertical)]">
        <div
          :class="[ns.e('line-inner'), ns.is(currentStatus === 'finish' ? 'finish' : '')]"
          :style="{ width: '100%' }"
        />
      </div>

      <!-- Icon / number -->
      <div :class="[ns.e('icon'), ns.is(currentStatus)]">
        <template v-if="icon">
          <i :class="icon" />
        </template>
        <template v-else-if="showCheckIcon">
          <svg viewBox="0 0 24 24" fill="currentColor" class="zc-step__icon-svg">
            <path :d="statusIcon" />
          </svg>
        </template>
        <template v-else-if="showCrossIcon">
          <svg viewBox="0 0 24 24" fill="currentColor" class="zc-step__icon-svg">
            <path :d="statusIcon" />
          </svg>
        </template>
        <template v-else>
          <span :class="ns.e('icon-text')">
            {{ (parent?.steps.value.findIndex((s) => s.uid === uid) ?? 0) + 1 }}
          </span>
        </template>
      </div>
    </div>

    <!-- Content -->
    <div :class="ns.e('content')">
      <div :class="[ns.e('title'), ns.is(currentStatus)]">{{ title }}</div>
      <div v-if="description" :class="[ns.e('description'), ns.is(currentStatus)]">
        {{ description }}
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcStep styles
 * ============================================================ */

.zc-step {
  position: relative;
  flex: 1;
  display: flex;
}

/* ---- Horizontal (default) ---- */
.zc-step:not(.is-vertical):not(.is-simple) {
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 0;
  min-width: 0;
}

/* ---- Head ---- */
.zc-step__head {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

/* Horizontal: head is a row with line+icon */
.zc-step:not(.is-vertical):not(.is-simple) .zc-step__head {
  flex-direction: row;
  align-items: center;
}

/* Vertical: head is column with icon+line below */
.zc-step.is-vertical {
  flex-direction: row;
  align-items: flex-start;
}
.zc-step.is-vertical .zc-step__head {
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  margin-right: 12px;
}

/* ---- Connector line ---- */
.zc-step__line {
  position: relative;
}

/* Horizontal line */
.zc-step:not(.is-vertical):not(.is-simple) .zc-step__line {
  flex: 1;
  height: 2px;
  background: var(--color-zc-border-base, #dcdfe6);
  margin: 0 8px;
}

/* Vertical line */
.zc-step.is-vertical .zc-step__line {
  width: 2px;
  flex: 1;
  min-height: 32px;
  background: var(--color-zc-border-base, #dcdfe6);
  margin: 8px 0;
}

.zc-step__line-inner {
  background: var(--zc-step-active-color);
  transition: background-color 0.3s ease;
}

/* Horizontal line-inner */
.zc-step:not(.is-vertical):not(.is-simple) .zc-step__line-inner {
  height: 100%;
}
.zc-step.is-vertical .zc-step__line-inner {
  width: 100%;
}

.zc-step__line-inner.is-finish {
  background: var(--color-zc-primary-500, #409eff);
}

/* ---- Icon ---- */
.zc-step__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-zc-bg-base, #fff);
  border: 2px solid var(--color-zc-border-base, #dcdfe6);
  color: var(--zc-step-wait-color);
  font-size: var(--text-zc-sm, 13px);
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.zc-step__icon.is-process {
  background: var(--color-zc-primary-500, #409eff);
  border-color: var(--color-zc-primary-500, #409eff);
  color: var(--color-zc-white, #fff);
}
.zc-step__icon.is-finish {
  background: var(--zc-step-active-color);
  border-color: var(--zc-step-active-color);
  color: var(--color-zc-white, #fff);
}
.zc-step__icon.is-error {
  background: var(--color-zc-danger-500, #f56c6c);
  border-color: var(--color-zc-danger-500, #f56c6c);
  color: var(--color-zc-white, #fff);
}

.zc-step__icon-svg {
  width: 14px;
  height: 14px;
}

.zc-step__icon-text {
  line-height: 1;
}

/* ---- Content ---- */
.zc-step__content {
  padding: 0 0 0 0;
}

.zc-step:not(.is-vertical):not(.is-simple) .zc-step__content {
  padding: 8px 0 0 0;
  text-align: center;
}

.zc-step.is-vertical .zc-step__content {
  padding: 0 0 24px 0;
}

/* ---- Title ---- */
.zc-step__title {
  font-size: var(--text-zc-base, 14px);
  font-weight: 600;
  color: var(--zc-step-text-color);
  line-height: 1.5;
}

.zc-step:not(.is-vertical):not(.is-simple) .zc-step__title {
  text-align: left;
}

.zc-step__title.is-wait {
  color: var(--zc-step-wait-color);
}
.zc-step__title.is-error {
  color: var(--zc-step-error-color);
}

/* ---- Description ---- */
.zc-step__description {
  margin-top: 4px;
  font-size: var(--text-zc-sm, 13px);
  color: var(--color-zc-text-secondary, #909399);
  line-height: 1.5;
}

.zc-step__description.is-error {
  color: var(--color-zc-danger-500, #f56c6c);
}

/* ---- Simple mode ---- */
.zc-step.is-simple {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.zc-step.is-simple .zc-step__line {
  display: none;
}
.zc-step.is-simple .zc-step__head {
  margin-bottom: 0;
}
.zc-step.is-simple .zc-step__icon {
  width: 20px;
  height: 20px;
  font-size: var(--text-zc-xs, 12px);
}
.zc-step.is-simple .zc-step__content {
  padding: 0;
}

/* ---- Last step: no line ---- */
.zc-step.is-last .zc-step__line {
  display: none;
}
</style>
