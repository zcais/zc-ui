/**
 * ZcDialog type definitions
 */

/** Dialog size preset */
export type DialogSize = 'small' | 'medium' | 'large' | 'full'

/** Dialog props */
export interface DialogProps {
  /** Visibility (v-model) */
  modelValue: boolean
  /** Dialog title */
  title?: string
  /** Dialog width (CSS string or number in px) */
  width?: string | number
  /** Dialog size preset */
  size?: DialogSize
  /** Show fullscreen toggle button */
  fullscreen?: boolean
  /** Enable header drag */
  draggable?: boolean
  /** Show close button */
  showClose?: boolean
  /** Center the dialog */
  center?: boolean
  /** Overlay background */
  overlayClass?: string
  /** Close on overlay click */
  closeOnClickOverlay?: boolean
  /** Close on Escape key */
  closeOnEsc?: boolean
  /** Lock body scroll when open */
  lockScroll?: boolean
  /** Custom dialog class */
  dialogClass?: string
  /** Hook called before closing. If returns false / rejects, close is aborted. */
  beforeClose?: (done: () => void) => void
}

/** Dialog emit events */
export interface DialogEmits {
  (e: 'update:modelValue', val: boolean): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'closed'): void
}
