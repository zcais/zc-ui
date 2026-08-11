/**
 * Async-validator-lite — a lightweight field validation engine.
 *
 * Supports: required, min/max (string length or number range),
 * pattern (RegExp), type checking (string/number/boolean/array/object/email/url),
 * enum validation, custom validator functions, value transforms,
 * and cross-field validation.
 *
 * Custom validators can return:
 * - `true` → pass
 * - `false` → fail (uses rule.message or default)
 * - `string` → fail with this error message
 * - `Promise<boolean | string>` → async validation
 */
import type { FormItemRule, FormItemValidationResult } from './types'
import { t as translate } from '@zc-ui/locale'

// ---- Built-in type validators ----

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const urlRegex = /^https?:\/\/[^\s<>"{}|\\^`[\]]+$/

function checkType(value: unknown, type: NonNullable<FormItemRule['type']>): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'array':
      return Array.isArray(value)
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value)
    case 'email':
      return typeof value === 'string' && emailRegex.test(value)
    case 'url':
      return typeof value === 'string' && urlRegex.test(value)
    default:
      return true
  }
}

/** Resolve a rule's message: string or function. */
function resolveMessage(rule: FormItemRule, value: unknown, defaultMessage: string): string {
  if (typeof rule.message === 'function') {
    return rule.message(rule, value)
  }
  return rule.message || defaultMessage
}

/**
 * Run a set of rules against a value.
 *
 * Returns `{ valid, message, field }`.
 * Rules are checked in order; the first failing rule produces the message.
 * Custom `validator` functions that return a Promise are awaited.
 *
 * If `model` is provided, it is passed to custom validator functions
 * enabling cross-field validation (e.g., confirm password matching).
 */
export async function validateField(
  field: string,
  value: unknown,
  rules: FormItemRule[],
  model?: Record<string, unknown>
): Promise<FormItemValidationResult> {
  for (const rule of rules) {
    // Apply transform if specified
    let val = value
    if (rule.transform) {
      try {
        val = rule.transform(value)
      } catch {
        // transform error → fail
        return {
          valid: false,
          message: resolveMessage(rule, value, translate('zc.form.validateFailed')),
          field,
        }
      }
    }

    // ---- required ----
    if (rule.required) {
      if (val == null || val === '' || (Array.isArray(val) && val.length === 0)) {
        return {
          valid: false,
          message: resolveMessage(rule, val, translate('zc.form.required')),
          field,
        }
      }
    }

    // Skip remaining checks for empty values (unless required)
    if (val == null || val === '') continue

    // ---- type ----
    if (rule.type) {
      if (!checkType(val, rule.type)) {
        const msgKey =
          rule.type === 'email'
            ? 'zc.form.email'
            : rule.type === 'url'
              ? 'zc.form.url'
              : 'zc.form.type'
        return {
          valid: false,
          message: resolveMessage(rule, val, translate(msgKey)),
          field,
        }
      }
    }

    // ---- enum ----
    if (rule.enum && rule.enum.length > 0) {
      if (!rule.enum.includes(val as string | number)) {
        return {
          valid: false,
          message: resolveMessage(
            rule,
            val,
            translate('zc.form.enum', { values: rule.enum.join(', ') })
          ),
          field,
        }
      }
    }

    // ---- min / max ----
    if (rule.min != null || rule.max != null) {
      const len = typeof val === 'number' ? val : String(val ?? '').length
      if (rule.min != null && len < rule.min) {
        return {
          valid: false,
          message: resolveMessage(rule, val, translate('zc.form.min', { min: rule.min })),
          field,
        }
      }
      if (rule.max != null && len > rule.max) {
        return {
          valid: false,
          message: resolveMessage(rule, val, translate('zc.form.max', { max: rule.max })),
          field,
        }
      }
    }

    // ---- pattern ----
    if (rule.pattern) {
      const regex = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern
      if (!regex.test(String(val ?? ''))) {
        return {
          valid: false,
          message: resolveMessage(rule, val, translate('zc.form.pattern')),
          field,
        }
      }
    }

    // ---- custom validator ----
    if (rule.validator) {
      try {
        const result = await rule.validator(rule, val, model)
        if (result === false) {
          return {
            valid: false,
            message: resolveMessage(rule, val, translate('zc.form.validateFailed')),
            field,
          }
        }
        // validator returns a string error message
        if (typeof result === 'string') {
          return {
            valid: false,
            message: result,
            field,
          }
        }
      } catch (err) {
        return {
          valid: false,
          message:
            err instanceof Error
              ? err.message
              : resolveMessage(rule, val, translate('zc.form.validateFailed')),
          field,
        }
      }
    }
  }

  return { valid: true, message: '', field }
}

/**
 * Normalise rules — accept a single rule or an array, always return an array.
 */
export function normaliseRules(rule: FormItemRule | FormItemRule[] | undefined): FormItemRule[] {
  if (!rule) return []
  return Array.isArray(rule) ? rule : [rule]
}
