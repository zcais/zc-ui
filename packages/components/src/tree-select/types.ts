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
  size?: TreeSelectSize
  virtual?: boolean
  props?: {
    value?: string
    label?: string
    children?: string
    disabled?: string
  }
}
