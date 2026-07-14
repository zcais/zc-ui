/** Size variants for InputNumber. */
export type InputNumberSize = 'large' | 'medium' | 'small'

/** Position of the step control buttons. */
export type ControlsPosition = '' | 'right'

/** Props for the ZcInputNumber component. */
export interface InputNumberProps {
  modelValue?: number | undefined
  min?: number
  max?: number
  step?: number
  stepStrictly?: boolean
  precision?: number
  disabled?: boolean
  controls?: boolean
  controlsPosition?: ControlsPosition
  size?: InputNumberSize
  placeholder?: string
  readonly?: boolean
}
