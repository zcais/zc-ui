<script setup lang="ts">
import {
  computed,
  ref,
  shallowRef,
  nextTick,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { useNamespace, useClickOutside, useId } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import type {
  MentionOption,
  MentionPlacement,
  MentionType,
  MentionBlurBehavior,
  MentionFilterFunc,
  MentionOptionGroup,
} from './types'

defineOptions({ name: 'ZcMention' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options?: MentionOption[]
    /** 1. Multi-trigger support */
    trigger?: string | string[]
    /** 2. Input mode */
    type?: MentionType
    disabled?: boolean
    placeholder?: string
    placement?: MentionPlacement
    filterable?: boolean
    /** 4. Custom filter function */
    filter?: MentionFilterFunc
    /** 5. Async loading */
    loading?: boolean
    loadingText?: string
    /** 6. Option groups */
    optionGroups?: MentionOptionGroup[]
    /** 9. Blur behavior */
    blurBehavior?: MentionBlurBehavior
    /** 10. Split mode */
    split?: boolean
    /** 11. Max height */
    maxHeight?: number | string
    /** 8. Teleport */
    teleport?: boolean | string
  }>(),
  {
    modelValue: '',
    options: () => [],
    trigger: '@',
    type: 'textarea',
    disabled: false,
    placeholder: '',
    placement: 'bottom',
    filterable: true,
    filter: undefined,
    loading: false,
    loadingText: '',
    optionGroups: () => [],
    blurBehavior: 'clear',
    split: false,
    maxHeight: 240,
    teleport: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'select', option: MentionOption): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'search', query: string, trigger: string): void
}>()

const ns = useNamespace('mention')
const { t } = useLocale()
const uid = useId('zc-mention').id

const placeholderText = computed(() => props.placeholder || t('zc.mention.placeholder'))
const loadingDisplayText = computed(() => props.loadingText || t('zc.mention.loading'))
const emptyDisplayText = computed(() => t('zc.mention.empty'))

// ---- Refs ----
const containerRef = shallowRef<HTMLElement>()
const inputRef = shallowRef<HTMLElement>() // textarea | input
const editableRef = shallowRef<HTMLElement>() // contenteditable (split mode)
const dropdownRef = shallowRef<HTMLElement>()

// ---- State ----
const visible = ref(false)
const isFocused = ref(false)
const activeIndex = ref(-1)
const searchText = ref('')
const triggerPosition = ref(0)
/** The trigger character that activated the current search session */
const activeTriggerChar = ref('@')

// ---- Computed: Trigger characters ----
const triggerCharacters = computed<string[]>(() => {
  if (Array.isArray(props.trigger)) return props.trigger
  return [props.trigger as string]
})

// ---- Computed: Filtered options ----
const filteredOptions = computed<MentionOption[]>(() => {
  if (!props.filterable || !searchText.value) {
    return props.options
  }
  const keyword = searchText.value.toLowerCase()
  const filterFn =
    props.filter ??
    ((opt: MentionOption, kw: string) => {
      const label = (opt.label ?? opt.value).toLowerCase()
      return label.includes(kw)
    })

  return props.options.filter((opt) =>
    filterFn(opt, keyword, activeTriggerChar.value),
  )
})

/** Whether any option groups are configured */
const hasGroups = computed(() => props.optionGroups.length > 0)

/** Options organized by groups for grouped rendering */
const groupedDisplayOptions = computed(() => {
  if (!hasGroups.value) return []
  return props.optionGroups
    .map((group) => ({
      ...group,
      options: filteredOptions.value.filter((opt) => opt.group === group.value),
    }))
    .filter((group) => group.options.length > 0)
})

/** Whether to show dropdown */
const dropdownVisible = computed(
  () => visible.value && (props.loading || filteredOptions.value.length > 0),
)

/** Whether to show empty state */
const emptyVisible = computed(
  () => visible.value && !props.loading && filteredOptions.value.length === 0,
)

// ---- Computed: Dropdown style ----
const dropdownMaxHeight = computed(() =>
  typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : (props.maxHeight as string),
)

/** Teleport target */
const teleportTarget = computed(() => {
  if (props.teleport === true) return 'body'
  if (typeof props.teleport === 'string') return props.teleport
  return undefined
})

