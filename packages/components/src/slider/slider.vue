<script setup lang="ts">
import { computed, ref, shallowRef, watch, onBeforeUnmount } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import type { SliderMark, SliderValue } from './types'

defineOptions({ name: 'ZcSlider' })

const props = withDefaults(
  defineProps<{
    modelValue?: SliderValue
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    vertical?: boolean
    showTooltip?: boolean
    range?: boolean
    marks?: SliderMark[]
    size?: 'large' | 'medium' | 'small'
    tooltipClass?: string
    height?: string
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    vertical: false,
    showTooltip: true,
    range: false,
    marks: () => [],
    size: 'medium',
    tooltipClass: '',
    height: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: SliderValue): void
  (e: 'change', value: SliderValue, oldValue: SliderValue): void
  (e: 'input', value: SliderValue): void
}>()

const ns = useNamespace('slider')
const runwayRef = shallowRef<HTMLElement>()

const dragging = ref(false)
const showThumbTooltip = ref(false)
const draggingIndex = ref(0) // 0 = first thumb, 1 = second thumb (range)

// ---- Internal values ----
const firstValue = ref<number>(0)
const secondValue = ref<number>(0)

function syncFromModel() {
  if (props.range) {
    const val = props.modelValue as [number, number]
    firstValue.value = Array.isArray(val) ? val[0] : props.min
    secondValue.value = Array.isArray(val) ? val[1] : props.min
  } else {
    firstValue.value = typeof props.modelValue === 'number' ? props.modelValue : props.min
    secondValue.value = 0
  }
}

syncFromModel()

// ---- Computed ----
const rangeValue = computed<[number, number]>(() => {
  const min = Math.min(firstValue.value, secondValue.value)
  const max = Math.max(firstValue.value, secondValue.value)
  return [min, max]
})

const rangeSpan = computed(() => props.max - props.min || 1)

const percentOfMin = computed(() => {
  return ((rangeValue.value[0] - props.min) / rangeSpan.value) * 100
})

const percentOfMax = computed(() => {
  return ((rangeValue.value[1] - props.min) / rangeSpan.value) * 100
})

const singlePercent = computed(() => {
  return ((firstValue.value - props.min) / rangeSpan.value) * 100
})

const classes = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('vertical', props.vertical),
  ns.is('dragging', dragging.value),
  ns.is('range', props.range),
])

// ---- Helpers ----
function getPercent(value: number): number {
  return ((value - props.min) / (props.max - props.min)) * 100
}

function clampValue(val: number): number {
  return Math.min(Math.max(val, props.min), props.max)
}

function snapToStep(val: number): number {
  const steps = Math.round((val - props.min) / props.step)
  return props.min + steps * props.step
}

function getValueFromPosition(clientX: number, clientY: number): number {
  const el = runwayRef.value
  if (!el) return props.min

  const rect = el.getBoundingClientRect()
  let percent: number

  if (props.vertical) {
    percent = 1 - (clientY - rect.top) / rect.height
  } else {
    percent = (clientX - rect.left) / rect.width
  }

  const raw = props.min + percent * rangeSpan.value
  return clampValue(snapToStep(raw))
}

function emitChange(oldVal: SliderValue) {
  const newVal = props.range ? ([...rangeValue.value] as [number, number]) : firstValue.value
  emit('update:modelValue', newVal)
  emit('input', newVal)
  emit('change', newVal, oldVal)
}

// ---- Drag handling ----
function startDrag(index: number, event: MouseEvent) {
  if (props.disabled) return
  event.preventDefault()
  event.stopPropagation()
  draggingIndex.value = index
  dragging.value = true
  showThumbTooltip.value = true

  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragMove(event: MouseEvent) {
  if (!dragging.value) return
  const value = getValueFromPosition(event.clientX, event.clientY)

  if (props.range) {
    if (draggingIndex.value === 0) {
      firstValue.value = value
    } else {
      secondValue.value = value
    }
  } else {
    firstValue.value = value
  }

  const newVal = props.range ? ([...rangeValue.value] as [number, number]) : firstValue.value
  emit('update:modelValue', newVal)
  emit('input', newVal)
}

function onDragEnd() {
  if (!dragging.value) return
  dragging.value = false
  showThumbTooltip.value = false

  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)

  const oldVal = props.modelValue
  emitChange(oldVal)
}

function handleTrackClick(event: MouseEvent) {
  if (props.disabled || dragging.value) return
  const value = getValueFromPosition(event.clientX, event.clientY)

  const oldVal = props.modelValue

  if (props.range) {
    // Determine which thumb is closer
    const dist1 = Math.abs(value - rangeValue.value[0])
    const dist2 = Math.abs(value - rangeValue.value[1])
    if (dist1 <= dist2) {
      firstValue.value = value
    } else {
      secondValue.value = value
    }
  } else {
    firstValue.value = value
  }

  emitChange(oldVal)
}

