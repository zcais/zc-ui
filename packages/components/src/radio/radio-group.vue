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
import { ref, provide, watch, shallowRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

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
const disabledRef = ref(props.disabled)
const nameRef = ref(props.name)

// ---- Sync props → refs so child components react to dynamic changes ----
watch(
  () => props.modelValue,
  (val) => {
    modelValueRef.value = val
  }
)
watch(
  () => props.disabled,
  (val) => {
    disabledRef.value = val
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

  const radios = Array.from(
    container.querySelectorAll<HTMLElement>('[role="radio"]:not(.is-disabled)')
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
  // Find the label value of the focused radio and select it
  const target = radios[nextIndex]
  const labelAttr = target?.getAttribute('data-label')
  if (labelAttr !== null) {
    const labelVal = isNaN(Number(labelAttr)) ? labelAttr : Number(labelAttr)
    changeEvent(labelVal as string | number | boolean)
  }
}
</script>

<template>
  <div
    ref="navRef"
    :class="ns.b()"
    role="radiogroup"
    :aria-disabled="disabled"
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