/** Dynamic dropdown position for Teleport mode */
const dropdownPos = ref({ top: 0, left: 0, width: 0 })
const dropdownPlacement = ref<MentionPlacement>('bottom')

function updateDropdownPosition() {
  const el = props.split ? editableRef.value : inputRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  dropdownPos.value = {
    top: rect.bottom,
    left: rect.left,
    width: rect.width,
  }
  dropdownPlacement.value = props.placement
}

const teleportedStyle = computed(() => {
  const p = dropdownPlacement.value
  const pos = dropdownPos.value
  if (p === 'top') {
    const el = props.split ? editableRef.value : inputRef.value
    const top = el ? el.getBoundingClientRect().top - 4 : 0
    return {
      position: 'fixed' as const,
      left: `${pos.left}px`,
      width: `${pos.width}px`,
      bottom: `${window.innerHeight - top}px`,
      maxHeight: dropdownMaxHeight.value,
    }
  }
  return {
    position: 'fixed' as const,
    left: `${pos.left}px`,
    width: `${pos.width}px`,
    top: `${pos.top + 4}px`,
    maxHeight: dropdownMaxHeight.value,
  }
})

// ---- Computed: ARIA ----
const dropdownId = computed(() => `zc-mention-listbox-${uid}`)
const getOptionId = (index: number) => `zc-mention-option-${uid}-${index}`

const ariaActiveDescendant = computed(() =>
  activeIndex.value >= 0 ? getOptionId(activeIndex.value) : undefined,
)

// ---- Computed: Classes ----
const classes = computed(() => [
  ns.b(),
  ns.is('disabled', props.disabled),
  ns.is('focused', isFocused.value),
  ns.is('split', props.split),
])

const inputClasses = computed(() =>
  props.type === 'input' ? ns.e('input') : ns.e('textarea'),
)

// ============================================================
// Actions
// ============================================================

/**
 * Scan backwards from cursor to find a trigger character.
 * Returns the trigger char and query, or null if no trigger found.
 */
function detectTrigger(value: string, cursorPos: number) {
  const triggers = triggerCharacters.value
  for (let i = cursorPos - 1; i >= 0; i--) {
    const char = value[i]
    if (triggers.includes(char)) {
      // Ensure the character before the trigger is whitespace or start
      if (i > 0 && !/\s/.test(value[i - 1]) && !triggers.includes(value[i - 1])) {
        // Trigger is in the middle of a word — skip
        continue
      }
      return {
        trigger: char,
        position: i + 1,
        query: value.substring(i + 1, cursorPos),
      }
    }
    if (/\s/.test(char)) break
  }
  return null
}

/** Shared trigger-detection logic used by textarea, input, and split modes */
function processTrigger(value: string, cursorPos: number) {
  const result = detectTrigger(value, cursorPos)
  if (result) {
    searchText.value = result.query
    activeTriggerChar.value = result.trigger
    triggerPosition.value = result.position
    visible.value = true
    activeIndex.value = filteredOptions.value.length > 0 ? 0 : -1
    emit('search', result.query, result.trigger)

    if (props.teleport) {
      nextTick(() => updateDropdownPosition())
    }
  } else {
    visible.value = false
    searchText.value = ''
  }
}

// ---- Input handlers ----

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const value = target.value
  const cursorPos = target.selectionStart ?? value.length

  processTrigger(value, cursorPos)
  emit('update:modelValue', value)
  emit('change', value)
}

function handleSplitInput(event: Event) {
  const target = event.target as HTMLElement
  const value = target.innerText || target.textContent || ''
  const cursorPos = getSplitCursorOffset()

  processTrigger(value, cursorPos)
  emit('update:modelValue', value)
  emit('change', value)
}

/** Get cursor text offset within contenteditable */
function getSplitCursorOffset(): number {
  const el = editableRef.value
  if (!el) return 0
  try {
    const selection = window.getSelection?.()
    if (!selection || selection.rangeCount === 0) return (el.innerText || '').length

    const range = selection.getRangeAt(0)
    const preRange = range.cloneRange()
    preRange.selectNodeContents(el)
    preRange.setEnd(range.endContainer, range.endOffset)
    return preRange.toString().length
  } catch {
    return (el.innerText || '').length
  }
}

