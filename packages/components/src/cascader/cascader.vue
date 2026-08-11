<script setup lang="ts">
import { computed, ref, shallowRef, type Ref } from 'vue'
import { useNamespace, useVirtualList } from '@zc-ui/hooks'
import { useClickOutside } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import type { CascaderOption, CascaderExpandTrigger } from './types'

defineOptions({ name: 'ZcCascader' })

const props = withDefaults(
  defineProps<{
    modelValue?: (string | number)[][]
    options?: CascaderOption[]
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    size?: 'large' | 'medium' | 'small'
    filterable?: boolean
    expandTrigger?: CascaderExpandTrigger
    multiple?: boolean
    checkStrictly?: boolean
    virtualScroll?: boolean
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    placeholder: '',
    disabled: false,
    clearable: false,
    size: 'medium',
    filterable: false,
    expandTrigger: 'click',
    multiple: false,
    checkStrictly: false,
    virtualScroll: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: (string | number)[][]): void
  (e: 'change', value: (string | number)[][]): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'expand-change', value: (string | number)[]): void
}>()

const ns = useNamespace('cascader')
const { t } = useLocale()

const placeholderText = computed(() => props.placeholder || t('zc.cascader.placeholder'))
const containerRef = shallowRef<HTMLElement>()

const visible = ref(false)
const isFocused = ref(false)
const expandedPaths = ref<(string | number)[][]>([])
const activePath = ref<(string | number)[]>([])
const searchText = ref('')

useClickOutside(containerRef, () => {
  if (visible.value) closeDropdown()
})

// ---- Helpers ----
function getLabel(option: CascaderOption): string {
  return option.label ?? String(option.value)
}

function getChildren(option: CascaderOption): CascaderOption[] | undefined {
  return option.children
}

function isDisabled(option: CascaderOption): boolean {
  return option.disabled === true
}

// ---- Panels ----
const panels = computed<CascaderOption[][]>(() => {
  const result: CascaderOption[][] = [props.options]
  for (const pathValue of activePath.value) {
    const parentOption = findOptionByPath(result[result.length - 1], pathValue)
    if (parentOption?.children?.length) {
      result.push(parentOption.children)
    } else {
      break
    }
  }
  return result
})

function findOptionByPath(
  options: CascaderOption[],
  targetValue: string | number
): CascaderOption | undefined {
  for (const opt of options) {
    if (opt.value === targetValue) return opt
  }
  return undefined
}

// ---- Selected labels ----
const selectedLabels = computed<string[]>(() => {
  const vals = props.modelValue
  if (!vals || vals.length === 0) return []
  return vals.map((path) => {
    const labels: string[] = []
    let current = props.options
    for (const val of path) {
      const opt = current.find((o) => o.value === val)
      if (opt) {
        labels.push(getLabel(opt))
        if (opt.children) current = opt.children
      }
    }
    return labels.join(' / ')
  })
})

const displayText = computed(() => {
  if (props.multiple) {
    if (!props.modelValue || props.modelValue.length === 0) return ''
    return selectedLabels.value.join(', ')
  }
  return selectedLabels.value[0] ?? ''
})

// ---- Filtered panels ----
const filteredOptions = computed<CascaderOption[]>(() => {
  if (!props.filterable || !searchText.value) return []
  const keyword = searchText.value.toLowerCase()
  const results: CascaderOption[] = []

  function flatten(options: CascaderOption[], path: CascaderOption[]) {
    for (const opt of options) {
      const fullPath = [...path, opt]
      if (getLabel(opt).toLowerCase().includes(keyword)) {
        results.push(opt)
      }
      if (opt.children) {
        flatten(opt.children, fullPath)
      }
    }
  }

  flatten(props.options, [])
  return results
})

const showFilterPanel = computed(() => props.filterable && searchText.value.length > 0)

// ---- Classes ----
const classes = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('focused', isFocused.value),
  ns.is('open', visible.value),
])

// ---- Actions ----
function expandNode(option: CascaderOption, panelIndex: number) {
  if (isDisabled(option)) return

  const newPath = [...activePath.value.slice(0, panelIndex), option.value]
  activePath.value = newPath

  if (getChildren(option)?.length) {
    const pathStr = JSON.stringify(newPath)
    const exists = expandedPaths.value.some((p) => JSON.stringify(p) === pathStr)
    if (!exists) {
      expandedPaths.value.push([...newPath])
    }
    emit('expand-change', newPath)
  }
}

