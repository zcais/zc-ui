/**
 * Async-validator-lite — a lightweight field validation engine.
 *
 * Supports: required, min/max (string length or number range),
 * pattern (RegExp), custom validator functions, and cross-field validation.
 */
import type { FormItemRule, FormItemValidationResult } from './types'
import { t as translate } from '@zc-ui/locale'

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
    // ---- required ----
    if (rule.required) {
      if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
        return {
          valid: false,
          message: rule.message || translate('zc.form.required'),
          field,
        }
      }
    }

    // ---- min / max ----
    if (rule.min != null || rule.max != null) {
      const len = typeof value === 'number' ? value : String(value ?? '').length
      if (rule.min != null && len < rule.min) {
        return {
          valid: false,
          message: rule.message || translate('zc.form.min', { min: rule.min }),
          field,
        }
      }
      if (rule.max != null && len > rule.max) {
        return {
          valid: false,
          message: rule.message || translate('zc.form.max', { max: rule.max }),
          field,
        }
      }
    }

    // ---- pattern ----
    if (rule.pattern) {
      const regex = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern
      if (!regex.test(String(value ?? ''))) {
        return {
          valid: false,
          message: rule.message || translate('zc.form.pattern'),
          field,
        }
      }
    }

    // ---- custom validator ----
    if (rule.validator) {
      try {
        const result = await rule.validator(rule, value, model)
        if (result === false) {
          return {
            valid: false,
            message: rule.message || translate('zc.form.validateFailed'),
            field,
          }
        }
      } catch (err) {
        return {
          valid: false,
          message:
            err instanceof Error
              ? err.message
              : rule.message || translate('zc.form.validateFailed'),
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
