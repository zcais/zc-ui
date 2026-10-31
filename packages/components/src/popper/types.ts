export type PopperPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface ViewportSize {
  width: number
  height: number
}

export interface ComputePositionOptions {
  reference: Rect
  popperSize: { width: number; height: number }
  placement: PopperPlacement
  offset: number
  viewport: ViewportSize
  flip?: boolean
  preventOverflow?: boolean
  boundaryPadding?: number
  arrowSize?: number
}

export interface PositionResult {
  x: number
  y: number
  placement: PopperPlacement
  arrow?: { x: number; y: number }
}
