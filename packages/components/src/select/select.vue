<script setup lang="ts" generic="T extends SelectOption">
import { computed, ref, shallowRef, watch, nextTick, useSlots, onUnmounted } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useClickOutside } from '@zc-ui/hooks'
import { useVirtualList } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import type { SelectOption, SelectOptionGroup, SelectValue, SelectSize } from './types'

defineOptions({ name: 'ZcSelect' })

// ---- Internal render-item type ----
interface RenderItem {
  key: string | number
  type: 'header' | 'option' | 'create'
  label: string
  option?: SelectOption
  disabled: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: SelectValue
    options?: T[]
    optionGroups?: SelectOptionGroup[]
    multiple?: boolean
    filterable?: boolean
    remote?: boolean
    remoteMethod?: (query: string) => Promise<T[]>
    allowCreate?: boolean
    loading?: boolean
    disabled?: boolean
    clearable?: boolean
    placeholder?: string
    size?: SelectSize
    collapseTags?: boolean
    collapseTagsLimit?: number
    noDataText?: string
    noMatchText?: string
    loadingText?: string
    virtualScroll?: boolean
    estimatedOptionHeight?: number
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    optionGroups: () => [],
    multiple: false,
    filterable: false,
    remote: false,
    allowCreate: false,
    loading: false,
    disabled: false,
    clearable: false,
    placeholder: '',
    size: 'medium',
    collapseTags: false,
    collapseTagsLimit: 1,
    noDataText: '',
    noMatchText: '',
    loadingText: '',
    virtualScroll: false,
    estimatedOptionHeight: 36,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue): void
  (e: 'change', value: SelectValue): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
  (e: 'visible-change', visible: boolean): void
  (e: 'remove-tag', tag: string | number): void
  (e: 'search', query: string): void
  (e: 'create-tag', value: string): void
}>()

const ns = useNamespace('select')
const slots = useSlots()
const { t } = useLocale()

const placeholderText = computed(() => props.placeholder || t('zc.select.placeholder'))

// ---- Refs ----
const triggerRef = shallowRef<HTMLElement>()
const inputRef = shallowRef<HTMLInputElement>()

const visible = ref(false)
const isFocused = ref(false)
const hoveringIndex = ref(-1)
const query = ref('')
const internalLoading = ref(props.loading)
const internalOptions = ref<SelectOption[]>([])

// ---- Sync external loading prop ----
watch(
  () => props.loading,
  (val) => {
    internalLoading.value = val
  }
)

// ---- Sync options (flat or from groups) ----
const hasGroups = computed(() => props.optionGroups && props.optionGroups.length > 0)

watch(
  () => [props.options, props.optionGroups],
  () => {
    if (hasGroups.value) {
      // Flatten group options into a single list
      internalOptions.value = props.optionGroups!.flatMap((g) => g.options)
    } else if (!props.remote) {
      internalOptions.value = [...props.options]
    }
  },
  { immediate: true, deep: true }
)

// ---- Click outside ----
useClickOutside(triggerRef, () => {
  if (visible.value) closeDropdown()
})

// ---- Filter helper ----
function matchesFilter(opt: SelectOption): boolean {
  if (!props.filterable || !query.value || props.remote) return true
  const q = query.value.toLowerCase()
  return String(opt.label).toLowerCase().includes(q)
}

// ---- Filtered options (flat) ----
const filteredOptions = computed<SelectOption[]>(() => {
  return internalOptions.value.filter((opt) => matchesFilter(opt))
})

// ---- Should show create option ----
const shouldShowCreate = computed(() => {
  if (!props.allowCreate || !props.filterable || !query.value.trim()) return false
  const q = query.value.toLowerCase().trim()
  // Don't show if an exact match already exists
  return !internalOptions.value.some(
    (opt) => String(opt.label).toLowerCase() === q || String(opt.value).toLowerCase() === q
  )
})

