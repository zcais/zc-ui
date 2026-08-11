<script setup lang="ts">
import { computed, ref, shallowRef, watch, nextTick } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import type { InputNumberSize, ControlsPosition } from './types'

defineOptions({ name: 'ZcInputNumber' })

const props = withDefaults(
  defineProps<{
    modelValue?: number | undefined
    min?: number
    max?: number
    step?: number
    stepStrictly?: boolean
    precision?: number
    disabled?: boolean
    controls?: boolean
    controlsPosition?: ControlsPosition
    size?: InputNumberSize
    placeholder?: string
    readonly?: boolean
  }>(),
  {
    modelValue: undefined,
    min: -Infinity,
    max: Infinity,
    step: 1,
    stepStrictly: false,
    precision: undefined,
    disabled: false,
    controls: true,
    controlsPosition: '',
    size: 'medium',
    placeholder: '',
    readonly: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | undefined): void
  (e: 'change', currentValue: number | undefined, oldValue: number | undefined): void
  (e: 'input', value: number | undefined): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}>()

const ns = useNamespace('input-number')
const inputRef = shallowRef<HTMLInputElement>()

const userInput = ref<string | null>(null)
const oldValue: { value: number | undefined } = { value: undefined }

// ---- Computed ----
const displayValue = computed(() => {
  if (userInput.value !== null) return userInput.value
  if (props.modelValue === undefined || props.modelValue === null) return ''
  return formatPrecision(props.modelValue)
})

const minDisabled = computed(() => {
  if (props.disabled) return true
  const val = getCurrentValue()
  return val !== undefined && val - props.step < props.min
})

const maxDisabled = computed(() => {
  if (props.disabled) return true
  const val = getCurrentValue()
  return val !== undefined && val + props.step > props.max
})

const containerClasses = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('without-controls', !props.controls),
  ns.is('controls-right', props.controlsPosition === 'right'),
])

// ---- Helpers ----
function getCurrentValue(): number | undefined {
  return props.modelValue ?? undefined
}

function formatPrecision(value: number): string {
  if (props.precision !== undefined) {
    return value.toFixed(props.precision)
  }
  return String(value)
}

function toPrecision(value: number): number {
  if (props.precision !== undefined) {
    return Number(value.toFixed(props.precision))
  }
  return value
}

function clampValue(value: number): number {
  return Math.min(Math.max(value, props.min), props.max)
}

function setValue(val: number | undefined) {
  oldValue.value = props.modelValue
  emit('update:modelValue', val)
  emit('input', val)
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  userInput.value = target.value
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const raw = target.value.trim()

  if (raw === '') {
    setValue(undefined)
    userInput.value = null
    emit('change', undefined, oldValue.value)
    return
  }

  let num = Number(raw)
  if (isNaN(num)) {
    num = props.modelValue ?? props.min
  }

  if (props.stepStrictly) {
    num = props.min + Math.round((num - props.min) / props.step) * props.step
  }

  num = clampValue(toPrecision(num))
  userInput.value = null
  setValue(num)
  emit('change', num, oldValue.value)
}

function handleStep(step: number) {
  if (props.disabled || props.readonly) return
  const current = getCurrentValue() ?? props.min
  let next = toPrecision(current + step)
  next = clampValue(next)

  if (next === current) return

  userInput.value = null
  setValue(next)
  emit('change', next, oldValue.value)
}

function increase() {
  if (maxDisabled.value) return
  handleStep(props.step)
}

function decrease() {
  if (minDisabled.value) return
  handleStep(-props.step)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleKeyDown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      increase()
      break
    case 'ArrowDown':
      event.preventDefault()
      decrease()
      break
  }
}

function focus() {
  inputRef.value?.focus()
}
function blur() {
  inputRef.value?.blur()
}

watch(
  () => props.modelValue,
  (_val) => {
    userInput.value = null
  },
  { immediate: true }
)

// Sync native input when displayValue changes
watch(displayValue, () => {
  nextTick(() => {
    if (inputRef.value && inputRef.value.value !== displayValue.value) {
      inputRef.value.value = displayValue.value
    }
  })
})

defineExpose({ focus, blur, increase, decrease })
</script>

<template>
  <div
    :class="containerClasses"
    role="spinbutton"
    :aria-valuenow="modelValue ?? undefined"
    :aria-valuemin="min === -Infinity ? undefined : min"
    :aria-valuemax="max === Infinity ? undefined : max"
    :aria-disabled="disabled"
  >
    <!-- Decrease button -->
    <span
      v-if="controls"
      :class="[ns.e('decrease'), ns.is('disabled', minDisabled)]"
      role="button"
      :aria-disabled="minDisabled"
      @click="decrease"
    >
      <svg
        viewBox="0 0 24 24"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M5 12h14" stroke-linecap="round" />
      </svg>
    </span>

    <!-- Input wrapper -->
    <div :class="ns.e('wrapper')">
      <input
        ref="inputRef"
        :class="ns.e('inner')"
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeyDown"
      />
    </div>

    <!-- Increase button -->
    <span
      v-if="controls"
      :class="[ns.e('increase'), ns.is('disabled', maxDisabled)]"
      role="button"
      :aria-disabled="maxDisabled"
      @click="increase"
    >
      <svg
        viewBox="0 0 24 24"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M12 5v14M5 12h14" stroke-linecap="round" />
      </svg>
    </span>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcInputNumber styles
 * ============================================================ */

