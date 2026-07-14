<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, useSlots, Comment, type VNode } from 'vue'
import { useNamespace, useResizeObserver } from '@zc-ui/hooks'

defineOptions({ name: 'ZcSegmented' })

export type SegmentedSize = 'large' | 'default' | 'small'

export interface SegmentedOption {
  /** Display label for the segment */
  label?: string
  /** Value of the segment (used for v-model) */
  value: string | number | boolean
  /** Whether this specific segment is disabled */
  disabled?: boolean
  /** Optional payload data for custom rendering */
  payload?: any
}

type RawOption = string | number | SegmentedOption

const props = withDefaults(
  defineProps<{
    /** v-model bound value */
    modelValue?: string | number | boolean
    /** Array of options: string/number shorthand or {label, value, disabled} objects */
    options?: RawOption[]
    /** Size variant */
    size?: SegmentedSize
    /** Stretch to full width of parent container */
    block?: boolean
    /** Disable entire segmented control */
    disabled?: boolean
    /** Name attribute for form integration */
    name?: string
  }>(),
  {
    modelValue: '',
    options: () => [],
    size: 'default',
    block: false,
    disabled: false,
    name: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void
  (e: 'change', value: string | number | boolean): void
}>()

const slots = useSlots()
const ns = useNamespace('segmented')

// ── Normalize options ──────────────────────────────────────────
const normalizedOptions = computed<SegmentedOption[]>(() => {
  // If default slot is used, build options from slot VNodes
  if (slots.default) {
    const vnodes = slots.default()
    const result: SegmentedOption[] = []
    for (const vnode of vnodes) {
      if (!vnode) continue
      // Skip comment/text whitespace nodes
      if (typeof vnode === 'string' || typeof vnode === 'number') continue
      if (vnode.type === Comment) continue
      const vnodeProps = (vnode as VNode).props || {}
      const value = vnodeProps.value as string | number | boolean
      if (value === undefined) continue
      result.push({
        label: (vnodeProps.label as string) || String(value),
        value,
        disabled: vnodeProps.disabled as boolean | undefined,
      })
    }
    if (result.length > 0) return result
  }

  // Otherwise use the options prop
  return props.options.map((opt): SegmentedOption => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: opt, disabled: false }
    }
    return opt
  })
})

// ── Active index ───────────────────────────────────────────────
const activeIndex = computed(() => {
  const idx = normalizedOptions.value.findIndex((o) => o.value === props.modelValue)
  return idx >= 0 ? idx : 0
})

// ── Thumb animation ────────────────────────────────────────────
const rootRef = ref<HTMLElement>()
const itemRefs = ref<HTMLElement[]>([])
const thumbStyle = ref<{ transform: string; width: string; opacity: number }>({
  transform: 'translateX(0)',
  width: '0px',
  opacity: 0,
})

function updateThumb() {
  const el = itemRefs.value[activeIndex.value]
  if (!el) {
    thumbStyle.value = { transform: 'translateX(0)', width: '0px', opacity: 0 }
    return
  }
  thumbStyle.value = {
    transform: `translateX(${el.offsetLeft}px)`,
    width: `${el.offsetWidth}px`,
    opacity: 1,
  }
}

onMounted(() => {
  nextTick(updateThumb)
})

watch(
  () => props.modelValue,
  () => nextTick(updateThumb)
)

watch(
  () => normalizedOptions.value,
  () => nextTick(updateThumb)
)

// Re-position thumb when the container or any item resizes
useResizeObserver(rootRef, () => updateThumb())

// ── Interaction ────────────────────────────────────────────────
function isDisabled(option: SegmentedOption): boolean {
  return props.disabled || !!option.disabled
}

function select(option: SegmentedOption) {
  if (isDisabled(option)) return
  if (option.value === props.modelValue) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

function handleClick(option: SegmentedOption, index: number) {
  select(option)
  // Ensure the clicked item receives focus
  const el = itemRefs.value[index]
  if (el) el.focus()
}

// ── Keyboard navigation ────────────────────────────────────────
function findFocusable(start: number, direction: 1 | -1): number {
  const opts = normalizedOptions.value
  let idx = start + direction
  while (idx >= 0 && idx < opts.length) {
    if (!isDisabled(opts[idx])) return idx
    idx += direction
  }
  return -1
}

function focusItem(index: number) {
  const el = itemRefs.value[index]
  if (el) el.focus()
}

function handleKeydown(event: KeyboardEvent, index: number) {
  const opts = normalizedOptions.value
  let targetIndex = -1

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      targetIndex = findFocusable(index, 1)
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      targetIndex = findFocusable(index, -1)
      break
    case 'Home':
      for (let i = 0; i < opts.length; i++) {
        if (!isDisabled(opts[i])) {
          targetIndex = i
          break
        }
      }
      break
    case 'End':
      for (let i = opts.length - 1; i >= 0; i--) {
        if (!isDisabled(opts[i])) {
          targetIndex = i
          break
        }
      }
      break
    case ' ':
    case 'Enter':
      event.preventDefault()
      select(opts[index])
      return
    default:
      return
  }

  if (targetIndex >= 0) {
    event.preventDefault()
    // Move focus and select
    select(opts[targetIndex])
    focusItem(targetIndex)
  }
}

// ── Classes ────────────────────────────────────────────────────
const classes = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('block', props.block),
])

function itemClasses(option: SegmentedOption, index: number) {
  return [
    ns.e('item'),
    ns.is('selected', index === activeIndex.value),
    ns.is('disabled', isDisabled(option)),
  ]
}

