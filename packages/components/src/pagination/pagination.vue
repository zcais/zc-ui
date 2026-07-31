<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'

defineOptions({ name: 'ZcPagination' })

import type { PaginationLayout } from './types'

const props = withDefaults(
  defineProps<{
    /** Total number of records */
    total: number
    /** Items per page */
    pageSize?: number
    /** Current page (v-model) */
    currentPage?: number
    /** Layout components to show */
    layout?: PaginationLayout
    /** Max visible page numbers */
    pagerCount?: number
    /** Disabled state */
    disabled?: boolean
    /** Available page sizes for the sizes selector */
    pageSizes?: number[]
    /** Show background on pager buttons */
    background?: boolean
  }>(),
  {
    pageSize: 10,
    currentPage: 1,
    layout: 'prev, pager, next, jumper, total',
    pagerCount: 7,
    disabled: false,
    pageSizes: () => [10, 20, 50, 100],
    background: false,
  }
)

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'change', page: number, pageSize: number): void
  (e: 'prev-click', page: number): void
  (e: 'next-click', page: number): void
}>()

const ns = useNamespace('pagination')
const { t } = useLocale()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const currentPageSync = computed({
  get: () => Math.min(Math.max(1, props.currentPage), totalPages.value),
  set: (val: number) => {
    const clamped = Math.min(Math.max(1, val), totalPages.value)
    emit('update:currentPage', clamped)
    emit('change', clamped, props.pageSize)
  },
})

/** Compute pager items with ellipsis */
const pagers = computed<(number | string)[]>(() => {
  const current = currentPageSync.value
  const count = props.pagerCount
  const half = Math.floor((count - 1) / 2)
  const total = totalPages.value

  if (total <= count) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const result: (number | string)[] = [1]
  let left = current - half
  let right = current + half

  if (left <= 2) {
    left = 2
    right = Math.min(count - 1, total - 1)
  } else if (right >= total - 1) {
    right = total - 1
    left = Math.max(2, total - count + 2)
  }

  if (left > 2) result.push('...')
  for (let i = left; i <= right; i++) result.push(i)
  if (right < total - 1) result.push('...')

  result.push(total)
  return result
})

const layoutParts = computed(() => props.layout.split(',').map((s) => s.trim()))

const isFirst = computed(() => currentPageSync.value <= 1)
const isLast = computed(() => currentPageSync.value >= totalPages.value)

function goTo(page: number) {
  if (props.disabled) return
  currentPageSync.value = page
}

function goPrev() {
  if (props.disabled || isFirst.value) return
  const newPage = currentPageSync.value - 1
  emit('prev-click', newPage)
  goTo(newPage)
}

function goNext() {
  if (props.disabled || isLast.value) return
  const newPage = currentPageSync.value + 1
  emit('next-click', newPage)
  goTo(newPage)
}

function handleJumper(e: KeyboardEvent) {
  const target = e.target as HTMLInputElement
  const val = parseInt(target.value, 10)
  if (!isNaN(val)) goTo(val)
  target.value = ''
}

/** Change page size from the sizes selector */
function handleSizeChange(e: Event) {
  const target = e.target as HTMLSelectElement
  const newSize = parseInt(target.value, 10)
  emit('update:pageSize', newSize)
  // Reset to page 1 when size changes
  const newTotalPages = Math.max(1, Math.ceil(props.total / newSize))
  const newPage = Math.min(currentPageSync.value, newTotalPages)
  emit('update:currentPage', newPage)
  emit('change', newPage, newSize)
}

function isActive(page: number | string) {
  return page === currentPageSync.value
}
</script>