function handleNodeHover(option: CascaderOption, panelIndex: number) {
  if (props.expandTrigger !== 'hover') return
  if (isDisabled(option)) return
  if (getChildren(option)?.length) {
    expandNode(option, panelIndex)
  }
}

function selectNode(option: CascaderOption, panelIndex: number) {
  if (isDisabled(option)) return
  const hasChildren = !!getChildren(option)?.length

  // When checkStrictly is true, allow selecting any node (including parents)
  if (!props.checkStrictly && props.expandTrigger === 'click' && hasChildren) {
    expandNode(option, panelIndex)
    return
  }

  const newPath = [...activePath.value.slice(0, panelIndex), option.value]

  if (props.multiple) {
    const current = [...props.modelValue]
    const existingIndex = current.findIndex((p) => JSON.stringify(p) === JSON.stringify(newPath))
    if (existingIndex >= 0) {
      current.splice(existingIndex, 1)
    } else {
      current.push(newPath)
    }
    emit('update:modelValue', current)
    emit('change', current)
  } else {
    emit('update:modelValue', [newPath])
    emit('change', [newPath])
    closeDropdown()
  }
}

function selectFilteredOption(option: CascaderOption) {
  const path = findPathToOption(props.options, option.value)
  if (path) {
    if (props.multiple) {
      const current = [...props.modelValue]
      const existingIndex = current.findIndex((p) => JSON.stringify(p) === JSON.stringify(path))
      if (existingIndex >= 0) {
        current.splice(existingIndex, 1)
      } else {
        current.push(path)
      }
      emit('update:modelValue', current)
      emit('change', current)
    } else {
      emit('update:modelValue', [path])
      emit('change', [path])
      closeDropdown()
    }
  }
}

function findPathToOption(
  options: CascaderOption[],
  targetValue: string | number,
  path: (string | number)[] = []
): (string | number)[] | null {
  for (const opt of options) {
    const newPath = [...path, opt.value]
    if (opt.value === targetValue) return newPath
    if (opt.children) {
      const result = findPathToOption(opt.children, targetValue, newPath)
      if (result) return result
    }
  }
  return null
}

function toggleDropdown() {
  if (props.disabled) return
  if (visible.value) {
    closeDropdown()
  } else {
    visible.value = true
    isFocused.value = true
  }
}

function closeDropdown() {
  visible.value = false
  isFocused.value = false
  searchText.value = ''
}

/* ---- Virtual scroll integration ---- */
const virtualItemHeight = 34

interface VirtualPanel {
  containerRef: Ref<HTMLElement | undefined>
  visibleData: Ref<CascaderOption[]>
  totalHeight: Ref<number>
  offsetY: Ref<number>
}

const virtualPanels = computed(() => {
  if (!props.virtualScroll) return []
  return panels.value.map((panelOptions) => {
    const result = useVirtualList<CascaderOption>({
      data: computed(() => panelOptions),
      itemHeight: virtualItemHeight,
      overscan: 5,
    })
    return {
      containerRef: result.containerRef,
      visibleData: result.visibleData,
      totalHeight: result.totalHeight,
      offsetY: result.offsetY,
    } satisfies VirtualPanel
  })
})

function handleClear(event: Event) {
  event.stopPropagation()
  emit('update:modelValue', [])
  emit('change', [])
}

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  searchText.value = target.value
}

function removeMultiplePath(path: (string | number)[]) {
  if (props.disabled) return
  const current = [...props.modelValue]
  const index = current.findIndex((p) => JSON.stringify(p) === JSON.stringify(path))
  if (index >= 0) {
    current.splice(index, 1)
    emit('update:modelValue', current)
    emit('change', current)
  }
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeDropdown()
  }
}

defineExpose({
  /** Toggle dropdown visibility */
  toggleDropdown,
  /** Close the dropdown */
  closeDropdown,
  /** Clear selected value */
  handleClear,
  /** Current visible state */
  visible,
})
</script>