// ---- Render items (group headers + options + create option) ----
const renderItems = computed<RenderItem[]>(() => {
  const items: RenderItem[] = []

  // Create-option entry (always at top)
  if (shouldShowCreate.value) {
    items.push({
      key: '__create__',
      type: 'create',
      label: query.value.trim(),
      disabled: false,
    })
  }

  if (hasGroups.value) {
    // Group mode — emit header + child options per group
    for (const group of props.optionGroups!) {
      const filtered = group.options.filter((opt) => matchesFilter(opt))
      if (filtered.length === 0) continue

      items.push({
        key: `__group_${group.label}`,
        type: 'header',
        label: group.label,
        disabled: group.disabled === true,
      })

      for (const opt of filtered) {
        items.push({
          key: opt.value,
          type: 'option',
          label: opt.label,
          option: opt,
          disabled: opt.disabled === true || group.disabled === true,
        })
      }
    }
  } else {
    // Flat mode
    for (const opt of filteredOptions.value) {
      items.push({
        key: opt.value,
        type: 'option',
        label: opt.label,
        option: opt,
        disabled: opt.disabled === true,
      })
    }
  }

  return items
})

// Reset hovering index when items change
watch(renderItems, () => {
  hoveringIndex.value = -1
})

// ---- Value handling ----
const selectedValues = computed<(string | number)[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return props.modelValue != null && !Array.isArray(props.modelValue) ? [props.modelValue] : []
})

const selectedOptions = computed<SelectOption[]>(() => {
  const allOptions = internalOptions.value
  return selectedValues.value
    .map((val) => allOptions.find((opt) => opt.value === val))
    .filter(Boolean) as SelectOption[]
})

const displayLabel = computed(() => {
  if (props.multiple) return ''
  const opt = selectedOptions.value[0]
  return opt ? opt.label : ''
})

const isEmpty = computed(() => selectedValues.value.length === 0)

// ---- Select-all (multiple mode) ----
const selectableOptions = computed(() => internalOptions.value.filter((opt) => !opt.disabled))

const isAllSelected = computed(() => {
  if (!props.multiple || selectableOptions.value.length === 0) return false
  return selectableOptions.value.every((opt) => selectedValues.value.includes(opt.value))
})

const isIndeterminate = computed(() => {
  if (!props.multiple) return false
  const count = selectableOptions.value.filter((opt) =>
    selectedValues.value.includes(opt.value)
  ).length
  return count > 0 && count < selectableOptions.value.length
})

function toggleSelectAll() {
  if (isAllSelected.value) {
    emit('update:modelValue', [])
    emit('change', [])
  } else {
    const allValues = selectableOptions.value.map((opt) => opt.value)
    emit('update:modelValue', allValues)
    emit('change', allValues)
  }
}

// ---- Classes ----
const containerClasses = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('focused', isFocused.value),
  ns.is('open', visible.value),
  ns.is('multiple', props.multiple),
  ns.is('filterable', props.filterable),
])

const dropdownClasses = computed(() => [ns.e('dropdown'), ns.is('entering', visible.value)])

// ---- Show clear icon ----
const showClear = computed(
  () => props.clearable && !props.disabled && selectedValues.value.length > 0 && visible.value
)

// ---- No-data text ----
const noDataTextComputed = computed(() => {
  if (props.remote || props.filterable) {
    return query.value
      ? props.noMatchText || t('zc.select.noMatch')
      : props.noDataText || t('zc.select.noData')
  }
  return props.noDataText || t('zc.select.noData')
})

// ---- Dropdown control ----
function openDropdown() {
  if (props.disabled) return
  visible.value = true
  isFocused.value = true
  emit('visible-change', true)
  nextTick(() => {
    if (props.filterable && inputRef.value) {
      inputRef.value.focus()
    }
  })
}

function closeDropdown() {
  visible.value = false
  isFocused.value = false
  query.value = ''
  emit('visible-change', false)
}

function toggleDropdown() {
  if (props.disabled) return
  if (visible.value) closeDropdown()
  else openDropdown()
}

// ---- Option helpers ----
function isSelected(value: string | number): boolean {
  return selectedValues.value.includes(value)
}

function isItemSelected(item: RenderItem): boolean {
  return item.type === 'option' && item.option ? isSelected(item.option.value) : false
}

