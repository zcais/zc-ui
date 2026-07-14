<script setup lang="ts">
import { computed, ref, shallowRef, watch, nextTick, useSlots } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useGlobalConfig } from '../config-provider/useGlobalConfig'

defineOptions({ name: 'ZcInput' })

export type InputType = 'text' | 'password' | 'number' | 'email' | 'tel' | 'url' | 'textarea'
export type InputSize = 'large' | 'medium' | 'small'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: InputType
    size?: InputSize
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    showPassword?: boolean
    maxlength?: number
    showWordLimit?: boolean
    autocomplete?: string
    name?: string
    rows?: number
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
    id?: string
    /** Accessible label for screen readers */
    ariaLabel?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    size: undefined,
    placeholder: '',
    disabled: false,
    readonly: false,
    clearable: false,
    showPassword: false,
    showWordLimit: false,
    autocomplete: 'off',
    rows: 3,
    resize: 'vertical',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'input', value: string): void
  (e: 'change', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
}>()

const ns = useNamespace('input')
const slots = useSlots()

// ---- ConfigProvider size integration ----
// Priority: explicit prop > ConfigProvider global size > default 'medium'
// InputSize is 'large'|'medium'|'small' (no 'mini'), so 'mini' degrades to 'small'
const { size: globalSize } = useGlobalConfig()
const effectiveSize = computed<InputSize>(() => {
  const resolved = props.size ?? globalSize.value ?? 'medium'
  return resolved === 'mini' ? 'small' : (resolved as InputSize)
})

const inputRef = shallowRef<HTMLInputElement | HTMLTextAreaElement>()
const hovering = ref(false)
const focused = ref(false)
const isPasswordVisible = ref(false)

const isTextarea = computed(() => props.type === 'textarea')

const nativeInputValue = computed(() => (props.modelValue == null ? '' : String(props.modelValue)))

watch(nativeInputValue, () => {
  setNativeInputValue()
})

function setNativeInputValue() {
  const el = inputRef.value
  if (!el) return
  if (el.value === nativeInputValue.value) return
  el.value = nativeInputValue.value
}

const effectiveType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type === 'textarea' ? 'text' : props.type
})

const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    nativeInputValue.value !== '' &&
    (focused.value || hovering.value)
)

const showPwdToggle = computed(
  () => props.showPassword && !props.disabled && !props.readonly && nativeInputValue.value !== ''
)

const textLength = computed(() =>
  typeof props.modelValue === 'number'
    ? String(props.modelValue).length
    : (props.modelValue || '').length
)

const isExceed = computed(() => !!props.maxlength && textLength.value > props.maxlength)

const containerClasses = computed(() => [
  ns.b(),
  ns.m(effectiveSize.value),
  ns.is('disabled', props.disabled),
  ns.is('focus', focused.value),
  ns.is('textarea', isTextarea.value),
  ns.is('exceed', isExceed.value),
])

// ---- Event handlers ----
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', target.value)
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('change', target.value)
}

function handleFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  focused.value = false
  emit('blur', event)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
  nextTick(() => setNativeInputValue())
}

function togglePassword() {
  isPasswordVisible.value = !isPasswordVisible.value
  nextTick(() => inputRef.value?.focus())
}

function focus() {
  inputRef.value?.focus()
}
function blur() {
  inputRef.value?.blur()
}

defineExpose({ focus, blur, inputRef })
</script>

