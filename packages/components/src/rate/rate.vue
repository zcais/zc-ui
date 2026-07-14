<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'

defineOptions({ name: 'ZcRate' })

const props = withDefaults(
  defineProps<{
    modelValue?: number
    max?: number
    size?: 'large' | 'medium' | 'small'
    disabled?: boolean
    allowHalf?: boolean
    lowThreshold?: number
    highThreshold?: number
    colors?: string[]
    voidColor?: string
    disabledVoidColor?: string
    showText?: boolean
    showScore?: boolean
    textColor?: string
    texts?: string[]
    scoreTemplate?: string
    clearable?: boolean
    readonly?: boolean
  }>(),
  {
    modelValue: 0,
    max: 5,
    size: 'medium',
    disabled: false,
    allowHalf: false,
    lowThreshold: 2,
    highThreshold: 4,
    colors: () => ['#F7BA2A', '#F7BA2A', '#F7BA2A'],
    voidColor: '#C6D1DE',
    disabledVoidColor: '#EFF2F7',
    showText: false,
    showScore: false,
    textColor: '',
    texts: () => [],
    scoreTemplate: '{value}',
    clearable: false,
    readonly: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number, oldValue: number): void
}>()

const ns = useNamespace('rate')
const { t } = useLocale()

const defaultTexts = computed(() => [
  t('zc.rate.texts.1'),
  t('zc.rate.texts.2'),
  t('zc.rate.texts.3'),
  t('zc.rate.texts.4'),
  t('zc.rate.texts.5'),
])
const displayTexts = computed(() => (props.texts.length > 0 ? props.texts : defaultTexts.value))
const hoverValue = ref<number | null>(null)

const sizeMap: Record<string, number> = {
  large: 28,
  medium: 20,
  small: 14,
}

const starSize = computed(() => sizeMap[props.size] ?? 20)

const currentValue = computed(() => hoverValue.value ?? props.modelValue)

const activeColor = computed(() => {
  const v = currentValue.value
  if (v <= props.lowThreshold) return props.colors[0]
  if (v <= props.highThreshold) return props.colors[1]
  return props.colors[2] ?? props.colors[1]
})

const classes = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('readonly', props.readonly),
])

function getStarFillValue(index: number): number {
  // index is 1-based
  const val = currentValue.value
  const full = Math.floor(val)
  const decimal = val - full

  if (index <= full) return 1
  if (index === full + 1 && props.allowHalf && decimal >= 0.5) return 0.5
  return 0
}

function handleMouseMove(index: number, event: MouseEvent) {
  if (props.disabled || props.readonly) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const isLeftHalf = event.clientX - rect.left < rect.width / 2

  if (props.allowHalf && isLeftHalf) {
    hoverValue.value = index - 0.5
  } else {
    hoverValue.value = index
  }
}

function handleMouseLeave() {
  if (props.disabled || props.readonly) return
  hoverValue.value = null
}

function selectValue(index: number) {
  if (props.disabled || props.readonly) return
  let newValue = hoverValue.value ?? index

  if (props.clearable && newValue === props.modelValue) {
    newValue = 0
  }

  const oldValue = props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue, oldValue)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp': {
      event.preventDefault()
      const newValue = Math.min(props.modelValue + (props.allowHalf ? 0.5 : 1), props.max)
      const oldValue = props.modelValue
      hoverValue.value = null
      emit('update:modelValue', newValue)
      emit('change', newValue, oldValue)
      break
    }
    case 'ArrowLeft':
    case 'ArrowDown': {
      event.preventDefault()
      const newValue = Math.max(props.modelValue - (props.allowHalf ? 0.5 : 1), 0)
      const oldValue = props.modelValue
      hoverValue.value = null
      emit('update:modelValue', newValue)
      emit('change', newValue, oldValue)
      break
    }
    case 'Home': {
      event.preventDefault()
      const oldValue = props.modelValue
      hoverValue.value = null
      emit('update:modelValue', 0)
      emit('change', 0, oldValue)
      break
    }
    case 'End': {
      event.preventDefault()
      const oldValue = props.modelValue
      hoverValue.value = null
      emit('update:modelValue', props.max)
      emit('change', props.max, oldValue)
      break
    }
  }
}

