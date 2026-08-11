<script setup lang="ts">
import { computed, ref, watch, useSlots, onBeforeUnmount, reactive, watchEffect } from 'vue'
import type { VNode } from 'vue'
import { useNamespace, useVirtualList } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import ZcCheckbox from '../checkbox/checkbox.vue'
import ZcPagination from '../pagination/pagination.vue'
import type {
  TableColumn,
  SortOrder,
  SortState,
  FilterState,
  SpanMethod,
  SpanValue,
  TableTreePropsConfig,
  SummaryMethod,
  ColumnSettingItem,
  DragSortEvent,
  ColumnResizeEvent,
  RenderRow,
} from './types'

defineOptions({ name: 'ZcTable' })

const props = withDefaults(
  defineProps<{
    data: Record<string, any>[]
    columns?: TableColumn[]
    rowKey?: string | ((row: Record<string, any>) => string | number)
    border?: boolean
    stripe?: boolean
    height?: number | string
    highlightCurrentRow?: boolean
    defaultSort?: SortState
    selectable?: boolean
    pagination?: boolean
    currentPage?: number
    pageSize?: number
    emptyText?: string
    showHeader?: boolean
    size?: 'large' | 'medium' | 'small'
    /** Enable virtual scrolling for large datasets (requires height) */
    virtual?: boolean
    /** Estimated row height in px for virtual scrolling (default: 48) */
    estimatedRowHeight?: number
    // ---- Advanced Features ----
    /** Span method for merging rows/columns */
    spanMethod?: SpanMethod
    /** Enable expandable rows */
    expandable?: boolean
    /** Tree table configuration */
    treeProps?: TableTreePropsConfig
    /** Expand all tree nodes by default */
    defaultExpandAll?: boolean
    /** Enable row drag sort */
    draggable?: boolean
    /** Enable editable cells */
    editable?: boolean
    /** Show summary row at the bottom */
    showSummary?: boolean
    /** Custom summary method */
    summaryMethod?: SummaryMethod
    /** Summary label for the first column (default: '合计') */
    summaryText?: string
    /** Show column settings panel */
    showColumnSettings?: boolean
    /** Enable column resize */
    resizable?: boolean
  }>(),
  {
    columns: () => [],
    rowKey: 'id',
    border: false,
    stripe: false,
    height: undefined,
    highlightCurrentRow: false,
    defaultSort: () => ({ prop: '', order: null }),
    selectable: false,
    pagination: false,
    currentPage: 1,
    pageSize: 10,
    emptyText: '',
    showHeader: true,
    size: 'medium',
    virtual: false,
    estimatedRowHeight: 48,
    spanMethod: undefined,
    expandable: false,
    treeProps: undefined,
    defaultExpandAll: false,
    draggable: false,
    editable: false,
    showSummary: false,
    summaryMethod: undefined,
    summaryText: '',
    showColumnSettings: false,
    resizable: false,
  }
)

const emit = defineEmits<{
  (e: 'sort-change', sort: SortState): void
  (e: 'filter-change', filters: FilterState): void
  (e: 'selection-change', selection: Record<string, any>[]): void
  (e: 'current-change', currentPage: number): void
  (e: 'row-click', row: Record<string, any>, column: TableColumn, event: Event): void
  (
    e: 'cell-click',
    row: Record<string, any>,
    column: TableColumn,
    cell: HTMLElement,
    event: Event
  ): void
  (e: 'expand-change', row: Record<string, any>, expanded: boolean): void
  (e: 'tree-toggle', row: Record<string, any>, expanded: boolean): void
  (e: 'row-drag-end', event: DragSortEvent): void
  (
    e: 'cell-edit',
    payload: { row: Record<string, any>; column: TableColumn; value: any; oldValue: any }
  ): void
  (e: 'column-resize', event: ColumnResizeEvent): void
  (e: 'column-settings-change', settings: ColumnSettingItem[]): void
}>()

const ns = useNamespace('table')
const slots = useSlots()
const { t } = useLocale()

const displayEmptyText = computed(() => props.emptyText || t('zc.table.emptyText'))

// ============================================================
// Column Resolution
// ============================================================
const resolvedColumns = computed<TableColumn[]>(() => {
  // Don't filter visible here —displayColumns handles visibility so that
  // the column-settings panel can still show toggle items for hidden columns.
  if (props.columns && props.columns.length > 0) {
    return [...props.columns]
  }
  return []
})

// ---- Column Settings state ----
const columnSettingsState = ref<ColumnSettingItem[]>([])

watch(
  () => props.columns,
  (cols) => {
    if (cols && cols.length > 0 && props.showColumnSettings) {
      columnSettingsState.value = cols.map((col, index) => ({
        prop: col.prop || `col-${index}`,
        label: col.label || col.prop || `Column ${index + 1}`,
        visible: col.visible !== false,
        order: index,
      }))
    }
  },
  { immediate: true }
)

const settingsDropdownVisible = ref(false)

function toggleSettingsDropdown() {
  settingsDropdownVisible.value = !settingsDropdownVisible.value
}

function handleColumnVisibilityChange(prop: string, visible: boolean) {
  const item = columnSettingsState.value.find((s) => s.prop === prop)
  if (item) {
    item.visible = visible
    emit('column-settings-change', [...columnSettingsState.value])
  }
}

function handleColumnOrderChange(prop: string, direction: 'up' | 'down') {
  const sorted = [...columnSettingsState.value].sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex((s) => s.prop === prop)
  if (idx < 0) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= sorted.length) return
  const tmpOrder = sorted[idx].order
  sorted[idx].order = sorted[swapIdx].order
  sorted[swapIdx].order = tmpOrder
  columnSettingsState.value = [...sorted]
  emit('column-settings-change', [...columnSettingsState.value])
}

// ---- Resize state ----
const resizeWidths = ref<Record<string, number>>({})

// ---- Display columns (applies settings + resize) ----
const displayColumns = computed<TableColumn[]>(() => {
  let cols = resolvedColumns.value

  if (props.showColumnSettings && columnSettingsState.value.length > 0) {
    const sortedSettings = [...columnSettingsState.value].sort((a, b) => a.order - b.order)
    cols = sortedSettings
      .filter((s) => s.visible)
      .map((s) => cols.find((c) => (c.prop || '') === s.prop))
      .filter((c): c is TableColumn => c !== undefined)
  } else {
    // Apply column.visible filter when settings panel is not active
    cols = cols.filter((col) => col.visible !== false)
  }

  // Ensure fixed-left columns come first and fixed-right columns come last,
  // regardless of column-settings ordering, so sticky offsets are correct.
  cols = [
    ...cols.filter((c) => isColumnFixedLeft(c)),
    ...cols.filter((c) => !isColumnFixedLeft(c) && !isColumnFixedRight(c)),
    ...cols.filter((c) => isColumnFixedRight(c)),
  ]

  // Apply resize widths
  cols = cols.map((col) => {
    const prop = col.prop || ''
    const resizeWidth = resizeWidths.value[prop]
    if (resizeWidth !== undefined) {
      return { ...col, width: resizeWidth }
    }
    return col
  })

  return cols
})

