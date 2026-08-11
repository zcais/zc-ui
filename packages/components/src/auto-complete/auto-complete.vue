<script setup lang="ts">
import { computed, ref, shallowRef, onBeforeUnmount } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useClickOutside } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import type { AutoCompleteOption, AutoCompleteFetcher } from './types'

defineOptions({ name: 'ZcAutoComplete' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    fetchSuggestions?: AutoCompleteFetcher
    valueKey?: string
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    size?: 'large' | 'medium' | 'small'
    debounce?: number
    highlightFirstItem?: boolean
    noDataText?: string
  }>(),
  {
    modelValue: '',
    fetchSuggestions: undefined,
    valueKey: 'value',
    placeholder: '',
    disabled: false,
    clearable: false,
    size: 'medium',
    debounce: 300,
    highlightFirstItem: true,
    noDataText: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', item: AutoCompleteOption): void
  (e: 'change', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const ns = useNamespace('auto-complete')
const { t } = useLocale()

const placeholderText = computed(() => props.placeholder || t('zc.autoComplete.placeholder'))
const noDataTextComputed = computed(() => props.noDataText || t('zc.autoComplete.noData'))
const searchingText = computed(() => t('zc.autoComplete.searching'))

const containerRef = shallowRef<HTMLElement>()
const inputRef = shallowRef<HTMLInputElement>()

const visible = ref(false)
const isFocused = ref(false)
const loading = ref(false)
const suggestions = ref<AutoCompleteOption[]>([])
const activeIndex = ref(-1)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

useClickOutside(containerRef, () => {
  if (visible.value) {
    visible.value = false
  }
})

const classes = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('focused', isFocused.value),
  ns.is('open', visible.value),
])

function getDisplayValue(item: AutoCompleteOption): string {
  return String(item[props.valueKey as keyof AutoCompleteOption] ?? item.label ?? item.value)
}

async function loadSuggestions(query: string) {
  if (!props.fetchSuggestions || !query) {
    suggestions.value = []
    return
  }

  loading.value = true
  try {
    const result = await props.fetchSuggestions(query)
    suggestions.value = result || []
    activeIndex.value = props.highlightFirstItem && suggestions.value.length > 0 ? 0 : -1
    visible.value = suggestions.value.length > 0
  } catch {
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  emit('update:modelValue', value)
  emit('change', value)

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loadSuggestions(value)
  }, props.debounce)
}

function selectItem(item: AutoCompleteOption) {
  if (item.disabled) return
  const display = getDisplayValue(item)
  emit('update:modelValue', display)
  emit('select', item)
  visible.value = false
  suggestions.value = []
}

