/** Mention option data structure */
export interface MentionOption {
  /** Unique value */
  value: string
  /** Display label */
  label?: string
  /** Avatar URL */
  avatar?: string
  /** Whether this option is disabled */
  disabled?: boolean
  /** Group key — when used with optionGroups, links the option to a group */
  group?: string
  [key: string]: unknown
}

/** Option group for grouped display */
export interface MentionOptionGroup {
  /** Group key — matches MentionOption.group */
  value: string
  /** Group display label */
  label: string
  /** Options in this group */
  options?: MentionOption[]
}

/** Dropdown placement */
export type MentionPlacement = 'top' | 'bottom'

/** Input element type */
export type MentionType = 'textarea' | 'input'

/** Behavior when the input loses focus while dropdown is open */
export type MentionBlurBehavior = 'clear' | 'select-first' | 'keep-open'

/** Custom filter function signature */
export type MentionFilterFunc = (
  option: MentionOption,
  keyword: string,
  trigger: string,
) => boolean

/** A mention item extracted from split-mode content */
export interface MentionMentionItem {
  /** The trigger character that activated this mention */
  trigger: string
  /** The value of the selected option */
  value: string
}

/** Mention component props */
export interface MentionProps {
  /** Bound value (v-model) */
  modelValue?: string
  /** Suggestion options */
  options?: MentionOption[]
  /**
   * Trigger character(s).
   * - `string`: single trigger (e.g. `'@'`)
   * - `string[]`: multiple triggers (e.g. `['@', '#']`)
   */
  trigger?: string | string[]
  /** Input element type: `'textarea'` (default) or `'input'` */
  type?: MentionType
  /** Whether the component is disabled */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Dropdown placement */
  placement?: MentionPlacement
  /** Whether built-in filtering is enabled */
  filterable?: boolean
  /** Custom filter function — overrides built-in `includes` matching */
  filter?: MentionFilterFunc
  /** Whether async remote search is in loading state */
  loading?: boolean
  /** Text shown during loading (overrides default locale text) */
  loadingText?: string
  /** Option groups for grouped display. When provided, options are rendered under their respective group headers */
  optionGroups?: MentionOptionGroup[]
  /** Behavior when input blurs while dropdown is open: `'clear'` | `'select-first'` | `'keep-open'` */
  blurBehavior?: MentionBlurBehavior
  /** Whether to render selected mentions as styled tags (contenteditable mode) */
  split?: boolean
  /** Maximum height of the dropdown panel (px or CSS string) */
  maxHeight?: number | string
  /** Whether to Teleport the dropdown to body (avoids overflow clipping). Can be a CSS selector string for custom target */
  teleport?: boolean | string
}
