<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useClickOutside } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import type { TreeSelectOption } from './types'
import ZcTreeSelectNode from './tree-node.vue'

defineOptions({ name: 'ZcTreeSelect' })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | (string | number)[]
    data?: TreeSelectOption[]
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    multiple?: boolean
    filterable?: boolean
    checkStrictly?: boolean
    size?: 'large' | 'medium' | 'small'
    virtual?: boolean
  }>(),
  {
    modelValue: undefined,
    data: () => [],
    placeholder: '',
    disabled: false,
    clearable: false,
    multiple: false,
    filterable: false,
    checkStrictly: false,
    size: 'medium',
    virtual: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | (string | number)[] | undefined): void
  (e: 'change', value: string | number | (string | number)[] | undefined): void
  (e: 'node-click', option: TreeSelectOption): void
  (e: 'expand'): void
}>()

const ns = useNamespace('tree-select')
const { t } = useLocale()

const placeholderText = computed(() => props.placeholder || t('zc.treeSelect.placeholder'))
const searchPlaceholderText = computed(() => t('zc.treeSelect.searchPlaceholder'))
const noDataText = computed(() => t('zc.treeSelect.noData'))

const containerRef = shallowRef<HTMLElement>()

const visible = ref(false)
const isFocused = ref(false)
const expandedKeys = ref<Set<string | number>>(new Set())
const searchText = ref('')

useClickOutside(containerRef, () => {
  if (visible.value) closeDropdown()
})

// ---- Helpers ----
function getLabel(option: TreeSelectOption): string {
  return option.label ?? String(option.value)
}

function isLeaf(option: TreeSelectOption): boolean {
  return option.isLeaf === true || !option.children || option.children.length === 0
}

function flattenAll(options: TreeSelectOption[]): TreeSelectOption[] {
  const result: TreeSelectOption[] = []
  function walk(opts: TreeSelectOption[]) {
    for (const opt of opts) {
      result.push(opt)
      if (opt.children) walk(opt.children)
    }
  }
  walk(options)
  return result
}

const allOptions = computed(() => flattenAll(props.data))

function findOption(value: string | number): TreeSelectOption | undefined {
  return allOptions.value.find((o) => o.value === value)
}

// ---- Selected labels ----
const selectedLabels = computed<string[]>(() => {
  if (props.multiple) {
    const vals = Array.isArray(props.modelValue) ? props.modelValue : []
    return vals.map((v) => {
      const opt = findOption(v)
      return opt ? getLabel(opt) : String(v)
    })
  }
  const val = props.modelValue
  if (val === undefined || val === null || val === '') return []
  const opt = findOption(val as string | number)
  return opt ? [getLabel(opt)] : [String(val)]
})

const displayText = computed(() => {
  if (props.multiple) return selectedLabels.value.join(', ')
  return selectedLabels.value[0] ?? ''
})

// ---- Filtered tree data ----
const filteredData = computed<TreeSelectOption[]>(() => {
  if (!props.filterable || !searchText.value) return props.data
  const keyword = searchText.value.toLowerCase()
  function filterNodes(options: TreeSelectOption[]): TreeSelectOption[] {
    const result: TreeSelectOption[] = []
    for (const opt of options) {
      if (getLabel(opt).toLowerCase().includes(keyword)) {
        result.push(opt)
      } else if (opt.children) {
        const filtered = filterNodes(opt.children)
        if (filtered.length > 0) result.push({ ...opt, children: filtered })
      }
    }
    return result
  }
  return filterNodes(props.data)
})

const classes = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('focused', isFocused.value),
  ns.is('open', visible.value),
])

// ---- Actions ----
function toggleExpand(key: string | number) {
  const newSet = new Set(expandedKeys.value)
  if (newSet.has(key)) newSet.delete(key)
  else newSet.add(key)
  expandedKeys.value = newSet
  emit('expand')
}

function selectNode(option: TreeSelectOption) {
  if (option.disabled) return
  emit('node-click', option)

  if (!isLeaf(option) && !props.checkStrictly) {
    toggleExpand(option.value)
    return
  }

  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(option.value)
    if (index >= 0) current.splice(index, 1)
    else current.push(option.value)
    emit('update:modelValue', current)
    emit('change', current)
  } else {
    if (props.checkStrictly || isLeaf(option)) {
      emit('update:modelValue', option.value)
      emit('change', option.value)
      closeDropdown()
    } else {
      toggleExpand(option.value)
    }
  }
}