// ---- Option selection ----
function selectOption(opt: SelectOption) {
  if (opt.disabled) return

  if (props.multiple) {
    const currentValues = [...selectedValues.value]
    const idx = currentValues.indexOf(opt.value)
    if (idx > -1) {
      currentValues.splice(idx, 1)
    } else {
      currentValues.push(opt.value)
    }
    emit('update:modelValue', currentValues)
    emit('change', currentValues)
  } else {
    emit('update:modelValue', opt.value)
    emit('change', opt.value)
    closeDropdown()
  }
}

// ---- Create new option ----
function handleCreateOption() {
  const value = query.value.trim()
  if (!value) return
  const newOption: SelectOption = { label: value, value }
  // Add to internal options so it appears in the list
  internalOptions.value = [...internalOptions.value, newOption]
  emit('create-tag', value)
  // Auto-select the newly created option
  selectOption(newOption)
  query.value = ''
}

// ---- Item click handler (works for any render item type) ----
function onItemClick(item: RenderItem) {
  if (item.type === 'header' || item.disabled) return
  if (item.type === 'create') {
    handleCreateOption()
    return
  }
  if (item.option) selectOption(item.option)
}

// ---- Remove tag / Clear ----
function removeTag(value: string | number, event?: Event) {
  event?.stopPropagation()
  if (props.multiple) {
    const currentValues = selectedValues.value.filter((v) => v !== value)
    emit('update:modelValue', currentValues)
    emit('change', currentValues)
    emit('remove-tag', value)
  }
}

function handleClear() {
  const empty = props.multiple ? [] : ''
  emit('update:modelValue', empty as SelectValue)
  emit('clear')
  emit('change', empty as SelectValue)
}

// ---- Search ----
let remoteTimer: ReturnType<typeof setTimeout> | null = null

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  const searchQuery = target.value
  query.value = searchQuery
  emit('search', searchQuery)

  if (props.remote && props.remoteMethod) {
    if (remoteTimer) clearTimeout(remoteTimer)
    internalLoading.value = true
    remoteTimer = setTimeout(async () => {
      try {
        const results = await props.remoteMethod!(searchQuery)
        internalOptions.value = results as SelectOption[]
      } finally {
        internalLoading.value = false
        remoteTimer = null
      }
    }, 300)
  }
}

// Cleanup remote timer on unmount
onUnmounted(() => {
  if (remoteTimer) {
    clearTimeout(remoteTimer)
    remoteTimer = null
  }
})

// ---- Keyboard navigation ----
function nextSelectableIndex(current: number, direction: number): number {
  const items = renderItems.value
  let idx = current + direction
  while (idx >= 0 && idx < items.length) {
    const item = items[idx]
    if (item.type !== 'header' && !item.disabled) return idx
    idx += direction
  }
  return direction > 0 ? current : -1
}

