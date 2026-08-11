<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import type { TransferOption } from './types'

defineOptions({ name: 'ZcTransfer' })

const props = withDefaults(
  defineProps<{
    modelValue?: (string | number)[]
    data?: TransferOption[]
    titles?: string[]
    filterable?: boolean
    filterPlaceholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: () => [],
    data: () => [],
    titles: () => [],
    filterable: false,
    filterPlaceholder: '',
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: (string | number)[]): void
  (e: 'change', value: (string | number)[]): void
  (e: 'left-check-change', checked: (string | number)[]): void
  (e: 'right-check-change', checked: (string | number)[]): void
}>()

const ns = useNamespace('transfer')
const { t } = useLocale()

const displayFilterPlaceholder = computed(
  () => props.filterPlaceholder || t('zc.transfer.filterPlaceholder')
)
const emptyText = computed(() => t('zc.transfer.noData'))

const leftChecked = ref<Set<string | number>>(new Set())
const rightChecked = ref<Set<string | number>>(new Set())
const leftSearch = ref('')
const rightSearch = ref('')

// ---- Computed ----
const leftData = computed<TransferOption[]>(() => {
  const rightKeys = new Set(props.modelValue)
  let items = props.data.filter((item) => !rightKeys.has(item.key))
  if (props.filterable && leftSearch.value) {
    const keyword = leftSearch.value.toLowerCase()
    items = items.filter((item) => item.label.toLowerCase().includes(keyword))
  }
  return items
})

const rightData = computed<TransferOption[]>(() => {
  let items = props.data.filter((item) => props.modelValue.includes(item.key))
  if (props.filterable && rightSearch.value) {
    const keyword = rightSearch.value.toLowerCase()
    items = items.filter((item) => item.label.toLowerCase().includes(keyword))
  }
  return items
})

const leftCheckedAll = computed(() => {
  const available = leftData.value.filter((item) => !item.disabled)
  return available.length > 0 && available.every((item) => leftChecked.value.has(item.key))
})

const rightCheckedAll = computed(() => {
  const available = rightData.value.filter((item) => !item.disabled)
  return available.length > 0 && available.every((item) => rightChecked.value.has(item.key))
})

const leftIndeterminate = computed(() => {
  const available = leftData.value.filter((item) => !item.disabled)
  const checkedCount = available.filter((item) => leftChecked.value.has(item.key)).length
  return checkedCount > 0 && checkedCount < available.length
})

const rightIndeterminate = computed(() => {
  const available = rightData.value.filter((item) => !item.disabled)
  const checkedCount = available.filter((item) => rightChecked.value.has(item.key)).length
  return checkedCount > 0 && checkedCount < available.length
})

const canMoveToRight = computed(() => leftChecked.value.size > 0 && !props.disabled)

const canMoveToLeft = computed(() => rightChecked.value.size > 0 && !props.disabled)

// ---- Check handling ----
function toggleLeftAll() {
  const newSet = new Set<string | number>()
  if (!leftCheckedAll.value) {
    leftData.value.filter((item) => !item.disabled).forEach((item) => newSet.add(item.key))
  }
  leftChecked.value = newSet
  emitCheckedChange('left', Array.from(newSet))
}

function toggleRightAll() {
  const newSet = new Set<string | number>()
  if (!rightCheckedAll.value) {
    rightData.value.filter((item) => !item.disabled).forEach((item) => newSet.add(item.key))
  }
  rightChecked.value = newSet
  emitCheckedChange('right', Array.from(newSet))
}

function toggleLeftItem(key: string | number, disabled?: boolean) {
  if (disabled) return
  const newSet = new Set(leftChecked.value)
  if (newSet.has(key)) {
    newSet.delete(key)
  } else {
    newSet.add(key)
  }
  leftChecked.value = newSet
  emitCheckedChange('left', Array.from(newSet))
}

function toggleRightItem(key: string | number, disabled?: boolean) {
  if (disabled) return
  const newSet = new Set(rightChecked.value)
  if (newSet.has(key)) {
    newSet.delete(key)
  } else {
    newSet.add(key)
  }
  rightChecked.value = newSet
  emitCheckedChange('right', Array.from(newSet))
}

