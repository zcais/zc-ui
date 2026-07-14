<script setup lang="ts">
import { computed, inject, onUnmounted, provide, ref, watch, useSlots } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import {
  formContextKey,
  formItemContextKey,
  type FormItemRule,
  type FormItemValidateState,
  type FormItemValidationResult,
} from './types'
import { validateField, normaliseRules } from './validate'

defineOptions({ name: 'ZcFormItem' })

const props = withDefaults(
  defineProps<{
    /** Field path in the form model (e.g. "user.name"). */
    prop?: string
    /** Label text. */
    label?: string
    /** Width override for this item's label. */
    labelWidth?: string | number
    /** Custom validation rules (merged with form-level rules). */
    rules?: FormItemRule | FormItemRule[]
    /** Whether to show error message. */
    showMessage?: boolean
    /** Required indicator (auto-detected from rules if not set). */
    required?: boolean
    /** Whether to disable this form item. */
    disabled?: boolean
  }>(),
  {
    showMessage: true,
    required: false,
    disabled: false,
  }
)

const ns = useNamespace('form-item')
const slots = useSlots()

// ---- Inject form context ----
const formCtx = inject(formContextKey, null)

// ---- Validation state ----
const validateState = ref<FormItemValidateState>('')
const validateMessage = ref('')
const validating = ref(false)

// ---- Resolve field value from model ----
function getFieldValue(): unknown {
  if (!formCtx || !props.prop) return undefined
  const model = formCtx.model.value
  // Support nested paths like "user.name"
  return props.prop.split('.').reduce<unknown>((acc, key) => {
    return (acc as Record<string, unknown>)?.[key]
  }, model)
}

// ---- Resolve applicable rules ----
function getFieldRules(): FormItemRule[] {
  const ownRules = normaliseRules(props.rules)
  if (ownRules.length) return ownRules
  if (!formCtx || !props.prop) return []
  const formRules = formCtx.rules.value
  const fieldRule = formRules[props.prop]
  return normaliseRules(fieldRule)
}

// ---- Required detection ----
const isRequired = computed(() => {
  if (props.required) return true
  return getFieldRules().some((r) => r.required)
})

// ---- Disabled state ----
const isDisabled = computed(() => {
  return props.disabled || formCtx?.disabled.value === true
})

// ---- Run validation ----
async function runValidation(): Promise<FormItemValidationResult> {
  if (!props.prop) {
    return { valid: true, message: '', field: '' }
  }

  const rules = getFieldRules()
  if (!rules.length) {
    validateState.value = ''
    validateMessage.value = ''
    return { valid: true, message: '', field: props.prop }
  }

  validating.value = true
  const value = getFieldValue()
  // Pass the full model for cross-field validation support
  const result = await validateField(props.prop, value, rules, formCtx?.model.value)
  validating.value = false

  if (result.valid) {
    validateState.value = 'success'
    validateMessage.value = ''
  } else {
    validateState.value = 'error'
    validateMessage.value = result.message
  }

  return result
}

async function validate(trigger?: 'blur' | 'change'): Promise<FormItemValidationResult> {
  const rules = getFieldRules()
  // If trigger is specified, only run rules matching that trigger
  if (trigger) {
    const triggeredRules = rules.filter((r) => r.trigger === trigger)
    if (!triggeredRules.length) {
      return { valid: true, message: '', field: props.prop || '' }
    }
    validating.value = true
    const value = getFieldValue()
    const result = await validateField(
      props.prop || '',
      value,
      triggeredRules,
      formCtx?.model.value
    )
    validating.value = false
    if (result.valid) {
      validateState.value = 'success'
      validateMessage.value = ''
    } else {
      validateState.value = 'error'
      validateMessage.value = result.message
    }
    return result
  }
  return runValidation()
}

function clearValidate() {
  validateState.value = ''
  validateMessage.value = ''
}

// ---- Register with parent form ----
if (formCtx && props.prop) {
  formCtx.registerField(props.prop, runValidation, clearValidate)
}

// ---- Unregister on unmount to avoid dangling references ----
onUnmounted(() => {
  if (formCtx && props.prop) {
    formCtx.unregisterField?.(props.prop)
  }
})

// Watch for model changes with 'change' trigger
if (formCtx && props.prop) {
  watch(
    () => getFieldValue(),
    () => {
      // Only validate if validateOnValueChange is true (watch mode)
      if (!formCtx.validateOnValueChange.value) return
      // Auto-validate on change only if rules have change trigger
      const rules = getFieldRules()
      if (rules.some((r) => r.trigger === 'change')) {
        validate('change')
      }
    }
  )
}

