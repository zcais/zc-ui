export type ColorFormat = 'hex' | 'rgb' | 'hsl'

export interface RGBColor {
  r: number
  g: number
  b: number
  a: number
}

export interface HSLColor {
  h: number
  s: number
  l: number
  a: number
}

export interface ColorPickerProps {
  modelValue?: string
  disabled?: boolean
  size?: 'large' | 'medium' | 'small'
  format?: ColorFormat
  showAlpha?: boolean
  predefine?: string[]
  colorFormat?: ColorFormat
}