function handleKeyDown(event: KeyboardEvent) {
  if (props.disabled) return
  const isDecrement = event.key === 'ArrowLeft' || event.key === 'ArrowDown'
  const isIncrement = event.key === 'ArrowRight' || event.key === 'ArrowUp'
  const isHome = event.key === 'Home'
  const isEnd = event.key === 'End'

  if (!isDecrement && !isIncrement && !isHome && !isEnd) return
  event.preventDefault()

  const oldVal = props.modelValue

  if (isHome) {
    if (props.range) {
      firstValue.value = props.min
    } else {
      firstValue.value = props.min
    }
    emitChange(oldVal)
    return
  }

  if (isEnd) {
    if (props.range) {
      secondValue.value = props.max
    } else {
      firstValue.value = props.max
    }
    emitChange(oldVal)
    return
  }

  const delta = isIncrement ? props.step : -props.step

  if (props.range) {
    const [lo, hi] = rangeValue.value
    if (lo === hi) {
      firstValue.value = clampValue(firstValue.value + delta)
    } else {
      firstValue.value = clampValue(firstValue.value + delta)
      secondValue.value = clampValue(secondValue.value + delta)
    }
  } else {
    firstValue.value = clampValue(firstValue.value + delta)
  }

  emitChange(oldVal)
}

// ---- Watch modelValue changes ----
watch(
  () => props.modelValue,
  () => {
    syncFromModel()
  }
)

// Marks positioning
function markStyle(mark: SliderMark): Record<string, string> {
  const percent = getPercent(mark.value)
  const style: Record<string, string> = props.vertical
    ? { bottom: `${percent}%` }
    : { left: `${percent}%` }
  return { ...style, ...(mark.style || {}) }
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
})
</script>

<template>
  <div :class="classes" @keydown="handleKeyDown">
    <div
      ref="runwayRef"
      :class="ns.e('runway')"
      :style="vertical ? { height: height || '200px' } : undefined"
      @click="handleTrackClick"
    >
      <!-- Active bar -->
      <div
        :class="ns.e('bar')"
        :style="
          range
            ? vertical
              ? { bottom: percentOfMin + '%', height: percentOfMax - percentOfMin + '%' }
              : { left: percentOfMin + '%', width: percentOfMax - percentOfMin + '%' }
            : vertical
              ? { height: singlePercent + '%' }
              : { width: singlePercent + '%' }
        "
      ></div>

      <!-- Marks -->
      <template v-for="(mark, i) in marks" :key="i">
        <div :class="ns.e('mark')" :style="markStyle(mark)">
          <span :class="ns.e('mark-label')">{{ mark.label }}</span>
        </div>
      </template>

      <!-- Thumb(s) -->
      <template v-if="range">
        <!-- First thumb -->
        <div
          :class="[ns.e('thumb-wrapper'), ns.is('dragging', dragging && draggingIndex === 0)]"
          :style="vertical ? { bottom: percentOfMin + '%' } : { left: percentOfMin + '%' }"
          role="slider"
          :aria-valuenow="rangeValue[0]"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-orientation="vertical ? 'vertical' : 'horizontal'"
          :aria-disabled="disabled"
          tabindex="0"
          @mousedown="startDrag(0, $event)"
          @mouseenter="showThumbTooltip = true"
          @mouseleave="!dragging && (showThumbTooltip = false)"
        >
          <div :class="ns.e('thumb')">
            <div v-if="showTooltip && showThumbTooltip" :class="ns.e('tooltip')">
              {{ rangeValue[0] }}
            </div>
          </div>
        </div>
        <!-- Second thumb -->
        <div
          :class="[ns.e('thumb-wrapper'), ns.is('dragging', dragging && draggingIndex === 1)]"
          :style="vertical ? { bottom: percentOfMax + '%' } : { left: percentOfMax + '%' }"
          role="slider"
          :aria-valuenow="rangeValue[1]"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-orientation="vertical ? 'vertical' : 'horizontal'"
          :aria-disabled="disabled"
          tabindex="0"
          @mousedown="startDrag(1, $event)"
          @mouseenter="showThumbTooltip = true"
          @mouseleave="!dragging && (showThumbTooltip = false)"
        >
          <div :class="ns.e('thumb')">
            <div v-if="showTooltip && showThumbTooltip" :class="ns.e('tooltip')">
              {{ rangeValue[1] }}
            </div>
          </div>
        </div>
      </template>

      <div
        v-else
        :class="[ns.e('thumb-wrapper'), ns.is('dragging', dragging)]"
        :style="vertical ? { bottom: singlePercent + '%' } : { left: singlePercent + '%' }"
        role="slider"
        :aria-valuenow="firstValue"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-orientation="vertical ? 'vertical' : 'horizontal'"
        :aria-disabled="disabled"
        tabindex="0"
        @mousedown="startDrag(0, $event)"
        @mouseenter="showThumbTooltip = true"
        @mouseleave="!dragging && (showThumbTooltip = false)"
      >
        <div :class="ns.e('thumb')">
          <div v-if="showTooltip && showThumbTooltip" :class="ns.e('tooltip')">
            {{ firstValue }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcSlider styles
 * ============================================================ */

.zc-slider {
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 0 10px;
  box-sizing: border-box;
}

.zc-slider__runway {
  position: relative;
  width: 100%;
  height: var(--zc-slider-height);
  background: var(--zc-slider-track-bg-color);
  border-radius: 3px;
  cursor: pointer;
}

.zc-slider__bar {
  position: absolute;
  height: var(--zc-slider-height);
  background: var(--zc-slider-bar-bg-color);
  border-radius: 3px;
  transition:
    width var(--transition-duration-zc-base, 0.25s),
    left var(--transition-duration-zc-base, 0.25s);
}

/* Thumb */
.zc-slider__thumb-wrapper {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--zc-slider-button-size);
  height: var(--zc-slider-button-size);
  z-index: var(--z-zc-base, 2);
}