function handleKeyDown(event: KeyboardEvent) {
  if (!visible.value || suggestions.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeIndex.value = Math.min(activeIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
      break
    case 'Enter':
      if (activeIndex.value >= 0 && activeIndex.value < suggestions.value.length) {
        event.preventDefault()
        selectItem(suggestions.value[activeIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      visible.value = false
      break
  }
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false
  emit('blur', event)
}

const showClear = computed(
  () => props.clearable && !!props.modelValue && !props.disabled && isFocused.value
)

function handleClear() {
  emit('update:modelValue', '')
  emit('change', '')
  inputRef.value?.focus()
}

defineExpose({ focus: () => inputRef.value?.focus(), blur: () => inputRef.value?.blur() })

// Clean up pending debounce timer on unmount to prevent memory leak
onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
})
</script>

<template>
  <div ref="containerRef" :class="classes">
    <div :class="ns.e('wrapper')">
      <span v-if="$slots.prefix" :class="ns.e('prefix')"><slot name="prefix" /></span>
      <input
        ref="inputRef"
        :class="ns.e('inner')"
        type="text"
        :value="modelValue"
        :placeholder="placeholderText"
        :disabled="disabled"
        @input="handleInput"
        @keydown="handleKeyDown"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <span v-if="$slots.suffix" :class="ns.e('suffix')"><slot name="suffix" /></span>
      <span v-if="showClear" :class="ns.e('clear')" @click.stop="handleClear">
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 8l8 8M16 8l-8 8" stroke-linecap="round" />
        </svg>
      </span>
    </div>
    <transition name="zc-auto-complete-dropdown">
      <div v-show="visible" :class="ns.e('suggestions')">
        <ul v-if="suggestions.length > 0" :class="ns.e('list')">
          <li
            v-for="(item, index) in suggestions"
            :key="index"
            :class="[
              ns.e('item'),
              ns.is('active', activeIndex === index),
              ns.is('disabled', item.disabled === true),
            ]"
            @click="selectItem(item)"
            @mouseenter="activeIndex = index"
          >
            <slot :item="item" :index="index">{{ getDisplayValue(item) }}</slot>
          </li>
        </ul>
        <div v-else-if="!loading" :class="ns.e('empty')">{{ noDataTextComputed }}</div>
        <div v-if="loading" :class="ns.e('loading')">{{ searchingText }}</div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcAutoComplete styles
 * ============================================================ */

.zc-auto-complete {
  /* Component-level CSS variables */
  --zc-auto-complete-bg-color: var(--color-zc-white, #fff);
  --zc-auto-complete-text-color: var(--color-zc-text-primary, #303133);
  --zc-auto-complete-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-auto-complete-hover-border-color: var(--color-zc-primary-300, #a0cfff);
  --zc-auto-complete-focus-border-color: var(--color-zc-primary-500, #409eff);
  --zc-auto-complete-focus-shadow-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-auto-complete-placeholder-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-auto-complete-disabled-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-auto-complete-disabled-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-auto-complete-icon-color: var(--color-zc-text-secondary, #909399);
  --zc-auto-complete-dropdown-bg-color: var(--color-zc-white, #fff);
  --zc-auto-complete-dropdown-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-auto-complete-item-hover-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-auto-complete-border-radius: var(--radius-zc-base, 4px);
  --zc-auto-complete-font-size: var(--text-zc-base, 14px);
  --zc-auto-complete-height: 36px;
  --zc-auto-complete-height-large: 42px;
  --zc-auto-complete-height-small: 28px;

  position: relative;
  display: inline-block;
  width: 100%;
  font-size: var(--zc-auto-complete-font-size);
}

.zc-auto-complete__wrapper {
  display: inline-flex;
  align-items: center;
  width: 100%;
  background: var(--color-zc-white, #fff);
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  padding: 0 11px;
  box-sizing: border-box;
  transition: border-color var(--transition-duration-zc-base, 0.25s);
}

.zc-auto-complete__wrapper:hover {
  border-color: var(--color-zc-primary-300, #a0cfff);
}

.zc-auto-complete.is-focused .zc-auto-complete__wrapper {
  border-color: var(--color-zc-primary-500, #409eff);
  box-shadow: 0 0 0 2px var(--color-zc-primary-50, #ecf5ff);
}

.zc-auto-complete.is-disabled .zc-auto-complete__wrapper {
  background: var(--color-zc-fill-light, #f5f7fa);
  border-color: var(--color-zc-border-light, #e4e7ed);
  cursor: not-allowed;
}

.zc-auto-complete__inner {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-zc-text-primary, #303133);
  font-size: inherit;
  height: 36px;
  -webkit-appearance: none;
  box-sizing: border-box;
}

.zc-auto-complete__inner::placeholder {
  color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-auto-complete__inner:disabled {
  cursor: not-allowed;
}

/* Sizes */
.zc-auto-complete--large .zc-auto-complete__inner {
  height: 42px;
  font-size: var(--text-zc-md, 16px);
}
.zc-auto-complete--small .zc-auto-complete__inner {
  height: 28px;
  font-size: var(--text-zc-sm, 13px);
}

/* Prefix / Suffix */
.zc-auto-complete__prefix,
.zc-auto-complete__suffix {
  display: inline-flex;
  align-items: center;
  color: var(--zc-auto-complete-icon-color);
}
.zc-auto-complete__prefix {
  margin-right: 6px;
}
.zc-auto-complete__suffix {
  margin-left: 6px;
}

/* Clear button */
.zc-auto-complete__clear {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: var(--zc-auto-complete-icon-color);
  transition: color var(--transition-duration-zc-fast, 0.15s);
}
.zc-auto-complete__clear:hover {
  color: var(--zc-auto-complete-text-color);
}

/* Suggestions dropdown */
.zc-auto-complete__suggestions {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: var(--z-zc-dropdown, 1000);
  background: var(--zc-auto-complete-dropdown-bg-color);
  border: 1px solid var(--zc-auto-complete-dropdown-border-color);
  border-radius: var(--zc-auto-complete-border-radius);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  max-height: 280px;
  overflow-y: auto;
  box-sizing: border-box;
}

.zc-auto-complete__list {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

.zc-auto-complete__item {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  cursor: pointer;
  color: var(--color-zc-text-regular, #606266);
  transition: background var(--transition-duration-zc-fast, 0.15s);
}

.zc-auto-complete__item:hover,
.zc-auto-complete__item.is-active {
  background: var(--zc-auto-complete-item-hover-bg-color);
}

.zc-auto-complete__item.is-disabled {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

.zc-auto-complete__empty,
.zc-auto-complete__loading {
  padding: 16px;
  text-align: center;
  color: var(--color-zc-text-secondary, #909399);
}

/* Dropdown transition */
.zc-auto-complete-dropdown-enter-active,
.zc-auto-complete-dropdown-leave-active {
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}
.zc-auto-complete-dropdown-enter-from,
.zc-auto-complete-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