// ============================================================
// Sorting
// ============================================================
const sortState = ref<SortState>({ ...props.defaultSort })

watch(
  () => props.defaultSort,
  (val) => {
    sortState.value = { ...val }
  }
)

function getRowKeyValue(row: Record<string, any>): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  return row[props.rowKey] ?? JSON.stringify(row)
}

function handleSortClick(column: TableColumn) {
  if (!column.sortable) return
  const prop = column.prop || ''
  let order: SortOrder | null = 'ascending'
  if (sortState.value.prop === prop) {
    if (sortState.value.order === 'ascending') order = 'descending'
    else if (sortState.value.order === 'descending') order = null
    else order = 'ascending'
  }
  sortState.value = { prop, order }
  emit('sort-change', { prop, order })
}

// ============================================================
// Filtering
// ============================================================
const filterState = ref<FilterState>({})

function handleFilterToggle(column: TableColumn, value: string | number) {
  const prop = column.prop || ''
  const current = filterState.value[prop] || []
  const idx = current.indexOf(value)
  if (idx >= 0) {
    filterState.value = { ...filterState.value, [prop]: current.filter((v) => v !== value) }
  } else {
    filterState.value = { ...filterState.value, [prop]: [...current, value] }
  }
  emit('filter-change', { ...filterState.value })
}

const activeFilterColumn = ref<string>('')

function toggleFilterDropdown(prop: string) {
  activeFilterColumn.value = activeFilterColumn.value === prop ? '' : prop
}

// ---- Click-outside: close filter dropdown ----
let documentClickHandler: ((e: Event) => void) | null = null

function attachDocumentClick() {
  if (documentClickHandler) return
  documentClickHandler = (e: Event) => {
    const target = e.target as HTMLElement
    if (!activeFilterColumn.value && !settingsDropdownVisible.value) return
    if (
      !target.closest('.zc-table__filter') &&
      !target.closest('.zc-table__settings-panel') &&
      !target.closest('.zc-table__settings-trigger')
    ) {
      activeFilterColumn.value = ''
      settingsDropdownVisible.value = false
    }
  }
  document.addEventListener('click', documentClickHandler)
}

function detachDocumentClick() {
  if (documentClickHandler) {
    document.removeEventListener('click', documentClickHandler)
    documentClickHandler = null
  }
}

watch([activeFilterColumn, settingsDropdownVisible], () => {
  if (activeFilterColumn.value || settingsDropdownVisible.value) attachDocumentClick()
  else detachDocumentClick()
})

onBeforeUnmount(() => {
  detachDocumentClick()
  detachResizeListeners()
})

// ============================================================
// Drag Sort: local data copy
// ============================================================
const localData = ref<Record<string, any>[]>([])

watch(
  () => props.data,
  (val) => {
    localData.value = [...val]
  },
  { immediate: true, deep: true }
)

// ============================================================
// Processed Data (sort + filter)
// ============================================================
const processedData = computed(() => {
  const sourceData = props.draggable ? localData.value : props.data
  let result = [...sourceData]

  // Apply filters
  for (const [prop, values] of Object.entries(filterState.value)) {
    if (values && values.length > 0) {
      result = result.filter((row) => {
        const cellValue = row[prop]
        return values.includes(cellValue)
      })
    }
  }

  // Apply sorting
  if (sortState.value.prop && sortState.value.order) {
    const prop = sortState.value.prop
    const order = sortState.value.order === 'ascending' ? 1 : -1
    const column = displayColumns.value.find((c) => c.prop === prop)
    if (column?.sortable !== 'custom') {
      result.sort((a, b) => {
        const valA = a[prop]
        const valB = b[prop]
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * order
        }
        return String(valA).localeCompare(String(valB)) * order
      })
    }
  }

  return result
})

// ============================================================
// Pagination
// ============================================================
const innerPage = ref(props.currentPage)
const innerPageSize = ref(props.pageSize)

watch(
  () => props.currentPage,
  (v) => {
    innerPage.value = v
  }
)
watch(
  () => props.pageSize,
  (v) => {
    innerPageSize.value = v
  }
)

const totalItems = computed(() => processedData.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / innerPageSize.value)))

const displayData = computed(() => {
  if (!props.pagination) return processedData.value
  const start = (innerPage.value - 1) * innerPageSize.value
  return processedData.value.slice(start, start + innerPageSize.value)
})

function handlePageChange(page: number) {
  if (page < 1 || page > totalPages.value) return
  innerPage.value = page
  emit('current-change', page)
}

// ============================================================
// Virtual Scrolling
// ============================================================
const {
  containerRef: wrapperRef,
  visibleData: virtualVisibleData,
  offsetY: virtualOffsetY,
  startIndex: virtualStartIndex,
  endIndex: virtualEndIndex,
  scrollToIndex,
} = useVirtualList({
  data: displayData,
  itemHeight: props.estimatedRowHeight,
  overscan: 4,
})

const isVirtualActive = computed(() => props.virtual && !props.pagination)

const virtualData = computed(() =>
  isVirtualActive.value ? virtualVisibleData.value : displayData.value
)

const visibleRange = computed(() => ({
  start: isVirtualActive.value ? virtualStartIndex.value : 0,
  end: isVirtualActive.value ? virtualEndIndex.value : displayData.value.length,
  translateY: isVirtualActive.value ? virtualOffsetY.value : 0,
}))

// ============================================================
// Tree Table
// ============================================================
const treeChildrenKey = computed(() => props.treeProps?.children || 'children')
const treeIndent = computed(() => props.treeProps?.indent ?? 16)

const isTreeEnabled = computed(() => {
  return processedData.value.some(
    (row) => Array.isArray(row[treeChildrenKey.value]) && row[treeChildrenKey.value].length > 0
  )
})

const expandedTreeKeys = ref<Set<string | number>>(new Set())

// Track whether defaultExpandAll has been applied to avoid resetting
// user-modified expand state on subsequent data changes.
let hasAppliedDefaultExpandAll = false

