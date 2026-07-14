/**
 * ZcAlert type definitions
 */

/** Alert type */
export type AlertType = 'success' | 'warning' | 'info' | 'error'

/** Alert visual effect */
export type AlertEffect = 'light' | 'dark'

/** Alert props */
export interface AlertProps {
  /** Alert type */
  type?: AlertType
  /** Alert title */
  title?: string
  /** Alert description text */
  description?: string
  /** Show icon */
  showIcon?: boolean
  /** Center the content */
  center?: boolean
  /** Whether alert can be closed */
  closable?: boolean
  /** Close button text */
  closeText?: string
  /** Visual style: light or dark */
  effect?: AlertEffect
}

/** Alert emit events */
export interface AlertEmits {
  (e: 'close', event: MouseEvent): void
}
