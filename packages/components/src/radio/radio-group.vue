<script lang="ts">
import type { Ref } from 'vue'

export interface RadioGroupContext {
  modelValue: Ref<string | number | boolean>
  disabled: Ref<boolean>
  name: Ref<string | undefined>
  changeEvent: (value: string | number | boolean) => void
}

export const radioGroupKey: symbol = Symbol('radioGroup')
</script>

<script setup lang="ts">
import { ref, computed, provide, watch, shallowRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useFormDisabled, useFormItem } from '../form/use-form'

defineOptions({ name: 'ZcRadioGroup' })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean
    disabled?: boolean
    name?: string
  }>(),
  {
    modelValue: '',
    disabled: false,
    name: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void
  (e: 'change', value: string | number | boolean): void
}>()

const ns = useNamespace('radio-group')

// ---- Provide RadioGroup context ----
const modelValueRef = ref(props.modelValue)
const nameRef = ref(props.name)

// ---- Form context integration ----
// Effective disabled: own prop > ZcFormItem > ZcForm; provided to child radios
const formDisabled = useFormDisabled(() => props.disabled)
const formItem = useFormItem()
const disabledRef = computed(() => formDisabled.value)

// ---- Sync props → refs so child components react to dynamic changes ----
watch(
  () => props.modelValue,
  (val) => {
    modelValueRef.value = val
  }
)
watch(
  () => props.name,
  (val) => {
    nameRef.value = val
  }
)

function changeEvent(value: string | number | boolean) {
  modelValueRef.value = value
  emit('update:modelValue', value)
  emit('change', value)
  // Bridge to form-item validation rules with trigger: 'change'
  formItem?.validate('change')
}

provide<RadioGroupContext>(radioGroupKey, {
  modelValue: modelValueRef,
  disabled: disabledRef,
  name: nameRef,
  changeEvent,
})

defineExpose({ changeEvent })

// ---- Keyboard navigation ----
const navRef = shallowRef<HTMLElement>()

function handleKeydown(event: KeyboardEvent) {
  if (disabledRef.value) return
  const container = navRef.value
  if (!container) return

  // Navigate the native radio inputs — they are the interactive elements.
  const radios = Array.from(
    container.querySelectorAll<HTMLInputElement>('input[type="radio"]:not(:disabled)')
  )
  if (radios.length === 0) return

  const currentIndex = radios.findIndex((r) => r === document.activeElement)
  let nextIndex = currentIndex

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % radios.length
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      nextIndex = currentIndex <= 0 ? radios.length - 1 : currentIndex - 1
      break
    default:
      return
  }

  radios[nextIndex]?.focus()
  // Select the radio whose input is focused; input.value mirrors the label value.
  const target = radios[nextIndex]
  if (target) {
    const raw = target.getAttribute('value') ?? target.value
    const labelVal = raw !== null && raw !== '' && !isNaN(Number(raw)) ? Number(raw) : raw
    changeEvent(labelVal as string | number | boolean)
  }
}
</script>

<template>
  <div
    ref="navRef"
    :class="ns.b()"
    role="radiogroup"
    :aria-disabled="disabledRef"
    @keydown="handleKeydown"
  >
    <slot />
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcRadioGroup styles
 * BEM naming: zc-radio-group
 * Flexbox container for radio button alignment
 * ============================================================ */

.zc-radio-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--spacing-zc-md, 16px);
  align-items: center;
  vertical-align: middle;
}
</style>