// Initialize expanded keys for defaultExpandAll
watch(
  () => props.data,
  (val) => {
    if (props.defaultExpandAll && val.length > 0 && !hasAppliedDefaultExpandAll) {
      const keys = new Set<string | number>()
      function collectKeys(data: Record<string, any>[]) {
        data.forEach((row) => {
          const children = row[treeChildrenKey.value]
          if (Array.isArray(children) && children.length > 0) {
            keys.add(getRowKeyValue(row))
            collectKeys(children)
          }
        })
      }
      collectKeys(val)
      expandedTreeKeys.value = keys
      hasAppliedDefaultExpandAll = true
    }
  },
  { immediate: true }
)

function toggleTreeExpand(row: Record<string, any>) {
  const key = getRowKeyValue(row)
  const willExpand = !expandedTreeKeys.value.has(key)
  if (willExpand) {
    expandedTreeKeys.value.add(key)
  } else {
    expandedTreeKeys.value.delete(key)
  }
  expandedTreeKeys.value = new Set(expandedTreeKeys.value)
  emit('tree-toggle', row, willExpand)
}

const renderRows = computed<RenderRow[]>(() => {
  if (!isTreeEnabled.value) {
    const data = isVirtualActive.value ? virtualData.value : displayData.value
    return data.map((row, index) => ({
      row,
      depth: 0,
      hasChildren: false,
      isTreeExpanded: false,
      index: isVirtualActive.value ? visibleRange.value.start + index : index,
    }))
  }

  // Tree mode: flatten with depth tracking
  const result: RenderRow[] = []
  function flatten(data: Record<string, any>[], depth: number) {
    data.forEach((row) => {
      const key = getRowKeyValue(row)
      const children = row[treeChildrenKey.value]
      const hasChildren = Array.isArray(children) && children.length > 0
      const isExpanded = expandedTreeKeys.value.has(key)

      result.push({
        row,
        depth,
        hasChildren,
        isTreeExpanded: isExpanded,
        index: result.length,
      })

      if (hasChildren && isExpanded) {
        flatten(children, depth + 1)
      }
    })
  }
  flatten(processedData.value, 0)
  return result
})

// ============================================================
// Expandable Rows
// ============================================================
const expandedRowKeys = ref<Set<string | number>>(new Set())

function toggleExpand(row: Record<string, any>) {
  const key = getRowKeyValue(row)
  const willExpand = !expandedRowKeys.value.has(key)
  if (willExpand) {
    expandedRowKeys.value.add(key)
  } else {
    expandedRowKeys.value.delete(key)
  }
  expandedRowKeys.value = new Set(expandedRowKeys.value)
  emit('expand-change', row, willExpand)
}

function isRowExpanded(row: Record<string, any>): boolean {
  return expandedRowKeys.value.has(getRowKeyValue(row))
}

// ============================================================
// Selection (checkbox)
// ============================================================
const selectedRows = ref<Set<string | number>>(new Set())
const isAllSelected = computed({
  get: () =>
    displayData.value.length > 0 &&
    displayData.value.every((row) => selectedRows.value.has(getRowKeyValue(row))),
  set: (val: boolean) => {
    if (val) {
      displayData.value.forEach((row) => selectedRows.value.add(getRowKeyValue(row)))
    } else {
      displayData.value.forEach((row) => selectedRows.value.delete(getRowKeyValue(row)))
    }
    selectedRows.value = new Set(selectedRows.value)
    emitSelectionChange()
  },
})

const isIndeterminate = computed(() => {
  const selected = displayData.value.filter((row) => selectedRows.value.has(getRowKeyValue(row)))
  return selected.length > 0 && selected.length < displayData.value.length
})

function handleRowSelect(row: Record<string, any>, checked?: boolean) {
  const key = getRowKeyValue(row)
  const shouldSelect = checked ?? !selectedRows.value.has(key)
  if (shouldSelect) {
    selectedRows.value.add(key)
  } else {
    selectedRows.value.delete(key)
  }
  selectedRows.value = new Set(selectedRows.value)
  emitSelectionChange()
}

function isRowSelected(row: Record<string, any>): boolean {
  return selectedRows.value.has(getRowKeyValue(row))
}

function emitSelectionChange() {
  const sourceData = props.draggable ? localData.value : props.data
  const rows = sourceData.filter((row) => selectedRows.value.has(getRowKeyValue(row)))
  emit('selection-change', rows)
}

// ============================================================
// Current Highlighted Row
// ============================================================
const currentRowIndex = ref<number>(-1)

function handleRowClick(row: Record<string, any>, column: TableColumn, event: Event) {
  if (props.highlightCurrentRow) {
    currentRowIndex.value = displayData.value.indexOf(row)
  }
  emit('row-click', row, column, event)
}

function handleCellClick(row: Record<string, any>, column: TableColumn, event: Event) {
  const cell = event.currentTarget as HTMLElement
  emit('cell-click', row, column, cell, event)
  // Start editing if cell is editable
  if (isCellEditable(column) && !isEditing(row, column)) {
    startEdit(row, column)
  }
}

// ============================================================
// Drag Sort
// ============================================================
const dragState = reactive({
  draggingIndex: -1,
  dragOverIndex: -1,
})

function handleDragStart(event: DragEvent, index: number) {
  dragState.draggingIndex = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

function handleDragOver(event: DragEvent, index: number) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragState.dragOverIndex = index
}

function handleDrop(event: DragEvent, index: number) {
  event.preventDefault()
  const oldIndex = dragState.draggingIndex
  const newIndex = index
  dragState.draggingIndex = -1
  dragState.dragOverIndex = -1

  if (oldIndex < 0 || oldIndex === newIndex) return

  // Reorder local data
  const data = [...localData.value]
  const [moved] = data.splice(oldIndex, 1)
  data.splice(newIndex, 0, moved)
  localData.value = data

  emit('row-drag-end', { oldIndex, newIndex, data })
}

function handleDragEnd() {
  dragState.draggingIndex = -1
  dragState.dragOverIndex = -1
}

// ============================================================
// Editable Cells
// ============================================================
const editingCell = ref<{ rowKey: string | number; prop: string } | null>(null)
const editValue = ref<string | number>('')
let isCancelled = false

function isCellEditable(column: TableColumn): boolean {
  return props.editable && column.editable !== false
}

function isEditing(row: Record<string, any>, column: TableColumn): boolean {
  const key = getRowKeyValue(row)
  return editingCell.value?.rowKey === key && editingCell.value?.prop === (column.prop || '')
}

function startEdit(row: Record<string, any>, column: TableColumn) {
  if (!isCellEditable(column)) return
  const key = getRowKeyValue(row)
  editingCell.value = { rowKey: key, prop: column.prop || '' }
  editValue.value = row[column.prop || '']
  isCancelled = false
}

