export interface AutoCompleteOption {
  label?: string
  value: string | number
  disabled?: boolean
  [key: string]: unknown
}

export type AutoCompleteValue = string

export type AutoCompleteSize = 'large' | 'medium' | 'small'

export type AutoCompleteFetcher = (
  query: string
) => AutoCompleteOption[] | Promise<AutoCompleteOption[]>
