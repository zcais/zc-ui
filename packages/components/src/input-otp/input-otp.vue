<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcInputOTP' })

export type InputOTPSize = 'large' | 'medium' | 'small'

const props = withDefaults(
  defineProps<{
    /** v-model value */
    modelValue?: string
    /** Number of input boxes */
    length?: number
    /** Input box size */
    size?: InputOTPSize
    /** Mask input with dots (password mode) */
    masked?: boolean
    /** Placeholder for each box */
    placeholder?: string
    /** Disabled state */
    disabled?: boolean
    /** Readonly state */
    readonly?: boolean
    /** Only allow numeric input */
    numericOnly?: boolean
    /** Autofocus on mount */
    autofocus?: boolean
    /** Separator character rendered between boxes (e.g. '-') */
    separator?: string
  }>(),
  {
    modelValue: '',
    length: 6,
    size: 'medium',
    masked: false,
    placeholder: '',
    disabled: false,
    readonly: false,
    numericOnly: false,
    autofocus: false,
    separator: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'complete', value: string): void
}>()

const ns = useNamespace('input-otp')

// Individual box values
const values = ref<string[]>(Array(props.length).fill(''))
// Track active box index
const activeIndex = ref(-1)
// Refs for each input element
const inputRefs = ref<HTMLInputElement[]>([])

// Sync external modelValue to internal values
watch(
  () => props.modelValue,
  (val) => {
    const str = val || ''
    for (let i = 0; i < props.length; i++) {
      values.value[i] = str[i] || ''
    }
  },
  { immediate: true }
)

// Emit when values change
function emitChange() {
  const result = values.value.join('')
  emit('update:modelValue', result)
  emit('change', result)
  if (result.length === props.length && !values.value.includes('')) {
    emit('complete', result)
  }
}

function onInput(e: Event, index: number) {
  const input = e.target as HTMLInputElement
  let val = input.value

  // Filter numeric only
  if (props.numericOnly) {
    val = val.replace(/[^0-9]/g, '')
  }

  // Handle paste-like multi-character input
  if (val.length > 1) {
    const chars = val.split('')
    let writeIndex = index
    for (const char of chars) {
      if (writeIndex >= props.length) break
      const filtered = props.numericOnly ? char.replace(/[^0-9]/g, '') : char
      if (filtered) {
        values.value[writeIndex] = filtered
        writeIndex++
      }
    }
    // Focus next empty box or last filled
    const nextEmpty = values.value.findIndex((v) => !v)
    focusBox(nextEmpty >= 0 ? Math.min(nextEmpty, props.length - 1) : props.length - 1)
    emitChange()
    return
  }

  // Single character input
  if (val) {
    values.value[index] = val
    // Auto-focus next box
    if (index < props.length - 1) {
      focusBox(index + 1)
    }
  } else {
    values.value[index] = ''
  }
  emitChange()
}

function onKeydown(e: KeyboardEvent, index: number) {
  if (props.disabled || props.readonly) return

  switch (e.key) {
    case 'Backspace': {
      e.preventDefault()
      if (values.value[index]) {
        // Clear current box
        values.value[index] = ''
        emitChange()
      } else if (index > 0) {
        // Go back to previous box and clear it
        values.value[index - 1] = ''
        focusBox(index - 1)
        emitChange()
      }
      break
    }
    case 'ArrowLeft': {
      e.preventDefault()
      if (index > 0) focusBox(index - 1)
      break
    }
    case 'ArrowRight': {
      e.preventDefault()
      if (index < props.length - 1) focusBox(index + 1)
      break
    }
    case 'Enter': {
      // Allow Enter to trigger complete if filled
      const result = values.value.join('')
      if (result.length === props.length) {
        emit('complete', result)
      }
      break
    }
  }
}

function onPaste(e: ClipboardEvent, index: number) {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') || ''
  let writeIndex = index

  for (const char of pasted) {
    if (writeIndex >= props.length) break
    const filtered = props.numericOnly ? char.replace(/[^0-9]/g, '') : char
    if (filtered) {
      values.value[writeIndex] = filtered
      writeIndex++
    }
  }

  // Focus appropriate box
  const nextEmpty = values.value.findIndex((v) => !v)
  focusBox(nextEmpty >= 0 ? Math.min(nextEmpty, props.length - 1) : props.length - 1)
  emitChange()
}

function onFocus(index: number) {
  activeIndex.value = index
}

function onBlur() {
  activeIndex.value = -1
}

function focusBox(index: number) {
  nextTick(() => {
    if (inputRefs.value[index]) {
      inputRefs.value[index].focus()
      inputRefs.value[index].select()
    }
  })
}

function handleClick(index: number) {
  focusBox(index)
}

// Autofocus on mount
nextTick(() => {
  if (props.autofocus && !props.disabled) {
    focusBox(0)
  }
})

const containerClasses = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
])

function boxClasses(index: number) {
  return [
    ns.e('box'),
    ns.is('active', activeIndex.value === index),
    ns.is('filled', !!values.value[index]),
  ]
}