function confirmEdit(row: Record<string, any>, column: TableColumn) {
  if (!editingCell.value || isCancelled) return
  const oldValue = row[column.prop || '']
  row[column.prop || ''] = editValue.value
  emit('cell-edit', { row, column, value: editValue.value, oldValue })
  editingCell.value = null
}

function cancelEdit() {
  isCancelled = true
  editingCell.value = null
}

// ============================================================
// Summary Row
// ============================================================
const summaryValues = computed<(string | VNode)[]>(() => {
  if (!props.showSummary) return []

  if (props.summaryMethod) {
    return props.summaryMethod({
      columns: displayColumns.value,
      data: processedData.value,
    })
  }

  // Default: sum numeric columns
  return displayColumns.value.map((col, index) => {
    if (index === 0) return props.summaryText || '合计'
    const prop = col.prop || ''
    const sum = processedData.value.reduce((acc, row) => {
      const val = Number(row[prop])
      return acc + (isNaN(val) ? 0 : val)
    }, 0)
    return sum !== 0 ? String(sum) : ''
  })
})

// ============================================================
// Span Method
// ============================================================
const cellSpans = computed<Record<string, SpanValue> | null>(() => {
  if (!props.spanMethod) return null
  const spans: Record<string, SpanValue> = {}
  renderRows.value.forEach((renderRow, rIndex) => {
    displayColumns.value.forEach((column, cIndex) => {
      const result = props.spanMethod!({
        row: renderRow.row,
        column,
        rowIndex: rIndex,
        columnIndex: cIndex,
      })
      let span: SpanValue
      if (!result) {
        span = { rowspan: 1, colspan: 1 }
      } else if (Array.isArray(result)) {
        span = { rowspan: result[0], colspan: result[1] }
      } else {
        span = result
      }
      spans[`${rIndex}-${cIndex}`] = span
    })
  })
  return spans
})

function getCellSpan(rowIndex: number, colIndex: number): SpanValue {
  if (!cellSpans.value) return { rowspan: 1, colspan: 1 }
  return cellSpans.value[`${rowIndex}-${colIndex}`] || { rowspan: 1, colspan: 1 }
}

// ============================================================
// Column Resize
// ============================================================
const resizeState = reactive({
  prop: '',
  startX: 0,
  startWidth: 0,
})

function isColumnResizable(column: TableColumn): boolean {
  if (!props.resizable) return false
  if (column.resizable === false) return false
  return true
}

function handleResizeStart(event: MouseEvent, column: TableColumn) {
  if (!isColumnResizable(column)) return
  event.preventDefault()
  event.stopPropagation()

  const prop = column.prop || ''
  resizeState.prop = prop
  resizeState.startX = event.clientX
  resizeState.startWidth = getColumnWidthValue(column)

  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeEnd)
}

function handleResizeMove(event: MouseEvent) {
  if (!resizeState.prop) return
  const diff = event.clientX - resizeState.startX
  const newWidth = Math.max(40, resizeState.startWidth + diff)
  resizeWidths.value[resizeState.prop] = newWidth
}

function handleResizeEnd() {
  if (resizeState.prop) {
    const newWidth = resizeWidths.value[resizeState.prop]
    if (newWidth !== undefined) {
      emit('column-resize', {
        prop: resizeState.prop,
        oldWidth: resizeState.startWidth,
        newWidth,
      })
    }
    resizeState.prop = ''
  }
  detachResizeListeners()
}

function detachResizeListeners() {
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeEnd)
}

// ============================================================
// Helpers
// ============================================================
const tableClasses = computed(() => [
  ns.b(),
  ns.is('border', props.border),
  ns.is('stripe', props.stripe),
  ns.is('scrollable', !!props.height),
  ns.m(props.size),
])

const totalColCount = computed(() => {
  let count = displayColumns.value.length
  if (props.selectable) count++
  if (props.expandable) count++
  return count
})

function getCellAlign(column: TableColumn): string {
  const align = column.align || 'left'
  return `text-align: ${align}`
}

function getHeaderAlign(column: TableColumn): string {
  const align = column.headerAlign || column.align || 'left'
  return `text-align: ${align}`
}

function getColumnClass(column?: TableColumn): string {
  return column?.className || ''
}

function isColumnFixedLeft(column: TableColumn): boolean {
  return column.fixed === 'left' || column.fixed === true
}

function isColumnFixedRight(column: TableColumn): boolean {
  return column.fixed === 'right'
}

function getColumnWidthValue(column: TableColumn): number {
  const prop = column.prop || ''
  if (resizeWidths.value[prop] !== undefined) {
    return resizeWidths.value[prop]
  }
  if (typeof column.width === 'number') return column.width
  if (typeof column.width === 'string') {
    const match = column.width.match(/(\d+)/)
    return match ? parseInt(match[1]) : 120
  }
  return 120
}

function getColumnStyle(column: TableColumn): Record<string, string> {
  const style: Record<string, string> = {}
  if (typeof column.width === 'number') {
    style.width = `${column.width}px`
  } else if (typeof column.width === 'string') {
    style.width = column.width
  }
  if (typeof column.minWidth === 'number') {
    style.minWidth = `${column.minWidth}px`
  } else if (typeof column.minWidth === 'string') {
    style.minWidth = column.minWidth
  }
  return style
}

function getFixedColumnStyle(column: TableColumn, index: number): Record<string, string> {
  const style = getColumnStyle(column)
  if (isColumnFixedLeft(column)) {
    style.position = 'sticky'
    style.left = `${getFixedLeftOffset(index)}px`
    style.zIndex = '2'
  } else if (isColumnFixedRight(column)) {
    style.position = 'sticky'
    style.right = `${getFixedRightOffset(index)}px`
    style.zIndex = '2'
  }
  return style
}

function getFixedLeftOffset(index: number): number {
  let offset = 0
  if (props.expandable) offset += 48
  if (props.selectable) offset += 48
  for (let i = 0; i < index; i++) {
    const col = displayColumns.value[i]
    if (col && isColumnFixedLeft(col)) {
      offset += getColumnWidthValue(col)
    }
  }
  return offset
}

function getFixedRightOffset(index: number): number {
  let offset = 0
  for (let i = displayColumns.value.length - 1; i > index; i--) {
    const col = displayColumns.value[i]
    if (col && isColumnFixedRight(col)) {
      offset += getColumnWidthValue(col)
    }
  }
  return offset
}

function isLastFixedLeft(index: number): boolean {
  const col = displayColumns.value[index]
  if (!col || !isColumnFixedLeft(col)) return false
  return !displayColumns.value.slice(index + 1).some((c) => isColumnFixedLeft(c))
}

