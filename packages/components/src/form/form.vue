<script setup lang="ts">
import { computed, provide, ref, toRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import {
  formContextKey,
  type ComponentSize,
  type FormLabelPosition,
  type FormRules,
  type FormItemValidationResult,
} from './types'

defineOptions({ name: 'ZcForm' })

const props = withDefaults(
  defineProps<{
    model: Record<string, unknown>
    rules?: FormRules
    labelWidth?: string | number
    labelPosition?: FormLabelPosition
    showMessage?: boolean
    inline?: boolean
    /** Whether to auto-validate when field values change (watch mode). Default: true */
    validateOnValueChange?: boolean
    /** Form-level disabled state. Controls inside render their disabled state. */
    disabled?: boolean
    /** Form-level size. Controls inside default to this size. */
    size?: ComponentSize
  }>(),
  {
    rules: () => ({}),
    labelWidth: '',
    labelPosition: 'right',
    showMessage: true,
    inline: false,
    validateOnValueChange: true,
    disabled: false,
    size: undefined,
  }
)

const emit = defineEmits<{
  (e: 'validate', prop: string, success: boolean, message: string): void
}>()

const ns = useNamespace('form')

/**
 * Safe deep clone that preserves Date, RegExp, and other non-JSON-serializable types.
 * Falls back to JSON parse/stringify for plain objects/arrays.
 */
function safeClone<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value
  if (value instanceof Date) return new Date(value) as T
  if (value instanceof RegExp) return new RegExp(value) as T
  if (value instanceof Map) return new Map(value) as T
  if (value instanceof Set) return new Set(value) as T
  if (Array.isArray(value)) return value.map((item) => safeClone(item)) as T
  // Plain object fallback
  try {
    const cloned: Record<string, unknown> = {}
    for (const key of Object.keys(value as Record<string, unknown>)) {
      cloned[key] = safeClone((value as Record<string, unknown>)[key])
    }
    return cloned as T
  } catch {
    return value
  }
}

// ---- Registered form items ----
interface FieldRegistry {
  validate: () => Promise<FormItemValidationResult>
  clearValidate: () => void
  /** Initial value of this field (snapshot at registration time) */
  initialValue: unknown
}
const fields = new Map<string, FieldRegistry>()

function registerField(
  field: string,
  validate: () => Promise<FormItemValidationResult>,
  clearValidate: () => void
) {
  // Snapshot the current model value as initial value for this field
  const initialValue = safeClone((props.model as Record<string, unknown>)[field] ?? undefined)
  fields.set(field, { validate, clearValidate, initialValue })
}

function unregisterField(field: string) {
  fields.delete(field)
}

// ---- Provide context ----
provide(formContextKey, {
  model: toRef(props, 'model'),
  rules: toRef(props, 'rules'),
  labelWidth: toRef(props, 'labelWidth'),
  labelPosition: toRef(props, 'labelPosition'),
  showMessage: toRef(props, 'showMessage'),
  validateOnValueChange: toRef(props, 'validateOnValueChange'),
  disabled: toRef(props, 'disabled'),
  size: toRef(props, 'size'),
  registerField,
  unregisterField,
})

// ---- Classes ----
const classes = computed(() => [
  ns.b(),
  ns.m(`label-${props.labelPosition}`),
  ns.is('inline', props.inline),
])

// ---- Label width style ----
const labelStyle = computed(() => {
  if (!props.labelWidth) return {}
  const val = typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth
  return { width: val }
})

provide('zcFormLabelStyle', labelStyle)

// ---- Public API ----

/**
 * Structured validation failure, keyed by field path (Element Plus
 * compatible: `validate()` rejects with this object).
 */
export type FormValidationFailure = Record<string, Array<{ message: string; field: string }>>

function collectFailures(results: FormItemValidationResult[]): FormValidationFailure {
  const invalidFields: FormValidationFailure = {}
  for (const r of results) {
    if (!r.valid) {
      ;(invalidFields[r.field] ??= []).push({ message: r.message, field: r.field })
    }
  }
  return invalidFields
}

/**
 * Validate all registered fields.
 *
 * Resolves `true` when every field passes; rejects with the invalid fields
 * object (`{ [field]: Array<{ message, field }> }`) on failure — mirroring
 * Element Plus so callers can `catch` and inspect which fields failed.
 */
async function validate(): Promise<boolean> {
  const results = await Promise.all(Array.from(fields.values()).map((f) => f.validate()))
  // Emit per-field results
  for (const r of results) {
    emit('validate', r.field, r.valid, r.message)
  }
  const invalidFields = collectFailures(results)
  if (Object.keys(invalidFields).length) {
    return Promise.reject(invalidFields)
  }
  return true
}

/**
 * Validate a specific field. Same resolve/reject semantics as `validate()`.
 */
async function validateFieldByName(name: string, ...rest: unknown[]): Promise<boolean> {
  void rest
  const entry = fields.get(name)
  if (!entry) return true
  const result = await entry.validate()
  emit('validate', result.field, result.valid, result.message)
  if (!result.valid) {
    return Promise.reject(collectFailures([result]))
  }
  return true
}

/** Reset all fields: restore initial model values and clear validation. */
function resetFields() {
  // Restore each field to its initial value (clone keeps Date/Map/Set intact)
  for (const [fieldName, field] of fields) {
    ;(props.model as Record<string, unknown>)[fieldName] = safeClone(field.initialValue)
    field.clearValidate()
  }
}

/** Clear validation messages for all fields. */
async function clearValidate() {
  for (const field of fields.values()) {
    field.clearValidate()
  }
}

const formRef = ref<HTMLFormElement | null>(null)

/** Scroll to the form item bound to `prop` (Element Plus compatible). */
function scrollToField(prop: string) {
  const root = formRef.value
  if (!root) return
  const el = root.querySelector<HTMLElement>(`[data-zc-form-field="${prop}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

defineExpose({
  validate,
  validateField: validateFieldByName,
  resetFields,
  clearValidate,
  scrollToField,
})
</script>

<template>
  <form ref="formRef" :class="classes" @submit.prevent>
    <slot />
  </form>
</template>

<style scoped>
/* ============================================================
 * ZcForm styles
 * ============================================================ */

.zc-form {
  width: 100%;
  box-sizing: border-box;
}

.zc-form--label-top .zc-form-item__label {
  display: block;
  text-align: left;
  padding-bottom: 4px;
  width: auto !important;
}

.zc-form--label-left .zc-form-item__label {
  text-align: left;
}

.zc-form--label-right .zc-form-item__label {
  text-align: right;
}

.zc-form.is-inline .zc-form-item {
  display: inline-flex;
  margin-right: var(--zc-form-inline-gap);
}
</style>
