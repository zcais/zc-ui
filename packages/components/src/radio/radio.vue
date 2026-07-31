<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useGlobalConfig } from '../config-provider/useGlobalConfig'
import { radioGroupKey, type RadioGroupContext } from './radio-group.vue'

defineOptions({ name: 'ZcRadio' })

export type RadioSize = 'large' | 'medium' | 'small'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean
    label?: string | number | boolean
    disabled?: boolean
    name?: string
    /** Accessible label for screen readers (falls back to label if string) */
    ariaLabel?: string
    /** Show border around the radio */
    border?: boolean
    /** Radio size (only effective with border) */
    size?: RadioSize
  }>(),
  {
    modelValue: '',
    disabled: false,
    border: false,
    size: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void
  (e: 'change', value: string | number | boolean): void
}>()

const ns = useNamespace('radio')

// ---- Radio Group Injection ----
const radioGroup = inject<RadioGroupContext | null>(radioGroupKey, null)

// Determine if this radio is checked
const isChecked = computed(() => {
  if (radioGroup) {
    return radioGroup.modelValue.value === props.label
  }
  return props.modelValue === props.label
})

// Determine if this radio is disabled
const isDisabled = computed(() => {
  return radioGroup ? radioGroup.disabled.value || props.disabled : props.disabled
})

// The name attribute (from group context or own prop)
const inputName = computed(() => {
  return radioGroup?.name?.value || props.name || undefined
})

// ---- Focus tracking for is-focused class ----
const isFocused = ref(false)

const { size: globalSize } = useGlobalConfig()
const effectiveSize = computed<RadioSize | undefined>(() => {
  if (radioGroup?.size?.value) {
    return radioGroup.size.value as RadioSize
  }
  return props.size ?? globalSize.value ?? undefined
})

// ---- BEM classes ----
const classes = computed(() => [
  ns.b(),
  ns.is('checked', isChecked.value),
  ns.is('disabled', isDisabled.value),
  ns.is('focused', isFocused.value),
  ns.is('border', props.border),
  effectiveSize.value ? ns.m(effectiveSize.value) : '',
])

// ---- Handlers ----
function handleClick(event: MouseEvent) {
  if (isDisabled.value) return

  // Prevent the label from stealing focus
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT') return

  // Focus the hidden input for accessibility
  const input = (event.currentTarget as HTMLElement).querySelector<HTMLInputElement>('input')
  input?.focus()

  select()
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  isFocused.value = false
}

function select() {
  if (isChecked.value) return
  const value = props.label === undefined ? true : props.label

  if (radioGroup) {
    radioGroup.changeEvent(value)
  } else {
    emit('update:modelValue', value)
    emit('change', value)
  }
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    select()
  }
}
</script>

<template>
  <label
    :class="classes"
    role="radio"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    :aria-label="ariaLabel || (typeof label === 'string' ? label : undefined)"
    :data-label="label"
    :tabindex="isDisabled ? -1 : isChecked ? 0 : -1"
    @click="handleClick"
    @keydown.enter.prevent="select"
    @keydown.space.prevent="select"
  >
    <span :class="[ns.e('input'), ns.is('checked', isChecked), ns.is('disabled', isDisabled)]">
      <span :class="[ns.e('inner'), ns.is('checked', isChecked)]" />
      <input
        :class="ns.e('original')"
        type="radio"
        :name="inputName"
        :value="label"
        :disabled="isDisabled"
        :checked="isChecked"
        tabindex="-1"
        @change="handleInputChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </span>
    <span v-if="$slots.default || label" :class="ns.e('label')">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
/* ============================================================
 * ZcRadio styles
 * BEM naming: zc-radio / zc-radio__input / zc-radio__inner
 * Custom radio circles with smooth transitions
 * ============================================================ */