function isFirstFixedRight(index: number): boolean {
  const col = displayColumns.value[index]
  if (!col || !isColumnFixedRight(col)) return false
  return !displayColumns.value.slice(0, index).some((c) => isColumnFixedRight(c))
}

function getDisplayIndex(vIndex: number, renderRow: RenderRow): number {
  if (isTreeEnabled.value) return renderRow.index
  if (isVirtualActive.value) return visibleRange.value.start + vIndex
  return vIndex
}

// ============================================================
// Incompatible Feature Warnings
// ============================================================
watchEffect(() => {
  if (import.meta.env?.DEV) {
    if (props.virtual && props.pagination) {
      console.warn(
        '[ZcTable] Virtual scrolling and pagination are not compatible. Pagination takes precedence; virtual scrolling will be disabled.'
      )
    }
    if (props.virtual && props.treeProps) {
      console.warn(
        '[ZcTable] Virtual scrolling and tree table (treeProps) are not compatible. Tree structure will be ignored in virtual mode.'
      )
    }
    if (props.virtual && props.spanMethod) {
      console.warn(
        '[ZcTable] Virtual scrolling and spanMethod are not compatible. Span results may be incorrect in virtual mode.'
      )
    }
    if (props.spanMethod && props.columns?.some((c) => c.fixed)) {
      console.warn(
        '[ZcTable] spanMethod and fixed columns may produce incorrect sticky offsets. Consider avoiding this combination.'
      )
    }
    if (props.draggable && props.treeProps) {
      console.warn(
        '[ZcTable] Drag sort and tree table are not fully compatible. Drag indices are based on flattened visual rows, not tree hierarchy.'
      )
    }
  }
})

// Expose for testing
defineExpose({
  startEdit,
  confirmEdit,
  cancelEdit,
  editValue,
  handleResizeStart,
  handleResizeMove,
  handleResizeEnd,
  // Virtual scrolling API
  virtualScrollTo: scrollToIndex,
  // Virtual scrolling / state (exposed for testing & advanced use)
  isVirtualActive,
  virtualData,
  displayData,
  displayColumns,
  processedData,
  renderRows,
  sortState,
  wrapperRef,
  // Selection & interaction
  isAllSelected,
  isRowSelected,
  handleRowSelect,
  handleSortClick,
  handleFilterToggle,
})
</script>