/** Place cursor at end of contenteditable */
function placeCursorEnd(el: HTMLElement) {
  try {
    const selection = window.getSelection?.()
    if (!selection) return
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  } catch {
    // no-op: Selection API not available (e.g. jsdom)
  }
}

// ---- Select option ----

function selectOption(option: MentionOption) {
  if (option.disabled) return

  const displayLabel = option.label ?? option.value

  if (props.split) {
    selectOptionInSplitMode(option, displayLabel)
  } else {
    selectOptionInTextMode(option, displayLabel)
  }

  emit('select', option)
  visible.value = false
  searchText.value = ''
}

function selectOptionInTextMode(option: MentionOption, displayLabel: string) {
  const el = inputRef.value as HTMLInputElement | HTMLTextAreaElement | undefined
  if (!el) return

  const value = props.modelValue
  const cursorPos = el.selectionStart ?? value.length

  const beforeTrigger = value.substring(0, triggerPosition.value - 1)
  const afterCursor = value.substring(cursorPos)
  const newValue =
    beforeTrigger + activeTriggerChar.value + displayLabel + ' ' + afterCursor

  emit('update:modelValue', newValue)
  emit('change', newValue)

  nextTick(() => {
    if (el) {
      el.focus()
      const newCursorPos =
        beforeTrigger.length + activeTriggerChar.value.length + displayLabel.length + 1
      el.setSelectionRange(newCursorPos, newCursorPos)
    }
  })
}

function selectOptionInSplitMode(option: MentionOption, displayLabel: string) {
  const el = editableRef.value
  if (!el) return

  const text = el.innerText || props.modelValue || ''
  const triggerStart = triggerPosition.value - 1
  const cursorEnd = getSplitCursorOffset()
  const before = text.substring(0, triggerStart)
  const after = text.substring(cursorEnd)
  const newValue = before + activeTriggerChar.value + displayLabel + ' ' + after

  emit('update:modelValue', newValue)
  emit('change', newValue)

  nextTick(() => {
    if (el) {
      el.innerHTML = textToMentionHtml(newValue)
      placeCursorEnd(el)
      el.focus()
    }
  })
}

// ---- Split mode: text ↔ HTML conversion ----

const mentionTagClass = 'zc-mention__tag'

/** Convert plain text to HTML with mention tags styled as chips */
function textToMentionHtml(text: string): string {
  if (!text) return ''
  // Escape HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')

  // Build regex from trigger characters
  const escaped = triggerCharacters.value
    .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  const regex = new RegExp(`(${escaped})([^\\s]+)`, 'g')

  html = html.replace(
    regex,
    `<span class="${mentionTagClass}" contenteditable="false">$1$2</span>`,
  )

  return html
}

// ---- Keyboard navigation ----

