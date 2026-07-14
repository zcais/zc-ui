<script setup lang="ts">
import { computed, provide, ref, type VNode } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import type { DescriptionsDirection, DescriptionsSize, DescriptionItemData } from './types'
import { DESCRIPTIONS_KEY } from './types'

defineOptions({ name: 'ZcDescriptions' })

const props = withDefaults(
  defineProps<{
    border?: boolean
    column?: number
    direction?: DescriptionsDirection
    size?: DescriptionsSize
    title?: string
    extra?: string
    colon?: boolean
    labelStyle?: Record<string, string>
    contentStyle?: Record<string, string>
  }>(),
  {
    border: false,
    column: 3,
    direction: 'horizontal',
    size: 'default',
    title: '',
    extra: '',
    colon: true,
    labelStyle: () => ({}),
    contentStyle: () => ({}),
  }
)

const ns = useNamespace('descriptions')

const items = ref<DescriptionItemData[]>([])

function addItem(item: DescriptionItemData) {
  const idx = items.value.findIndex((i) => i.uid === item.uid)
  if (idx > -1) {
    items.value[idx] = { ...items.value[idx], ...item }
  } else {
    items.value.push(item)
  }
}

function removeItem(uid: number) {
  const idx = items.value.findIndex((i) => i.uid === uid)
  if (idx > -1) items.value.splice(idx, 1)
}

provide(DESCRIPTIONS_KEY, {
  column: computed(() => props.column),
  border: computed(() => props.border),
  direction: computed(() => props.direction),
  size: computed(() => props.size),
  colon: computed(() => props.colon),
  labelStyle: computed(() => props.labelStyle),
  contentStyle: computed(() => props.contentStyle),
  addItem,
  removeItem,
})

/**
 * Group collected items into rows, respecting the `column` limit.
 * Each item's span contributes to the column count.
 */
const rows = computed<DescriptionItemData[][]>(() => {
  const result: DescriptionItemData[][] = []
  let currentRow: DescriptionItemData[] = []
  let currentSpan = 0
  const maxColumn = props.column

  for (const item of items.value) {
    const span = Math.min(item.span || 1, maxColumn)
    if (currentSpan + span > maxColumn && currentRow.length > 0) {
      result.push(currentRow)
      currentRow = []
      currentSpan = 0
    }
    currentRow.push({ ...item, span })
    currentSpan += span
    if (currentSpan >= maxColumn) {
      result.push(currentRow)
      currentRow = []
      currentSpan = 0
    }
  }
  if (currentRow.length > 0) result.push(currentRow)
  return result
})

/** Inline functional component to render a slot function */
const SlotRenderer = (p: { render?: () => VNode[] }) => (p.render ? p.render() : null)

const classes = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.m(props.direction),
  ns.is('bordered', props.border),
])
</script>

<template>
  <div :class="classes">
    <div v-if="title || $slots.title || extra || $slots.extra" :class="ns.e('header')">
      <div :class="ns.e('title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div :class="ns.e('extra')">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>
    <!-- Hidden slot: child DescriptionsItem components register themselves via provide/inject.
         The slot content is never displayed (parent renders via the `rows` computed). -->
    <div style="display: none" aria-hidden="true">
      <slot />
    </div>

    <div :class="ns.e('body')">
      <table :class="ns.e('table')">
        <tbody>
          <tr v-for="(row, rowIdx) in rows" :key="rowIdx" :class="ns.e('row')">
            <template v-for="item in row" :key="item.uid">
              <th
                :class="[ns.e('label'), item.labelClassName]"
                :colspan="1"
                :style="{ ...labelStyle, ...(item.labelStyle || {}) }"
              >
                {{ item.label }}{{ colon ? ':' : '' }}
              </th>
              <td
                :class="[ns.e('content'), item.contentClassName]"
                :colspan="item.span * 2 - 1"
                :style="contentStyle"
              >
                <SlotRenderer :render="item.content" />
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcDescriptions styles
 * ============================================================ */

.zc-descriptions {
  --zc-descriptions-title-color: var(--color-zc-text-primary, #303133);
  --zc-descriptions-title-font-size: var(--text-zc-md, 16px);
  --zc-descriptions-label-color: var(--color-zc-text-regular, #606266);
  --zc-descriptions-label-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-descriptions-content-color: var(--color-zc-text-primary, #303133);
  --zc-descriptions-content-bg-color: var(--color-zc-bg-base, #fff);
  --zc-descriptions-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-descriptions-font-size: var(--text-zc-base, 14px);
  --zc-descriptions-item-padding: 12px 16px;

  font-size: var(--zc-descriptions-font-size);
  color: var(--zc-descriptions-content-color);
}

.zc-descriptions__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.zc-descriptions__title {
  font-size: var(--zc-descriptions-title-font-size);
  font-weight: 600;
  color: var(--zc-descriptions-title-color);
}

.zc-descriptions__extra {
  font-size: var(--zc-descriptions-font-size);
  color: var(--color-zc-text-secondary, #909399);
}

.zc-descriptions__body {
  width: 100%;
}

.zc-descriptions__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.zc-descriptions--vertical .zc-descriptions__table {
  display: table;
}

/* ---- Cell ---- */
.zc-descriptions__label {
  font-weight: 500;
  color: var(--zc-descriptions-label-color);
  background: var(--zc-descriptions-label-bg-color);
  padding: var(--zc-descriptions-item-padding);
  text-align: right;
  white-space: nowrap;
}

.zc-descriptions__content {
  color: var(--zc-descriptions-content-color);
  background: var(--zc-descriptions-content-bg-color);
  padding: var(--zc-descriptions-item-padding);
}

.zc-descriptions--small .zc-descriptions__label,
.zc-descriptions--small .zc-descriptions__content {
  padding: 6px 12px;
}

.zc-descriptions--large .zc-descriptions__label,
.zc-descriptions--large .zc-descriptions__content {
  padding: 12px 20px;
}

/* ---- Bordered ---- */
.zc-descriptions.is-bordered .zc-descriptions__label,
.zc-descriptions.is-bordered .zc-descriptions__content {
  border: 1px solid var(--zc-descriptions-border-color);
}

/* ---- Vertical direction ---- */
.zc-descriptions--vertical .zc-descriptions__label {
  text-align: left;
  background: transparent;
}
</style>
