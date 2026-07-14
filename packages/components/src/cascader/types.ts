export interface CascaderOption {
  value: string | number
  label?: string
  children?: CascaderOption[]
  disabled?: boolean
  [key: string]: unknown
}

export type CascaderSize = 'large' | 'medium' | 'small'
export type CascaderExpandTrigger = 'click' | 'hover'

export interface CascaderProps {
  modelValue?: (string | number)[][]
  options?: CascaderOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: CascaderSize
  filterable?: boolean
  expandTrigger?: CascaderExpandTrigger
  multiple?: boolean
  checkStrictly?: boolean
  virtualScroll?: boolean
  props?: {
    value?: string
    label?: string
    children?: string
    disabled?: string
  }
}