function getItemTabIndex(option: SegmentedOption, index: number): number | undefined {
  if (isDisabled(option)) return undefined
  // Roving tabindex: only active item is in tab order
  return index === activeIndex.value ? 0 : -1
}

// ── Slot helpers ───────────────────────────────────────────────
function hasItemSlot(option: SegmentedOption): boolean {
  return !!slots[`item-${option.value}`]
}
</script>

<template>
  <div
    ref="rootRef"
    :class="classes"
    role="radiogroup"
    :aria-disabled="disabled"
    :aria-readonly="false"
  >
    <!-- Motion thumb indicator -->
    <div :class="ns.e('thumb')" :style="thumbStyle" aria-hidden="true" />

    <!-- Segmented items -->
    <div
      v-for="(option, index) in normalizedOptions"
      :key="String(option.value)"
      :ref="
        (el) => {
          if (el) itemRefs[index] = el as HTMLElement
        }
      "
      :class="itemClasses(option, index)"
      role="radio"
      :aria-checked="index === activeIndex"
      :aria-disabled="isDisabled(option)"
      :tabindex="getItemTabIndex(option, index)"
      @click="handleClick(option, index)"
      @keydown="handleKeydown($event, index)"
    >
      <input
        v-if="name"
        type="radio"
        :name="name"
        :value="option.value"
        :checked="index === activeIndex"
        :disabled="isDisabled(option)"
        :class="ns.e('input')"
        tabindex="-1"
        aria-hidden="true"
        @click.prevent
      />
      <slot
        v-if="hasItemSlot(option)"
        :name="`item-${option.value}`"
        :option="option"
        :selected="index === activeIndex"
      />
      <span v-else :class="ns.e('item-label')">{{ option.label ?? option.value }}</span>
    </div>
  </div>
</template>

<style scoped>
.zc-segmented {
  --zc-segmented-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-segmented-item-text-color: var(--color-zc-text-regular, #606266);
  --zc-segmented-item-active-bg-color: var(--color-zc-bg-base, #fff);
  --zc-segmented-item-active-text-color: var(--color-zc-text-primary, #303133);
  --zc-segmented-item-hover-text-color: var(--color-zc-text-primary, #303133);
  --zc-segmented-border-radius: var(--radius-zc-base, 4px);
  --zc-segmented-item-padding: 0 12px;
  --zc-segmented-font-size: var(--text-zc-base, 14px);
  --zc-segmented-item-height: 32px;

  display: inline-flex;
  position: relative;
  padding: 2px;
  background-color: var(--zc-segmented-bg-color);
  border-radius: var(--zc-segmented-border-radius);
  font-size: var(--zc-segmented-font-size);
  line-height: 1;
  user-select: none;
  -webkit-user-select: none;
}

/* ── Block mode ────────────────────────────────────── */
.zc-segmented.is-block {
  display: flex;
  width: 100%;
}

.zc-segmented.is-block .zc-segmented__item {
  flex: 1;
  justify-content: center;
}

/* ── Disabled (entire control) ─────────────────────── */
.zc-segmented.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* ── Motion thumb ──────────────────────────────────── */
.zc-segmented__thumb {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  border-radius: calc(var(--zc-segmented-border-radius) - 1px);
  background-color: var(--zc-segmented-item-active-bg-color);
  box-shadow:
    0 2px 8px -2px rgba(0, 0, 0, 0.05),
    0 1px 4px -1px rgba(0, 0, 0, 0.07),
    0 0 1px 0 rgba(0, 0, 0, 0.08);
  transition-property: transform, width;
  transition-duration: var(--transition-duration-zc-base, 0.3s);
  transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
  pointer-events: none;
  z-index: 1;
}

/* ── Items ─────────────────────────────────────────── */
.zc-segmented__item {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--zc-segmented-item-padding);
  cursor: pointer;
  border-radius: calc(var(--zc-segmented-border-radius) - 1px);
  color: var(--zc-segmented-item-text-color);
  white-space: nowrap;
  transition: color var(--transition-duration-zc-base, 0.25s)
    var(--ease-zc-in-out, cubic-bezier(0.4, 0, 0.2, 1));
  outline: none;
}

.zc-segmented__item:hover:not(.is-disabled):not(.is-selected) {
  color: var(--zc-segmented-item-hover-text-color);
}

.zc-segmented__item.is-selected {
  color: var(--zc-segmented-item-active-text-color);
  font-weight: 500;
}

.zc-segmented__item.is-selected:hover {
  color: var(--zc-segmented-item-active-text-color);
}

.zc-segmented__item.is-disabled {
  cursor: not-allowed;
  color: var(--color-zc-text-placeholder, #c0c4cc);
}

.zc-segmented__item:focus-visible {
  box-shadow: 0 0 0 2px var(--color-zc-primary-200, #a0cfff);
}

/* ── Item label ────────────────────────────────────── */
.zc-segmented__item-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ── Hidden input ──────────────────────────────────── */
.zc-segmented__input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  margin: 0;
  pointer-events: none;
}

/* ── Size variants ─────────────────────────────────── */
.zc-segmented--large {
  min-height: 40px;
  font-size: var(--text-zc-lg, 16px);
  border-radius: var(--zc-segmented-border-radius);
}

.zc-segmented--large .zc-segmented__item {
  padding: 0 16px;
  min-height: 36px;
}

.zc-segmented--default {
  min-height: var(--zc-segmented-item-height);
}

.zc-segmented--default .zc-segmented__item {
  padding: 0 12px;
  min-height: 28px;
}

.zc-segmented--small {
  min-height: 24px;
  font-size: var(--text-zc-sm, 12px);
}

.zc-segmented--small .zc-segmented__item {
  padding: 0 8px;
  min-height: 20px;
}
</style>
