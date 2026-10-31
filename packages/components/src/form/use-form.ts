/**
 * Form-related composables shared by all form controls.
 *
 * Mirrors Element Plus' `useFormSize` / `useFormDisabled` / `useFormItem`:
 * controls resolve their effective size and disabled state from their own
 * prop first, then the wrapping ZcFormItem, then ZcForm, then the global
 * ConfigProvider — and bridge blur/change events to form-item validation.
 *
 * @example
 * import { useFormDisabled, useFormSize, useFormItem } from '../form/use-form'
 *
 * const formSize = useFormSize(() => props.size)
 * const formDisabled = useFormDisabled(() => props.disabled)
 * const formItem = useFormItem()
 */
import { computed, inject, type ComputedRef } from 'vue'
import { formContextKey, formItemContextKey, type FormItemContext } from './types'
import { useGlobalConfig } from '../config-provider/useGlobalConfig'
import type { ComponentSize } from '../types'

/**
 * Resolve the effective size for a form control.
 *
 * Priority: component prop > ZcFormItem size > ZcForm size > ConfigProvider
 * global size. Returns `undefined` when nothing is configured so callers can
 * apply their own default.
 */
export function useFormSize(
  getPropSize?: () => ComponentSize | undefined
): ComputedRef<ComponentSize | undefined> {
  const form = inject(formContextKey, null)
  const formItem = inject(formItemContextKey, null)
  const { size: globalSize } = useGlobalConfig()

  return computed(
    () => getPropSize?.() ?? formItem?.size.value ?? form?.size.value ?? globalSize.value
  )
}

/**
 * Resolve the effective disabled state for a form control.
 *
 * Disabled when the component's own prop is set, the wrapping ZcFormItem is
 * disabled, or the parent ZcForm is disabled.
 */
export function useFormDisabled(getPropDisabled?: () => boolean | undefined): ComputedRef<boolean> {
  const form = inject(formContextKey, null)
  const formItem = inject(formItemContextKey, null)

  return computed(
    () =>
      getPropDisabled?.() === true ||
      formItem?.disabled.value === true ||
      form?.disabled.value === true
  )
}

/**
 * Inject the surrounding ZcFormItem context (null outside a form).
 *
 * Call `formItem?.validate('blur' | 'change')` from control event handlers to
 * drive validation rules configured with a matching `trigger`.
 */
export function useFormItem(): FormItemContext | null {
  return inject(formItemContextKey, null)
}