function emitCheckedChange(side: 'left' | 'right', checked: (string | number)[]) {
  if (side === 'left') {
    emit('left-check-change', checked)
  } else {
    emit('right-check-change', checked)
  }
}

// ---- Move ----
function moveToRight() {
  if (!canMoveToRight.value) return
  const newValue = [...props.modelValue]
  leftChecked.value.forEach((key) => {
    if (!newValue.includes(key)) {
      newValue.push(key)
    }
  })
  leftChecked.value = new Set()
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

function moveToLeft() {
  if (!canMoveToLeft.value) return
  const newValue = [...props.modelValue]
  rightChecked.value.forEach((key) => {
    const index = newValue.indexOf(key)
    if (index >= 0) newValue.splice(index, 1)
  })
  rightChecked.value = new Set()
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

defineExpose({
  /** Move checked items from left to right */
  moveToRight,
  /** Move checked items from right to left */
  moveToLeft,
  /** Left panel search query */
  leftSearch,
  /** Right panel search query */
  rightSearch,
})
</script>

<template>
  <div :class="[ns.b(), ns.is('disabled', disabled)]">
    <!-- Left panel -->
    <div :class="ns.e('panel')">
      <div :class="ns.e('header')">
        <label :class="ns.e('header-checkbox')">
          <span
            :class="[
              ns.e('checkbox'),
              ns.is('checked', leftCheckedAll),
              ns.is('indeterminate', leftIndeterminate),
              ns.is('disabled', disabled),
            ]"
            @click="toggleLeftAll"
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
                v-if="leftCheckedAll"
                d="M7 12l3 3 7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path v-else-if="leftIndeterminate" d="M7 12h10" stroke-linecap="round" />
            </svg>
          </span>
        </label>
        <span :class="ns.e('header-text')"> {{ leftChecked.size }}/{{ leftData.length }} </span>
      </div>

      <div v-if="filterable" :class="ns.e('filter')">
        <input
          v-model="leftSearch"
          :class="ns.e('filter-input')"
          type="text"
          :placeholder="displayFilterPlaceholder"
        />
      </div>

      <div :class="ns.e('list')">
        <label
          v-for="item in leftData"
          :key="String(item.key)"
          :class="[
            ns.e('item'),
            ns.is('checked', leftChecked.has(item.key)),
            ns.is('disabled', item.disabled || disabled),
          ]"
        >
          <span
            :class="[
              ns.e('checkbox'),
              ns.is('checked', leftChecked.has(item.key)),
              ns.is('disabled', item.disabled || disabled),
            ]"
            @click="toggleLeftItem(item.key, item.disabled)"
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
                v-if="leftChecked.has(item.key)"
                d="M7 12l3 3 7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span :class="ns.e('item-label')">{{ item.label }}</span>
        </label>
        <div v-if="leftData.length === 0" :class="ns.e('empty')">{{ emptyText }}</div>
      </div>
    </div>

    <!-- Buttons -->
    <div :class="ns.e('buttons')">
      <button
        :class="[ns.e('button'), ns.is('disabled', !canMoveToRight)]"
        :disabled="!canMoveToRight"
        @click="moveToRight"
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        :class="[ns.e('button'), ns.is('disabled', !canMoveToLeft)]"
        :disabled="!canMoveToLeft"
        @click="moveToLeft"
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- Right panel -->
    <div :class="ns.e('panel')">
      <div :class="ns.e('header')">
        <label :class="ns.e('header-checkbox')">
          <span
            :class="[
              ns.e('checkbox'),
              ns.is('checked', rightCheckedAll),
              ns.is('indeterminate', rightIndeterminate),
              ns.is('disabled', disabled),
            ]"
            @click="toggleRightAll"
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
                v-if="rightCheckedAll"
                d="M7 12l3 3 7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path v-else-if="rightIndeterminate" d="M7 12h10" stroke-linecap="round" />
            </svg>
          </span>
        </label>
        <span :class="ns.e('header-text')"> {{ rightChecked.size }}/{{ rightData.length }} </span>
      </div>

      <div v-if="filterable" :class="ns.e('filter')">
        <input
          v-model="rightSearch"
          :class="ns.e('filter-input')"
          type="text"
          :placeholder="displayFilterPlaceholder"
        />
      </div>

      <div :class="ns.e('list')">
        <label
          v-for="item in rightData"
          :key="String(item.key)"
          :class="[
            ns.e('item'),
            ns.is('checked', rightChecked.has(item.key)),
            ns.is('disabled', item.disabled || disabled),
          ]"
        >
          <span
            :class="[
              ns.e('checkbox'),
              ns.is('checked', rightChecked.has(item.key)),
              ns.is('disabled', item.disabled || disabled),
            ]"
            @click="toggleRightItem(item.key, item.disabled)"
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
                v-if="rightChecked.has(item.key)"
                d="M7 12l3 3 7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span :class="ns.e('item-label')">{{ item.label }}</span>
        </label>
        <div v-if="rightData.length === 0" :class="ns.e('empty')">{{ emptyText }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcTransfer styles
 * ============================================================ */

.zc-transfer {
  display: inline-flex;
  align-items: center;
  font-size: var(--text-zc-base, 14px);
}

.zc-transfer.is-disabled {
  opacity: 0.6;
}

/* Panel */
.zc-transfer__panel {
  width: 220px;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  background: var(--color-zc-white, #fff);
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.zc-transfer__header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-zc-border-lighter, #ebeef5);
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-transfer__header-checkbox {
  display: inline-flex;
  cursor: pointer;
}

.zc-transfer__header-text {
  flex: 1;
  text-align: right;
  color: var(--color-zc-text-secondary, #909399);
  font-size: var(--text-zc-xs, 12px);
}

/* Checkbox */
.zc-transfer__checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-zc-border-base, #dcdfe6);
  transition: color var(--transition-duration-zc-fast, 0.15s);
}

.zc-transfer__checkbox.is-checked {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-transfer__checkbox.is-indeterminate {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-transfer__checkbox.is-disabled {
  cursor: not-allowed;
  color: var(--color-zc-text-placeholder, #a8abb2);
}

/* Filter */
.zc-transfer__filter {
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-zc-border-lighter, #ebeef5);
}

.zc-transfer__filter-input {
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

.zc-transfer__filter-input:focus {
  border-color: var(--color-zc-primary-500, #409eff);
}

/* List */
.zc-transfer__list {
  height: 300px;
  overflow-y: auto;
  padding: 4px 0;
  scrollbar-width: thin;
}

.zc-transfer__list::-webkit-scrollbar {
  width: 4px;
}

.zc-transfer__list::-webkit-scrollbar-thumb {
  background: var(--color-zc-border-base, #dcdfe6);
  border-radius: 2px;
}

/* Item */
.zc-transfer__item {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  cursor: pointer;
  color: var(--color-zc-text-regular, #606266);
  font-size: var(--text-zc-sm, 13px);
  transition: background var(--transition-duration-zc-fast, 0.15s);
}

.zc-transfer__item:hover {
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-transfer__item.is-checked {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-transfer__item.is-disabled {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

.zc-transfer__item.is-disabled:hover {
  background: transparent;
}

.zc-transfer__item-label {
  margin-left: 8px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zc-transfer__empty {
  padding: 16px;
  text-align: center;
  color: var(--color-zc-text-secondary, #909399);
  font-size: var(--text-zc-xs, 12px);
}

/* Buttons */
.zc-transfer__buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 8px;
}

.zc-transfer__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  background: var(--color-zc-white, #fff);
  color: var(--color-zc-text-primary, #303133);
  cursor: pointer;
  transition: all var(--transition-duration-zc-fast, 0.15s);
}

.zc-transfer__button:hover:not(.is-disabled) {
  border-color: var(--color-zc-primary-500, #409eff);
  color: var(--color-zc-primary-500, #409eff);
}

.zc-transfer__button.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
