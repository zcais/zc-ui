export type MessageBoxType = 'alert' | 'confirm' | 'prompt'

export type MessageBoxAction = 'confirm' | 'cancel'

export interface MessageBoxOptions {
  /** Title of the message box */
  title?: string
  /** Message content */
  message?: string
  /** Confirm button text */
  confirmText?: string
  /** Cancel button text */
  cancelText?: string
  /** Confirm button type */
  confirmButtonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Cancel button type */
  cancelButtonType?: 'default' | 'primary' | 'text'
  /** Input placeholder (prompt mode) */
  inputPlaceholder?: string
  /** Input initial value (prompt mode) */
  inputValue?: string
  /** Input type (prompt mode) */
  inputType?: string
  /** Input validator (prompt mode) */
  inputValidator?: (value: string) => boolean | string
  /** Show close button */
  showClose?: boolean
  /** Close on overlay click */
  closeOnClickOverlay?: boolean
  /** Center the box */
  center?: boolean
  /** Box width */
  width?: string | number
  /** Render message as HTML */
  dangerouslyUseHTMLString?: boolean
}

/** Result returned by MessageBox.confirm() */
export interface MessageBoxResult {
  action: MessageBoxAction
  value: string
}

/** Callback type for MessageBox */
export type MessageBoxCallback = (action: MessageBoxAction, value: string) => void

/** Promise resolve type for MessageBox.confirm */
export type MessageBoxConfirmResolve = string

/** Promise reject type for MessageBox.confirm */
export type MessageBoxConfirmReject = 'cancel' | 'close'