<template>
  <div :class="tableClasses">
    <!-- Column Settings Toolbar -->
    <div v-if="showColumnSettings" :class="ns.e('toolbar')">
      <button
        :class="[ns.e('settings-trigger'), { 'is-active': settingsDropdownVisible }]"
        :aria-expanded="settingsDropdownVisible"
        aria-haspopup="true"
        @click.stop="toggleSettingsDropdown"
      >
        ⚙Column Settings
      </button>
      <div v-if="settingsDropdownVisible" :class="ns.e('settings-panel')" @click.stop>
        <div
          v-for="(item, idx) in [...columnSettingsState].sort((a, b) => a.order - b.order)"
          :key="item.prop"
          :class="ns.e('settings-item')"
        >
          <label>
            <input
              type="checkbox"
              :checked="item.visible"
              @change="
                handleColumnVisibilityChange(item.prop, ($event.target as HTMLInputElement).checked)
              "
            />
            {{ item.label }}
          </label>
          <span :class="ns.e('settings-order')">
            <button :disabled="idx === 0" @click="handleColumnOrderChange(item.prop, 'up')">
              ↑
            </button>
            <button
              :disabled="idx === columnSettingsState.length - 1"
              @click="handleColumnOrderChange(item.prop, 'down')"
            >
              ↓
            </button>
          </span>
        </div>
      </div>
    </div>

    <div
      ref="wrapperRef"
      :class="ns.e('wrapper')"
      :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    >
      <table :class="ns.e('inner')">
        <!-- Header -->
        <thead v-if="showHeader">
          <tr>
            <!-- Expand column header -->
            <th v-if="expandable" :class="ns.e('th')" style="width: 48px"></th>
            <!-- Selection checkbox column -->
            <th v-if="selectable" :class="[ns.e('th'), ns.e('selection-col')]" style="width: 48px">
              <ZcCheckbox
                :model-value="isAllSelected"
                :indeterminate="isIndeterminate"
                @update:model-value="(val: boolean) => (isAllSelected = val)"
              />
            </th>
            <!-- Data columns -->
            <th
              v-for="(column, colIdx) in displayColumns"
              :key="column.prop || column.label"
              :class="[
                ns.e('th'),
                column.fixed ? ns.is('fixed', true) : '',
                isColumnFixedLeft(column) ? ns.is('fixed-left') : '',
                isColumnFixedRight(column) ? ns.is('fixed-right') : '',
                isLastFixedLeft(colIdx) ? ns.is('fixed-left-last') : '',
                isFirstFixedRight(colIdx) ? ns.is('fixed-right-first') : '',
                column.align ? ns.is('align-' + column.align) : '',
              ]"
              :style="getFixedColumnStyle(column, colIdx)"
            >
              <div :class="[ns.e('cell'), getColumnClass(column)]" :style="getHeaderAlign(column)">
                <!-- Slot for custom header -->
                <slot
                  v-if="column.prop && slots[`header-${column.prop}`]"
                  :name="`header-${column.prop}`"
                  :column="column"
                />
                <template v-else>{{ column.label }}</template>

                <!-- Sort indicator -->
                <span
                  v-if="column.sortable"
                  :class="ns.e('sort-icon')"
                  @click="handleSortClick(column)"
                >
                  <span
                    :class="
                      ns.is(
                        'active',
                        sortState.prop === column.prop && sortState.order === 'ascending'
                      )
                    "
                    >↑</span
                  >
                  <span
                    :class="
                      ns.is(
                        'active',
                        sortState.prop === column.prop && sortState.order === 'descending'
                      )
                    "
                    >↓</span
                  >
                </span>

                <!-- Filter dropdown -->
                <span v-if="column.filterable && column.filters" :class="ns.e('filter')">
                  <span
                    :class="ns.e('filter-trigger')"
                    @click.stop="toggleFilterDropdown(column.prop || '')"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                    </svg>
                  </span>
                  <div
                    v-if="activeFilterColumn === column.prop"
                    :class="ns.e('filter-dropdown')"
                    @click.stop
                  >
                    <label
                      v-for="opt in column.filters"
                      :key="String(opt.value)"
                      :class="ns.e('filter-item')"
                    >
                      <input
                        type="checkbox"
                        :value="opt.value"
                        :checked="(filterState[column.prop || ''] || []).includes(opt.value)"
                        @change="handleFilterToggle(column, opt.value)"
                      />
                      {{ opt.text }}
                    </label>
                  </div>
                </span>
              </div>

              <!-- Resize handle -->
              <span
                v-if="isColumnResizable(column)"
                :class="ns.e('resize-handle')"
                role="separator"
                aria-orientation="vertical"
                @mousedown="handleResizeStart($event, column)"
              ></span>
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <!-- Virtual scroll: spacer row above -->
          <tr
            v-if="virtual && !pagination"
            aria-hidden="true"
            style="visibility: hidden; border: none; padding: 0; height: 0"
          >
            <td
              :style="{
                height: `${visibleRange.translateY}px`,
                padding: 0,
                border: 'none',
                margin: 0,
              }"
              :colspan="totalColCount"
            />
          </tr>

          <!-- Data rows -->
          <template
            v-for="(renderRow, vIndex) in virtual && !pagination
              ? virtualData.map((r, i) => ({
                  row: r,
                  depth: 0,
                  hasChildren: false,
                  isTreeExpanded: false,
                  index: visibleRange.start + i,
                }))
              : renderRows"
            :key="getRowKeyValue(renderRow.row)"
          >
            <tr
              :class="[
                ns.e('row'),
                ns.is('stripe', stripe && getDisplayIndex(vIndex, renderRow) % 2 === 1),
                ns.is(
                  'current',
                  highlightCurrentRow && currentRowIndex === getDisplayIndex(vIndex, renderRow)
                ),
                ns.is('dragging', dragState.draggingIndex === vIndex),
                ns.is(
                  'drag-over',
                  dragState.dragOverIndex === vIndex && dragState.draggingIndex !== vIndex
                ),
              ]"
              :style="virtual && !pagination ? { height: `${estimatedRowHeight}px` } : undefined"
              :draggable="draggable"
              @click="handleRowClick(renderRow.row, displayColumns[0] || {}, $event)"
              @dragstart="draggable ? handleDragStart($event, vIndex) : undefined"
              @dragover="draggable ? handleDragOver($event, vIndex) : undefined"
              @drop="draggable ? handleDrop($event, vIndex) : undefined"
              @dragend="draggable ? handleDragEnd() : undefined"
            >
              <!-- Expand toggle cell -->
              <td v-if="expandable" :class="ns.e('td')" style="width: 48px" @click.stop>
                <span
                  :class="ns.e('expand-icon')"
                  role="button"
                  :aria-expanded="isRowExpanded(renderRow.row)"
                  aria-label="Toggle row expansion"
                  tabindex="0"
                  @click="toggleExpand(renderRow.row)"
                  @keydown.enter.prevent="toggleExpand(renderRow.row)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path v-if="isRowExpanded(renderRow.row)" d="M6 9l6 6 6-6" />
                    <path v-else d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              </td>

              <!-- Selection checkbox -->
              <td v-if="selectable" :class="ns.e('td')" style="width: 48px" @click.stop>
                <ZcCheckbox
                  :model-value="isRowSelected(renderRow.row)"
                  @update:model-value="(val: boolean) => handleRowSelect(renderRow.row, val)"
                />
              </td>

              <!-- Data cells -->
              <template
                v-for="(column, cIndex) in displayColumns"
                :key="column.prop || column.label"
              >
                <td
                  v-if="
                    getCellSpan(getDisplayIndex(vIndex, renderRow), cIndex).rowspan > 0 &&
                    getCellSpan(getDisplayIndex(vIndex, renderRow), cIndex).colspan > 0
                  "
                  :rowspan="getCellSpan(getDisplayIndex(vIndex, renderRow), cIndex).rowspan"
                  :colspan="getCellSpan(getDisplayIndex(vIndex, renderRow), cIndex).colspan"
                  :class="[
                    ns.e('td'),
                    column.fixed ? ns.is('fixed', true) : '',
                    isColumnFixedLeft(column) ? ns.is('fixed-left') : '',
                    isColumnFixedRight(column) ? ns.is('fixed-right') : '',
                    isLastFixedLeft(cIndex) ? ns.is('fixed-left-last') : '',
                    isFirstFixedRight(cIndex) ? ns.is('fixed-right-first') : '',
                    getColumnClass(column),
                  ]"
                  :style="getFixedColumnStyle(column, cIndex)"
                  @click="handleCellClick(renderRow.row, column, $event)"
                >
                  <div :class="ns.e('cell')" :style="getCellAlign(column)">
                    <!-- Tree indent + toggle (first column only) -->
                    <template v-if="isTreeEnabled && cIndex === 0">
                      <span
                        :class="ns.e('tree-indent')"
                        :style="{ width: `${renderRow.depth * treeIndent}px` }"
                      ></span>
                      <span
                        v-if="renderRow.hasChildren"
                        :class="ns.e('tree-toggle')"
                        role="button"
                        :aria-expanded="renderRow.isTreeExpanded"
                        :aria-label="
                          renderRow.isTreeExpanded ? 'Collapse tree node' : 'Expand tree node'
                        "
                        tabindex="0"
                        @click.stop="toggleTreeExpand(renderRow.row)"
                        @keydown.enter.prevent="toggleTreeExpand(renderRow.row)"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path v-if="renderRow.isTreeExpanded" d="M6 9l6 6 6-6" />
                          <path v-else d="M9 6l6 6-6 6" />
                        </svg>
                      </span>
                      <span v-else :class="ns.e('tree-placeholder')"></span>
                    </template>

                    <!-- Editable input -->
                    <template v-if="isEditing(renderRow.row, column)">
                      <component
                        :is="column.editComponent"
                        v-if="column.editComponent"
                        :model-value="editValue"
                        :placeholder="column.editPlaceholder"
                        @update:model-value="(v: string | number) => (editValue = v)"
                        @keyup.enter="confirmEdit(renderRow.row, column)"
                        @keydown.escape.prevent="cancelEdit()"
                        @blur="confirmEdit(renderRow.row, column)"
                      />
                      <input
                        v-else
                        v-model="editValue"
                        :class="ns.e('edit-input')"
                        :placeholder="column.editPlaceholder"
                        @keyup.enter="confirmEdit(renderRow.row, column)"
                        @keydown.escape.prevent="cancelEdit()"
                        @blur="confirmEdit(renderRow.row, column)"
                      />
                    </template>

                    <!-- Custom column slot -->
                    <slot
                      v-else-if="column.prop && slots[`cell-${column.prop}`]"
                      :name="`cell-${column.prop}`"
                      :row="renderRow.row"
                      :column="column"
                      :value="renderRow.row[column.prop]"
                      :index="getDisplayIndex(vIndex, renderRow)"
                    />

                    <!-- Formatter function -->
                    <template v-else-if="column.formatter">{{
                      column.formatter(
                        renderRow.row,
                        column,
                        renderRow.row[column.prop || ''],
                        getDisplayIndex(vIndex, renderRow)
                      )
                    }}</template>

                    <!-- Default: show raw value -->
                    <template v-else>{{ renderRow.row[column.prop || ''] }}</template>
                  </div>
                </td>
              </template>
            </tr>

            <!-- Expandable content row -->
            <tr v-if="expandable && isRowExpanded(renderRow.row)" :class="ns.e('expand-row')">
              <td :colspan="totalColCount" :class="ns.e('expand-content')">
                <slot
                  name="expand"
                  :row="renderRow.row"
                  :index="getDisplayIndex(vIndex, renderRow)"
                />
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-if="renderRows.length === 0">
            <td :colspan="totalColCount" :class="ns.e('empty-cell')">
              {{ displayEmptyText }}
            </td>
          </tr>

          <!-- Virtual scroll: spacer row below -->
          <tr
            v-if="virtual && !pagination && visibleRange.end < displayData.length"
            aria-hidden="true"
            style="visibility: hidden"
          >
            <td
              :style="{
                height: `${(displayData.length - visibleRange.end) * estimatedRowHeight}px`,
                padding: 0,
                border: 'none',
              }"
              :colspan="totalColCount"
            />
          </tr>
        </tbody>

        <!-- Summary Row -->
        <tfoot v-if="showSummary">
          <tr :class="ns.e('summary-row')">
            <td v-if="expandable" :class="[ns.e('td'), ns.e('summary-cell')]"></td>
            <td v-if="selectable" :class="[ns.e('td'), ns.e('summary-cell')]"></td>
            <td
              v-for="(value, idx) in summaryValues"
              :key="idx"
              :class="[
                ns.e('td'),
                ns.e('summary-cell'),
                displayColumns[idx]?.fixed ? ns.is('fixed', true) : '',
                isColumnFixedLeft(displayColumns[idx]) ? ns.is('fixed-left') : '',
                isColumnFixedRight(displayColumns[idx]) ? ns.is('fixed-right') : '',
                isLastFixedLeft(idx) ? ns.is('fixed-left-last') : '',
                isFirstFixedRight(idx) ? ns.is('fixed-right-first') : '',
              ]"
              :style="getFixedColumnStyle(displayColumns[idx], idx)"
            >
              <div :class="ns.e('cell')">
                <template v-if="typeof value === 'string'">{{ value }}</template
                ><component :is="value" v-else />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Pagination (uses ZcPagination component) -->
    <div v-if="pagination" :class="ns.e('pagination')">
      <ZcPagination
        :total="totalItems"
        :current-page="innerPage"
        :page-size="innerPageSize"
        layout="total, prev, pager, next"
        @update:current-page="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcTable styles
 * BEM naming: zc-table / zc-table__th / zc-table__td / zc-table__row
 * ============================================================ */