.zc-slider__thumb-wrapper.is-dragging {
  z-index: var(--z-zc-base, 3);
}

.zc-slider__thumb {
  width: var(--zc-slider-button-size);
  height: var(--zc-slider-button-size);
  border-radius: var(--zc-slider-button-border-radius);
  background: var(--zc-slider-button-bg-color);
  border: 2px solid var(--zc-slider-button-border-color);
  box-sizing: border-box;
  cursor: grab;
  transition:
    transform var(--transition-duration-zc-fast, 0.15s),
    border-color var(--transition-duration-zc-fast, 0.15s);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.zc-slider__thumb-wrapper:hover .zc-slider__thumb {
  transform: scale(1.2);
  border-color: var(--color-zc-primary-300, #a0cfff);
}

.zc-slider__thumb-wrapper.is-dragging .zc-slider__thumb {
  cursor: grabbing;
  transform: scale(1.3);
  border-color: var(--color-zc-primary-500, #409eff);
  box-shadow: 0 0 0 6px var(--color-zc-primary-50, #ecf5ff);
}

/* Tooltip */
.zc-slider__tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
  padding: 4px 8px;
  background: var(--color-zc-text-primary, #303133);
  color: var(--color-zc-white, #fff);
  font-size: var(--text-zc-xs, 12px);
  border-radius: var(--radius-zc-base, 4px);
  white-space: nowrap;
  pointer-events: none;
  z-index: var(--z-zc-dropdown, 10);
}

.zc-slider__tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--color-zc-text-primary, #303133);
}

/* Marks */
.zc-slider__mark {
  position: absolute;
  transform: translateX(-50%);
  top: 100%;
  margin-top: 4px;
}

.zc-slider__mark-label {
  display: block;
  font-size: var(--text-zc-xs, 12px);
  color: var(--color-zc-text-secondary, #909399);
  line-height: 1.4;
  white-space: nowrap;
}

/* Vertical */
.zc-slider.is-vertical {
  width: auto;
  height: auto;
  padding: 10px 0;
  flex-direction: column;
}

.zc-slider.is-vertical .zc-slider__runway {
  width: 6px;
  height: 100%;
  min-height: 100px;
}

.zc-slider.is-vertical .zc-slider__bar {
  width: 6px;
  height: auto;
  bottom: 0;
}

.zc-slider.is-vertical .zc-slider__thumb-wrapper {
  top: auto;
  left: 50%;
  transform: translate(-50%, 50%);
}

.zc-slider.is-vertical .zc-slider__tooltip {
  bottom: auto;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  margin-left: 10px;
  margin-bottom: 0;
}

.zc-slider.is-vertical .zc-slider__tooltip::after {
  top: 50%;
  left: auto;
  right: 100%;
  transform: translateY(-50%);
  border-top-color: transparent;
  border-right-color: var(--color-zc-text-primary, #303133);
}

.zc-slider.is-vertical .zc-slider__mark {
  top: auto;
  left: 100%;
  transform: translateY(50%);
  margin-top: 0;
  margin-left: 8px;
}

/* Disabled */
.zc-slider.is-disabled .zc-slider__runway {
  cursor: not-allowed;
  opacity: 0.5;
}

.zc-slider.is-disabled .zc-slider__thumb {
  cursor: not-allowed;
  border-color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-slider.is-disabled .zc-slider__bar {
  background: var(--color-zc-text-placeholder, #a8abb2);
}
</style>
