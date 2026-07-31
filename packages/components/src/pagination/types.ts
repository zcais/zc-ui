/**
 * ZcPagination type definitions
 */

/** Layout token string */
export type PaginationLayout = string

/** Pagination props */
export interface PaginationProps {
  /** Total number of records */
  total: number
  /** Items per page */
  pageSize?: number
  /** Current page (v-model) */
  currentPage?: number
  /** Layout components to show (comma-separated: prev, pager, next, jumper, total, sizes) */
  layout?: PaginationLayout
  /** Max visible page numbers */
  pagerCount?: number
  /** Disabled state */
  disabled?: boolean
  /** Available page sizes for the sizes selector */
  pageSizes?: number[]
  /** Show background on pager buttons */
  background?: boolean
}

/** Pagination emit events */
export interface PaginationEmits {
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'change', page: number, pageSize: number): void
  (e: 'prev-click', page: number): void
  (e: 'next-click', page: number): void
}
