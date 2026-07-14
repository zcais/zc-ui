/**
 * ZcProgress type definitions
 */

/** Progress display type */
export type ProgressType = 'line' | 'circle' | 'dashboard'

/** Progress status */
export type ProgressStatus = 'primary' | 'success' | 'warning' | 'error' | 'info'

/** Progress props */
export interface ProgressProps {
  /** Progress type */
  type?: ProgressType
  /** Percentage (0-100) */
  percentage?: number
  /** Progress status */
  status?: ProgressStatus
  /** Stroke width in px */
  strokeWidth?: number
  /** Show text inside the bar */
  textInside?: boolean
  /** Show percentage text */
  showText?: boolean
  /** Diameter for circle/dashboard type */
  width?: number
  /** Custom color (overrides status color) */
  color?: string
  /** Enable striped animation */
  striped?: boolean
  /** Animate striped bars */
  stripedFlow?: boolean
  /** Duration of animation in seconds */
  duration?: number
}