// ---- Provide context for child components ----
provide(formItemContextKey, {
  field: props.prop || '',
  validateState,
  validateMessage,
  validating,
  validate,
  clearValidate,
})

// ---- Classes ----
const classes = computed(() => [
  ns.b(),
  ns.is('error', validateState.value === 'error'),
  ns.is('success', validateState.value === 'success'),
  ns.is('required', isRequired.value),
  ns.is('no-asterisk', !isRequired.value),
  ns.is('disabled', isDisabled.value),
])

// ---- Label width ----
const labelStyle = computed(() => {
  const width = props.labelWidth || formCtx?.labelWidth.value
  if (!width) return {}
  const val = typeof width === 'number' ? `${width}px` : width
  return { width: val, flexShrink: 0 }
})

// ---- Show error ----
const shouldShowError = computed(() => {
  const show = props.showMessage && (formCtx?.showMessage.value ?? true)
  return show && validateState.value === 'error' && validateMessage.value !== ''
})

// ---- Public API ----
defineExpose({ validate, clearValidate })
</script>

<template>
  <div :class="classes">
    <!-- Label -->
    <label v-if="label || slots.label" :class="ns.e('label')" :style="labelStyle">
      <slot name="label">{{ label }}</slot>
    </label>

    <!-- Content -->
    <div :class="ns.e('content')">
      <slot />

      <!-- Validating spinner -->
      <transition name="zc-form-item-error">
        <span v-if="validating" :class="ns.e('validating')" role="status" aria-label="validating">
          <svg viewBox="0 0 24 24" width="14" height="14" class="zc-spinner">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-dasharray="31.4 31.4"
              stroke-linecap="round"
            />
          </svg>
        </span>
      </transition>

      <!-- Error message -->
      <transition name="zc-form-item-error">
        <div v-if="shouldShowError" :class="ns.e('error')" role="alert">
          <slot name="error" :error="validateMessage">
            {{ validateMessage }}
          </slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcFormItem styles
 * ============================================================ */

.zc-form-item {
  --zc-form-item-label-color: var(--color-zc-text-regular, #606266);
  --zc-form-item-error-color: var(--color-zc-danger-500, #f56c6c);
  --zc-form-item-label-font-size: var(--text-zc-base, 14px);
  --zc-form-item-margin-bottom: 22px;
  --zc-form-item-content-gap: 8px;

  display: flex;
  align-items: flex-start;
  margin-bottom: var(--zc-form-item-margin-bottom);
  font-size: var(--zc-form-item-label-font-size);
}

/* ---- Label ---- */
.zc-form-item__label {
  display: inline-flex;
  align-items: center;
  padding-right: var(--zc-form-item-content-gap);
  box-sizing: border-box;
  color: var(--zc-form-item-label-color);
  font-size: var(--zc-form-item-label-font-size);
  line-height: 36px;
  height: 36px;
}

/* Required asterisk */
.zc-form-item.is-required > .zc-form-item__label::before {
  content: '*';
  color: var(--zc-form-item-error-color);
  margin-right: 4px;
}

/* ---- Content ---- */
.zc-form-item__content {
  flex: 1;
  position: relative;
  min-height: 36px;
  line-height: 36px;
  font-size: var(--zc-form-item-label-font-size);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

/* ---- Error state ---- */
.zc-form-item.is-error :deep(.zc-input__wrapper),
.zc-form-item.is-error :deep(.zc-input__inner) {
  border-color: var(--zc-form-item-error-color);
}

.zc-form-item.is-error :deep(.zc-input__wrapper:focus-within) {
  box-shadow: 0 0 0 2px var(--color-zc-danger-50, #fef0f0);
}

/* ---- Error message ---- */
.zc-form-item__error {
  position: absolute;
  top: 100%;
  left: 0;
  color: var(--zc-form-item-error-color);
  font-size: var(--text-zc-xs, 12px);
  line-height: 1.5;
  padding-top: 4px;
}

/* Error transition */
.zc-form-item-error-enter-active,
.zc-form-item-error-leave-active {
  transition: all var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-form-item-error-enter-from,
.zc-form-item-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ---- Success state (optional subtle indicator) ---- */
.zc-form-item.is-success :deep(.zc-input__wrapper) {
  border-color: var(--color-zc-success-500, #67c23a);
}

/* ---- Validating spinner ---- */
.zc-form-item__validating {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-zc-info-500, #909399);
  display: inline-flex;
  align-items: center;
}

.zc-spinner {
  animation: zc-spin 0.6s linear infinite;
}

@keyframes zc-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ---- Disabled state ---- */
.zc-form-item.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
