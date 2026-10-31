<script setup lang="ts">
import { ref, watch, toRef, onMounted } from 'vue'
import { usePopper } from './usePopper'
import type { PopperPlacement } from './types'

defineOptions({ name: 'ZcPopper' })

const props = withDefaults(
  defineProps<{
    reference: HTMLElement | null
    placement?: PopperPlacement
    visible?: boolean
    offset?: number
    showArrow?: boolean
    flip?: boolean
    preventOverflow?: boolean
  }>(),
  {
    placement: 'top',
    visible: false,
    offset: 8,
    showArrow: false,
    flip: true,
    preventOverflow: true,
  }
)

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'placement-change': [placement: PopperPlacement]
}>()

const popperRef = ref<HTMLElement | null>(null)

const { styles, actualPlacement, update } = usePopper({
  reference: () => props.reference,
  popper: () => popperRef.value,
  placement: toRef(props, 'placement'),
  offset: toRef(props, 'offset'),
  flip: toRef(props, 'flip'),
  preventOverflow: toRef(props, 'preventOverflow'),
})

onMounted(() => {
  update()
})

watch(
  actualPlacement,
  (newPlacement) => {
    emit('placement-change', newPlacement)
  },
  { immediate: true }
)
</script>

<template>
  <div
    v-show="visible"
    ref="popperRef"
    class="zc-popper"
    :style="styles"
    :data-placement="actualPlacement"
  >
    <slot />
    <div v-if="showArrow" class="zc-popper__arrow" />
  </div>
</template>
