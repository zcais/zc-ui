<script lang="ts">
/** Injection key for CheckboxGroup context. */
export const checkboxGroupKey = Symbol('checkboxGroup')

export interface CheckboxGroupContext {
  modelValue: import('vue').Ref<Array<string | number | boolean>>
  disabled: import('vue').Ref<boolean>
  changeEvent: () => void
}
</script>

<script setup lang="ts">
import { provide, ref, watch, computed, type Ref } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useFormDisabled, useFormItem } from '../form/use-form'
const props = withDefaults(
  defineProps<{
    modelValue?: Array<string | number | boolean>
    disabled?: boolean
  }>(),
  {
    modelValue: () => [],
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<string | number | boolean>): void
  (e: 'change', value: Array<string | number | boolean>): void
}>()

const ns = useNamespace('checkbox-group')

// ---- Reactive wrapper for the model value (for injection) ----
const modelRef: Ref<Array<string | number | boolean>> = ref(props.modelValue)

// ---- Sync the ref when parent updates the prop ----
watch(
  () => props.modelValue,
  (newVal) => {
    modelRef.value = newVal ?? []
  },
  { deep: true }
)

// ---- Form context integration ----
// Effective disabled: own prop > ZcFormItem > ZcForm; provided to child checkboxes
const formDisabled = useFormDisabled(() => props.disabled)
const formItem = useFormItem()
const disabledRef = computed(() => formDisabled.value)

const context: CheckboxGroupContext = {
  modelValue: modelRef,
  disabled: disabledRef,
  /** Called after a checkbox toggles its label in modelRef */
  changeEvent() {
    const value = modelRef.value
    emit('update:modelValue', value)
    emit('change', value)
    // Bridge to form-item validation rules with trigger: 'change'
    formItem?.validate('change')
  },
}

provide(checkboxGroupKey, context)

const classes = computed(() => [ns.b(), ns.is('disabled', disabledRef.value)])
</script>

<template>
  <div :class="classes" role="group" aria-label="checkbox-group">
    <slot />
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcCheckboxGroup styles
 * BEM naming: zc-checkbox-group
 * Flex container to arrange child checkboxes horizontally.
 * ============================================================ */

.zc-checkbox-group {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-zc-md, 16px);
}

.zc-checkbox-group.is-disabled {
  cursor: not-allowed;
}
</style>
