<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import type { InputTagSize } from './types'

defineOptions({ name: 'ZcInputTag' })

export type { InputTagSize }

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    max?: number
    allowDuplicate?: boolean
    trigger?: 'enter' | 'space' | 'comma'
    clearable?: boolean
    size?: InputTagSize
    closable?: boolean
  }>(),
  {
    modelValue: () => [],
    placeholder: '请输入标签',
    disabled: false,
    readonly: false,
    max: 0,
    allowDuplicate: false,
    trigger: 'enter',
    clearable: false,
    size: 'medium',
    closable: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', tags: string[]): void
  (e: 'add', tag: string): void
  (e: 'remove', tag: string): void
  (e: 'clear'): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

const ns = useNamespace('input-tag')
const inputValue = ref('')
const inputRef = shallowRef<HTMLInputElement>()
const isFocused = ref(false)

const tags = computed(() => props.modelValue)

const isMaxed = computed(() => props.max > 0 && tags.value.length >= props.max)

function addTag(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return

  // Check max limit
  if (props.max > 0 && tags.value.length >= props.max) return

  // Check duplicate
  if (!props.allowDuplicate && tags.value.includes(trimmed)) return

  const newTags = [...tags.value, trimmed]
  emit('update:modelValue', newTags)
  emit('add', trimmed)
  inputValue.value = ''
}

function removeTag(index: number) {
  const tag = tags.value[index]
  const newTags = tags.value.filter((_, i) => i !== index)
  emit('update:modelValue', newTags)
  emit('remove', tag)
}

function clearAll() {
  emit('update:modelValue', [])
  emit('clear')
}

function handleKeydown(e: KeyboardEvent) {
  if (props.disabled || props.readonly) return

  // Backspace on empty input removes last tag
  if (e.key === 'Backspace' && inputValue.value === '' && tags.value.length > 0) {
    removeTag(tags.value.length - 1)
    return
  }

  // Enter always adds
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag(inputValue.value)
    return
  }

  // Space trigger
  if (props.trigger === 'space' && e.key === ' ') {
    e.preventDefault()
    addTag(inputValue.value)
    return
  }

  // Comma trigger
  if (props.trigger === 'comma' && e.key === ',') {
    e.preventDefault()
    addTag(inputValue.value)
    return
  }
}

function handleBlur() {
  isFocused.value = false
  // Add remaining text as tag on blur
  if (inputValue.value.trim()) {
    addTag(inputValue.value)
  }
  emit('blur')
}

function handleFocus() {
  isFocused.value = true
  emit('focus')
}

function focusInput() {
  inputRef.value?.focus()
}

defineExpose({ focus: focusInput })
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(size),
      ns.is('disabled', disabled),
      ns.is('readonly', readonly),
      ns.is('focused', isFocused),
    ]"
    @click="focusInput"
  >
    <!-- Tags -->
    <span v-for="(tag, index) in tags" :key="`${tag}-${index}`" :class="ns.e('tag')">
      {{ tag }}
      <button
        v-if="closable && !disabled && !readonly"
        :class="ns.e('tag-close')"
        type="button"
        :aria-label="`移除标签 ${tag}`"
        @click.stop="removeTag(index)"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M6 18L18 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </span>

    <!-- Input -->
    <input
      ref="inputRef"
      v-model="inputValue"
      :class="ns.e('input')"
      :placeholder="tags.length === 0 ? placeholder : ''"
      :disabled="disabled"
      :readonly="readonly || isMaxed"
      @keydown="handleKeydown"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- Clear all -->
    <button
      v-if="clearable && tags.length > 0 && !disabled && !readonly"
      :class="ns.e('clear')"
      type="button"
      aria-label="清除全部"
      @click.stop="clearAll"
    >
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6 6l12 12M6 18L18 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.zc-input-tag {
  --zc-input-tag-bg: var(--color-zc-bg-base, #fff);
  --zc-input-tag-border: var(--color-zc-border, #dcdfe6);
  --zc-input-tag-border-hover: var(--color-zc-border-hover, #c0c4cc);
  --zc-input-tag-border-focus: var(--color-zc-primary, #409eff);
  --zc-input-tag-text: var(--color-zc-text-primary, #303133);
  --zc-input-tag-placeholder: var(--color-zc-text-placeholder, #a8abb2);
  --zc-input-tag-radius: var(--radius-zc-base, 4px);
  --zc-input-tag-padding-x: 8px;
  --zc-input-tag-gap: 6px;
  --zc-input-tag-min-height: 34px;
  --zc-input-tag-font-size: var(--text-zc-base, 14px);

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--zc-input-tag-gap);
  width: 100%;
  min-height: var(--zc-input-tag-min-height);
  padding: 4px var(--zc-input-tag-padding-x);
  border: 1px solid var(--zc-input-tag-border);
  border-radius: var(--zc-input-tag-radius);
  background: var(--zc-input-tag-bg);
  cursor: text;
  box-sizing: border-box;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.zc-input-tag:hover {
  border-color: var(--zc-input-tag-border-hover);
}

.zc-input-tag.is-focused {
  border-color: var(--zc-input-tag-border-focus);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.12);
}

.zc-input-tag.is-disabled {
  background: var(--color-zc-fill-light, #f5f7fa);
  cursor: not-allowed;
}

.zc-input-tag.is-disabled input {
  cursor: not-allowed;
}

/* Size variants */
.zc-input-tag--small {
  --zc-input-tag-min-height: 28px;
  --zc-input-tag-font-size: var(--text-zc-sm, 13px);
  --zc-input-tag-padding-x: 6px;
}

.zc-input-tag--large {
  --zc-input-tag-min-height: 42px;
  --zc-input-tag-font-size: var(--text-zc-md, 16px);
  --zc-input-tag-padding-x: 12px;
}

/* Tags */
.zc-input-tag__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: var(--color-zc-primary-light-9, #ecf5ff);
  color: var(--color-zc-primary, #409eff);
  border-radius: var(--radius-zc-base, 4px);
  font-size: var(--zc-input-tag-font-size);
  line-height: 1.4;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.zc-input-tag__tag-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0.6;
  padding: 0;
  border-radius: 50%;
  transition:
    opacity 0.2s,
    background 0.2s;
}

.zc-input-tag__tag-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

.zc-input-tag__tag-close svg {
  width: 10px;
  height: 10px;
}

/* Input */
.zc-input-tag__input {
  flex: 1;
  min-width: 60px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--zc-input-tag-text);
  font-size: var(--zc-input-tag-font-size);
  height: calc(var(--zc-input-tag-min-height) - 10px);
  padding: 0;
}

.zc-input-tag__input::placeholder {
  color: var(--zc-input-tag-placeholder);
}

/* Clear button */
.zc-input-tag__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: pointer;
  padding: 0;
  border-radius: 50%;
  transition: color 0.2s;
}

.zc-input-tag__clear:hover {
  color: var(--color-zc-text-secondary, #909399);
}

.zc-input-tag__clear svg {
  width: 12px;
  height: 12px;
}
</style>
