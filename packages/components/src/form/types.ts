/**
 * Form context types and injection key.
 *
 * Shared between ZcForm (provider) and ZcFormItem (consumer).
 * Each ZcFormItem registers itself with the parent form so that
 * the form can trigger validation for all items (e.g. on submit).
 */
import type { InjectionKey, Ref } from 'vue'

/** A single validation rule for a form field. */
export interface FormItemRule {
  /** Built-in validator type. */
  required?: boolean
  min?: number
  max?: number
  /** Regex pattern (string or RegExp). */
  pattern?: RegExp | string
  /** Type validation (checks typeof value). */
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url'
  /** Allowed values (enum validation). */
  enum?: Array<string | number>
  /**
   * Custom validator function.
   * Returns `true` (pass) or `false` (fail / error), or a Promise.
   * Can also return an error message string directly for convenience.
   * When the third `model` parameter is present, enables cross-field validation.
   * @example
   * // Async validator with API check
   * validator: async (rule, value) => {
   *   const res = await checkUsername(value)
   *   return res.available
   * }
   * @example
   * // Cross-field: confirm password must match password
   * validator: (rule, value, model) => value === model.password
   */
  validator?: (
    rule: FormItemRule,
    value: unknown,
    model?: Record<string, unknown>
  ) => boolean | string | Promise<boolean | string>
  /** Custom error message (string or function for dynamic messages). */
  message?: string | ((rule: FormItemRule, value: unknown) => string)
  /** When to trigger validation. */
  trigger?: 'blur' | 'change'
  /** Transform the value before validation. */
  transform?: (value: unknown) => unknown
}

/** Rules map keyed by model property path. */
export type FormRules = Record<string, FormItemRule | FormItemRule[]>

/** Label position options. */
export type FormLabelPosition = 'left' | 'right' | 'top'

/** Message type for validation results. */
export type FormItemValidateState = '' | 'error' | 'success'

/** Result returned by a FormItem validation. */
export interface FormItemValidationResult {
  valid: boolean
  message: string
  field: string
}

/** Context provided by ZcForm to all ZcFormItem children. */
export interface FormContext {
  /** The reactive model object bound to the form. */
  model: Ref<Record<string, unknown>>
  /** Validation rules keyed by field path. */
  rules: Ref<FormRules>
  /** Label width for all items. */
  labelWidth: Ref<string | number>
  /** Label position. */
  labelPosition: Ref<FormLabelPosition>
  /** Whether to show error messages inline. */
  showMessage: Ref<boolean>
  /** Whether to auto-validate on value change (watch mode). */
  validateOnValueChange: Ref<boolean>
  /** Form-level disabled state. */
  disabled: Ref<boolean>
  /** Register a FormItem for collective validation. */
  registerField: (
    field: string,
    validate: () => Promise<FormItemValidationResult>,
    clearValidate: () => void
  ) => void
  /** Unregister a FormItem. */
  unregisterField: (field: string) => void
}

/** Injection key for FormContext. */
export const formContextKey: InjectionKey<FormContext> = Symbol('zcFormContext')

/** Context provided by ZcFormItem to child input components. */
export interface FormItemContext {
  /** Field path in the form model. */
  field: string
  /** Current validation state. */
  validateState: Ref<FormItemValidateState>
  /** Current validation message. */
  validateMessage: Ref<string>
  /** Whether async validation is in progress. */
  validating: Ref<boolean>
  /** Trigger validation programmatically. */
  validate: (trigger?: 'blur' | 'change') => Promise<FormItemValidationResult>
  /** Clear validation state. */
  clearValidate: () => void
}

/** Injection key for FormItemContext. */
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('zcFormItemContext')

// ============================================================
// Form Array (dynamic fields)
// ============================================================

/**
 * A form array item that guarantees a unique key for list rendering.
 * Extends the original item type T with a `_key` property.
 */
export type FormArrayItem<T extends Record<string, unknown>> = T & {
  /** Auto-generated unique key for list rendering. */
  _key: string | number
}

/** Options for createFormArray / useFormArray. */
export interface FormArrayOptions {
  /** The property name used for the unique key (default: '_key'). */
  keyField?: string
  /** Whether to auto-generate unique keys for each item (default: true). */
  autoKeys?: boolean
}

/** Return type of createFormArray / useFormArray. */
export interface UseFormArrayReturn<T extends Record<string, unknown>> {
  /** Reactive array of items (each item has a unique _key). */
  fields: Ref<FormArrayItem<T>[]>
  /** Add a new item at the end; uses defaultItem if provided at creation. */
  add: (item?: Partial<T>) => void
  /** Remove item at the given index. */
  remove: (index: number) => void
  /** Move item from `fromIndex` to `toIndex`. */
  move: (fromIndex: number, toIndex: number) => void
  /** Push an item to the end (alias of add). */
  push: (item: Partial<T>) => void
  /** Insert an item at a specific index. */
  insert: (index: number, item: Partial<T>) => void
  /** Remove all items. */
  clear: () => void
  /** Get item at index. */
  get: (index: number) => FormArrayItem<T> | undefined
  /** Current number of items. */
  length: Ref<number>
  /** Validate all items (for form integration). */
  validate: () => Promise<boolean>
}
