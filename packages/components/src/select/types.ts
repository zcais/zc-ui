/** A single option in the select dropdown. */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

/** A group of options with a label header. */
export interface SelectOptionGroup {
  label: string
  options: SelectOption[]
  disabled?: boolean
}

/** Normalized flat item used internally — either a regular option or a group header marker. */
export interface SelectFlatItem {
  /** Unique key for v-for */
  key: string | number
  /** true if this item is a group header (not selectable) */
  isGroupHeader?: boolean
  /** Group label (only for header items) */
  groupLabel?: string
  /** The actual option (only for non-header items) */
  option?: SelectOption
  /** Disabled state */
  disabled?: boolean
}

export type SelectValue = string | number | (string | number)[]
export type SelectSize = 'large' | 'medium' | 'small'

export interface SelectProps {
  modelValue?: SelectValue
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
  size?: SelectSize
  filterable?: boolean
  virtualScroll?: boolean
  estimatedOptionHeight?: number
}