.zc-table {
  /* Component-level CSS variables */
  --zc-table-bg-color: var(--color-zc-bg-base, #fff);
  --zc-table-text-color: var(--color-zc-text-regular, #606266);
  --zc-table-border-color: var(--color-zc-border-lighter, #ebeef5);
  --zc-table-header-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-table-header-text-color: var(--color-zc-text-secondary, #909399);
  --zc-table-row-hover-bg-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-table-current-row-bg-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-table-cell-padding: 10px 12px;
  --zc-table-font-size: var(--text-zc-base, 14px);
  --zc-table-header-font-weight: 600;
  --zc-table-border-radius: var(--radius-zc-base, 4px);
  --zc-table-fixed-shadow: 2px 0 4px rgba(0, 0, 0, 0.06);
  --zc-table-empty-text-color: var(--color-zc-text-secondary, #909399);
  --zc-table-footer-bg-color: var(--color-zc-bg-base, #fff);
  --zc-table-summary-bg-color: var(--color-zc-fill-light, #f5f7fa);

  width: 100%;
  font-size: var(--zc-table-font-size);
  color: var(--zc-table-text-color);
  background: var(--zc-table-bg-color);
}

.zc-table__wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
}

.zc-table__inner {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

/* ---- Header cells ---- */
.zc-table__th {
  background: var(--zc-table-header-bg-color);
  color: var(--zc-table-header-text-color);
  font-weight: var(--zc-table-header-font-weight);
  font-size: var(--text-zc-sm, 13px);
  text-align: left;
  padding: var(--zc-table-cell-padding);
  border-bottom: 1px solid var(--zc-table-border-color);
  white-space: nowrap;
  position: relative;
}

/* ---- Sticky header (works when height is set) ---- */
.zc-table.is-scrollable .zc-table__th {
  position: sticky;
  top: 0;
  z-index: 3;
}

.zc-table.is-border .zc-table__th {
  border-right: 1px solid var(--zc-table-border-color);
}
.zc-table.is-border .zc-table__th:last-child {
  border-right: none;
}

.zc-table__cell {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ---- Body cells ---- */
.zc-table__td {
  padding: var(--zc-table-cell-padding);
  border-bottom: 1px solid var(--zc-table-border-color);
  transition: background-color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-table.is-border .zc-table__td {
  border-right: 1px solid var(--zc-table-border-color);
}
.zc-table.is-border .zc-table__td:last-child {
  border-right: none;
}

/* ---- Rows ---- */
.zc-table__row:hover .zc-table__td {
  background: var(--zc-table-row-hover-bg-color);
}

.zc-table__row.is-stripe .zc-table__td {
  background: var(--color-zc-fill-lighter, #fafafa);
}

.zc-table__row.is-current .zc-table__td {
  background: var(--color-zc-primary-50, #ecf5ff);
}

/* ---- Fixed columns ---- */
.zc-table__th.is-fixed,
.zc-table__td.is-fixed {
  background: inherit;
}

.zc-table__th.is-fixed-left,
.zc-table__td.is-fixed-left,
.zc-table__th.is-fixed-right,
.zc-table__td.is-fixed-right {
  position: sticky !important;
  z-index: 2;
  background: var(--zc-table-bg-color);
}

.zc-table__th.is-fixed-left {
  background: var(--zc-table-header-bg-color);
}

.zc-table__row:hover .zc-table__td.is-fixed-left,
.zc-table__row:hover .zc-table__td.is-fixed-right {
  background: var(--color-zc-primary-50, #ecf5ff);
}

.zc-table__row.is-stripe .zc-table__td.is-fixed-left,
.zc-table__row.is-stripe .zc-table__td.is-fixed-right {
  background: var(--color-zc-fill-lighter, #fafafa);
}

.zc-table__row.is-current .zc-table__td.is-fixed-left,
.zc-table__row.is-current .zc-table__td.is-fixed-right {
  background: var(--color-zc-primary-50, #ecf5ff);
}

/* Fixed column shadow */
.zc-table__th.is-fixed-left-last,
.zc-table__td.is-fixed-left-last {
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.06);
}

.zc-table__th.is-fixed-right-first,
.zc-table__td.is-fixed-right-first {
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.06);
}

/* ---- Selection column ---- */
.zc-table__selection-col {
  width: 48px;
  text-align: center;
}

.zc-table__selection-col .zc-table__cell {
  justify-content: center;
}

/* ---- Sort icon ---- */
.zc-table__sort-icon {
  display: inline-flex;
  flex-direction: column;
  cursor: pointer;
  line-height: 0.8;
  font-size: 11px;
  color: var(--color-zc-text-placeholder, #c0c4cc);
  user-select: none;
}

.zc-table__sort-icon span {
  transition: color var(--transition-duration-zc-fast, 0.15s);
}

.zc-table__sort-icon span.is-active {
  color: var(--color-zc-primary-500, #409eff);
}

/* ---- Filter ---- */
.zc-table__filter {
  position: relative;
}

.zc-table__filter-trigger {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  color: var(--color-zc-text-placeholder, #c0c4cc);
  transition: color var(--transition-duration-zc-fast, 0.15s);
}

.zc-table__filter-trigger:hover {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-table__filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: var(--z-zc-dropdown, 1000);
  min-width: 140px;
  background: var(--color-zc-bg-base, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: var(--shadow-zc-md, 0 4px 12px rgba(0, 0, 0, 0.1));
  padding: var(--spacing-zc-xs, 4px) 0;
}

.zc-table__filter-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-zc-xs, 4px);
  padding: var(--spacing-zc-xs, 4px) var(--spacing-zc-md, 16px);
  cursor: pointer;
  white-space: nowrap;
  font-size: var(--text-zc-sm, 13px);
}

.zc-table__filter-item:hover {
  background: var(--color-zc-fill-light, #f5f7fa);
}

/* ---- Empty state ---- */
.zc-table__empty-cell {
  text-align: center;
  padding: var(--spacing-zc-xl, 32px) var(--spacing-zc-md, 16px);
  color: var(--zc-table-empty-text-color);
}

/* ---- Pagination wrapper ---- */
.zc-table__pagination {
  display: flex;
  align-items: center;
  padding: var(--spacing-zc-base, 12px) 0;
  flex-wrap: wrap;
}

/* ---- Size variants ---- */
.zc-table--large .zc-table__th,
.zc-table--large .zc-table__td {
  --zc-table-cell-padding: 14px 16px;
}
.zc-table--small .zc-table__th,
.zc-table--small .zc-table__td {
  --zc-table-cell-padding: 6px 10px;
}

/* ============================================================
 * Advanced Feature Styles
 * ============================================================ */

/* ---- Expandable Row ---- */
.zc-table__expand-icon {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-zc-text-secondary, #909399);
  transition: color 0.15s;
}

.zc-table__expand-icon:hover {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-table__expand-row {
  background: var(--color-zc-fill-lighter, #fafafa);
}

.zc-table__expand-content {
  padding: 12px 16px;
}

/* ---- Tree Table ---- */
.zc-table__tree-indent {
  display: inline-block;
  flex-shrink: 0;
}

.zc-table__tree-toggle {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--color-zc-text-secondary, #909399);
  transition: color 0.15s;
}

.zc-table__tree-toggle:hover {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-table__tree-placeholder {
  display: inline-block;
  width: 20px;
  flex-shrink: 0;
}

/* ---- Drag Sort ---- */
.zc-table__row.is-dragging {
  opacity: 0.5;
}

.zc-table__row.is-drag-over {
  border-top: 2px solid var(--color-zc-primary-500, #409eff);
}

/* ---- Editable Cell ---- */
.zc-table__edit-input {
  width: 100%;
  padding: 4px 8px;
  font-size: inherit;
  font-family: inherit;
  border: 1px solid var(--color-zc-primary-500, #409eff);
  border-radius: var(--radius-zc-base, 4px);
  outline: none;
  box-sizing: border-box;
}

.zc-table__edit-input:focus {
  border-color: var(--color-zc-primary-600, #337ecc);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* ---- Summary Row ---- */
.zc-table__summary-row .zc-table__td,
.zc-table__summary-row .zc-table__summary-cell {
  background: var(--color-zc-fill-light, #f5f7fa);
  font-weight: 600;
  border-top: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-bottom: none;
}

/* ---- Column Settings ---- */
.zc-table__toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
  position: relative;
}

.zc-table__settings-trigger {
  padding: 4px 12px;
  font-size: var(--text-zc-sm, 13px);
  color: var(--color-zc-text-regular, #606266);
  background: var(--color-zc-bg-base, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  cursor: pointer;
  transition: all 0.15s;
}

.zc-table__settings-trigger:hover,
.zc-table__settings-trigger.is-active {
  color: var(--color-zc-primary-500, #409eff);
  border-color: var(--color-zc-primary-500, #409eff);
}

.zc-table__settings-panel {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: var(--z-zc-dropdown, 1000);
  min-width: 200px;
  background: var(--color-zc-bg-base, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: var(--shadow-zc-md, 0 4px 12px rgba(0, 0, 0, 0.1));
  padding: 4px 0;
}

.zc-table__settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  font-size: var(--text-zc-sm, 13px);
}

.zc-table__settings-item label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.zc-table__settings-item:hover {
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-table__settings-order {
  display: flex;
  gap: 4px;
}

.zc-table__settings-order button {
  width: 22px;
  height: 22px;
  padding: 0;
  font-size: 12px;
  border: 1px solid var(--color-zc-border-lighter, #ebeef5);
  background: var(--color-zc-bg-base, #fff);
  border-radius: var(--radius-zc-base, 4px);
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
}

.zc-table__settings-order button:hover:not(:disabled) {
  color: var(--color-zc-primary-500, #409eff);
  border-color: var(--color-zc-primary-500, #409eff);
}

.zc-table__settings-order button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ---- Column Resize ---- */
.zc-table__resize-handle {
  position: absolute;
  right: -4px;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  z-index: 1;
  user-select: none;
}

.zc-table__resize-handle:hover {
  background: var(--color-zc-primary-500, #409eff);
  opacity: 0.5;
}

.zc-table__expand-icon,
.zc-table__tree-toggle {
  outline: none;
}

.zc-table__expand-icon:focus-visible,
.zc-table__tree-toggle:focus-visible {
  box-shadow: 0 0 0 2px var(--color-zc-primary-500, #409eff);
  border-radius: var(--radius-zc-base, 4px);
}
</style>
