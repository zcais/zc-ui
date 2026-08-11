<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useGlobalConfig } from '../config-provider/useGlobalConfig'
import type { ComponentSize } from '../config-provider/types'
import { checkboxGroupKey, type CheckboxGroupContext } from './checkbox-group.vue'

defineOptions({ name: 'ZcCheckbox' })

export type CheckboxSize = 'large' | 'medium' | 'small'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean | string | number
    label?: string | number | boolean
    disabled?: boolean
    indeterminate?: boolean
    name?: string
    /** Accessible label for screen readers (falls back to label) */
    ariaLabel?: string
    /** Show border around the checkbox */
    border?: boolean
    /** Checkbox size (only effective with border) */
    size?: CheckboxSize
  }>(),
  {
    modelValue: false,
    disabled: false,
    indeterminate: false,
    border: false,
    size: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const ns = useNamespace('checkbox')

// ---- Group injection ----
const checkboxGroup = inject<CheckboxGroupContext | undefined>(checkboxGroupKey, undefined)

// ---- Computed state ----
const isGroup = computed(() => !!checkboxGroup)

const isChecked = computed(() => {
  if (isGroup.value) {
    return checkboxGroup!.modelValue.value.includes(props.label!)
  }
  return !!props.modelValue
})

const isDisabled = computed(() => {
  return props.disabled || (isGroup.value && checkboxGroup!.disabled.value)
})

// ---- ConfigProvider size integration ----
const { size: globalSize } = useGlobalConfig()
const effectiveSize = computed<ComponentSize | undefined>(() => {
  return props.size ?? globalSize.value ?? undefined
})

// ---- Handlers ----
const isFocused = ref(false)

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const checked = target.checked
  if (isDisabled.value) return
  toggleCheck(checked)
}

function handleClick() {
  if (isDisabled.value) return
  // For group mode, toggle via click on label
  if (isGroup.value) {
    toggleCheck(!isChecked.value)
  } else {
    toggleCheck(!props.modelValue)
  }
}

function toggleCheck(newChecked: boolean) {
  if (isGroup.value) {
    const groupModel = checkboxGroup!.modelValue
    const labelVal = props.label!
    if (newChecked) {
      // Add label if not already present
      if (!groupModel.value.includes(labelVal)) {
        groupModel.value = [...groupModel.value, labelVal]
      }
    } else {
      // Remove label
      groupModel.value = groupModel.value.filter((v) => v !== labelVal)
    }
    checkboxGroup!.changeEvent()
  } else {
    emit('update:modelValue', newChecked)
    emit('change', newChecked)
  }
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  isFocused.value = false
}

const classes = computed(() => [
  ns.b(),
  ns.is('checked', isChecked.value),
  ns.is('disabled', isDisabled.value),
  ns.is('indeterminate', !isChecked.value && props.indeterminate),
  ns.is('focused', isFocused.value),
  ns.is('border', props.border),
  effectiveSize.value ? ns.m(effectiveSize.value) : '',
])
</script>

<template>
  <label
    :class="classes"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed' : isChecked"
    :aria-disabled="isDisabled"
    :aria-label="ariaLabel || (typeof label === 'string' ? label : undefined)"
  >
    <span :class="ns.e('input')">
      <span :class="ns.e('inner')">
        <!-- Checkmark SVG (shown when checked) -->
        <svg
          v-if="isChecked && !indeterminate"
          :class="ns.e('icon')"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <!-- Indeterminate dash SVG -->
        <svg
          v-else-if="indeterminate"
          :class="ns.e('icon')"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
      <input
        :checked="isChecked"
        :disabled="isDisabled"
        :name="name"
        :value="label"
        type="checkbox"
        :class="ns.e('original')"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @click.stop
      />
    </span>
    <span v-if="$slots.default || label" :class="ns.e('label')" @click="handleClick">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
/* ============================================================
 * ZcCheckbox styles
 * BEM naming: zc-checkbox / zc-checkbox__input / zc-checkbox__inner
 * All colors use CSS variables with fallbacks for global theming.
 * ============================================================ */

