import type { VNode, Component } from 'vue'

/** Table column definition */
export interface TableColumn {
  /** Unique key — used for sorting and row key extraction */
  prop?: string
  /** Display label for the column header */
  label?: string
  /** Column width in pixels */
  width?: number | string
  /** Minimum column width in pixels */
  minWidth?: number | string
  /** Whether the column is fixed to left or right */
  fixed?: 'left' | 'right' | boolean
  /** Whether the column is sortable */
  sortable?: boolean | 'custom'
  /** Whether the column can be filtered */
  filterable?: boolean
  /** Filter options for the column */
  filters?: TableFilterOption[]
  /** Alignment of cell content */
  align?: 'left' | 'center' | 'right'
  /** Alignment of header content */
  headerAlign?: 'left' | 'center' | 'right'
  /** Custom class for cells */
  className?: string
  /** Whether the column is visible */
  visible?: boolean
  /** Render function for custom cell content */
  formatter?: (
    row: Record<string, any>,
    column: TableColumn,
    cellValue: any,
    index: number
  ) => string
  /** Whether the column is resizable (default follows table-level `resizable` prop) */
  resizable?: boolean
  /** Whether cells in this column are editable (requires table-level `editable` prop) */
  editable?: boolean
  /** Custom edit component for editable cells */
  editComponent?: Component
  /** Placeholder text for editable cell */
  editPlaceholder?: string
}

/** Filter option for column filtering */
export interface TableFilterOption {
  text: string
  value: string | number
}

/** Sort order */
export type SortOrder = 'ascending' | 'descending'

/** Current sort state */
export interface SortState {
  prop: string
  order: SortOrder | null
}

/** Current filter state */
export type FilterState = Record<string, (string | number)[]>

/** Pagination configuration */
export interface PaginationConfig {
  currentPage: number
  pageSize: number
  total: number
}

/** Row selection event */
export type SelectionChangeHandler = (rows: Record<string, any>[]) => void

// ============================================================
// Advanced Feature Types
// ============================================================

/** Span method return type */
export interface SpanValue {
  rowspan: number
  colspan: number
}

/** Span method for merging cells (rowspan/colspan) */
export type SpanMethod = (data: {
  row: Record<string, any>
  column: TableColumn
  rowIndex: number
  columnIndex: number
}) => SpanValue | [number, number] | undefined

/** Tree table configuration */
export interface TableTreePropsConfig {
  /** Key for accessing child rows (default: 'children') */
  children?: string
  /** Whether the row has children (for lazy loading) */
  hasChildren?: string
  /** Indent width per level in pixels (default: 16) */
  indent?: number
}

/** Summary method for calculating summary row values */
export type SummaryMethod = (data: {
  columns: TableColumn[]
  data: Record<string, any>[]
}) => (string | VNode)[]

/** Column setting item for user customization */
export interface ColumnSettingItem {
  prop: string
  label: string
  visible: boolean
  order: number
}

/** Edit state for editable cells */
export interface EditState {
  rowKey: string | number
  prop: string
  value: any
}

/** Drag sort event payload */
export interface DragSortEvent {
  oldIndex: number
  newIndex: number
  data: Record<string, any>[]
}

/** Column resize event payload */
export interface ColumnResizeEvent {
  prop: string
  oldWidth: number
  newWidth: number
}