function handleKeyDown(event: KeyboardEvent) {
  if (!visible.value) {
    if (event.key === 'Enter' || event.key === 'ArrowDown') {
      event.preventDefault()
      openDropdown()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      hoveringIndex.value = nextSelectableIndex(hoveringIndex.value, 1)
      if (props.virtualScroll) virtualScrollToHovered()
      break
    case 'ArrowUp':
      event.preventDefault()
      hoveringIndex.value = nextSelectableIndex(hoveringIndex.value, -1)
      if (props.virtualScroll) virtualScrollToHovered()
      break
    case 'Enter':
      event.preventDefault()
      {
        const item = renderItems.value[hoveringIndex.value]
        if (item) onItemClick(item)
      }
      break
    case 'Escape':
      event.preventDefault()
      closeDropdown()
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

// ---- Collapsed tags ----
const visibleTags = computed(() => {
  if (!props.collapseTags) return selectedOptions.value
  return selectedOptions.value.slice(0, props.collapseTagsLimit)
})

const hiddenTagCount = computed(() =>
  props.collapseTags ? Math.max(0, selectedOptions.value.length - props.collapseTagsLimit) : 0
)

// ---- Virtual scroll integration ----
const virtualItemHeight = computed(() => props.estimatedOptionHeight || 36)

const {
  containerRef: virtualContainerRef,
  visibleData: virtualVisibleData,
  totalHeight: virtualTotalHeight,
  offsetY: virtualOffsetY,
  startIndex: virtualStartIndex,
  scrollToIndex: virtualScrollToIndex,
} = useVirtualList<RenderItem>({
  data: computed(() => renderItems.value),
  itemHeight: virtualItemHeight,
  overscan: 5,
})

function virtualScrollToHovered() {
  virtualScrollToIndex(hoveringIndex.value)
}

function focus() {
  if (inputRef.value) {
    inputRef.value.focus()
  } else {
    triggerRef.value?.focus()
  }
}

function blur() {
  if (inputRef.value) {
    inputRef.value.blur()
  }
  if (visible.value) closeDropdown()
}

defineExpose({
  visible,
  focus,
  blur,
  openDropdown,
  closeDropdown,
  toggleSelectAll,
  virtualContainerRef,
})
</script>

<template>
  <div
    ref="triggerRef"
    :class="containerClasses"
    :role="filterable ? undefined : 'combobox'"
    :aria-expanded="visible"
    :aria-haspopup="filterable ? undefined : 'listbox'"
    :aria-controls="visible ? 'zc-select-listbox' : undefined"
    :aria-activedescendant="
      visible && hoveringIndex >= 0 ? `zc-select-option-${hoveringIndex}` : undefined
    "
    :aria-label="placeholderText"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : filterable ? undefined : 0"
    @click="toggleDropdown"
    @keydown="handleKeyDown"
  >
    <!-- Select trigger -->
    <div :class="ns.e('wrapper')">
      <!-- Prefix -->
      <span v-if="slots.prefix" :class="ns.e('prefix')">
        <slot name="prefix" />
      </span>

      <!-- Multiple tags -->
      <template v-if="multiple && selectedOptions.length > 0">
        <div :class="ns.e('tags')">
          <span v-for="opt in visibleTags" :key="opt.value" :class="ns.e('tag')">
            <span :class="ns.e('tag-text')">{{ opt.label }}</span>
            <span :class="ns.e('tag-close')" @click.stop="removeTag(opt.value, $event)">
              <svg
                viewBox="0 0 24 24"
                width="10"
                height="10"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
              >
                <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
              </svg>
            </span>
          </span>
          <span v-if="hiddenTagCount > 0" :class="ns.e('tag-count')"> + {{ hiddenTagCount }} </span>
        </div>
      </template>

      <!-- Filterable input -->
      <input
        v-if="filterable"
        ref="inputRef"
        :class="ns.e('input')"
        :value="query"
        :placeholder="
          isEmpty || (multiple && selectedOptions.length === 0) ? placeholderText : displayLabel
        "
        :disabled="disabled"
        @input="handleSearchInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @click.stop
      />

      <!-- Non-filterable display -->
      <span
        v-if="!filterable && (!multiple || selectedOptions.length === 0)"
        :class="[ns.e('display'), ns.is('placeholder', isEmpty)]"
      >
        {{ isEmpty ? placeholderText : displayLabel }}
      </span>

      <!-- Clear button -->
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

      <!-- Arrow icon -->
      <span :class="[ns.e('arrow'), ns.is('reverse', visible)]">
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </div>

    <!-- Dropdown menu -->
    <transition name="zc-select-dropdown">
      <div v-show="visible" :class="dropdownClasses">
        <!-- Loading -->
        <div v-if="loading || internalLoading" :class="ns.e('loading')">
          <svg class="zc-select__loading-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
          <span>{{ loadingText || t('zc.select.loading') }}</span>
        </div>

        <template v-else>
          <!-- Select-all bar (multiple mode only) -->
          <div
            v-if="multiple && selectableOptions.length > 0"
            :class="ns.e('select-all')"
            role="checkbox"
            :aria-checked="isAllSelected ? 'true' : isIndeterminate ? 'mixed' : 'false'"
            :aria-label="isAllSelected ? t('zc.select.deselectAll') : t('zc.select.selectAll')"
            tabindex="0"
            @click.stop="toggleSelectAll"
            @keydown.enter.prevent="toggleSelectAll"
          >
            <span
              :class="[
                ns.e('check-all'),
                ns.is('checked', isAllSelected),
                ns.is('indeterminate', isIndeterminate),
              ]"
            >
              <svg
                v-if="isAllSelected"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
              >
                <path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg
                v-else-if="isIndeterminate"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
              >
                <path d="M5 12h14" stroke-linecap="round" />
              </svg>
            </span>
            <span>{{ isAllSelected ? t('zc.select.deselectAll') : t('zc.select.selectAll') }}</span>
          </div>

          <!-- Virtual scroll mode -->
          <div
            v-if="virtualScroll && renderItems.length > 0"
            ref="virtualContainerRef"
            :class="ns.e('virtual-list')"
          >
            <div :style="{ height: virtualTotalHeight + 'px', position: 'relative' }">
              <div :style="{ transform: `translateY(${virtualOffsetY}px)` }">
                <div
                  v-for="(item, vi) in virtualVisibleData"
                  :key="item.key"
                  :class="[
                    ns.e('option'),
                    ns.is('group-title', item.type === 'header'),
                    ns.is('selected', isItemSelected(item)),
                    ns.is('disabled', item.disabled),
                    ns.is('hover', hoveringIndex === virtualStartIndex + vi),
                    ns.is('create', item.type === 'create'),
                  ]"
                  :style="{ height: virtualItemHeight + 'px' }"
                  :role="item.type === 'header' ? 'presentation' : 'option'"
                  :aria-selected="isItemSelected(item)"
                  :aria-disabled="item.disabled"
                  @click.stop="onItemClick(item)"
                  @mouseenter="hoveringIndex = virtualStartIndex + vi"
                >
                  <span :class="ns.e('option-label')">
                    <template v-if="item.type === 'create'">
                      <span :class="ns.e('create-prefix')">+</span>
                      {{ item.label }}
                    </template>
                    <template v-else>
                      {{ item.label }}
                    </template>
                  </span>
                  <span v-if="isItemSelected(item)" :class="ns.e('check')">
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Normal (non-virtual) mode -->
          <ul
            v-else-if="renderItems.length > 0"
            id="zc-select-listbox"
            :class="ns.e('options')"
            role="listbox"
            :aria-multiselectable="multiple ? 'true' : undefined"
          >
            <template v-for="(item, index) in renderItems" :key="item.key">
              <!-- Group header -->
              <li
                v-if="item.type === 'header'"
                :class="[ns.e('group-title'), ns.is('disabled', item.disabled)]"
              >
                {{ item.label }}
              </li>

              <!-- Create-option entry -->
              <li
                v-else-if="item.type === 'create'"
                :class="[
                  ns.e('option'),
                  ns.is('create', true),
                  ns.is('hover', hoveringIndex === index),
                ]"
                role="option"
                @click.stop="onItemClick(item)"
                @mouseenter="hoveringIndex = index"
              >
                <span :class="ns.e('option-label')">
                  <span :class="ns.e('create-prefix')">+</span>
                  {{ item.label }}
                </span>
              </li>

              <!-- Regular option -->
              <li
                v-else
                :id="`zc-select-option-${index}`"
                :class="[
                  ns.e('option'),
                  ns.is('selected', isItemSelected(item)),
                  ns.is('disabled', item.disabled),
                  ns.is('hover', hoveringIndex === index),
                ]"
                role="option"
                :aria-selected="isItemSelected(item)"
                :aria-disabled="item.disabled"
                @click.stop="onItemClick(item)"
                @mouseenter="hoveringIndex = index"
              >
                <span :class="ns.e('option-label')">{{ item.label }}</span>
                <span v-if="isItemSelected(item)" :class="ns.e('check')">
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </li>
            </template>
          </ul>

          <!-- No data / Empty slot -->
          <div v-else :class="ns.e('empty')">
            <slot name="empty">{{ noDataTextComputed }}</slot>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcSelect styles
 * ============================================================ */