<template>
  <div
    ref="containerRef"
    :class="classes"
    role="combobox"
    aria-haspopup="listbox"
    :aria-expanded="visible"
    :aria-label="placeholderText"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    @keydown="handleKeyDown"
  >
    <!-- Input wrapper -->
    <div :class="ns.e('wrapper')" @click="toggleDropdown">
      <!-- Multiple tags -->
      <template v-if="multiple && modelValue.length > 0">
        <span v-for="(path, idx) in modelValue" :key="idx" :class="ns.e('tag')">
          {{ selectedLabels[idx] }}
          <span :class="ns.e('tag-close')" @click.stop="removeMultiplePath(path)">×</span>
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
        role="button"
        aria-label="清除选择"
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
    <transition name="zc-cascader-dropdown">
      <div v-show="visible" :class="ns.e('dropdown')">
        <!-- Search input -->
        <div v-if="filterable" :class="ns.e('search')">
          <input
            :class="ns.e('search-input')"
            type="text"
            :placeholder="placeholderText"
            :value="searchText"
            @input="handleSearchInput"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </div>

        <!-- Filtered results -->
        <div v-if="showFilterPanel" :class="ns.e('menu')">
          <div :class="ns.e('menu-list')">
            <div
              v-for="option in filteredOptions"
              :key="String(option.value)"
              :class="[ns.e('node'), ns.is('disabled', isDisabled(option))]"
              @click="selectFilteredOption(option)"
            >
              {{ getLabel(option) }}
            </div>
          </div>
        </div>

        <!-- Normal panels -->
        <div v-else :class="ns.e('panels')">
          <!-- Virtual scroll mode -->
          <template v-if="virtualScroll">
            <div v-for="(_panel, panelIdx) in panels" :key="panelIdx" :class="ns.e('menu')">
              <div
                v-if="virtualPanels[panelIdx]"
                :ref="(virtualPanels[panelIdx] as any).containerRef"
                :class="ns.e('menu-list')"
                style="height: 260px; overflow-y: auto"
              >
                <div
                  :style="{
                    height: `${(virtualPanels[panelIdx] as any).totalHeight}px`,
                    position: 'relative',
                  }"
                >
                  <div
                    :style="{
                      transform: `translateY(${(virtualPanels[panelIdx] as any).offsetY}px)`,
                    }"
                  >
                    <div
                      v-for="option in (virtualPanels[panelIdx] as any).visibleData"
                      :key="String(option.value)"
                      :class="[
                        ns.e('node'),
                        ns.is('active', activePath[panelIdx] === option.value),
                        ns.is('disabled', isDisabled(option)),
                        ns.is('expand', !!getChildren(option)?.length),
                      ]"
                      @click="selectNode(option, panelIdx)"
                      @mouseenter="handleNodeHover(option, panelIdx)"
                    >
                      <span :class="ns.e('node-label')">{{ getLabel(option) }}</span>
                      <span v-if="getChildren(option)?.length" :class="ns.e('node-arrow')">›</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Normal mode -->
          <template v-else>
            <div v-for="(panel, panelIdx) in panels" :key="panelIdx" :class="ns.e('menu')">
              <div :class="ns.e('menu-list')">
                <div
                  v-for="option in panel"
                  :key="String(option.value)"
                  :class="[
                    ns.e('node'),
                    ns.is('active', activePath[panelIdx] === option.value),
                    ns.is('disabled', isDisabled(option)),
                    ns.is('expand', !!getChildren(option)?.length),
                  ]"
                  role="option"
                  :aria-selected="activePath[panelIdx] === option.value"
                  :aria-disabled="isDisabled(option)"
                  :aria-level="panelIdx + 1"
                  :aria-label="getLabel(option)"
                  :tabindex="isDisabled(option) ? -1 : 0"
                  @click="selectNode(option, panelIdx)"
                  @keydown.enter.prevent="selectNode(option, panelIdx)"
                  @mouseenter="handleNodeHover(option, panelIdx)"
                >
                  <!-- Multiple checkbox -->
                  <span
                    v-if="multiple"
                    :class="ns.e('node-checkbox')"
                    @click.stop="selectNode(option, panelIdx)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <path
                        v-if="
                          modelValue.some(
                            (p: (string | number)[]) =>
                              JSON.stringify([...activePath.slice(0, panelIdx), option.value]) ===
                              JSON.stringify(p)
                          )
                        "
                        d="M7 12l3 3 7-7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <span :class="ns.e('node-label')">{{ getLabel(option) }}</span>
                  <span v-if="getChildren(option)?.length" :class="ns.e('node-arrow')">
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcCascader styles
 * ============================================================ */