function handleKeyDown(event: KeyboardEvent) {
  if (!visible.value) return

  switch (event.key) {
    case 'ArrowDown':
      if (filteredOptions.value.length === 0) return
      event.preventDefault()
      activeIndex.value =
        activeIndex.value < 0
          ? 0
          : Math.min(activeIndex.value + 1, filteredOptions.value.length - 1)
      scrollActiveIntoView()
      break
    case 'ArrowUp':
      if (filteredOptions.value.length === 0) return
      event.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
      scrollActiveIntoView()
      break
    case 'Enter':
    case 'Tab':
      if (activeIndex.value >= 0 && activeIndex.value < filteredOptions.value.length) {
        event.preventDefault()
        selectOption(filteredOptions.value[activeIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      closeSuggestions()
      break
  }
}

function scrollActiveIntoView() {
  nextTick(() => {
    const dropdown = dropdownRef.value
    if (!dropdown) return
    const activeEl = document.getElementById(getOptionId(activeIndex.value))
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  })
}

// ---- Focus / Blur ----

function handleFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false
  emit('blur', event)

  // Handle blur behavior
  if (visible.value) {
    switch (props.blurBehavior) {
      case 'select-first':
        if (filteredOptions.value.length > 0) {
          selectOption(filteredOptions.value[0])
        } else {
          closeSuggestions()
        }
        break
      case 'keep-open':
        // Keep dropdown open — do nothing
        break
      case 'clear':
      default:
        // Defer close to allow click events on dropdown items to fire
        setTimeout(() => {
          if (!isFocused.value) closeSuggestions()
        }, 150)
        break
    }
  }
}

function closeSuggestions() {
  visible.value = false
  searchText.value = ''
  activeIndex.value = -1
}

// ---- Click outside ----
useClickOutside(containerRef, () => {
  if (visible.value) {
    if (props.blurBehavior !== 'keep-open') {
      closeSuggestions()
    }
  }
}, {
  ignore: [dropdownRef],
})

// ---- Dropdown positioning (for Teleport) ----
function handleScrollResize() {
  if (visible.value && props.teleport) {
    updateDropdownPosition()
  }
}

// ---- Watchers ----

// Re-render split mode content when modelValue changes externally
watch(
  () => props.modelValue,
  (val) => {
    if (props.split && editableRef.value) {
      const current = editableRef.value.innerText
      if (current !== val) {
        editableRef.value.innerHTML = textToMentionHtml(val || '')
      }
    }
  },
)

// Reset active index when filtered options change
watch(filteredOptions, () => {
  activeIndex.value = filteredOptions.value.length > 0 ? 0 : -1
})

// ---- Lifecycle ----
onMounted(() => {
  if (props.split && editableRef.value) {
    editableRef.value.innerHTML = textToMentionHtml(props.modelValue || '')
  }
  if (props.teleport) {
    window.addEventListener('scroll', handleScrollResize, true)
    window.addEventListener('resize', handleScrollResize)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScrollResize, true)
  window.removeEventListener('resize', handleScrollResize)
})

// ---- Expose for testing / parent access ----
defineExpose({
  visible,
  searchText,
  activeIndex,
  filteredOptions,
  closeSuggestions,
})
</script>

<template>
  <div ref="containerRef" :class="classes">
    <!-- ============================================================ -->
    <!-- Split mode: contenteditable with styled mention tags -->
    <!-- ============================================================ -->
    <div
      v-if="split"
      ref="editableRef"
      :class="ns.e('editable')"
      contenteditable="true"
      :data-placeholder="placeholderText"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="dropdownVisible || emptyVisible"
      :aria-activedescendant="ariaActiveDescendant"
      :aria-controls="dropdownId"
      aria-autocomplete="list"
      :aria-disabled="disabled"
      :tabindex="disabled ? -1 : 0"
      @input="handleSplitInput"
      @keydown="handleKeyDown"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <!-- ============================================================ -->
    <!-- Normal mode: textarea -->
    <!-- ============================================================ -->
    <textarea
      v-else-if="type === 'textarea'"
      ref="inputRef"
      :class="inputClasses"
      :value="modelValue"
      :placeholder="placeholderText"
      :disabled="disabled"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="dropdownVisible || emptyVisible"
      :aria-activedescendant="ariaActiveDescendant"
      :aria-controls="dropdownId"
      aria-autocomplete="list"
      @input="handleInput"
      @keydown="handleKeyDown"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <!-- ============================================================ -->
    <!-- Normal mode: input -->
    <!-- ============================================================ -->
    <input
      v-else
      ref="inputRef"
      :class="inputClasses"
      :value="modelValue"
      :placeholder="placeholderText"
      :disabled="disabled"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="dropdownVisible || emptyVisible"
      :aria-activedescendant="ariaActiveDescendant"
      :aria-controls="dropdownId"
      aria-autocomplete="list"
      @input="handleInput"
      @keydown="handleKeyDown"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <!-- ============================================================ -->
    <!-- Dropdown -->
    <!-- ============================================================ -->
    <Teleport :to="teleportTarget" :disabled="!teleport">
      <transition name="zc-mention-dropdown">
        <!-- Main dropdown (loading / options) -->
        <div
          v-show="dropdownVisible"
          :id="dropdownId"
          ref="dropdownRef"
          :class="[ns.e('suggestions'), ns.is('top', placement === 'top')]"
          :style="teleport ? teleportedStyle : { maxHeight: dropdownMaxHeight }"
          role="listbox"
          aria-label="Mention suggestions"
        >
          <!-- Loading state -->
          <div v-if="loading" :class="ns.e('loading')">
            <slot name="loading">
              <span :class="ns.e('loading-text')">{{ loadingDisplayText }}</span>
            </slot>
          </div>

          <!-- Options list -->
          <template v-else>
            <!-- Grouped rendering -->
            <template v-if="hasGroups">
              <div
                v-for="group in groupedDisplayOptions"
                :key="group.value"
                :class="ns.e('group')"
              >
                <div :class="ns.e('group-title')">{{ group.label }}</div>
                <div
                  v-for="(option, idx) in group.options"
                  :id="getOptionId(filteredOptions.indexOf(option))"
                  :key="option.value"
                  :class="[
                    ns.e('item'),
                    ns.is('active', activeIndex === filteredOptions.indexOf(option)),
                    ns.is('disabled', option.disabled),
                  ]"
                  role="option"
                  :aria-selected="activeIndex === filteredOptions.indexOf(option)"
                  @click="selectOption(option)"
                  @mouseenter="activeIndex = filteredOptions.indexOf(option)"
                >
                  <slot name="option" :option="option">
                    <img
                      v-if="option.avatar"
                      :class="ns.e('item-avatar')"
                      :src="option.avatar"
                      :alt="option.value"
                    />
                    <div :class="ns.e('item-content')">
                      <span :class="ns.e('item-value')">{{ option.value }}</span>
                      <span
                        v-if="option.label && option.label !== option.value"
                        :class="ns.e('item-label')"
                        >{{ option.label }}</span
                      >
                    </div>
                  </slot>
                </div>
              </div>
            </template>

            <!-- Flat rendering -->
            <template v-else>
              <div :class="ns.e('list')">
                <div
                  v-for="(option, index) in filteredOptions"
                  :id="getOptionId(index)"
                  :key="option.value"
                  :class="[
                    ns.e('item'),
                    ns.is('active', activeIndex === index),
                    ns.is('disabled', option.disabled),
                  ]"
                  role="option"
                  :aria-selected="activeIndex === index"
                  @click="selectOption(option)"
                  @mouseenter="activeIndex = index"
                >
                  <slot name="option" :option="option">
                    <img
                      v-if="option.avatar"
                      :class="ns.e('item-avatar')"
                      :src="option.avatar"
                      :alt="option.value"
                    />
                    <div :class="ns.e('item-content')">
                      <span :class="ns.e('item-value')">{{ option.value }}</span>
                      <span
                        v-if="option.label && option.label !== option.value"
                        :class="ns.e('item-label')"
                        >{{ option.label }}</span
                      >
                    </div>
                  </slot>
                </div>
              </div>
            </template>
          </template>
        </div>
      </transition>

      <!-- Empty state (separate transition, only shown when no results) -->
      <transition name="zc-mention-dropdown">
        <div
          v-show="emptyVisible"
          :class="[ns.e('suggestions'), ns.e('empty'), ns.is('top', placement === 'top')]"
          :style="teleport ? teleportedStyle : { maxHeight: dropdownMaxHeight }"
        >
          <slot name="empty">
            <div :class="ns.e('empty-text')">{{ emptyDisplayText }}</div>
          </slot>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcMention styles
 * ============================================================ */