const displayText = computed(() => {
  if (props.showScore) {
    return props.scoreTemplate.replace('{value}', String(props.modelValue))
  }
  if (props.showText && displayTexts.value.length > 0) {
    const idx = Math.min(Math.ceil(props.modelValue) - 1, displayTexts.value.length - 1)
    return displayTexts.value[Math.max(0, idx)]
  }
  return ''
})
</script>

<template>
  <div
    :class="classes"
    role="slider"
    :aria-valuenow="modelValue"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :aria-disabled="disabled || readonly"
    :tabindex="disabled || readonly ? -1 : 0"
    @mouseleave="handleMouseLeave"
    @keydown="handleKeydown"
  >
    <span
      v-for="n in max"
      :key="n"
      :class="ns.e('item')"
      @mousemove="handleMouseMove(n, $event)"
      @click="selectValue(n)"
    >
      <!-- Full star -->
      <svg
        :class="[ns.e('icon'), ns.is('active', getStarFillValue(n) >= 1)]"
        :width="starSize"
        :height="starSize"
        viewBox="0 0 24 24"
        :fill="getStarFillValue(n) >= 1 ? activeColor : 'none'"
        :stroke="getStarFillValue(n) >= 1 ? activeColor : disabled ? disabledVoidColor : voidColor"
        stroke-width="1.5"
      >
        <path d="M12 2l2.9 6.5 7.1.6-5.4 4.7 1.7 7L12 17.3 5.7 21l1.7-7L2 9.1l7.1-.6L12 2z" />
      </svg>
      <!-- Half star overlay -->
      <svg
        v-if="allowHalf && getStarFillValue(n) === 0.5"
        :class="[ns.e('icon'), ns.e('icon-half')]"
        :width="starSize"
        :height="starSize"
        viewBox="0 0 24 24"
        :fill="activeColor"
        :stroke="activeColor"
        stroke-width="1.5"
        style="position: absolute; left: 0; top: 0; clip-path: inset(0 50% 0 0)"
      >
        <path d="M12 2l2.9 6.5 7.1.6-5.4 4.7 1.7 7L12 17.3 5.7 21l1.7-7L2 9.1l7.1-.6L12 2z" />
      </svg>
    </span>
    <span
      v-if="(showText || showScore) && displayText"
      :class="ns.e('text')"
      :style="textColor ? { color: textColor } : undefined"
    >
      {{ displayText }}
    </span>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcRate styles
 * ============================================================ */

.zc-rate {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  line-height: 1;
}

.zc-rate__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.zc-rate__icon {
  display: block;
  transition: transform var(--transition-duration-zc-fast, 0.15s);
}

.zc-rate__item:hover .zc-rate__icon {
  transform: scale(1.15);
}

.zc-rate__text {
  margin-left: var(--zc-rate-gap);
  font-size: var(--zc-rate-text-font-size);
  color: var(--zc-rate-text-color);
}

/* Disabled / readonly */
.zc-rate.is-disabled,
.zc-rate.is-readonly {
  cursor: default;
}

.zc-rate.is-disabled .zc-rate__item,
.zc-rate.is-readonly .zc-rate__item {
  cursor: default;
}

.zc-rate.is-disabled .zc-rate__item:hover .zc-rate__icon,
.zc-rate.is-readonly .zc-rate__item:hover .zc-rate__icon {
  transform: none;
}

.zc-rate.is-disabled .zc-rate__icon {
  opacity: 0.6;
}

.zc-rate.is-disabled .zc-rate__text {
  color: var(--zc-rate-star-disabled-color);
}
</style>
