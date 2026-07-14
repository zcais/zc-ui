<script setup lang="ts">
import { computed, provide, ref, watch, type ComputedRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcCollapse' })

export type CollapseModelValue = string | number | Array<string | number>
export type CollapseItemName = string | number

const props = withDefaults(
  defineProps<{
    /** Active panel name(s) — v-model */
    modelValue?: CollapseModelValue
    /** Accordion mode: only one panel open at a time */
    accordion?: boolean
  }>(),
  {
    modelValue: () => [],
    accordion: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: CollapseModelValue): void
  (e: 'change', value: CollapseModelValue): void
}>()

const ns = useNamespace('collapse')

const activeNames = ref<Array<string | number>>(
  Array.isArray(props.modelValue)
    ? props.modelValue
    : props.modelValue !== undefined
      ? [props.modelValue]
      : []
)

watch(
  () => props.modelValue,
  (val) => {
    if (Array.isArray(val)) {
      activeNames.value = val
    } else if (val === '' || val === undefined) {
      activeNames.value = []
    } else {
      activeNames.value = [val]
    }
  }
)

function toggleItem(name: string | number | undefined) {
  if (name === undefined) return

  if (props.accordion) {
    const newValue = activeNames.value.includes(name) ? [] : [name]
    activeNames.value = newValue
    emitValue(newValue)
  } else {
    const idx = activeNames.value.indexOf(name)
    if (idx > -1) {
      const newValue = activeNames.value.filter((n) => n !== name)
      activeNames.value = newValue
      emitValue(newValue)
    } else {
      const newValue = [...activeNames.value, name]
      activeNames.value = newValue
      emitValue(newValue)
    }
  }
}

function emitValue(value: Array<string | number>) {
  const emitVal: CollapseModelValue = props.accordion ? (value[0] ?? '') : value
  emit('update:modelValue', emitVal)
  emit('change', emitVal)
}

const activeNamesComputed = computed(() => activeNames.value) as ComputedRef<Array<string | number>>

provide('zcCollapse', {
  activeNames: activeNamesComputed,
  toggleItem,
})

const classes = computed(() => [ns.b(), ns.is('accordion', props.accordion)])
</script>

<template>
  <div :class="classes" role="tablist">
    <slot />
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcCollapse styles
 * BEM naming: zc-collapse
 * ============================================================ */

.zc-collapse {
  --zc-collapse-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-collapse-header-bg-color: var(--color-zc-bg-base, #fff);
--zc-collapse-header-text-color: var(--color-zc-text-primary, #303133);
--zc-collapse-header-font-size: var(--text-zc-md, 16px);
  --zc-collapse-header-height: 48px;
  --zc-collapse-content-bg-color: var(--color-zc-bg-base, #fff);
  --zc-collapse-content-text-color: var(--color-zc-text-regular, #606266);
  --zc-collapse-content-padding: 16px 0;
  --zc-collapse-active-header-color: var(--color-zc-primary-500, #409eff);

  border-top: 1px solid var(--zc-collapse-border-color);
  border-bottom: 1px solid var(--zc-collapse-border-color);
}
</style>