function toggleDropdown() {
  if (props.disabled) return
  if (visible.value) {
    closeDropdown()
  } else {
    visible.value = true
    isFocused.value = true
    if (expandedKeys.value.size === 0) {
      props.data.forEach((opt) => {
        if (opt.children && opt.children.length > 0) expandedKeys.value.add(opt.value)
      })
    }
  }
}

function closeDropdown() {
  visible.value = false
  isFocused.value = false
  searchText.value = ''
}

function handleClear(event: Event) {
  event.stopPropagation()
  if (props.multiple) {
    emit('update:modelValue', [])
    emit('change', [])
  } else {
    emit('update:modelValue', undefined)
    emit('change', undefined)
  }
}

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  searchText.value = target.value
}

function removeMultipleItem(value: string | number) {
  if (props.disabled) return
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const index = current.indexOf(value)
  if (index >= 0) {
    current.splice(index, 1)
    emit('update:modelValue', current)
    emit('change', current)
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeDropdown()
  }
}
</script>

<template>
  <div ref="containerRef" :class="classes" @keydown="handleKeyDown">
    <div :class="ns.e('wrapper')" @click="toggleDropdown">
      <!-- Multiple tags -->
      <template v-if="multiple && Array.isArray(modelValue) && modelValue.length > 0">
        <span v-for="val in modelValue" :key="String(val)" :class="ns.e('tag')">
          {{ findOption(val) ? getLabel(findOption(val)!) : String(val) }}
          <span :class="ns.e('tag-close')" @click.stop="removeMultipleItem(val)">×</span>
        </span>
      </template>

      <!-- Single display -->
      <span v-if="!multiple" :class="[ns.e('display'), ns.is('placeholder', !displayText)]">
        {{ displayText || placeholderText }}
      </span>

      <!-- Clear -->
      <span
        v-if="clearable && displayText && !disabled"
        :class="ns.e('clear')"
        @click="handleClear"
      >
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

      <!-- Arrow -->
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

    <!-- Dropdown -->
    <transition name="zc-tree-select-dropdown">
      <div v-show="visible" :class="ns.e('dropdown')">
        <div v-if="filterable" :class="ns.e('search')">
          <input
            :class="ns.e('search-input')"
            type="text"
            :placeholder="searchPlaceholderText"
            :value="searchText"
            @input="handleSearchInput"
          />
        </div>

        <div :class="ns.e('tree')">
          <ZcTreeSelectNode
            v-for="option in filteredData"
            :key="String(option.value)"
            :node="option"
            :level="0"
            :expanded-keys="expandedKeys"
            :selected-value="
              multiple ? undefined : Array.isArray(modelValue) ? undefined : modelValue
            "
            :checked-values="multiple ? (Array.isArray(modelValue) ? modelValue : []) : []"
            :multiple="multiple"
            @toggle-expand="toggleExpand"
            @select="selectNode"
          />
          <div v-if="filteredData.length === 0" :class="ns.e('empty')">{{ noDataText }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcTreeSelect styles
 * ============================================================ */

.zc-tree-select {
  position: relative;
  display: inline-block;
  width: 100%;
  font-size: var(--text-zc-base, 14px);
}

.zc-tree-select__wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 36px;
  padding: 0 30px 0 11px;
  background: var(--color-zc-white, #fff);
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  box-sizing: border-box;
  cursor: pointer;
  transition: border-color var(--transition-duration-zc-base, 0.25s);
}

.zc-tree-select__wrapper:hover {
  border-color: var(--color-zc-primary-300, #a0cfff);
}

.zc-tree-select.is-focused .zc-tree-select__wrapper {
  border-color: var(--color-zc-primary-500, #409eff);
  box-shadow: 0 0 0 2px var(--color-zc-primary-50, #ecf5ff);
}

.zc-tree-select.is-disabled .zc-tree-select__wrapper {
  background: var(--color-zc-fill-light, #f5f7fa);
  border-color: var(--color-zc-border-light, #e4e7ed);
  cursor: not-allowed;
}

.zc-tree-select__display {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-zc-text-primary, #303133);
}

.zc-tree-select__display.is-placeholder {
  color: var(--color-zc-text-placeholder, #a8abb2);
}

/* Tags */
.zc-tree-select__tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 6px;
  margin: 2px 4px 2px 0;
  background: var(--color-zc-fill-light, #f5f7fa);
  border-radius: var(--radius-zc-base, 4px);
  font-size: var(--text-zc-xs, 12px);
  color: var(--color-zc-text-regular, #606266);
  line-height: 1;
}

.zc-tree-select__tag-close {
  margin-left: 4px;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
  font-size: 14px;
}

.zc-tree-select__tag-close:hover {
  color: var(--color-zc-text-primary, #303133);
}

/* Clear & Arrow */
.zc-tree-select__clear {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
}

.zc-tree-select__clear:hover {
  color: var(--color-zc-text-primary, #303133);
}

.zc-tree-select__arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-zc-text-secondary, #909399);
  transition: transform var(--transition-duration-zc-base, 0.25s);
  pointer-events: none;
}

.zc-tree-select__arrow.is-reverse {
  transform: translateY(-50%) rotate(180deg);
}

/* Sizes */
.zc-tree-select--large .zc-tree-select__wrapper {
  min-height: 42px;
  font-size: var(--text-zc-md, 16px);
}
.zc-tree-select--small .zc-tree-select__wrapper {
  min-height: 28px;
  font-size: var(--text-zc-sm, 13px);
}

/* Dropdown */
.zc-tree-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: var(--z-zc-dropdown, 1000);
  background: var(--color-zc-white, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  box-sizing: border-box;
}

/* Search */
.zc-tree-select__search {
  padding: 8px;
  border-bottom: 1px solid var(--color-zc-border-lighter, #ebeef5);
}

.zc-tree-select__search-input {
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  font-size: var(--text-zc-xs, 12px);
  outline: none;
  color: var(--color-zc-text-primary, #303133);
  box-sizing: border-box;
}

.zc-tree-select__search-input:focus {
  border-color: var(--color-zc-primary-500, #409eff);
}

/* Tree */
.zc-tree-select__tree {
  max-height: 260px;
  overflow-y: auto;
  padding: 4px 0;
  scrollbar-width: thin;
}

/* Virtual tree container */
.zc-tree-select__virtual-tree {
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: 4px;
}

.zc-tree-select__tree::-webkit-scrollbar {
  width: 4px;
}

.zc-tree-select__tree::-webkit-scrollbar-thumb {
  background: var(--color-zc-border-base, #dcdfe6);
  border-radius: 2px;
}

.zc-tree-select__empty {
  padding: 16px;
  text-align: center;
  color: var(--color-zc-text-secondary, #909399);
  font-size: var(--text-zc-xs, 12px);
}

/* Tree Node */
.zc-tree-select__node {
  user-select: none;
}

.zc-tree-select__node-content {
  display: flex;
  align-items: center;
  height: 32px;
  padding-right: 12px;
  cursor: pointer;
  color: var(--color-zc-text-regular, #606266);
  font-size: var(--text-zc-sm, 13px);
  transition: background var(--transition-duration-zc-fast, 0.15s);
  box-sizing: border-box;
}

.zc-tree-select__node-content:hover {
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-tree-select__node.is-selected > .zc-tree-select__node-content {
  color: var(--color-zc-primary-500, #409eff);
  font-weight: 600;
}

.zc-tree-select__node.is-disabled > .zc-tree-select__node-content {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

.zc-tree-select__node.is-disabled > .zc-tree-select__node-content:hover {
  background: transparent;
}

/* Virtual tree node */
.zc-tree-select__virtual-tree .zc-tree-select__node {
  display: flex;
  align-items: center;
  height: 32px;
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--transition-duration-zc-fast, 0.15s);
}

.zc-tree-select__virtual-tree .zc-tree-select__node:hover {
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-tree-select__virtual-tree .zc-tree-select__node-label.is-selected {
  color: var(--color-zc-primary-500, #409eff);
  font-weight: 600;
}

.zc-tree-select__node-expand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  color: var(--color-zc-text-secondary, #909399);
  flex-shrink: 0;
}

.zc-tree-select__node-expand.is-leaf {
  visibility: hidden;
}

.zc-tree-select__node-checkbox {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
  color: var(--color-zc-border-base, #dcdfe6);
  flex-shrink: 0;
}

.zc-tree-select__node-checkbox.is-checked {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-tree-select__node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Dropdown transition */
.zc-tree-select-dropdown-enter-active,
.zc-tree-select-dropdown-leave-active {
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}
.zc-tree-select-dropdown-enter-from,
.zc-tree-select-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
