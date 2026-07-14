export interface RateProps {
  modelValue?: number
  max?: number
  size?: 'large' | 'medium' | 'small'
  disabled?: boolean
  allowHalf?: boolean
  colors?: string[]
  voidColor?: string
  disabledVoidColor?: string
  showText?: boolean
  showScore?: boolean
  textColor?: string
  texts?: string[]
  scoreTemplate?: string
  clearable?: boolean
  readonly?: boolean
}