<template>
  <div
    :class="[ns.b(), ns.is('disabled', disabled), ns.is('background', background)]"
    role="navigation"
    :aria-label="t('zc.pagination.label')"
  >
    <template v-for="(part, i) in layoutParts" :key="i">
      <!-- Total -->
      <span v-if="part === 'total'" :class="ns.e('total')">
        {{ t('zc.pagination.total', { total }) }}
      </span>

      <!-- Prev -->
      <button
        v-else-if="part === 'prev'"
        :class="[ns.e('btn'), ns.e('prev'), ns.is('disabled', isFirst)]"
        :disabled="disabled || isFirst"
        :aria-label="t('zc.pagination.prev')"
        type="button"
        @click="goPrev"
      >
        <svg viewBox="0 0 24 24" fill="none" class="zc-pagination__icon">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- Pager -->
      <ul v-else-if="part === 'pager'" :class="ns.e('pager')">
        <li
          v-for="(page, idx) in pagers"
          :key="idx"
          :class="[
            ns.e('number'),
            ns.is('active', isActive(page)),
            ns.is('ellipsis', page === '...'),
          ]"
          :role="page === '...' ? 'none' : undefined"
          :aria-current="isActive(page) ? 'page' : undefined"
          :aria-label="page === '...' ? undefined : `第 ${page} 页`"
          :tabindex="page === '...' || isActive(page) ? -1 : 0"
          :aria-hidden="page === '...' ? 'true' : undefined"
          @click="page !== '...' && goTo(page as number)"
          @keydown.enter="page !== '...' && goTo(page as number)"
        >
          <template v-if="page === '...'">
            <svg viewBox="0 0 24 24" fill="none" class="zc-pagination__ellipsis-icon">
              <circle cx="5" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="19" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </template>
          <template v-else>{{ page }}</template>
        </li>
      </ul>

      <!-- Next -->
      <button
        v-else-if="part === 'next'"
        :class="[ns.e('btn'), ns.e('next'), ns.is('disabled', isLast)]"
        :disabled="disabled || isLast"
        :aria-label="t('zc.pagination.next')"
        type="button"
        @click="goNext"
      >
        <svg viewBox="0 0 24 24" fill="none" class="zc-pagination__icon">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- Sizes selector -->
      <span v-else-if="part === 'sizes'" :class="ns.e('sizes')">
        <select
          :class="ns.e('sizes-select')"
          :value="pageSize"
          :disabled="disabled"
          aria-label="Items per page"
          @change="handleSizeChange"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }} / page</option>
        </select>
      </span>

      <!-- Jumper -->
      <span v-else-if="part === 'jumper'" :class="ns.e('jumper')">
        {{ t('zc.pagination.goto') }}
        <input
          :class="ns.e('jumper-input')"
          :aria-label="t('zc.pagination.goto')"
          type="number"
          :min="1"
          :max="totalPages"
          :disabled="disabled"
          @keyup.enter="handleJumper"
        />
        {{ t('zc.pagination.pageClassifier') }}
      </span>
    </template>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcPagination styles
 * ============================================================ */