.zc-input-number {
  /* Component-level CSS variables with global token defaults */
  --zc-input-number-bg-color: var(--color-zc-white, #fff);
  --zc-input-number-text-color: var(--color-zc-text-primary, #303133);
  --zc-input-number-placeholder-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-input-number-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-input-number-hover-border-color: var(--color-zc-primary-300, #a0cfff);
  --zc-input-number-focus-border-color: var(--color-zc-primary-500, #409eff);
  --zc-input-number-focus-shadow-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-input-number-disabled-text-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-input-number-button-hover-bg-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-input-number-border-radius: var(--radius-zc-base, 4px);
  --zc-input-number-fill-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-input-number-transition-duration: var(--transition-duration-zc-base, 0.25s);

  display: inline-flex;
  align-items: stretch;
  position: relative;
  width: 100%;
  height: 36px;
  font-size: var(--text-zc-base, 14px);
  line-height: 1;
}

/* ---- Inline controls (default) ---- */
.zc-input-number__decrease,
.zc-input-number__increase {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 32px;
  padding: 0 8px;
  background: var(--color-zc-fill-light, #f5f7fa);
  color: var(--color-zc-text-primary, #303133);
  cursor: pointer;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  box-sizing: border-box;
  user-select: none;
  transition: all var(--transition-duration-zc-base, 0.25s);
}

.zc-input-number__decrease {
  border-right: none;
  border-radius: var(--zc-input-number-border-radius) 0 0 var(--zc-input-number-border-radius);
}

.zc-input-number__increase {
  border-left: none;
  border-radius: 0 var(--zc-input-number-border-radius) var(--zc-input-number-border-radius) 0;
}

.zc-input-number__decrease:hover:not(.is-disabled),
.zc-input-number__increase:hover:not(.is-disabled) {
  color: var(--zc-input-number-focus-border-color);
}

.zc-input-number__decrease.is-disabled,
.zc-input-number__increase.is-disabled {
  color: var(--zc-input-number-disabled-text-color);
  cursor: not-allowed;
}

/* ---- Wrapper ---- */
.zc-input-number__wrapper {
  display: inline-flex;
  align-items: stretch;
  flex: 1;
  width: 100%;
  background: var(--zc-input-number-bg-color);
}

/* ---- Inner input ---- */
.zc-input-number__inner {
  flex: 1;
  width: 100%;
  border: 1px solid var(--zc-input-number-border-color);
  border-left: none;
  border-right: none;
  outline: none;
  background: transparent;
  color: var(--zc-input-number-text-color);
  font-size: inherit;
  text-align: center;
  height: 36px;
  padding: 0 8px;
  box-sizing: border-box;
  -webkit-appearance: none;
  transition: border-color var(--transition-duration-zc-base, 0.25s);
}

.zc-input-number__inner:focus {
  border-color: var(--zc-input-number-focus-border-color);
  box-shadow: 0 0 0 2px var(--zc-input-number-button-hover-bg-color);
}

.zc-input-number__inner::placeholder {
  color: var(--zc-input-number-placeholder-color);
}

.zc-input-number__inner:disabled {
  cursor: not-allowed;
}

/* ---- Without controls ---- */
.zc-input-number.is-without-controls .zc-input-number__inner {
  border: 1px solid var(--zc-input-number-border-color);
  border-radius: var(--zc-input-number-border-radius);
}

/* ---- Controls right position ---- */
.zc-input-number.is-controls-right {
  flex-direction: row;
}

.zc-input-number.is-controls-right .zc-input-number__decrease {
  order: 3;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-top: none;
  border-radius: 0 0 var(--radius-zc-base, 4px) 0;
  min-width: 36px;
  height: 50%;
  position: absolute;
  right: 0;
  bottom: 0;
}

.zc-input-number.is-controls-right .zc-input-number__increase {
  order: 2;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: 0 var(--radius-zc-base, 4px) 0 0;
  min-width: 36px;
  height: 50%;
  position: absolute;
  right: 0;
  top: 0;
}

.zc-input-number.is-controls-right .zc-input-number__inner {
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  padding-right: 42px;
  text-align: left;
}

/* ---- Sizes ---- */
.zc-input-number--large {
  height: 42px;
}

.zc-input-number--large .zc-input-number__inner {
  height: 42px;
  font-size: var(--text-zc-md, 16px);
}

.zc-input-number--small {
  height: 28px;
}

.zc-input-number--small .zc-input-number__inner {
  height: 28px;
  font-size: var(--text-zc-sm, 13px);
}

.zc-input-number--small .zc-input-number__decrease,
.zc-input-number--small .zc-input-number__increase {
  min-width: 28px;
  padding: 0 6px;
}

/* ---- Disabled ---- */
.zc-input-number.is-disabled .zc-input-number__inner {
  background: var(--color-zc-fill-light, #f5f7fa);
  border-color: var(--color-zc-border-light, #e4e7ed);
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

.zc-input-number.is-disabled .zc-input-number__decrease,
.zc-input-number.is-disabled .zc-input-number__increase {
  border-color: var(--color-zc-border-light, #e4e7ed);
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}
</style>
