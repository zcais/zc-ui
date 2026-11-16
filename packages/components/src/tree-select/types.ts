export interface TreeSelectOption {
  value: string | number
  label?: string
  children?: TreeSelectOption[]
  disabled?: boolean
  isLeaf?: boolean
  [key: string]: unknown
}

export type TreeSelectSize = 'large' | 'medium' | 'small'

export interface TreeSelectProps {
  modelValue?: string | number | (string | number)[]
  data?: TreeSelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
  filterable?: boolean
  checkStrictly?: boolean
  /** Whether parent (non-leaf) nodes are selectable. When false, parents act as group headers (expand/collapse only). Default: false */
  parentSelectable?: boolean
  size?: TreeSelectSize
  virtual?: boolean
  /** Whether to teleport the dropdown to body (avoids clipping by overflow ancestors). Default: true */
  teleport?: boolean
  props?: {
    value?: string
    label?: string
    children?: string
    disabled?: string
  }
}