.zc-pagination {
  --zc-pagination-button-bg-color: var(--color-zc-bg-base, #fff);
  --zc-pagination-button-text-color: var(--color-zc-text-regular, #606266);
  --zc-pagination-button-hover-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-pagination-button-hover-text-color: var(--color-zc-primary-500, #409eff);
  --zc-pagination-button-active-bg-color: var(--color-zc-primary-500, #409eff);
  --zc-pagination-button-active-text-color: var(--color-zc-white, #fff);
  --zc-pagination-button-disabled-bg-color: var(--color-zc-bg-base, #fff);
  --zc-pagination-button-disabled-text-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-pagination-button-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-pagination-button-border-radius: var(--radius-zc-base, 4px);
  --zc-pagination-button-size: 32px;
  --zc-pagination-font-size: var(--text-zc-base, 14px);
  --zc-pagination-active-color: var(--color-zc-primary-500, #409eff);

  display: flex;
  align-items: center;
  gap: var(--spacing-zc-sm, 8px);
  font-size: var(--zc-pagination-font-size);
  color: var(--zc-pagination-button-text-color);
}

.zc-pagination.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.zc-pagination__total {
  white-space: nowrap;
  margin-right: var(--spacing-zc-xs, 4px);
  color: var(--zc-pagination-total-text-color);
}

.zc-pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 4px;
  border: 1px solid var(--zc-pagination-button-border-color);
  border-radius: var(--zc-pagination-button-border-radius);
  background: var(--zc-pagination-button-bg-color);
  color: var(--zc-pagination-button-text-color);
  cursor: pointer;
  transition: all var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-pagination__btn:hover:not(.is-disabled) {
  background: var(--zc-pagination-button-hover-bg-color);
  color: var(--zc-pagination-button-hover-text-color);
  border-color: var(--zc-pagination-active-color);
}

.zc-pagination__btn.is-disabled {
  cursor: not-allowed;
  background: var(--zc-pagination-button-disabled-bg-color);
  color: var(--zc-pagination-button-disabled-text-color);
}

.zc-pagination__icon {
  width: 16px;
  height: 16px;
}

.zc-pagination__pager {
  display: flex;
  align-items: center;
  gap: var(--spacing-zc-xs, 4px);
  list-style: none;
  margin: 0;
  padding: 0;
}

.zc-pagination__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 4px;
  border: 1px solid var(--zc-pagination-button-border-color);
  border-radius: var(--zc-pagination-button-border-radius);
  background: var(--zc-pagination-button-bg-color);
  color: var(--zc-pagination-button-text-color);
  cursor: pointer;
  user-select: none;
  transition: all var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-pagination__number:hover:not(.is-active):not(.is-ellipsis) {
  background: var(--zc-pagination-button-hover-bg-color);
  color: var(--zc-pagination-button-hover-text-color);
  border-color: var(--zc-pagination-active-color);
}

.zc-pagination__number.is-active {
  background: var(--zc-pagination-button-active-bg-color);
  border-color: var(--zc-pagination-button-active-bg-color);
  color: var(--zc-pagination-button-active-text-color);
  font-weight: 600;
}

.zc-pagination__number.is-ellipsis {
  border: none;
  background: none;
  cursor: default;
  letter-spacing: 2px;
}

.zc-pagination__ellipsis-icon {
  width: 20px;
  height: 16px;
}

.zc-pagination__jumper {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-zc-xs, 4px);
  white-space: nowrap;
}

.zc-pagination__jumper-input {
  width: 48px;
  height: 28px;
  padding: 0 4px;
  text-align: center;
  border: 1px solid var(--zc-pagination-button-border-color);
  border-radius: var(--zc-pagination-button-border-radius);
  background: var(--zc-pagination-button-bg-color);
  color: var(--zc-pagination-button-text-color);
  font-size: var(--zc-pagination-font-size);
  outline: none;
  transition: border-color var(--transition-duration-zc-base, 0.25s);
}

.zc-pagination__jumper-input:focus {
  border-color: var(--zc-pagination-active-color);
}

/* Remove number input arrows */
.zc-pagination__jumper-input::-webkit-inner-spin-button,
.zc-pagination__jumper-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.zc-pagination__jumper-input {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* ---- Sizes selector ---- */
.zc-pagination__sizes {
  display: inline-flex;
  align-items: center;
  margin-right: var(--spacing-zc-xs, 4px);
}

.zc-pagination__sizes-select {
  height: 28px;
  padding: 0 24px 0 8px;
  border: 1px solid var(--zc-pagination-button-border-color);
  border-radius: var(--zc-pagination-button-border-radius);
  background: var(--zc-pagination-button-bg-color);
  color: var(--zc-pagination-button-text-color);
  font-size: var(--zc-pagination-font-size);
  cursor: pointer;
  outline: none;
  transition: border-color var(--transition-duration-zc-base, 0.25s);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23606266' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
}

.zc-pagination__sizes-select:focus {
  border-color: var(--zc-pagination-active-color);
}

.zc-pagination__sizes-select:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* ---- Background mode ---- */
.zc-pagination.is-background .zc-pagination__btn,
.zc-pagination.is-background .zc-pagination__number {
  background: transparent;
  border: none;
  border-radius: var(--radius-zc-base, 4px);
}

.zc-pagination.is-background .zc-pagination__btn:hover:not(.is-disabled),
.zc-pagination.is-background .zc-pagination__number:hover:not(.is-active):not(.is-ellipsis) {
  background: var(--zc-pagination-button-hover-bg-color);
  color: var(--zc-pagination-button-hover-text-color);
}

.zc-pagination.is-background .zc-pagination__btn.is-disabled,
.zc-pagination.is-background .zc-pagination__number.is-disabled {
  background: transparent;
}

.zc-pagination.is-background .zc-pagination__number.is-active {
  background: var(--zc-pagination-button-active-bg-color);
  color: var(--zc-pagination-button-active-text-color);
}
</style>
