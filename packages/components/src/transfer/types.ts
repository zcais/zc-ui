export interface TransferOption {
  key: string | number
  label: string
  disabled?: boolean
  [key: string]: unknown
}

export type TransferDataItem = TransferOption

export interface TransferProps {
  modelValue?: (string | number)[]
  data?: TransferOption[]
  titles?: string[]
  filterable?: boolean
  filterPlaceholder?: string
  disabled?: boolean
  props?: {
    key?: string
    label?: string
    disabled?: string
  }
}