.zc-mention {
  position: relative;
  display: inline-block;
  width: 100%;
  font-size: var(--text-zc-base, 14px);
}

/* ---- Textarea / Input ---- */
.zc-mention__textarea,
.zc-mention__input {
  display: block;
  width: 100%;
  padding: 8px 11px;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  background: var(--color-zc-white, #fff);
  color: var(--color-zc-text-primary, #303133);
  font-size: inherit;
  font-family: inherit;
  line-height: 1.5;
  outline: none;
  box-sizing: border-box;
  transition: border-color var(--transition-duration-zc-base, 0.25s);
}

.zc-mention__textarea {
  min-height: 80px;
  resize: vertical;
}

.zc-mention__input {
  height: 34px;
}

.zc-mention__textarea:hover,
.zc-mention__input:hover {
  border-color: var(--color-zc-primary-300, #a0cfff);
}

.zc-mention.is-focused .zc-mention__textarea,
.zc-mention.is-focused .zc-mention__input {
  border-color: var(--color-zc-primary-500, #409eff);
  box-shadow: 0 0 0 2px var(--color-zc-primary-50, #ecf5ff);
}

.zc-mention__textarea::placeholder,
.zc-mention__input::placeholder {
  color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-mention__textarea:disabled,
.zc-mention__input:disabled {
  background: var(--color-zc-fill-light, #f5f7fa);
  border-color: var(--color-zc-border-light, #e4e7ed);
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

/* ---- Split mode: contenteditable ---- */
.zc-mention__editable {
  display: block;
  width: 100%;
  min-height: 80px;
  padding: 8px 11px;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  background: var(--color-zc-white, #fff);
  color: var(--color-zc-text-primary, #303133);
  font-size: inherit;
  font-family: inherit;
  line-height: 1.5;
  outline: none;
  box-sizing: border-box;
  transition: border-color var(--transition-duration-zc-base, 0.25s);
  word-wrap: break-word;
  overflow-y: auto;
  resize: vertical;
  white-space: pre-wrap;
}

.zc-mention__editable:hover {
  border-color: var(--color-zc-primary-300, #a0cfff);
}

.zc-mention.is-focused .zc-mention__editable {
  border-color: var(--color-zc-primary-500, #409eff);
  box-shadow: 0 0 0 2px var(--color-zc-primary-50, #ecf5ff);
}

.zc-mention__editable:empty::before {
  content: attr(data-placeholder);
  color: var(--color-zc-text-placeholder, #a8abb2);
  pointer-events: none;
}

.zc-mention__tag {
  display: inline-block;
  padding: 0 6px;
  margin: 0 1px;
  background: var(--color-zc-primary-50, #ecf5ff);
  color: var(--color-zc-primary-600, #337ecc);
  border: 1px solid var(--color-zc-primary-200, #c6e2ff);
  border-radius: var(--radius-zc-base, 4px);
  font-size: 0.9em;
  line-height: 1.6;
  cursor: default;
  user-select: all;
}

/* ---- Suggestions dropdown ---- */
.zc-mention__suggestions {
  position: absolute;
  left: 0;
  right: 0;
  z-index: var(--z-zc-dropdown, 1000);
  background: var(--color-zc-white, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  overflow-y: auto;
  box-sizing: border-box;
}

.zc-mention__suggestions.is-top {
  bottom: 100%;
  top: auto;
  margin-bottom: 4px;
}

/* ---- Loading ---- */
.zc-mention__loading {
  padding: 12px;
  text-align: center;
}

.zc-mention__loading-text {
  color: var(--color-zc-text-secondary, #909399);
  font-size: var(--text-zc-sm, 13px);
}

/* ---- Empty ---- */
.zc-mention__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.zc-mention__empty-text {
  color: var(--color-zc-text-secondary, #909399);
  font-size: var(--text-zc-sm, 13px);
}

/* ---- List & items ---- */
.zc-mention__list {
  padding: 4px 0;
}

.zc-mention__group {
  padding: 4px 0;
}

.zc-mention__group-title {
  padding: 4px 12px;
  font-size: var(--text-zc-xs, 12px);
  color: var(--color-zc-text-secondary, #909399);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.zc-mention__item {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  cursor: pointer;
  color: var(--color-zc-text-regular, #606266);
  transition: background var(--transition-duration-zc-fast, 0.15s);
}

.zc-mention__item:hover,
.zc-mention__item.is-active {
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-mention__item.is-disabled {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

.zc-mention__item.is-disabled:hover {
  background: transparent;
}

.zc-mention__item-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  flex-shrink: 0;
}

.zc-mention__item-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.zc-mention__item-value {
  font-size: var(--text-zc-sm, 13px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zc-mention__item-label {
  font-size: var(--text-zc-xs, 12px);
  color: var(--color-zc-text-secondary, #909399);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---- Dropdown transition ---- */
.zc-mention-dropdown-enter-active,
.zc-mention-dropdown-leave-active {
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-mention-dropdown-enter-from,
.zc-mention-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
