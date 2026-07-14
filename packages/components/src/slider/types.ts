/** Slider mark point definition. */
export interface SliderMark {
  value: number
  label: string
  style?: Record<string, string>
}

/** Props type for ZcSlider. */
export type SliderValue = number | [number, number]
export type SliderSize = 'large' | 'medium' | 'small'