/* ---- Container ---- */
.zc-checkbox {
  /* Component-level CSS variables */
  --zc-checkbox-text-color: var(--color-zc-text-regular, #606266);
  --zc-checkbox-checked-color: var(--color-zc-primary-500, #409eff);
  --zc-checkbox-checked-bg-color: var(--color-zc-primary-500, #409eff);
  --zc-checkbox-checked-border-color: var(--color-zc-primary-500, #409eff);
  --zc-checkbox-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-checkbox-hover-border-color: var(--color-zc-primary-400, #79bbff);
  --zc-checkbox-bg-color: var(--color-zc-fill-lighter, #fafafa);
  --zc-checkbox-disabled-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-checkbox-disabled-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-checkbox-disabled-text-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-checkbox-icon-color: var(--color-zc-white, #fff);
  --zc-checkbox-focus-outline-color: var(--color-zc-primary-400, #79bbff);
  --zc-checkbox-font-size: var(--text-zc-base, 14px);
  --zc-checkbox-gap: var(--spacing-zc-sm, 8px);
  --zc-checkbox-input-size: 16px;
  --zc-checkbox-input-border-radius: var(--radius-zc-sm, 2px);

  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--zc-checkbox-font-size);
  color: var(--zc-checkbox-text-color);
  user-select: none;
  vertical-align: middle;
  gap: var(--zc-checkbox-gap);
  outline: none;
}

/* ---- Input wrapper ---- */
.zc-checkbox__input {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: var(--zc-checkbox-input-size);
  height: var(--zc-checkbox-input-size);
}

/* ---- Checkbox box ---- */
.zc-checkbox__inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: var(--zc-checkbox-input-size);
  height: var(--zc-checkbox-input-size);
  border: 1px solid var(--zc-checkbox-border-color);
  border-radius: var(--zc-checkbox-input-border-radius);
  background: var(--zc-checkbox-bg-color);
  transition:
    border-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    background-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-checkbox__inner:hover {
  border-color: var(--zc-checkbox-hover-border-color);
}

/* ---- Checkmark / dash icon ---- */
.zc-checkbox__icon {
  width: 14px;
  height: 14px;
  color: var(--zc-checkbox-icon-color);
}

/* ---- Hidden native checkbox ---- */
.zc-checkbox__original {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  z-index: -1;
}

/* ---- Focus state (keyboard navigation) ---- */
.zc-checkbox.is-focused .zc-checkbox__inner {
  outline: 2px solid var(--zc-checkbox-focus-outline-color);
  outline-offset: 2px;
}

/* ---- Checked state ---- */
.zc-checkbox.is-checked .zc-checkbox__inner {
  background: var(--zc-checkbox-checked-bg-color);
  border-color: var(--zc-checkbox-checked-border-color);
}

.zc-checkbox.is-checked .zc-checkbox__label {
  color: var(--zc-checkbox-checked-color);
}

/* ---- Indeterminate state ---- */
.zc-checkbox.is-indeterminate .zc-checkbox__inner {
  background: var(--zc-checkbox-checked-bg-color);
  border-color: var(--zc-checkbox-checked-border-color);
}

/* ---- Disabled state ---- */
.zc-checkbox.is-disabled {
  cursor: not-allowed;
}

.zc-checkbox.is-disabled .zc-checkbox__inner {
  background: var(--zc-checkbox-disabled-bg-color);
  border-color: var(--zc-checkbox-disabled-border-color);
  cursor: not-allowed;
}

.zc-checkbox.is-disabled.is-checked .zc-checkbox__inner {
  background: var(--zc-checkbox-disabled-bg-color);
  border-color: var(--zc-checkbox-disabled-border-color);
}

.zc-checkbox.is-disabled.is-checked .zc-checkbox__icon,
.zc-checkbox.is-disabled.is-indeterminate .zc-checkbox__icon {
  color: var(--zc-checkbox-disabled-text-color);
}

.zc-checkbox.is-disabled .zc-checkbox__label {
  color: var(--zc-checkbox-disabled-text-color);
  cursor: not-allowed;
}

/* ---- Label ---- */
.zc-checkbox__label {
  display: inline-flex;
  align-items: center;
  padding-left: var(--spacing-zc-xs, 4px);
  line-height: 1.5;
  transition: color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

/* ---- Border variant ---- */
.zc-checkbox.is-border {
  padding: 8px 12px;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  transition: border-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}
.zc-checkbox.is-border:hover:not(.is-disabled) {
  border-color: var(--color-zc-primary-400, #79bbff);
}
.zc-checkbox.is-border.is-checked {
  border-color: var(--color-zc-primary-500, #409eff);
}
.zc-checkbox.is-border.is-disabled {
  background: var(--color-zc-fill-light, #f5f7fa);
  border-color: var(--color-zc-border-light, #e4e7ed);
}

/* ---- Sizes (with border) ---- */
.zc-checkbox--large.is-border {
  padding: 10px 14px;
}
.zc-checkbox--large.is-border .zc-checkbox__inner {
  width: 18px;
  height: 18px;
}
.zc-checkbox--small.is-border {
  padding: 6px 10px;
}
.zc-checkbox--small.is-border .zc-checkbox__inner {
  width: 12px;
  height: 12px;
}
</style>