/** Public API: focus the first empty or first box */
function focus() {
  const firstEmpty = values.value.findIndex((v) => !v)
  focusBox(firstEmpty >= 0 ? firstEmpty : 0)
}

/** Public API: clear all boxes */
function clear() {
  values.value = Array(props.length).fill('')
  emitChange()
  focusBox(0)
}

defineExpose({ focus, clear })
</script>

<template>
  <div :class="containerClasses" role="group" aria-label="OTP input">
    <template v-for="(_, index) in length" :key="index">
      <div :class="boxClasses(index)" @click="handleClick(index)">
        <input
          :ref="
            (el) => {
              if (el) inputRefs[index] = el as HTMLInputElement
            }
          "
          :type="masked ? 'password' : 'text'"
          :value="values[index]"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="1"
          :inputmode="numericOnly ? 'numeric' : 'text'"
          :autocomplete="index === 0 ? 'one-time-code' : 'off'"
          :class="ns.e('input')"
          @input="onInput($event, index)"
          @keydown="onKeydown($event, index)"
          @paste="onPaste($event, index)"
          @focus="onFocus(index)"
          @blur="onBlur"
        />
        <span v-if="masked && values[index]" :class="ns.e('dot')" />
      </div>
      <span v-if="separator && index < length - 1" :class="ns.e('separator')">{{ separator }}</span>
    </template>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcInputOTP styles
 * BEM naming: zc-input-otp / zc-input-otp__box / zc-input-otp__input
 * ============================================================ */

.zc-input-otp {
  --zc-otp-box-size: 40px;
  --zc-otp-box-radius: 6px;
  --zc-otp-box-border: 1px solid var(--color-zc-border-base, #dcdfe6);
  --zc-otp-box-border-active: 1px solid var(--color-zc-primary, #409eff);
  --zc-otp-box-bg: var(--color-zc-bg-base, #fff);
  --zc-otp-font-size: var(--text-zc-md, 16px);
  --zc-otp-text-color: var(--color-zc-text-primary, #303133);
  --zc-otp-gap: 8px;
  --zc-otp-placeholder-color: var(--color-zc-text-placeholder, #a8abb2);
  display: inline-flex;
  align-items: center;
  gap: var(--zc-otp-gap);
}

/* ---- Size variants ---- */
.zc-input-otp--large {
  --zc-otp-box-size: 48px;
  --zc-otp-font-size: 18px;
  --zc-otp-gap: 10px;
}

.zc-input-otp--small {
  --zc-otp-box-size: 32px;
  --zc-otp-font-size: 14px;
  --zc-otp-gap: 6px;
}

/* ---- Box ---- */
.zc-input-otp__box {
  position: relative;
  width: var(--zc-otp-box-size);
  height: var(--zc-otp-box-size);
  border-radius: var(--zc-otp-box-radius);
  border: var(--zc-otp-box-border);
  background-color: var(--zc-otp-box-bg);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zc-input-otp__box:hover {
  border-color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-input-otp__box.is-active {
  border: var(--zc-otp-box-border-active);
  box-shadow: 0 0 0 2px var(--color-zc-primary-light-8, rgba(64, 158, 255, 0.12));
}

.zc-input-otp__box.is-filled {
  border-color: var(--color-zc-primary, #409eff);
}

/* ---- Input ---- */
.zc-input-otp__input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  font-size: var(--zc-otp-font-size);
  color: var(--zc-otp-text-color);
  padding: 0;
  cursor: inherit;
}

.zc-input-otp__input::placeholder {
  color: var(--zc-otp-placeholder-color);
}

/* Hide actual text in masked mode, show dot instead */
.zc-input-otp__input[type='password'] {
  color: transparent !important;
}

/* ---- Masked dot ---- */
.zc-input-otp__dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--zc-otp-text-color);
  pointer-events: none;
}

/* ---- Separator ---- */
.zc-input-otp__separator {
  color: var(--color-zc-text-secondary, #909399);
  font-size: var(--zc-otp-font-size);
  user-select: none;
}

/* ---- Disabled ---- */
.zc-input-otp.is-disabled .zc-input-otp__box {
  background-color: var(--color-zc-fill-light, #f5f7fa);
  border-color: var(--color-zc-border-light, #e4e7ed);
  cursor: not-allowed;
}

.zc-input-otp.is-disabled .zc-input-otp__input {
  cursor: not-allowed;
  color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-input-otp.is-disabled .zc-input-otp__box:hover {
  border-color: var(--color-zc-border-light, #e4e7ed);
}

/* ---- Dark mode ---- */
.dark .zc-input-otp {
  --zc-otp-box-bg: var(--color-zc-bg-base, #1a1a1a);
  --zc-otp-box-border: 1px solid var(--color-zc-border-base, #414243);
  --zc-otp-text-color: var(--color-zc-text-primary, #e5eaf3);
  --zc-otp-placeholder-color: var(--color-zc-text-placeholder, #6b6e72);
}
</style>