.zc-select {
  /* Component-level CSS variables */
  --zc-select-bg-color: var(--color-zc-white, #fff);
  --zc-select-text-color: var(--color-zc-text-primary, #303133);
  --zc-select-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-select-hover-border-color: var(--color-zc-primary-300, #a0cfff);
  --zc-select-focus-border-color: var(--color-zc-primary-500, #409eff);
  --zc-select-placeholder-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-select-disabled-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-select-disabled-text-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-select-border-radius: var(--radius-zc-base, 4px);
  --zc-select-font-size: var(--text-zc-base, 14px);
  --zc-select-height: 36px;
  --zc-select-dropdown-bg-color: var(--color-zc-white, #fff);
  --zc-select-dropdown-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-select-dropdown-border-radius: var(--radius-zc-base, 4px);
  --zc-select-option-hover-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-select-option-selected-text-color: var(--color-zc-primary-500, #409eff);
  --zc-select-tag-bg-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-select-tag-text-color: var(--color-zc-primary-500, #409eff);
  --zc-select-icon-color: var(--color-zc-text-secondary, #909399);
  --zc-select-clear-icon-color: var(--color-zc-text-secondary, #909399);

  position: relative;
  display: inline-block;
  width: 100%;
  font-size: var(--zc-select-font-size);
  cursor: pointer;
}

/* ---- Wrapper ---- */
.zc-select__wrapper {
  display: flex;
  align-items: center;
  min-height: var(--zc-select-height);
  padding: 0 30px 0 11px;
  background: var(--zc-select-bg-color);
  border: 1px solid var(--zc-select-border-color);
  border-radius: var(--zc-select-border-radius);
  box-sizing: border-box;
  transition: border-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  flex-wrap: wrap;
  gap: 4px;
}

.zc-select__wrapper:hover {
  border-color: var(--zc-select-hover-border-color);
}

.zc-select.is-focused .zc-select__wrapper {
  border-color: var(--zc-select-focus-border-color);
  box-shadow: 0 0 0 2px var(--color-zc-primary-50, #ecf5ff);
}

.zc-select.is-disabled .zc-select__wrapper {
  background: var(--zc-select-disabled-bg-color);
  border-color: var(--color-zc-border-light, #e4e7ed);
  cursor: not-allowed;
}

/* ---- Sizes ---- */
.zc-select--large .zc-select__wrapper {
  min-height: 42px;
  font-size: var(--text-zc-md, 16px);
}
.zc-select--small .zc-select__wrapper {
  min-height: 28px;
  padding: 0 24px 0 9px;
  font-size: var(--text-zc-sm, 13px);
}

/* ---- Display text ---- */
.zc-select__display {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--zc-select-text-color);
}

.zc-select__display.is-placeholder {
  color: var(--zc-select-placeholder-color);
}

/* ---- Filterable input ---- */
.zc-select__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--zc-select-text-color);
  font-size: inherit;
  height: 30px;
  min-width: 0;
  -webkit-appearance: none;
}

.zc-select__input::placeholder {
  color: var(--zc-select-placeholder-color);
}

/* ---- Tags ---- */
.zc-select__tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
  align-items: center;
}

.zc-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--zc-select-tag-bg-color);
  color: var(--zc-select-tag-text-color);
  border: 1px solid var(--color-zc-primary-200, #c6e2ff);
  border-radius: var(--zc-select-border-radius);
  padding: 0 6px;
  height: 24px;
  font-size: var(--text-zc-xs, 12px);
  line-height: 1;
}

.zc-select__tag-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  padding: 2px;
  color: var(--zc-select-tag-text-color);
  transition: all var(--transition-duration-zc-fast, 0.15s);
}

.zc-select__tag-close:hover {
  background: var(--zc-select-tag-text-color);
  color: var(--color-zc-white, #fff);
}

.zc-select__tag-count {
  color: var(--zc-select-icon-color);
  font-size: var(--text-zc-xs, 12px);
}

/* ---- Clear button ---- */
.zc-select__clear {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--zc-select-clear-icon-color);
  transition: color var(--transition-duration-zc-base, 0.25s);
}

.zc-select__clear:hover {
  color: var(--zc-select-text-color);
}

/* ---- Arrow ---- */
.zc-select__arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  color: var(--zc-select-icon-color);
  transition: transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  pointer-events: none;
}

.zc-select__arrow.is-reverse {
  transform: translateY(-50%) rotate(180deg);
}

/* ---- Prefix ---- */
.zc-select__prefix {
  margin-right: 6px;
  color: var(--zc-select-icon-color);
}

/* ---- Dropdown ---- */
.zc-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: var(--z-zc-dropdown, 1000);
  background: var(--zc-select-dropdown-bg-color);
  border: 1px solid var(--zc-select-dropdown-border-color);
  border-radius: var(--zc-select-dropdown-border-radius);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  max-height: 280px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* ---- Select-all bar ---- */
.zc-select__select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 36px;
  cursor: pointer;
  color: var(--color-zc-text-regular, #606266);
  border-bottom: 1px solid var(--color-zc-border-lighter, #ebeef5);
  font-size: var(--zc-select-font-size);
  transition: background var(--transition-duration-zc-fast, 0.15s);
}

.zc-select__select-all:hover {
  background: var(--zc-select-option-hover-bg-color);
}

.zc-select__check-all {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid var(--zc-select-border-color);
  border-radius: var(--zc-select-border-radius);
  color: var(--color-zc-white, #fff);
  transition: all var(--transition-duration-zc-fast, 0.15s);
}

.zc-select__check-all.is-checked {
  background: var(--zc-select-option-selected-text-color);
  border-color: var(--zc-select-option-selected-text-color);
}

.zc-select__check-all.is-indeterminate {
  background: var(--zc-select-option-selected-text-color);
  border-color: var(--zc-select-option-selected-text-color);
}

/* ---- Virtual list ---- */
.zc-select__virtual-list {
  max-height: 280px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ---- Options list ---- */
.zc-select__options {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

.zc-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 36px;
  cursor: pointer;
  color: var(--color-zc-text-regular, #606266);
  transition: background var(--transition-duration-zc-fast, 0.15s);
  box-sizing: border-box;
}

.zc-select__option.is-hover,
.zc-select__option:hover {
  background: var(--zc-select-option-hover-bg-color);
}

.zc-select__option.is-selected {
  color: var(--zc-select-option-selected-text-color);
  font-weight: 600;
}

.zc-select__option.is-disabled,
.zc-select__option.is-disabled:hover {
  color: var(--zc-select-disabled-text-color);
  cursor: not-allowed;
  background: transparent;
}

/* ---- Create option ---- */
.zc-select__option.is-create {
  color: var(--zc-select-option-selected-text-color);
}

.zc-select__create-prefix {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  border: 1px solid var(--zc-select-option-selected-text-color);
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
}

/* ---- Group title ---- */
.zc-select__group-title {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  font-size: var(--text-zc-xs, 12px);
  line-height: 1;
  color: var(--zc-select-icon-color);
  font-weight: 600;
  cursor: default;
  user-select: none;
  background: var(--color-zc-fill-lighter, #fafafa);
}

.zc-select__group-title.is-disabled {
  opacity: 0.5;
}

/* ---- Option label ---- */
.zc-select__option-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
}

.zc-select__check {
  display: inline-flex;
  color: var(--zc-select-option-selected-text-color);
}

/* ---- Empty ---- */
.zc-select__empty,
.zc-select__loading {
  padding: 16px;
  text-align: center;
  color: var(--zc-select-icon-color);
  font-size: var(--zc-select-font-size);
}

.zc-select__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.zc-select__loading-icon {
  width: 16px;
  height: 16px;
  animation: zc-select-spin 0.6s linear infinite;
}

@keyframes zc-select-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ---- Dropdown transition ---- */
.zc-select-dropdown-enter-active,
.zc-select-dropdown-leave-active {
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
  opacity: 1;
  transform: translateY(0);
}

.zc-select-dropdown-enter-from,
.zc-select-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