<template>
  <!-- Textarea mode -->
  <div
    v-if="isTextarea"
    :class="containerClasses"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <textarea
      :id="id"
      ref="inputRef"
      :class="ns.e('inner')"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-label="ariaLabel || placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="rows"
      :autocomplete="autocomplete"
      :name="name"
      :style="{ resize }"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span v-if="showWordLimit && maxlength" :class="ns.e('count')">
      {{ textLength }}/{{ maxlength }}
    </span>
  </div>

  <!-- Input mode -->
  <div
    v-else
    :class="containerClasses"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!-- Prepend slot -->
    <div v-if="slots.prepend" :class="ns.e('prepend')">
      <slot name="prepend" />
    </div>

    <div :class="ns.e('wrapper')">
      <!-- Prefix slot -->
      <span v-if="slots.prefix" :class="ns.e('prefix')">
        <slot name="prefix" />
      </span>

      <input
        :id="id"
        ref="inputRef"
        :class="ns.e('inner')"
        :type="effectiveType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :name="name"
        :aria-label="ariaLabel"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <!-- Suffix area -->
      <span v-if="showPwdToggle || showClear || slots.suffix" :class="ns.e('suffix')">
        <slot name="suffix" />

        <!-- Clear button -->
        <span
          v-if="showClear"
          :class="ns.e('clear')"
          role="button"
          aria-label="清除"
          tabindex="0"
          @click="handleClear"
          @keydown.enter="handleClear"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 8l8 8M16 8l-8 8" stroke-linecap="round" />
          </svg>
        </span>

        <!-- Password toggle -->
        <span
          v-if="showPwdToggle"
          :class="ns.e('password')"
          role="button"
          :aria-label="isPasswordVisible ? '隐藏密码' : '显示密码'"
          tabindex="0"
          @click="togglePassword"
          @keydown.enter="togglePassword"
        >
          <svg
            v-if="!isPasswordVisible"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            />
            <path d="M1 1l22 22" stroke-linecap="round" />
          </svg>
        </span>
      </span>

      <!-- Word limit (inline, no suffix slot) -->
      <span v-if="showWordLimit && maxlength && !slots.suffix" :class="ns.e('count')">
        {{ textLength }}/{{ maxlength }}
      </span>
    </div>

    <!-- Append slot -->
    <div v-if="slots.append" :class="ns.e('append')">
      <slot name="append" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcInput styles
 * Component-level CSS variables defined on .zc-input root.
* All styles reference these variables instead of global tokens.
* ============================================================ */