.zc-cascader {
  position: relative;
  display: inline-block;
  width: 100%;
  font-size: var(--text-zc-base, 14px);
}

.zc-cascader__wrapper {
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

.zc-cascader__wrapper:hover {
  border-color: var(--color-zc-primary-300, #a0cfff);
}

.zc-cascader.is-focused .zc-cascader__wrapper {
  border-color: var(--color-zc-primary-500, #409eff);
  box-shadow: 0 0 0 2px var(--color-zc-primary-50, #ecf5ff);
}

.zc-cascader.is-disabled .zc-cascader__wrapper {
  background: var(--color-zc-fill-light, #f5f7fa);
  border-color: var(--color-zc-border-light, #e4e7ed);
  cursor: not-allowed;
}

.zc-cascader__display {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-zc-text-primary, #303133);
}

.zc-cascader__display.is-placeholder {
  color: var(--color-zc-text-placeholder, #a8abb2);
}

/* Tags */
.zc-cascader__tag {
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

.zc-cascader__tag-close {
  margin-left: 4px;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
  font-size: 14px;
  line-height: 1;
}

.zc-cascader__tag-close:hover {
  color: var(--color-zc-text-primary, #303133);
}

/* Clear & Arrow */
.zc-cascader__clear {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
}

.zc-cascader__clear:hover {
  color: var(--color-zc-text-primary, #303133);
}

.zc-cascader__arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-zc-text-secondary, #909399);
  transition: transform var(--transition-duration-zc-base, 0.25s);
  pointer-events: none;
}

.zc-cascader__arrow.is-reverse {
  transform: translateY(-50%) rotate(180deg);
}

/* Sizes */
.zc-cascader--large .zc-cascader__wrapper {
  min-height: 42px;
  font-size: var(--text-zc-md, 16px);
}
.zc-cascader--small .zc-cascader__wrapper {
  min-height: 28px;
  font-size: var(--text-zc-sm, 13px);
}

/* Dropdown */
.zc-cascader__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: var(--z-zc-dropdown, 1000);
  background: var(--color-zc-white, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  box-sizing: border-box;
}

/* Search */
.zc-cascader__search {
  padding: 8px;
  border-bottom: 1px solid var(--color-zc-border-lighter, #ebeef5);
}

.zc-cascader__search-input {
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

.zc-cascader__search-input:focus {
  border-color: var(--color-zc-primary-500, #409eff);
}

/* Panels */
.zc-cascader__panels {
  display: flex;
}

.zc-cascader__menu {
  min-width: 180px;
  max-height: 260px;
  border-right: 1px solid var(--color-zc-border-lighter, #ebeef5);
}

.zc-cascader__menu:last-child {
  border-right: none;
}

.zc-cascader__menu-list {
  padding: 4px 0;
  margin: 0;
}

/* Node */
.zc-cascader__node {
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 20px 0 10px;
  cursor: pointer;
  color: var(--color-zc-text-regular, #606266);
  font-size: var(--text-zc-sm, 13px);
  transition: background var(--transition-duration-zc-fast, 0.15s);
  box-sizing: border-box;
}

.zc-cascader__node:hover {
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-cascader__node.is-active {
  color: var(--color-zc-primary-500, #409eff);
  font-weight: 600;
}

.zc-cascader__node.is-disabled {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

.zc-cascader__node.is-disabled:hover {
  background: transparent;
}

.zc-cascader__node-checkbox {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
  color: var(--color-zc-border-base, #dcdfe6);
}

.zc-cascader__node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zc-cascader__node-arrow {
  display: inline-flex;
  margin-left: 8px;
  color: var(--color-zc-text-placeholder, #a8abb2);
}

/* Dropdown transition */
.zc-cascader-dropdown-enter-active,
.zc-cascader-dropdown-leave-active {
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}
.zc-cascader-dropdown-enter-from,
.zc-cascader-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
