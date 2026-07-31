export interface InputTagProps {
  /** Current tags (v-model) */
  modelValue: string[]
  /** Placeholder text */
  placeholder?: string
  /** Disable the input */
  disabled?: boolean
  /** Read only */
  readonly?: boolean
  /** Max number of tags (0 = unlimited) */
  max?: number
  /** Allow duplicate tags */
  allowDuplicate?: boolean
  /** Trigger to add tag: 'enter' | 'space' | 'comma' */
  trigger?: 'enter' | 'space' | 'comma'
  /** Validate function for each tag */
  validate?: (value: string) => boolean | string
  /** Show clear all button */
  clearable?: boolean
  /** Input size */
  size?: 'small' | 'medium' | 'large'
  /** Show tag close button */
  closable?: boolean
}

export interface InputTagEmits {
  (e: 'update:modelValue', tags: string[]): void
  (e: 'add', tag: string): void
  (e: 'remove', tag: string): void
  (e: 'clear'): void
  (e: 'blur'): void
  (e: 'focus'): void
}

export type InputTagSize = 'small' | 'medium' | 'large'