.zc-input {
  /* Component-level CSS variables with global token defaults */
  --zc-input-bg-color: var(--color-zc-white, #fff);
  --zc-input-text-color: var(--color-zc-text-primary, #303133);
  --zc-input-placeholder-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-input-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-input-hover-border-color: var(--color-zc-primary-300, #a0cfff);
  --zc-input-focus-border-color: var(--color-zc-primary-500, #409eff);
  --zc-input-focus-shadow-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-input-disabled-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-input-disabled-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-input-disabled-text-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-input-icon-color: var(--color-zc-text-secondary, #909399);
  --zc-input-icon-hover-color: var(--color-zc-text-primary, #303133);
  --zc-input-exceed-color: var(--color-zc-danger-500, #f56c6c);
  --zc-input-count-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-input-prepend-append-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-input-prepend-append-text-color: var(--color-zc-text-regular, #606266);
  --zc-input-prepend-append-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-input-border-radius: var(--radius-zc-base, 4px);
  --zc-input-font-size: var(--text-zc-base, 14px);
  --zc-input-font-size-large: var(--text-zc-md, 16px);
  --zc-input-font-size-small: var(--text-zc-sm, 13px);
  --zc-input-font-size-xs: var(--text-zc-xs, 12px);
  --zc-input-transition-duration: var(--transition-duration-zc-base, 0.25s);
  --zc-input-transition-timing: var(--ease-zc-in-out, ease);
  --zc-input-height-large: 42px;
  --zc-input-height-medium: 36px;
  --zc-input-height-small: 28px;

  display: inline-flex;
  width: 100%;
  font-size: var(--zc-input-font-size);
  line-height: 1.5;
  vertical-align: middle;
}

/* ---- Textarea mode ---- */
.zc-input.is-textarea {
  position: relative;
}

.zc-input.is-textarea .zc-input__inner {
  display: block;
  resize: vertical;
  padding: 8px 12px;
  min-height: 60px;
  line-height: 1.5;
  border: 1px solid var(--zc-input-border-color);
  border-radius: var(--zc-input-border-radius);
  background: var(--zc-input-bg-color);
  outline: none;
  width: 100%;
  color: var(--zc-input-text-color);
  transition: border-color var(--zc-input-transition-duration) var(--zc-input-transition-timing);
}

.zc-input.is-textarea .zc-input__inner:focus {
  border-color: var(--zc-input-focus-border-color);
}

.zc-input.is-textarea .zc-input__inner::placeholder {
  color: var(--zc-input-placeholder-color);
}

.zc-input.is-textarea .zc-input__count {
  position: absolute;
  bottom: 6px;
  right: 10px;
  color: var(--zc-input-count-color);
  font-size: var(--zc-input-font-size-xs);
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--zc-input-border-radius);
  padding: 0 4px;
}

/* ---- Wrapper ---- */
.zc-input__wrapper {
  display: inline-flex;
  align-items: center;
  flex: 1;
  width: 100%;
  background: var(--zc-input-bg-color);
  border: 1px solid var(--zc-input-border-color);
  border-radius: var(--zc-input-border-radius);
  padding: 0 11px;
  transition: border-color var(--zc-input-transition-duration) var(--zc-input-transition-timing);
  box-sizing: border-box;
}

.zc-input__wrapper:hover {
  border-color: var(--zc-input-hover-border-color);
}

.zc-input.is-focus .zc-input__wrapper {
  border-color: var(--zc-input-focus-border-color);
  box-shadow: 0 0 0 2px var(--zc-input-focus-shadow-color);
}

/* ---- Inner input ---- */
.zc-input__inner {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--zc-input-text-color);
  font-size: inherit;
  line-height: inherit;
  padding: 0;
  height: var(--zc-input-height-medium);
  -webkit-appearance: none;
  box-sizing: border-box;
}

.zc-input__inner::placeholder {
  color: var(--zc-input-placeholder-color);
}

.zc-input__inner:disabled {
  cursor: not-allowed;
}

/* ---- Sizes ---- */
.zc-input--large .zc-input__wrapper {
  padding: 0 15px;
}
.zc-input--large .zc-input__inner {
  height: var(--zc-input-height-large);
  font-size: var(--zc-input-font-size-large);
}

.zc-input--medium .zc-input__inner {
  height: var(--zc-input-height-medium);
}

.zc-input--small .zc-input__wrapper {
  padding: 0 9px;
}
.zc-input--small .zc-input__inner {
  height: var(--zc-input-height-small);
  font-size: var(--zc-input-font-size-small);
}

/* ---- Disabled ---- */
.zc-input.is-disabled {
  --zc-input-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-input-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-input-hover-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-input-text-color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-input.is-disabled .zc-input__wrapper {
  background: var(--zc-input-disabled-bg-color);
  border-color: var(--zc-input-disabled-border-color);
  cursor: not-allowed;
}
.zc-input.is-disabled .zc-input__wrapper:hover {
  border-color: var(--zc-input-disabled-border-color);
}
.zc-input.is-disabled .zc-input__inner {
  color: var(--zc-input-disabled-text-color);
  cursor: not-allowed;
}
.zc-input.is-textarea.is-disabled .zc-input__inner {
  background: var(--zc-input-disabled-bg-color);
  border-color: var(--zc-input-disabled-border-color);
  color: var(--zc-input-disabled-text-color);
  cursor: not-allowed;
}

/* ---- Exceed ---- */
.zc-input.is-exceed {
  --zc-input-count-color: var(--color-zc-danger-500, #f56c6c);
  --zc-input-border-color: var(--color-zc-danger-500, #f56c6c);
}
.zc-input.is-exceed .zc-input__count {
  color: var(--zc-input-exceed-color);
}
.zc-input.is-exceed .zc-input__wrapper,
.zc-input.is-exceed .zc-input__inner {
  border-color: var(--zc-input-exceed-color);
}

/* ---- Prefix / Suffix ---- */
.zc-input__prefix,
.zc-input__suffix {
  display: inline-flex;
  align-items: center;
  color: var(--zc-input-icon-color);
  white-space: nowrap;
}

.zc-input__prefix {
  margin-right: 6px;
}

.zc-input__suffix {
  margin-left: 6px;
  gap: 4px;
}

.zc-input__clear,
.zc-input__password {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--zc-input-icon-color);
  transition: color var(--zc-input-transition-duration);
}

.zc-input__clear:hover,
.zc-input__password:hover {
  color: var(--zc-input-icon-hover-color);
}

/* ---- Prepend / Append ---- */
.zc-input__prepend,
.zc-input__append {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--zc-input-prepend-append-bg-color);
  color: var(--zc-input-prepend-append-text-color);
  border: 1px solid var(--zc-input-prepend-append-border-color);
  padding: 0 16px;
  white-space: nowrap;
}

.zc-input__prepend {
  border-right: none;
  border-radius: var(--zc-input-border-radius) 0 0 var(--zc-input-border-radius);
}

.zc-input__append {
  border-left: none;
  border-radius: 0 var(--zc-input-border-radius) var(--zc-input-border-radius) 0;
}

.zc-input__prepend + .zc-input__wrapper {
  border-radius: 0;
}

/* ---- Word count ---- */
.zc-input__count {
  display: inline-flex;
  align-items: center;
  color: var(--zc-input-count-color);
  font-size: var(--zc-input-font-size-xs);
  white-space: nowrap;
}
</style>