/* ---- Base radio container ---- */
.zc-radio {
  /* Component-level CSS variables */
  --zc-radio-text-color: var(--color-zc-text-regular, #606266);
  --zc-radio-checked-color: var(--color-zc-primary-500, #409eff);
  --zc-radio-hover-color: var(--color-zc-primary-400, #79bbff);
  --zc-radio-active-color: var(--color-zc-primary-600, #337ecc);
  --zc-radio-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-radio-bg-color: var(--color-zc-white, #fff);
  --zc-radio-dot-color: var(--color-zc-white, #fff);
  --zc-radio-disabled-text-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-radio-disabled-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-radio-disabled-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-radio-disabled-dot-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-radio-focus-outline-color: var(--color-zc-primary-400, #79bbff);
  --zc-radio-font-size: var(--text-zc-base, 14px);
  --zc-radio-gap: var(--spacing-zc-sm, 8px);
  --zc-radio-input-size: 18px;
  --zc-radio-inner-size: 16px;
  --zc-radio-dot-size: 6px;

  display: inline-flex;
  align-items: center;
  gap: var(--zc-radio-gap);
  cursor: pointer;
  font-size: var(--zc-radio-font-size);
  color: var(--zc-radio-text-color);
  user-select: none;
  outline: none;
  vertical-align: middle;
}

/* ---- Input area (clickable circle area) ---- */
.zc-radio__input {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--zc-radio-input-size);
  height: var(--zc-radio-input-size);
  flex-shrink: 0;
}

/* ---- Visual radio circle ---- */
.zc-radio__inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--zc-radio-inner-size);
  height: var(--zc-radio-inner-size);
  border: 2px solid var(--zc-radio-border-color);
  border-radius: 50%;
  background: var(--zc-radio-bg-color);
  transition:
    border-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    background-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  box-sizing: border-box;
}

/* Inner dot (hidden by default) */
.zc-radio__inner::after {
  content: '';
  width: var(--zc-radio-dot-size);
  height: var(--zc-radio-dot-size);
  border-radius: 50%;
  background: var(--zc-radio-dot-color);
  transform: scale(0);
  transition: transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

/* ---- States ---- */

/* Checked: show filled dot */
.zc-radio__input.is-checked .zc-radio__inner {
  border-color: var(--zc-radio-checked-color);
  background: var(--zc-radio-checked-color);
}

.zc-radio__input.is-checked .zc-radio__inner::after {
  transform: scale(1);
}

/* Focus-visible ring on the outer container */
.zc-radio:focus-visible {
  outline: 2px solid var(--zc-radio-focus-outline-color);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Hover: subtle color change on unchecked */
.zc-radio:not(.is-disabled):hover .zc-radio__inner {
  border-color: var(--zc-radio-hover-color);
}

/* Active press state */
.zc-radio:not(.is-disabled):active .zc-radio__inner {
  border-color: var(--zc-radio-active-color);
}

/* ---- Disabled state ---- */
.zc-radio.is-disabled {
  cursor: not-allowed;
  color: var(--zc-radio-disabled-text-color);
}

.zc-radio.is-disabled .zc-radio__inner {
  border-color: var(--zc-radio-disabled-border-color);
  background: var(--zc-radio-disabled-bg-color);
  cursor: not-allowed;
}

.zc-radio.is-disabled .zc-radio__input.is-checked .zc-radio__inner {
  border-color: var(--zc-radio-disabled-border-color);
  background: var(--zc-radio-disabled-bg-color);
}

.zc-radio.is-disabled .zc-radio__input.is-checked .zc-radio__inner::after {
  background: var(--zc-radio-disabled-dot-color);
}

/* ---- Hidden native input ---- */
.zc-radio__original {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
  z-index: -1;
}

.zc-radio.is-disabled .zc-radio__original {
  cursor: not-allowed;
}

/* ---- Label ---- */
.zc-radio__label {
  display: inline-flex;
  align-items: center;
  line-height: 1.2;
  padding-left: 2px;
}

/* ---- Border variant ---- */
.zc-radio.is-border {
  padding: 8px 12px;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  transition: border-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}
.zc-radio.is-border:hover:not(.is-disabled) {
  border-color: var(--color-zc-primary-400, #79bbff);
}
.zc-radio.is-border.is-checked {
  border-color: var(--color-zc-primary-500, #409eff);
}
.zc-radio.is-border.is-disabled {
  background: var(--color-zc-fill-light, #f5f7fa);
  border-color: var(--color-zc-border-light, #e4e7ed);
}

/* ---- Sizes (with border) ---- */
.zc-radio--large.is-border {
  padding: 10px 14px;
}
.zc-radio--large.is-border .zc-radio__inner {
  width: 16px;
  height: 16px;
}
.zc-radio--small.is-border {
  padding: 6px 10px;
}
.zc-radio--small.is-border .zc-radio__inner {
  width: 12px;
  height: 12px;
}
</style>
